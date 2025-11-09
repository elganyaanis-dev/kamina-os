const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 2930;

console.log("🔷 SERVEUR SIMPLE SANS DÉPENDANCES - DÉMARRAGE");

const server = http.createServer((req, res) => {
    console.log(`📨 Requête reçue: ${req.method} ${req.url}`);
    
    // Headers CORS pour autoriser les requêtes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === '/send-message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const message = data.message;
                
                // 🎯 AFFICHAGE DIRECT DANS TERMUX
                console.log('\n╔══════════════════════════════════════╗');
                console.log('║           📨 MESSAGE REÇU!           ║');
                console.log('║                                      ║');
                console.log('║   "' + message + '"');
                console.log('║                                      ║');
                console.log('║   👑 CHABBI MOHAMMED ANIS            ║');
                console.log('║   🕐 ' + new Date().toLocaleTimeString() + '              ║');
                console.log('║                                      ║');
                console.log('╚══════════════════════════════════════╝\n');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'SUCCESS', 
                    message: 'Message affiché dans Termux',
                    timestamp: new Date().toISOString()
                }));
                
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }
    
    if (req.url === '/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const command = data.command;
                
                console.log(`🎯 Exécution commande: ${command}`);
                
                const { exec } = require('child_process');
                exec(command, (error, stdout, stderr) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        command: command,
                        output: stdout || stderr,
                        error: error ? error.message : null,
                        timestamp: new Date().toISOString()
                    }));
                });
                
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }
    
    // Interface web simple
    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>🔷 Contrôle Termux Réel</title>
    <meta charset="utf-8">
    <style>
        body { background: #000; color: #0f0; font-family: monospace; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        input, button { 
            background: #222; color: #0f0; border: 1px solid #0f0; 
            padding: 10px; margin: 5px; font-family: monospace;
        }
        .log { background: #111; padding: 10px; height: 200px; overflow-y: scroll; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔷 CONTRÔLE TERMUX RÉEL</h1>
        <p>👑 CHABBI MOHAMMED ANIS</p>
        
        <div>
            <input type="text" id="message" placeholder="Votre message" value="Test de connexion réelle">
            <button onclick="sendMessage()">📤 Envoyer à Termux</button>
        </div>
        
        <div>
            <input type="text" id="command" placeholder="Commande (ls, pwd, etc)" value="ls -la">
            <button onclick="executeCommand()">⚡ Exécuter</button>
        </div>
        
        <h3>📊 Journal:</h3>
        <div class="log" id="log">Démarrage...</div>
    </div>

    <script>
        const log = document.getElementById('log');
        
        function addLog(msg) {
            log.innerHTML += '> ' + msg + '\\n';
            log.scrollTop = log.scrollHeight;
        }

        async function sendMessage() {
            const message = document.getElementById('message').value;
            addLog('Envoi: ' + message);
            
            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                const result = await response.json();
                addLog('✓ Succès: ' + result.message);
            } catch (error) {
                addLog('✗ Erreur: ' + error.message);
            }
        }

        async function executeCommand() {
            const command = document.getElementById('command').value;
            addLog('Exécution: ' + command);
            
            try {
                const response = await fetch('/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command })
                });
                const result = await response.json();
                addLog('Résultat: ' + (result.output || 'Commande exécutée'));
            } catch (error) {
                addLog('✗ Erreur: ' + error.message);
            }
        }

        addLog('🔷 Interface prête - Envoyez un message!');
    </script>
</body>
</html>
        `);
        return;
    }
    
    // Route par défaut
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        status: 'SERVER_ACTIVE',
        message: 'Serveur Termux opérationnel',
        owner: 'CHABBI MOHAMMED ANIS',
        timestamp: new Date().toISOString()
    }));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('✅ SERVEUR ACTIF: http://localhost:' + PORT);
    console.log('🔷 PRÊT À RECEVOIR DES COMMANDES RÉELLES');
    console.log('👑 CHABBI MOHAMMED ANIS - CONNEXION RÉELLE ÉTABLIE');
});

// Garder le serveur actif
setInterval(() => {
    console.log('💓 Serveur actif - ' + new Date().toLocaleTimeString());
}, 30000);
