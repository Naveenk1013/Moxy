/**
 * Utility to format and launch 1-Tap WhatsApp shares across Moxy.
 * Uses universal web intent: https://api.whatsapp.com/send?text=...
 * Supported on both mobile WhatsApp app and desktop WhatsApp Web.
 */

export function openWhatsApp(text) {
  if (!text) return;
  const encoded = encodeURIComponent(text.trim());
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function formatGeneralMessage(content) {
  const clean = (content || '')
    .replace(/\*\*(.*?)\*\*/g, '*$1*') // Convert markdown bold **text** to WhatsApp *text*
    .replace(/###?\s+(.*)/g, '*$1*\n') // Convert headers
    .replace(/^[-*]\s+/gm, '• ') // Convert bullet points
    .replace(/`([^`]+)`/g, '$1') // Strip code ticks
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)') // Format links
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return `🏨 *Moxy AI Concierge Briefing*\n\n${clean}\n\n— _Shared via Moxy Concierge (IIHM)_`;
}

export function formatPnrShare(pnr) {
  if (!pnr) return '';
  const pnrNum = pnr.PnrNumber || '';
  const train = `${pnr.TrainNumber || ''} ${pnr.TrainName || ''}`.trim();
  const route = `${pnr.From || ''} ➔ ${pnr.To || ''}`;
  const date = pnr.JourneyDate || '';
  const chart = pnr.ChatPrepared === 'YES' ? 'Prepared ✅' : 'Not Prepared ⏳';
  const fare = pnr.TicketFare ? ` | Fare: ₹${pnr.TicketFare}` : '';

  const passengers = (pnr.Passangers || [])
    .map((p, i) => `  ${i + 1}. *${p.Passenger || `Passenger ${i + 1}`}*: Coach ${p.Coach || '—'}, Berth ${p.Berth || '—'} (${p.CurrentStatus || p.BookingStatus || 'WL'})`)
    .join('\n');

  return `🎫 *Indian Railways PNR Status: ${pnrNum}*\n\n` +
    `🚆 *Train:* ${train}\n` +
    `📍 *Route:* ${route}\n` +
    `📅 *Date:* ${date}\n` +
    `📊 *Chart Status:* ${chart}${fare}\n\n` +
    `👥 *Passenger Allocation:*\n${passengers || '  No passengers listed'}\n\n` +
    `— _Shared via Moxy AI Concierge_`;
}

export function formatItineraryShare(itinerary) {
  if (!itinerary) return '';
  const title = itinerary.title || `${itinerary.days}-Day Itinerary`;
  const dest = itinerary.destination || 'Destination';

  const daysText = (itinerary.dayPlans || [])
    .map((dp) => {
      const parts = [
        `*Day ${dp.day}: ${dp.theme || ''}*`,
        `• 🌅 Morning: ${dp.morning?.title || ''}`,
        `• ☀️ Afternoon: ${dp.afternoon?.title || ''}`,
        `• 🌆 Evening: ${dp.evening?.title || ''}`,
        dp.foodSpot ? `• 🍽️ Top Food: ${dp.foodSpot}` : '',
      ].filter(Boolean);
      return parts.join('\n');
    })
    .join('\n\n');

  return `🗺️ *${title}*\n📍 *Destination:* ${dest}\n\n${daysText}\n\n— _Shared via Moxy AI Concierge_`;
}

export function formatSosShare(sos) {
  if (!sos) return '';
  const lines = (sos.helplines || [])
    .map(h => `${h.icon || '🚨'} *${h.name}*: ${h.number}`)
    .join('\n');

  const hospitals = (sos.nearbyHospitals || [])
    .slice(0, 3)
    .map(h => `🏥 *${h.name}* (${h.distance}) - 📞 ${h.phone}`)
    .join('\n');

  return `🚨 *Emergency & Tourist Helplines (${sos.location || 'India'})*\n\n` +
    `⚡ *24/7 Essential Numbers:*\n${lines}\n\n` +
    `🏥 *Top Emergency Hospitals:*\n${hospitals}\n\n` +
    `— _Shared via Moxy Safety Hub_`;
}

export function formatMetroShare(metro) {
  if (!metro) return '';
  const interchange = metro.interchangeStation ? `🔄 *Transfer:* At ${metro.interchangeStation} (${metro.fromLine} ➔ ${metro.toLine} Line)` : 'Direct Route (No Transfer)';
  return `🚇 *Hyderabad Metro Transit Guide*\n\n` +
    `🟢 *From:* ${metro.originStation} (${metro.fromLine} Line)\n` +
    `🔴 *To:* ${metro.destinationStation} (${metro.toLine} Line)\n` +
    `${interchange}\n` +
    `⏱️ *Time:* ${metro.estimatedTime} (${metro.totalStops} stations)\n` +
    `🎟️ *Fare:* ₹${metro.estimatedFare}\n` +
    `⏰ *Timings:* 6:00 AM – 11:00 PM\n\n` +
    `— _Shared via Moxy AI Concierge_`;
}

export function formatFoodShare(food) {
  if (!food) return '';
  const specialties = (food.famousSpecialties || []).map(s => `• ${s}`).join('\n');
  const outlets = (food.outlets || []).slice(0, 3).map(o => `🏪 *${o.name}* (PF ${o.platform}) - ${o.highlights}`).join('\n');

  return `🍱 *Station Food Radar: ${food.stationName} (${food.stationCode})*\n\n` +
    `✨ *Famous Delicacies:*\n${specialties}\n\n` +
    `🍴 *Recommended Outlets:*\n${outlets}\n\n` +
    `📲 ${food.eCateringTips || 'Order food to your train seat via IRCTC eCatering'}\n\n` +
    `— _Shared via Moxy AI Concierge_`;
}
