import { NextResponse } from "next/server";
import { triggerTriviaBroadcast } from "../trivia/route";
import { triggerDigestBroadcast } from "../digest/route";
import { triggerMarketPulseBroadcast } from "../market-pulse/route";
import { triggerCodeSutraBroadcast } from "../code-sutra/route";
import { triggerGenAIFrontiersBroadcast } from "../genai-frontiers/route";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const force = searchParams.get("force");

        // For manual testing/forcing a specific broadcast
        if (force) {
            console.log(`Forcing broadcast: ${force}`);
            switch (force) {
                case "trivia": return NextResponse.json(await triggerTriviaBroadcast());
                case "digest": return NextResponse.json(await triggerDigestBroadcast());
                case "market-pulse": return NextResponse.json(await triggerMarketPulseBroadcast());
                case "code-sutra": return NextResponse.json(await triggerCodeSutraBroadcast());
                case "genai-frontiers": return NextResponse.json(await triggerGenAIFrontiersBroadcast());
                default: return NextResponse.json({ error: "Invalid force parameter" }, { status: 400 });
            }
        }

        const now = new Date();
        const hour = now.getUTCHours();
        const minute = now.getUTCMinutes();
        const day = now.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

        console.log(`Cron Orchestrator running at ${hour}:${minute} UTC, Day ${day}`);

        // 1. Daily Trivia: 07:45 UTC
        if (hour === 7 && minute >= 40 && minute <= 55) {
            console.log("Triggering Daily Trivia...");
            return NextResponse.json(await triggerTriviaBroadcast());
        }

        // 2. Daily Digest: 09:15 UTC (Tue, Thu)
        if (hour === 9 && minute >= 10 && minute <= 25 && (day === 2 || day === 4)) {
            console.log("Triggering Daily Digest...");
            return NextResponse.json(await triggerDigestBroadcast());
        }

        // 3. Market Pulse: 11:30 UTC (Mon, Wed, Fri)
        if (hour === 11 && minute >= 25 && minute <= 40 && (day === 1 || day === 3 || day === 5)) {
            console.log("Triggering Market Pulse...");
            return NextResponse.json(await triggerMarketPulseBroadcast());
        }

        // 4. Code Sutra: 15:15 UTC (Tue, Thu, Sat)
        if (hour === 15 && minute >= 10 && minute <= 25 && (day === 2 || day === 4 || day === 6)) {
            console.log("Triggering Code Sutra...");
            return NextResponse.json(await triggerCodeSutraBroadcast());
        }

        // 5. GenAI Frontiers: 18:45 UTC (Daily)
        if (hour === 18 && minute >= 40 && minute <= 55) {
            console.log("Triggering GenAI Frontiers...");
            return NextResponse.json(await triggerGenAIFrontiersBroadcast());
        }

        return NextResponse.json({
            message: "No tasks scheduled for this window",
            time: `${hour}:${minute} UTC`,
            day
        });

    } catch (error: any) {
        console.error("Cron Orchestrator Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
