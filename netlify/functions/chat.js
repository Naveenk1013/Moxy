/**
 * Moxy Chat — Netlify Serverless Function
 * Receives user message + conversation history,
 * executes Claude API with Tool Calling (Indian Rail APIs, Itinerary Engine),
 * and returns structured response with reply, suggestions, handoff flag, and widgets.
 */

import { SYSTEM_PROMPT } from '../../src/data/system-prompt.js';
import {
  CLAUDE_CONCIERGE_TOOLS,
  executeConciergeTool,
} from '../../src/data/concierge-tools.js';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1500;

export const handler = async (event) => {
  // --- CORS headers ---
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your-anthropic-api-key-here') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply:
          "I'm not fully set up yet — the Anthropic API key is missing. Please configure it in your Netlify dashboard or `.env` file.",
        suggestions: [],
        isHandoff: true,
        widgets: [],
      }),
    };
  }

  try {
    const { message, history = [], userLocation = null } = JSON.parse(event.body || '{}');

    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing "message" field' }),
      };
    }

    const trimmedHistory = history.slice(-10);
    const messages = [
      ...trimmedHistory,
      { role: 'user', content: message },
    ];

    const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
    const aviationApiKey =
      process.env.AVIATIONSTACK_API_KEY ||
      process.env.VITE_AVIATIONSTACK_API_KEY ||
      '00e4984eec66f3295ff0f442f67362dd';
    const rapidApiKey =
      process.env.RAPIDAPI_KEY ||
      process.env.VITE_RAPIDAPI_KEY ||
      '85462d5cbamsh9076c050a90c888p1a7a37jsna23f794446fd';
    const googleMapsApiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      'AIzaSyDNovIU0_oDgiPG0_yISD6rrM-EoPHuCqo';

    let dynamicSystemPrompt = SYSTEM_PROMPT;
    if (userLocation && (userLocation.city || userLocation.address)) {
      const locStr = userLocation.address || userLocation.locality || userLocation.city;
      const coordsStr = userLocation.latitude && userLocation.longitude
        ? ` (Coordinates: ${userLocation.latitude}, ${userLocation.longitude})`
        : '';
      dynamicSystemPrompt += `\n\n## 📍 User's Live Detected Location\nThe guest is currently located at: **${locStr}**${coordsStr}.\n- When the guest asks for travel distances, directions, route calculations, or "how far is [place]" without specifying a starting origin, automatically set their origin to "${locStr}".\n- When the guest asks for live weather, forecasts, food recommendations, or local attractions without explicitly naming a city, assume "${userLocation.city || locStr}".\n- Never ask the user "where are you located?" because their location is already detected and provided here.`;
    }

    // Step 1: Call Claude with tools definition
    const apiResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        system: dynamicSystemPrompt,
        messages,
        tools: CLAUDE_CONCIERGE_TOOLS,
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Claude API error ${apiResponse.status}:`, errorText);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          reply:
            "I'm having a brief connection hiccup with the concierge engine. Please try again in a moment!",
          suggestions: [
            'What courses do you offer?',
            'Check train 12565 live status',
            'Plan a 3-day Hyderabad trip',
          ],
          isHandoff: false,
          widgets: [],
        }),
      };
    }

    const apiData = await apiResponse.json();
    const widgets = [];
    let assistantReply = '';
    let suggestions = [];
    let isHandoff = false;

    // Check if Claude invoked tools
    const toolCalls = (apiData.content || []).filter(
      (b) => b.type === 'tool_use'
    );

    if (toolCalls.length > 0) {
      // Execute each tool call
      const toolResults = [];
      for (const call of toolCalls) {
        const toolExecution = await executeConciergeTool(
          call.name,
          call.input,
          { aviationApiKey, rapidApiKey, googleMapsApiKey, userLocation }
        );
        if (toolExecution.widget) {
          widgets.push(toolExecution.widget);
        }
        toolResults.push({
          type: 'tool_result',
          tool_use_id: call.id,
          content: JSON.stringify(toolExecution.result),
        });
      }

      // Step 2: Send tool results back to Claude for final conversational reply
      const followUpResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 300,
          system:
            dynamicSystemPrompt +
            '\n\nIMPORTANT: An interactive visual widget card is already generated and displayed in the UI for the guest. Provide only a brief, warm 1-2 sentence concierge greeting with emojis introducing the card. DO NOT repeat the itinerary or timetable in plain text.',
          messages: [
            ...messages,
            { role: 'assistant', content: apiData.content },
            { role: 'user', content: toolResults },
          ],
        }),
      });

      if (followUpResponse.ok) {
        const followUpData = await followUpResponse.json();
        const textBlocks = (followUpData.content || []).filter(
          (b) => b.type === 'text'
        );
        assistantReply = textBlocks.map((b) => b.text).join('\n\n');
      }
    } else {
      // Direct text response
      const textBlocks = (apiData.content || []).filter(
        (b) => b.type === 'text'
      );
      assistantReply = textBlocks.map((b) => b.text).join('\n\n');
    }

    // Try parsing structured JSON if returned in text
    try {
      const jsonMatch = assistantReply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.reply) {
          assistantReply = parsed.reply;
          if (Array.isArray(parsed.suggestions)) suggestions = parsed.suggestions;
          if (parsed.isHandoff) isHandoff = true;
        }
      }
    } catch {
      // Keep markdown text as reply
    }

    // Check for handoff triggers in text
    if (
      assistantReply.toLowerCase().includes('admissions office') ||
      assistantReply.toLowerCase().includes('admin.hyderabad@iihm.ac.in') ||
      assistantReply.toLowerCase().includes('contact our team')
    ) {
      isHandoff = true;
    }

    // Generate intelligent default suggestions based on context if empty
    if (suggestions.length === 0) {
      if (widgets.some((w) => w.type === 'route_distance')) {
        suggestions = [
          'What is the weather like there?',
          'Find top food spots near the destination',
          'How to reach IIHM Hyderabad from airport?',
        ];
      } else if (widgets.some((w) => w.type === 'weather')) {
        suggestions = [
          'Calculate travel distance from IIHM Hyderabad',
          'Create a 3-day itinerary for this city',
          'What are the must-visit places here?',
        ];
      } else if (widgets.some((w) => w.type === 'live_train')) {
        suggestions = [
          'Check seat availability for this train',
          'What is the ticket fare?',
          'What are top places to visit in Hyderabad?',
        ];
      } else if (widgets.some((w) => w.type === 'seat_availability')) {
        suggestions = [
          'What is the fare for 3A and 2A?',
          'Check live running status',
          'How to reach IIHM Hyderabad from station?',
        ];
      } else if (widgets.some((w) => w.type === 'itinerary')) {
        suggestions = [
          'What are the best food spots in this plan?',
          'Can you customize for a luxury budget?',
          'Check train tickets to this destination',
        ];
      } else {
        suggestions = [
          'What courses do you offer at Hyderabad?',
          'Check train 12565 live status',
          'Create a 3-day Hyderabad itinerary',
        ];
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: assistantReply,
        suggestions,
        isHandoff,
        widgets,
      }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        reply:
          "Something went wrong on my end. Please try again or contact IIHM Hyderabad directly.",
        suggestions: ['What courses do you offer?', 'How do I apply?'],
        isHandoff: true,
        widgets: [],
      }),
    };
  }
};
