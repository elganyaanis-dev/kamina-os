const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const PORT = 2950;
const LOG_FILE = path.join(__dirname, 'deepseek_messages.log');

console.log("🔷 SYSTÈME KAMINA-OS RÉEL - DÉMARRAGE");
console.log("👑 CHABBI MOHAMMED ANIS");
console.log("🌐 Port: " + PORT);

// Fonction pour logger les messages
function logMessage(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type}: ${message}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    console.log(`📝 ${logEntry}`);
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

    // 🎯 ENDPOINT PRINCIPAL POUR DEEPSEEK
    if (req.url === '/deepseek-connect' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                
                // 🎯 AFFICHAGE SPÉCIAL DANS TERMUX
                console.log('\n╔══════════════════════════════════════╗');
                console.log('║           🔷 DEEPSEEK CONNECT        ║');
                console.log('║                                      ║');
                console.log('║   📨 ' + (data.message || 'Nouveau message').substring(0, 30).padEnd(30) + '║');
                console.log('║   👑 ' + (data.owner || 'CHABBI MOHAMMED ANIS').padEnd(30) + '║');
                console.log('║   🎯 ' + (data.action || 'Communication').padEnd(30) + '║');
                console.log('║   🕐 ' + new Date().toLocaleTimeString().padEnd(30) + '║');
                console.log('║                                      ║');
                console.log('╚══════════════════════════════════════╝\n');

                // Logger le message
                logMessage(`DeepSeek: ${data.message}`, 'DEEPSEEK');

                // Exécuter une commande si fournie
                if (data.command) {
                    console.log('🎯 Exécution commande: ' + data.command);
                    exec(data.command, (error, stdout, stderr) => {
                        if (stdout) {
                            console.log('📊 Résultat: ' + stdout);
                            logMessage(`CMD Output: ${stdout}`, 'COMMAND');
                        }
                        if (stderr) console.log('⚠️  Erreur: ' + stderr);
                    });
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'CONNECTED',
                    message: 'Message reçu par Termux',
                    timestamp: new Date().toISOString(),
                    server: 'KAMINA-OS'
                }));

            } catch (error) {
                console.log('❌ Erreur: ' + error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // 🎯 ENDPOINT POUR L'ÉTAT DU SYSTÈME
    if (req.url === '/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            system: 'KAMINA-OS',
            status: 'ACTIVE',
            owner: 'CHABBI MOHAMMED ANIS',
            deepseek_connected: true,
            timestamp: new Date().toISOString(),
            port: PORT
        }));
        return;
    }

    // 🎯 INTERFACE WEB SIMPLE
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>🔷 KAMINA-OS - Connexion Réelle</title>
    <style>
        body { background: #0d1117; color: #c9d1d9; font-family: monospace; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .status { background: #161b22; padding: 15px; border-radius: 6px; margin: 10px 0; }
        .connected { color: #3fb950; }
        input, button { 
            background: #21262d; color: #c9d1d9; border: 1px solid #30363d; 
            padding: 10px; margin: 5px; border-radius: 4px; 
        }
        button { background: #238636; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔷 KAMINA-OS ACTIF</h1>
        <div class="status">
            <p class="connected">✅ Connecté à Termux</p>
            <p>👑 CHABBI MOHAMMED ANIS</p>
            <p>🌐 Port: ${PORT}</p>
        </div>
        <p>Le serveur est prêt à recevoir des messages de DeepSeek.</p>
    </div>
</body>
</html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log("✅ SERVEUR KAMINA-OS ACTIF: http://localhost:" + PORT);
    console.log("🔷 PRÊT POUR LA CONNEXION RÉELLE AVEC DEEPSEEK");
    logMessage('Serveur KAMINA-OS démarré', 'SYSTEM');
});

// Garder le serveur actif
setInterval(() => {
    logMessage('Serveur actif', 'HEARTBEAT');
}, 60000);
