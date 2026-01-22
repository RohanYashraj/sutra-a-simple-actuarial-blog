import { NextResponse, connection } from "next/server";
import { triggerTriviaBroadcast } from "../trivia/route";
import { triggerDigestBroadcast } from "../digest/route";
import { triggerMarketPulseBroadcast } from "../market-pulse/route";
import { triggerCodeSutraBroadcast } from "../code-sutra/route";
import { triggerGenAIFrontiersBroadcast } from "../genai-frontiers/route";
import { triggerActuarialSimplifiedBroadcast } from "../actuarial-simplified/route";

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
                case "actuarial-simplified": return NextResponse.json(await triggerActuarialSimplifiedBroadcast());
                default: return NextResponse.json({ error: "Invalid force parameter" }, { status: 400 });
            }
        }

        const now = new Date();
        const hour = now.getUTCHours();
        const minute = now.getUTCMinutes();
        const day = now.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

        console.log(`Cron Orchestrator running at ${hour}:${minute} UTC, Day ${day}`);

        // 1. Sutra Trivia: 08:00 UTC (Wednesday)
        // Wednesday (Day 3)
        if (hour === 8 && minute >= 0 && minute < 20 && day === 3) {
            console.log("Triggering Sutra Trivia...");
            return NextResponse.json(await triggerTriviaBroadcast());
        }

        // 2. Market Pulse: 08:00 UTC (Saturday)
        // Saturday (Day 6)
        if (hour === 8 && minute >= 0 && minute < 20 && day === 6) {
            console.log("Triggering Market Pulse...");
            return NextResponse.json(await triggerMarketPulseBroadcast());
        }

        // 3. Code Sutra: 08:00 UTC (Tuesday)
        // Tuesday (Day 2)
        if (hour === 8 && minute >= 0 && minute < 20 && day === 2) {
            console.log("Triggering Code Sutra...");
            return NextResponse.json(await triggerCodeSutraBroadcast());
        }

        // 4. GenAI Frontiers: 08:00 UTC (Friday)
        // Friday (Day 5)
        if (hour === 8 && minute >= 0 && minute < 20 && day === 5) {
            console.log("Triggering GenAI Frontiers...");
            return NextResponse.json(await triggerGenAIFrontiersBroadcast());
        }

        // 5. Sutra Digest: 13:00 UTC (Monday)
        // Monday (Day 1)
        if (hour === 13 && minute >= 0 && minute < 20 && day === 1) {
            console.log("Triggering Sutra Digest...");
            return NextResponse.json(await triggerDigestBroadcast());
        }

        // 6. Actuarial Simplified: 08:00 UTC (Monday & Thursday)
        // Monday (Day 1) & Thursday (Day 4)
        if (hour === 8 && minute >= 0 && minute < 20 && (day === 1 || day === 4)) {
            console.log("Triggering Actuarial Simplified...");
            return NextResponse.json(await triggerActuarialSimplifiedBroadcast());
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
