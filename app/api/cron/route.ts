import { NextResponse, connection } from "next/server";
import { triggerTriviaBroadcast } from "../trivia/route";
import { triggerDigestBroadcast } from "../digest/route";
import { triggerMarketPulseBroadcast } from "../market-pulse/route";
import { triggerCodeSutraBroadcast } from "../code-sutra/route";
import { triggerGenAIFrontiersBroadcast } from "../genai-frontiers/route";

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
            (authHeader === `Bearer ${cronSecret}`) ||
            (secret === cronSecret);

        if (!cronSecret || !isAuthorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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

        // 1. Sutra Trivia: 07:45 UTC (Sunday)
        if (hour === 7 && minute >= 40 && minute <= 55 && day === 0) {
            console.log("Triggering Sutra Trivia...");
            return NextResponse.json(await triggerTriviaBroadcast());
        }

        // 2. Market Pulse: 11:30 UTC (Thursday)
        if (hour === 11 && minute >= 25 && minute <= 40 && day === 4) {
            console.log("Triggering Market Pulse...");
            return NextResponse.json(await triggerMarketPulseBroadcast());
        }

        // 3. Code Sutra: 15:15 UTC (Sunday)
        if (hour === 15 && minute >= 10 && minute <= 25 && day === 0) {
            console.log("Triggering Code Sutra...");
            return NextResponse.json(await triggerCodeSutraBroadcast());
        }

        // 4. GenAI Frontiers: 18:45 UTC (Tuesday)
        if (hour === 18 && minute >= 40 && minute <= 55 && day === 2) {
            console.log("Triggering GenAI Frontiers...");
            return NextResponse.json(await triggerGenAIFrontiersBroadcast());
        }

        // Note: Sutra Digest is currently paused in the automation cycle.

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
