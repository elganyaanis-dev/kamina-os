const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 2930;

console.log("🔷 SYSTÈME DE MESSAGERIE HTTP ACTIVÉ");

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 🎯 ENDPOINT POUR ENVOYER DES MESSAGES À TERMUX
    if (req.url === '/send-message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message } = JSON.parse(body);
                
                console.log(`\n📨 MESSAGE REÇU: ${message}`);
                
                // 🎯 AFFICHER LE MESSAGE DANS TERMUX
                const displayMessage = `
╔══════════════════════════════════════╗
║           📨 MESSAGE HTTP           ║
║                                      ║
║   "${message}"                       ║
║                                      ║
║   🌐 Via: localhost:2930            ║
║   🕐 ${new Date().toLocaleTimeString()}           ║
║   👑 ${"CHABBI MOHAMMED ANIS"}      ║
║                                      ║
╚══════════════════════════════════════╝
                `;
                
                console.log(displayMessage);
                
                // 🎯 SAUVEGARDER DANS L'HISTORIQUE
                fs.appendFileSync(
                    path.join(__dirname, 'memory/messages.txt'),
                    `[${new Date().toISOString()}] ${message}\n`
                );

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    delivered: true,
                    timestamp: new Date().toISOString()
                }));
                
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 🎯 ENDPOINT POUR EXÉCUTER DES COMMANDES
    if (req.url === '/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { command } = JSON.parse(body);
                
                console.log(`\n🎯 COMMANDE EXÉCUTÉE: ${command}`);
                
                exec(command, (error, stdout, stderr) => {
                    const result = {
                        command: command,
                        output: stdout || stderr,
                        error: error ? error.message : null,
                        timestamp: new Date().toISOString()
                    };
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                });
                
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 🎯 INTERFACE WEB
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>🔷 Contrôle Termux</title>
    <style>
        body { 
            background: #0d1117; 
            color: white; 
            font-family: Arial; 
            padding: 20px;
        }
        .container { max-width: 600px; margin: 0 auto; }
        .message-box { 
            background: #161b22; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0;
        }
        input, textarea { 
            width: 100%; 
            padding: 10px; 
            margin: 10px 0; 
            background: #21262d; 
            border: 1px solid #30363d; 
            color: white; 
            border-radius: 5px;
        }
        button { 
            background: #238636; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer;
        }
        .log { 
            background: black; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 10px 0; 
            font-family: monospace; 
            height: 200px; 
            overflow-y: scroll;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔷 Contrôle Termux - DeepSeek</h1>
        <div class="message-box">
            <h3>📨 Envoyer un message à Termux</h3>
            <input type="text" id="messageInput" placeholder="Tapez votre message...">
            <button onclick="sendMessage()">📤 Envoyer</button>
        </div>
        
        <div class="message-box">
            <h3>🎯 Exécuter une commande</h3>
            <input type="text" id="commandInput" placeholder="ls -la">
            <button onclick="executeCommand()">⚡ Exécuter</button>
        </div>
        
        <div class="message-box">
            <h3>📊 Journal en temps réel</h3>
            <div class="log" id="logOutput">En attente de messages...</div>
        </div>
    </div>

    <script>
        const log = document.getElementById('logOutput');
        
        function addLog(message) {
            log.innerHTML += '> ' + message + '\\n';
            log.scrollTop = log.scrollHeight;
        }

        async function sendMessage() {
            const message = document.getElementById('messageInput').value;
            if (!message) return;
            
            addLog('Envoi: ' + message);
            
            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                
                const result = await response.json();
                addLog('✓ Message délivré: ' + message);
                document.getElementById('messageInput').value = '';
                
            } catch (error) {
                addLog('✗ Erreur: ' + error.message);
            }
        }

        async function executeCommand() {
            const command = document.getElementById('commandInput').value;
            if (!command) return;
            
            addLog('Exécution: ' + command);
            
            try {
                const response = await fetch('/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command })
                });
                
                const result = await response.json();
                addLog('Résultat: ' + (result.output || 'Commande exécutée'));
                document.getElementById('commandInput').value = '';
                
            } catch (error) {
                addLog('✗ Erreur: ' + error.message);
            }
        }

        // 📝 Exemple automatique
        document.getElementById('messageInput').value = "Hello depuis le navigateur!";
    </script>
</body>
</html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🔷 Serveur messagerie actif: http://localhost:${PORT}`);
    console.log("📨 Prêt à recevoir des messages HTTP!");
});

// 🎯 MAINTENIR LA CONNEXION
setInterval(() => {
    console.log(`💓 Serveur actif - ${new Date().toLocaleTimeString()}`);
}, 60000);
