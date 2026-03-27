import { NextResponse, connection } from "next/server";
import { triggerTriviaBroadcast } from "../trivia/route";
import { triggerDigestBroadcast } from "../digest/route";
import { triggerMarketPulseBroadcast } from "../market-pulse/route";
import { triggerCodeSutraBroadcast } from "../code-sutra/route";
import { triggerGenAIFrontiersBroadcast } from "../genai-frontiers/route";
import { triggerActuarialSimplifiedBroadcast } from "../actuarial-simplified/route";

/** Matches only :15 so repeated pings in the same hour do not double-send. */
function isUtcMinuteSlot(
  hour: number,
  minute: number,
  slotHour: number,
  slotMinute = 15,
) {
  return hour === slotHour && minute === slotMinute;
}

/** 0-based week-of-year for rotating Thursday streams (5-week cycle). */
function utcWeekIndex(d: Date) {
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const day = Math.floor(
    (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - start) /
      86400000,
  );
  return Math.floor(day / 7);
}

export async function GET(request: Request) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force");
    const secret = searchParams.get("secret");

    // Security Check
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;

    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || secret === cronSecret;

    if (!cronSecret || !isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For manual testing/forcing a specific broadcast
    if (force) {
      console.log(`Forcing broadcast: ${force}`);
      switch (force) {
        case "trivia":
          return NextResponse.json(await triggerTriviaBroadcast());
        case "digest":
          return NextResponse.json(await triggerDigestBroadcast());
        case "market-pulse":
          return NextResponse.json(await triggerMarketPulseBroadcast());
        case "code-sutra":
          return NextResponse.json(await triggerCodeSutraBroadcast());
        case "genai-frontiers":
          return NextResponse.json(await triggerGenAIFrontiersBroadcast());
        case "actuarial-simplified":
          return NextResponse.json(await triggerActuarialSimplifiedBroadcast());
        default:
          return NextResponse.json(
            { error: "Invalid force parameter" },
            { status: 400 },
          );
      }
    }

    const now = new Date();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const day = now.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    console.log(
      `Cron Orchestrator running at ${hour}:${minute} UTC, Day ${day}`,
    );

    // At most two automated broadcasts per week:
    // 1) Weekly digest — Monday 13:15 UTC
    // 2) One featured stream — Thursday 08:15 UTC, rotates every ~5 weeks

    if (day === 1 && isUtcMinuteSlot(hour, minute, 13)) {
      console.log("Triggering Sutra Digest (weekly)...");
      return NextResponse.json(await triggerDigestBroadcast());
    }

    if (day === 4 && isUtcMinuteSlot(hour, minute, 8)) {
      const slot = utcWeekIndex(now) % 5;
      const triggers = [
        () => triggerActuarialSimplifiedBroadcast(),
        () => triggerCodeSutraBroadcast(),
        () => triggerTriviaBroadcast(),
        () => triggerGenAIFrontiersBroadcast(),
        () => triggerMarketPulseBroadcast(),
      ] as const;
      const labels = [
        "Actuarial Simplified",
        "Code Sutra",
        "Sutra Trivia",
        "GenAI Frontiers",
        "Market Pulse",
      ] as const;
      console.log(
        `Triggering weekly featured stream (${labels[slot]}, rotation ${slot}/5)...`,
      );
      return NextResponse.json(await triggers[slot]());
    }

    return NextResponse.json({
      message: "No tasks scheduled for this window",
      time: `${hour}:${minute} UTC`,
      day,
    });
  } catch (error: any) {
    console.error("Cron Orchestrator Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
