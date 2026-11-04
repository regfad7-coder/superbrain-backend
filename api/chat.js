export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ ok: false, error: "Method not allowed" });
}

try {
const { agentRole, message, context } = req.body;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
return res.status(500).json({ ok: false, error: "Missing API key" });
}

const contextText = Array.isArray(context) && context.length > 0
? "Contexte des agents précédents : " + context.join(" | ")
: "";

const prompt = "Tu es l'agent " + agentRole + " dans un système multi-agents appelé SuperBrain. " +
contextText + " Question de l'utilisateur : " + message + " Réponds de manière concise et utile, dans le rôle de " + agentRole + ".";

const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }],
}),
}
);

const data = await response.json();

if (!response.ok) {
return res.status(500).json({ ok: false, error: data.error ? data.error.message : "Gemini error" });
}

const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]
? data.candidates[0].content.parts[0].text
: "";

if (!text) {
return res.status(500).json({ ok: false, error: "Empty response from Gemini" });
}

return res.status(200).json({ ok: true, text: text });
} catch (error) {
return res.status(500).json({ ok: false, error: error.message || "Unknown error" });
}
}
