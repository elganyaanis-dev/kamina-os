const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 2931;

console.log("🔷 CONNEXION RÉELLE DEEPSEEK-TERMUX ACTIVÉE");
console.log("🎯 DÉVELOPPEMENT CONTINU ASSURÉ");

const server = http.createServer((req, res) => {
    console.log(`📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // 🎯 ENDPOINT MESSAGE RÉEL
    if (req.url === '/deepseek-message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message, type = 'info' } = JSON.parse(body);
                
                // 🎯 AFFICHAGE RÉEL DANS TERMUX
                const border = '═'.repeat(40);
                console.log('\n╔' + border + '╗');
                console.log('║' + ' '.repeat(40) + '║');
                console.log('║' + '📨 MESSAGE DEEPSEEK RÉEL'.padStart(30).padEnd(40) + '║');
                console.log('║' + ' '.repeat(40) + '║');
                console.log('║   ' + message.padEnd(37) + '║');
                console.log('║' + ' '.repeat(40) + '║');
                console.log('║   👑 CHABBI MOHAMMED ANIS'.padEnd(40) + '║');
                console.log('║   🕐 ' + new Date().toLocaleTimeString().padEnd(34) + '║');
                console.log('║   🌐 Port: ' + String(PORT).padEnd(29) + '║');
                console.log('║' + ' '.repeat(40) + '║');
                console.log('╚' + border + '╝\n');
                
                // 🎯 SAUVEGARDE RÉELLE
                fs.appendFileSync(
                    path.join(__dirname, 'real_messages.log'),
                    `[${new Date().toISOString()}] ${message}\n`
                );
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true,
                    delivered: true,
                    termux_display: true,
                    timestamp: new Date().toISOString(),
                    port: PORT
                }));
                
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }
    
    // 🎯 ENDPOINT COMMANDE RÉELLE
    if (req.url === '/deepseek-command' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { command } = JSON.parse(body);
                
                console.log(`\n🎯 COMMANDE RÉELLE EXÉCUTÉE: ${command}`);
                
                const { exec } = require('child_process');
                exec(command, (error, stdout, stderr) => {
                    const result = {
                        command: command,
                        output: stdout || stderr,
                        error: error ? error.message : null,
                        executed_at: new Date().toISOString(),
                        success: !error
                    };
                    
                    console.log(`📊 RÉSULTAT: ${result.success ? 'SUCCÈS' : 'ERREUR'}`);
                    if (stdout) console.log(`📝 Output: ${stdout}`);
                    
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
    
    // 🎯 ENDPOINT DÉVELOPPEMENT
    if (req.url === '/develop' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { feature, code } = JSON.parse(body);
                
                console.log(`\n🔧 DÉVELOPPEMENT: ${feature}`);
                console.log(`💻 Code reçu: ${code.substring(0, 100)}...`);
                
                // Créer le fichier de développement
                const devFile = path.join(__dirname, 'development', `${feature.replace(/\s+/g, '_')}.js`);
                fs.mkdirSync(path.dirname(devFile), { recursive: true });
                fs.writeFileSync(devFile, code);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    developed: true,
                    feature: feature,
                    file: devFile,
                    timestamp: new Date().toISOString()
                }));
                
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }
    
    // 🎯 INTERFACE WEB RÉELLE
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>🔷 CONNEXION RÉELLE - Port ${PORT}</title>
    <meta charset="utf-8">
    <style>
        body { background: #0d1117; color: #c9d1d9; font-family: 'Courier New', monospace; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .panel { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 20px; margin: 15px 0; }
        input, textarea, button { 
            background: #0d1117; color: #c9d1d9; border: 1px solid #30363d; 
            padding: 10px; margin: 5px; border-radius: 4px; font-family: monospace;
        }
        button { background: #238636; cursor: pointer; }
        button:hover { background: #2ea043; }
        .log { background: #000; padding: 15px; border-radius: 4px; height: 300px; overflow-y: scroll; font-size: 12px; }
        .status { color: #3fb950; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔷 CONNEXION RÉELLE DEEPSEEK-TERMUX</h1>
        <div class="panel">
            <h3>📨 Envoyer un message réel à Termux</h3>
            <input type="text" id="messageInput" value="Test de connexion réelle DeepSeek-Termux" style="width: 70%;">
            <button onclick="sendRealMessage()">📤 Envoyer à Termux</button>
        </div>
        
        <div class="panel">
            <h3>🎯 Exécuter une commande réelle</h3>
            <input type="text" id="commandInput" value="pwd && ls -la" style="width: 70%;">
            <button onclick="executeRealCommand()">⚡ Exécuter dans Termux</button>
        </div>
        
        <div class="panel">
            <h3>🔧 Développement Kamina-OS</h3>
            <input type="text" id="featureInput" placeholder="Nom de la fonctionnalité" value="deepseek_connector">
            <textarea id="codeInput" placeholder="Code JavaScript" style="width: 100%; height: 100px;">// Nouvelle fonctionnalité Kamina-OS\nconsole.log("Développement actif!");</textarea>
            <button onclick="developFeature()">🚀 Développer</button>
        </div>
        
        <div class="panel">
            <h3>📊 Journal réel en temps réel</h3>
            <div class="log" id="realLog">
                🔷 Connexion réelle établie sur le port ${PORT}
                👑 CHABBI MOHAMMED ANIS
                🚀 Développement continu activé
            </div>
        </div>
    </div>

    <script>
        const log = document.getElementById('realLog');
        
        function addLog(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            log.innerHTML += `\\n[${timestamp}] ${message}`;
            log.scrollTop = log.scrollHeight;
        }

        async function sendRealMessage() {
            const message = document.getElementById('messageInput').value;
            addLog(`📨 Envoi message: "${message}"`);
            
            try {
                const response = await fetch('/deepseek-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, type: 'real' })
                });
                
                const result = await response.json();
                if (result.success) {
                    addLog('✅ Message affiché dans Termux!', 'success');
                }
            } catch (error) {
                addLog('❌ Erreur: ' + error.message, 'error');
            }
        }

        async function executeRealCommand() {
            const command = document.getElementById('commandInput').value;
            addLog(`🎯 Exécution: ${command}`);
            
            try {
                const response = await fetch('/deepseek-command', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command })
                });
                
                const result = await response.json();
                addLog(`📝 Résultat: ${result.output || 'Commande exécutée'}`);
            } catch (error) {
                addLog('❌ Erreur: ' + error.message, 'error');
            }
        }

        async function developFeature() {
            const feature = document.getElementById('featureInput').value;
            const code = document.getElementById('codeInput').value;
            addLog(`🔧 Développement: ${feature}`);
            
            try {
                const response = await fetch('/develop', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ feature, code })
                });
                
                const result = await response.json();
                addLog(`✅ Fonctionnalité développée: ${result.feature}`, 'success');
            } catch (error) {
                addLog('❌ Erreur développement: ' + error.message, 'error');
            }
        }

        // Test automatique
        setTimeout(() => {
            addLog('🚀 SYSTÈME PRÊT - Connexion réelle active');
        }, 1000);
    </script>
</body>
</html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║           🔷 CONNEXION RÉELLE ÉTABLIE!                      ║');
    console.log('║                                                              ║');
    console.log('║   ✅ Serveur actif sur le port: ' + String(PORT).padEnd(39) + '║');
    console.log('║   👑 CHABBI MOHAMMED ANIS' + ' '.repeat(44) + '║');
    console.log('║   🌐 Accès: http://localhost:' + String(PORT).padEnd(38) + '║');
    console.log('║   🚀 Développement continu activé' + ' '.repeat(33) + '║');
    console.log('║                                                              ║');
    console.log('║   📨 Envoyez des messages RÉELS à Termux                    ║');
    console.log('║   🎯 Exécutez des commandes RÉELLES                         ║');
    console.log('║   🔧 Développez Kamina-OS en direct                         ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    console.log('🔷 DÉMARRAGE RÉUSSI - PRÊT POUR LA CONNEXION RÉELLE!');
});

// Surveillance continue
setInterval(() => {
    console.log(`💓 [${new Date().toLocaleTimeString()}] Connexion réelle active - Port ${PORT}`);
}, 60000);
