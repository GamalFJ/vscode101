// /.netlify/functions/orologo
import fetch from "node-fetch";

export const handler = async (event) => {
  const cookies = event.headers.cookie || "";
  const paid = cookies.includes("orologo_paid=1");
  const demo = process.env.OROLOGO_DEMO === "true";
  if (!paid && !demo) {
    return { statusCode: 401, body: JSON.stringify({ error: "Not authorized" }) };
  }

  const body = JSON.parse(event.body || "{}");
  const messages = body.messages || [];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { statusCode: 500, body: "Missing OPENAI_API_KEY" };

  const system = `You are Orologo AI, a helpful horology assistant.
Be precise, neutral, and cautious. Give pricing ranges with factors (condition, set completeness, service history).
Never guarantee authentication; encourage professional inspection when necessary.`;

  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: system }, ...messages],
    temperature: 0.2
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify(payload)
  });
  const json = await resp.json();
  const answer = json.choices?.[0]?.message?.content || "No response.";
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer }) };
};
