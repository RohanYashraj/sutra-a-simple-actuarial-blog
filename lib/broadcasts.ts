import { Resend } from "resend";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sanitizeSlug } from "@/lib/slug";
import { submitUrlsToIndexNow } from "@/lib/indexnow";
import type { StreamId } from "@/lib/gemini";

const resend = new Resend(process.env.RESEND_API_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type BroadcastType = StreamId | string;

interface SendBroadcastOptions<TData> {
  type: BroadcastType;
  title: string;
  subject: string;
  from: string;
  replyTo: string;
  html: string;
  data: TData;
}

export async function sendStreamBroadcast<TData>(
  options: SendBroadcastOptions<TData>,
) {
  const { type, title, subject, from, replyTo, html, data } = options;

  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!audienceId) {
    throw new Error("RESEND_AUDIENCE_ID is not set");
  }

  const { data: broadcast, error } = await resend.broadcasts.create({
    audienceId,
    from,
    subject,
    replyTo,
    html,
    name: `${title} - ${new Date().toLocaleDateString()}`,
  });

  if (error || !broadcast) {
    throw new Error(
      `Resend Broadcast Error: ${error?.message || "Unknown error"}`,
    );
  }

  const { error: sendError } = await resend.broadcasts.send(broadcast.id);

  if (sendError) {
    throw new Error(`Resend Send Error: ${sendError.message}`);
  }

  const slug = `${sanitizeSlug(title)}-${new Date().getTime()}`;

  await convex.mutation(api.broadcasts.saveBroadcast, {
    type,
    title,
    slug,
    data,
  });

  await submitUrlsToIndexNow([
    `https://sutra.rohanyashraj.com/archive/${type}/${slug}`,
  ]);

  return {
    broadcastId: broadcast.id,
    title,
    slug,
  };
}

