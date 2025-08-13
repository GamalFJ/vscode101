# Gamz Select (Static HTML/CSS/JS)

A deploy-ready static site with:
- Index, Shop, Product pages
- Newsletter block
- Orologo AI page with Netlify Functions (OpenAI) and Gumroad license verification

## Quickstart (local preview)
Just open `index.html` in a local server (e.g., VS Code Live Server) so fetch() can read JSON.

## Deploy to Netlify
1. Create a new site from this folder.
2. **Build settings**: no build command; publish dir = `.`
3. **Environment variables**:
   - `OPENAI_API_KEY=...`
   - `OROLOGO_DEMO=true` (or `false` to require purchase)
   - `GUMROAD_PRODUCT_ID=your_product_id_or_permalink`
4. The provided `netlify.toml` maps:
   - `/api/orologo` → `/.netlify/functions/orologo`
   - `/api/verify` → `/.netlify/functions/verify`

## Inventory
- Update `data/inventory.json` with your watches. Use local images in `assets/products/...` or full URLs.

## Newsletter
- Replace the form in `index.html` with your Beehiiv/MailerLite embed, or point the current form `action` to your endpoint.

## Orologo AI
- Users buy via Gumroad overlay (you can wire the Buy buttons to your product pages).
- After purchase, give users a license key; they enter it in Orologo to unlock.
- Serverless function verifies the key via Gumroad API and sets a cookie to allow chat.
