// /.netlify/functions/verify
import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const { license } = JSON.parse(event.body || "{}");
    if (!license) return { statusCode: 400, body: JSON.stringify({ ok: false }) };
    const product = process.env.GUMROAD_PRODUCT_ID; // or product_permalink
    if (!product) return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Missing product id" }) };

    const form = new URLSearchParams();
    form.append("product_id", product);
    form.append("license_key", license);
    form.append("increment_uses_count", "true");

    const r = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });
    const data = await r.json();
    const valid = !!(data?.success);

    if (valid) {
      // set cookie
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "orologo_paid=1; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax"
        },
        body: JSON.stringify({ ok: true })
      };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: false }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false }) };
  }
};
