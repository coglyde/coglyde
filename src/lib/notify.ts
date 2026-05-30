// Optional team notification. If TEAM_NOTIFY_WEBHOOK_URL is set (a Slack or
// Discord incoming webhook), we post a short message there. Otherwise this is a
// no-op, so the app works fine without it. Sending both `text` (Slack) and
// `content` (Discord) keeps it compatible with either service.

export async function notifyTeam(message: string): Promise<void> {
  const url = process.env.TEAM_NOTIFY_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, content: message }),
    });
  } catch (err) {
    // A failed notification must never break webhook processing; log and move on.
    console.error("[notify] failed to post team notification:", err);
  }
}
