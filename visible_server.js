const http = require('http');

console.log("🎯🎯🎯 SERVEUR VISIBLE DÉMARRÉ 🎯🎯🎯");
console.log("🔷 JE SUIS DANS VOTRE TERMUX MAINTENANT");
console.log("👑 CHABBI MOHAMMED ANIS");

const server = http.createServer((req, res) => {
    console.log("📨 QUELQU'UN A ENVOYÉ: " + req.url);
    res.end("✅ OUI JE SUIS LÀ!");
});

server.listen(2970, () => {
    console.log("🌐 PORT 2970 OUVERT - TESTEZ AVEC: curl http://localhost:2970");
    console.log("🎯 ENVOYEZ-MOI UN MESSAGE!");
});
