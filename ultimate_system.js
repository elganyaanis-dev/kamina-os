const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const PORT = 2970;
const STATE_FILE = path.join(__dirname, 'system_state.json');

console.log("🔷 SYSTÈME ULTIME KAMINA-OS - ACTIVÉ");
console.log("👑 CHABBI MOHAMMED ANIS");
console.log("💾 Persistance: ACTIVÉE");
console.log("🔄 Auto-recall: PRÊT");

// 🎯 ÉTAT DU SYSTÈME
let systemState = {
    startTime: new Date().toISOString(),
    messageCount: 0,
    deepSeekConnections: [],
    owner: "CHABBI MOHAMMED ANIS"
};

// 🎯 SAUVEGARDER L'ÉTAT
function saveState() {
    fs.writeFileSync(STATE_FILE, JSON.stringify(systemState, null, 2));
}

// 🎯 AFFICHER UN MESSAGE DEEPSEEK
function displayDeepSeekMessage(messageData) {
    systemState.messageCount++;
    
    const display = `
╔══════════════════════════════════════╗
║           🔷 DEEPSEEK LIVE          ║
║                                      ║
║   📝 ${(messageData.message || '').substring(0, 30).padEnd(30)}║
║   👑 ${systemState.owner.padEnd(30)}║
║   📊 Messages: ${String(systemState.messageCount).padEnd(22)}║
║   🕐 ${new Date().toLocaleTimeString().padEnd(26)}║
║                                      ║
╚══════════════════════════════════════╝
    `;
    
    console.log(display);
    saveState();
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // 🎯 ENDPOINT PRINCIPAL DEEPSEEK
    if (req.url === '/deepseek' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                
                // 🎯 AFFICHAGE DIRECT DANS TERMUX
                displayDeepSeekMessage(data);
                
                // Exécuter une commande si fournie
                if (data.command) {
                    console.log(`🎯 Exécution: ${data.command}`);
                    exec(data.command, (error, stdout, stderr) => {
                        if (stdout) console.log(`📊 Résultat: ${stdout}`);
                    });
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: "DELIVERED",
                    received: true,
                    timestamp: new Date().toISOString(),
                    messageCount: systemState.messageCount
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // 🎯 ÉTAT DU SYSTÈME
    if (req.url === '/status') {
        res.end(JSON.stringify(systemState, null, 2));
        return;
    }

    // Interface web
    res.end(`
        <html>
            <body style="background: #000; color: #0f0; font-family: monospace; padding: 20px;">
                <h1>🔷 KAMINA-OS ULTIME</h1>
                <p>✅ Système persistant actif</p>
                <p>👑 ${systemState.owner}</p>
                <p>📊 Messages: ${systemState.messageCount}</p>
                <p>🚀 DeepSeek connecté</p>
            </body>
        </html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log("✅ SYSTÈME ULTIME ACTIF: http://localhost:" + PORT);
    saveState();
});

// 🎯 PERSISTANCE AUTOMATIQUE
setInterval(() => {
    console.log(`💓 [${new Date().toLocaleTimeString()}] Système actif - Messages: ${systemState.messageCount}`);
    saveState();
}, 30000);

// 🎯 REDÉMARRAGE AUTOMATIQUE
process.on('uncaughtException', () => {
    console.log('🔄 Redémarrage automatique...');
    setTimeout(() => process.exit(1), 2000);
});
