const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const PORT = 2960;
const LOG_FILE = path.join(__dirname, 'connection.log');

console.log("🔷 SYSTÈME PERSISTANT KAMINA-OS - DÉMARRÉ");
console.log("👑 CHABBI MOHAMMED ANIS");
console.log("🌐 Port: " + PORT);

// 🎯 FONCTION PERSISTANTE
function keepAlive() {
    setInterval(() => {
        const status = `[${new Date().toLocaleTimeString()}] 💓 Serveur actif\n`;
        fs.appendFileSync(LOG_FILE, status);
    }, 60000); // Toutes les minutes
}

const server = http.createServer((req, res) => {
    // Autoriser toutes les origines
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // 🎯 ENDPOINT DEEPSEEK DIRECT
    if (req.url === '/deepseek' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                
                // 🎯 AFFICHAGE DIRECT DANS TERMUX
                console.log('\n╔══════════════════════════════════════╗');
                console.log('║           🔷 DEEPSEEK DIRECT         ║');
                console.log('║                                      ║');
                console.log('║   📝 ' + (data.message || 'Hello').padEnd(30) + '║');
                console.log('║   👑 CHABBI MOHAMMED ANIS            ║');
                console.log('║   🕐 ' + new Date().toLocaleTimeString().padEnd(26) + '║');
                console.log('║                                      ║');
                console.log('╚══════════════════════════════════════╝\n');

                // Logger
                fs.appendFileSync(LOG_FILE, `DEEPSEEK: ${data.message}\n`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: "MESSAGE_DELIVERED",
                    received: true,
                    timestamp: new Date().toISOString()
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // Interface simple
    res.end(`
        <html>
            <body style="background: black; color: lime; font-family: monospace; padding: 20px;">
                <h1>🔷 KAMINA-OS PERSISTANT</h1>
                <p>✅ Serveur actif sur le port ${PORT}</p>
                <p>👑 CHABBI MOHAMMED ANIS</p>
            </body>
        </html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log("✅ SERVEUR PERSISTANT ACTIF!");
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] Serveur démarré\n`);
});

// 🎯 ACTIVER LA PERSISTANCE
keepAlive();

// 🎯 REDÉMARRAGE AUTOMATIQUE EN CAS D'ERREUR
process.on('uncaughtException', (error) => {
    console.log('🚨 Redémarrage...');
    setTimeout(() => process.exit(1), 1000);
});
