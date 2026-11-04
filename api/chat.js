://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
contents: [
{
parts: [
{ text: systemPrompt + "\n\nDemande utilisateur : " + message + contextText }
]
}
],
generationConfig: {
temperature: 0.7,
maxOutputTokens: 800
}
})
}
);

const data = await response.json();

if (!response.ok) {
console.error("Erreur Gemini:", data);
return res.status(500).json({ error: "Erreur API Gemini", details: data.error?.message || "Erreur inconnue" });
}

const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse générée.";

return res.status(200).json({ ok: true, text, agentRole });
} catch (err) {
console.error("Erreur serveur:", err);
return res.status(500).json({ error: "Erreur serveur interne" });
}
}
```
