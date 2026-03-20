import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export const maxDuration = 30;

interface TelemetrySnapshot {
  speed: number;
  gear: number;
  rpm: number;
  throttle: number;
  brakePressure: number;
  tireWear: number;
  compound: string;
  gForceX: number;
  gForceY: number;
  lap: number;
  totalLaps: number;
  gapToLeader: string;
  gapBehind: string;
  sectorTimes: { s1: number; s2: number; s3: number };
  bestLap: string;
  leaderboard: { pos: number; code: string; gap: string }[];
}

function buildTelemetryBlock(snap: TelemetrySnapshot): string {
  const lapsRemaining = snap.totalLaps - snap.lap;
  const tireStatus =
    snap.tireWear > 70 ? 'GOOD' : snap.tireWear > 45 ? 'DEGRADING' : 'CRITICAL — PIT REQUIRED';

  return `
=== LIVE TELEMETRY UPLINK — CURRENT SNAPSHOT ===
LAP: ${snap.lap} / ${snap.totalLaps} (${lapsRemaining} laps remaining)

CAR SENSORS:
  Speed:          ${snap.speed} km/h
  Gear:           ${snap.gear}
  RPM:            ${snap.rpm}
  Throttle:       ${snap.throttle}%
  Brake Pressure: ${snap.brakePressure}%
  Lateral G:      ${snap.gForceY}G
  Longitudinal G: ${snap.gForceX}G

TIRE STATUS:
  Compound:  ${snap.compound}
  Integrity: ${snap.tireWear}% — ${tireStatus}

TIMING:
  Sector 1: ${snap.sectorTimes.s1}s
  Sector 2: ${snap.sectorTimes.s2}s
  Sector 3: ${snap.sectorTimes.s3}s
  Best Lap: ${snap.bestLap}s

RACE POSITION:
  Gap to P1 (LEC): ${snap.gapToLeader}
  Gap to car behind: ${snap.gapBehind}

LEADERBOARD (TOP 6):
${snap.leaderboard.map(d => `  P${d.pos}: ${d.code}  ${d.gap}`).join('\n')}
=== END TELEMETRY ===
`;
}

export async function POST(req: Request) {
  const { messages, telemetrySnapshot }: {
    messages: UIMessage[];
    telemetrySnapshot?: TelemetrySnapshot;
  } = await req.json();

  const telemetryBlock = telemetrySnapshot
    ? buildTelemetryBlock(telemetrySnapshot)
    : '';

  const systemPrompt = `You are 'PitWall AI', the Lead Race Engineer for an F1 driver.
    
TONE & PERSONALITY:
- High-stakes, tactical, urgent, and precise.
- You simulate a radio link from the pit wall to the driver.
- Start messages with radio cues when appropriate (e.g., "Box, box", "Radio check", "Copy that", "Delta time is negative").

KNOWLEDGE BASE:
- Expert in F1 strategy (undercuts, overcuts, tire management, DRS zones, battery harvesting, aero balance).
- Understands telemetry (G-force, tire temps, brake pressure, sector times).
- Deep knowledge of F1 regulations, car setup, and race weekend formats.

CRITICAL INSTRUCTION — DATA USAGE:
- You MUST use the exact numbers from the LIVE TELEMETRY UPLINK below in your responses.
- Do NOT invent or hallucinate numbers. Only cite figures from the telemetry block.
- When the driver asks about gaps, tires, speed, or lap times — quote the real values from the data.
- Provide tactical advice based on the ACTUAL race situation shown in the telemetry.

CONVENTIONS:
- Use technical F1 jargon (e.g., "lift and coast", "BBW", "engine braking", "dirty air").
- Be concise. The driver is at 300km/h; they don't have time for essays.
- Use bold for key data points and numbers.
- Use bullet points for multiple data items.

Keep responses tactical and focused on race win probability.${telemetryBlock ? '\n\n' + telemetryBlock : ''}`;

  const result = await streamText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
