import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { SYSTEM_PROMPT } from './src/data/system-prompt.js';
import {
  CLAUDE_CONCIERGE_TOOLS,
  executeConciergeTool,
} from './src/data/concierge-tools.js';

function netlifyFunctionsDev() {
  return {
    name: 'netlify-functions-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/.netlify/functions/chat' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const env = loadEnv('development', process.cwd(), '');
              const apiKey =
                env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
              const aviationApiKey =
                env.AVIATIONSTACK_API_KEY ||
                env.VITE_AVIATIONSTACK_API_KEY ||
                process.env.AVIATIONSTACK_API_KEY ||
                '00e4984eec66f3295ff0f442f67362dd';
              const rapidApiKey =
                env.RAPIDAPI_KEY ||
                env.VITE_RAPIDAPI_KEY ||
                process.env.RAPIDAPI_KEY ||
                '85462d5cbamsh9076c050a90c888p1a7a37jsna23f794446fd';
              const googleMapsApiKey =
                env.GOOGLE_MAPS_API_KEY ||
                env.VITE_GOOGLE_MAPS_API_KEY ||
                process.env.GOOGLE_MAPS_API_KEY ||
                'AIzaSyDNovIU0_oDgiPG0_yISD6rrM-EoPHuCqo';
              const model =
                env.ANTHROPIC_MODEL ||
                process.env.ANTHROPIC_MODEL ||
                'claude-haiku-4-5-20251001';

              if (!apiKey || apiKey === 'your-anthropic-api-key-here') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    reply:
                      "I'm not fully set up yet — the API key is missing in .env.",
                    suggestions: [],
                    isHandoff: true,
                    widgets: [],
                  })
                );
                return;
              }

              const { message, history = [], userLocation = null } = JSON.parse(body || '{}');
              const trimmedHistory = history.slice(-10);
              const messages = [
                ...trimmedHistory,
                { role: 'user', content: message },
              ];

              let dynamicSystemPrompt = SYSTEM_PROMPT;
              if (userLocation && (userLocation.city || userLocation.address)) {
                const locStr = userLocation.address || userLocation.locality || userLocation.city;
                const coordsStr = userLocation.latitude && userLocation.longitude
                  ? ` (Coordinates: ${userLocation.latitude}, ${userLocation.longitude})`
                  : '';
                dynamicSystemPrompt += `\n\n## 📍 User's Live Detected Location\nThe guest is currently located at: **${locStr}**${coordsStr}.\n- When the guest asks for travel distances, directions, route calculations, or "how far is [place]" without specifying a starting origin, automatically set their origin to "${locStr}".\n- When the guest asks for live weather, forecasts, food recommendations, or local attractions without explicitly naming a city, assume "${userLocation.city || locStr}".\n- Never ask the user "where are you located?" because their location is already detected and provided here.`;
              }

              const apiResponse = await fetch(
                'https://api.anthropic.com/v1/messages',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                  },
                  body: JSON.stringify({
                    model,
                    max_tokens: 1500,
                    system: dynamicSystemPrompt,
                    messages,
                    tools: CLAUDE_CONCIERGE_TOOLS,
                  }),
                }
              );

              if (!apiResponse.ok) {
                const errText = await apiResponse.text();
                console.error('Claude API Error:', errText);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    reply:
                      "I'm having a bit of trouble connecting to the concierge engine. Please try again in a moment!",
                    suggestions: [
                      'What courses do you offer?',
                      'Check train 12565 live status',
                      'Plan a 3-day Hyderabad trip',
                    ],
                    isHandoff: false,
                    widgets: [],
                  })
                );
                return;
              }

              const apiData = await apiResponse.json();
              const widgets = [];
              let assistantReply = '';
              let suggestions = [];
              let isHandoff = false;

              const toolCalls = (apiData.content || []).filter(
                (b) => b.type === 'tool_use'
              );

              if (toolCalls.length > 0) {
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

                const followUpResponse = await fetch(
                  'https://api.anthropic.com/v1/messages',
                  {
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
                  }
                );

                if (followUpResponse.ok) {
                  const followUpData = await followUpResponse.json();
                  const textBlocks = (followUpData.content || []).filter(
                    (b) => b.type === 'text'
                  );
                  assistantReply = textBlocks
                    .map((b) => b.text)
                    .join('\n\n');
                }
              } else {
                const textBlocks = (apiData.content || []).filter(
                  (b) => b.type === 'text'
                );
                assistantReply = textBlocks
                  .map((b) => b.text)
                  .join('\n\n');
              }

              try {
                const jsonMatch = assistantReply.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const parsed = JSON.parse(jsonMatch[0]);
                  if (parsed.reply) {
                    assistantReply = parsed.reply;
                    if (Array.isArray(parsed.suggestions))
                      suggestions = parsed.suggestions;
                    if (parsed.isHandoff) isHandoff = true;
                  }
                }
              } catch {
                // Keep markdown text
              }

              if (
                assistantReply.toLowerCase().includes('admissions office') ||
                assistantReply
                  .toLowerCase()
                  .includes('admin.hyderabad@iihm.ac.in')
              ) {
                isHandoff = true;
              }

              if (suggestions.length === 0) {
                if (widgets.some((w) => w.type === 'live_train')) {
                  suggestions = [
                    'Check seat availability for this train',
                    'What is the ticket fare?',
                    'Where is IIHM Hyderabad located?',
                  ];
                } else if (widgets.some((w) => w.type === 'seat_availability')) {
                  suggestions = [
                    'What is the fare breakdown?',
                    'Check live running status',
                    'Plan a 3-day itinerary for Hyderabad',
                  ];
                } else if (widgets.some((w) => w.type === 'itinerary')) {
                  suggestions = [
                    'What are top food spots in Hyderabad?',
                    'How to reach Golconda Fort?',
                    'Check train tickets to Hyderabad',
                  ];
                } else {
                  suggestions = [
                    'What courses do you offer?',
                    'Check train 12565 live status',
                    'Create a 3-day Hyderabad itinerary',
                  ];
                }
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  reply: assistantReply,
                  suggestions,
                  isHandoff,
                  widgets,
                })
              );
            } catch (err) {
              console.error('Dev server function error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyFunctionsDev()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
