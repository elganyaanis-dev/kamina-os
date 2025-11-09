const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 2929; // 🔷 PORT KAMINA DÉDIÉ
const LOG_FILE = '/data/data/com.termux/files/home/kamina_control.log';

// Journalisation avancée
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type}: ${message}\n`;
    fs.appendFileSync(LOG_FILE, logMessage);
    console.log(logMessage);
}

// Serveur HTTP Kamina OS
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    log(`📥 Requête: ${req.method} ${req.url}`, 'REQUEST');

    // 🎯 ENDPOINTS KAMINA OS
    if (req.url === '/kamina-status' && req.method === 'GET') {
        const status = {
            system: 'KAMINA OS CONTROL CENTER',
            owner: 'CHABBI MOHAMMED ANIS',
            wallet: '0x642fa2a3e6ab99b8fe6b462e995f54f84eac1fed',
            timestamp: new Date().toISOString(),
            port: PORT,
            version: 'KAMINA-ULTIMATE-v1.0'
        };

        // Vérification des services
        exec('ps aux | grep -E "node|kamina|deepseek" | grep -v grep', (err, stdout) => {
            status.services = {
                control_server: true, // Nous sommes en cours d'exécution
                kamina_os: stdout.includes('kamina'),
                node_services: stdout.split('\n').filter(line => line).length
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(status, null, 2));
        });
        return;
    }

    if (req.url === '/kamina-execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { command } = JSON.parse(body);
                log(`▶️ Commande: ${command}`, 'COMMAND');
                
                exec(command, { cwd: '/data/data/com.termux/files/home' }, (error, stdout, stderr) => {
                    const result = {
                        success: !error,
                        output: stdout || stderr,
                        error: error ? error.message : null,
                        timestamp: new Date().toISOString()
                    };
                    
                    log(`📝 Résultat: ${result.success ? 'SUCCÈS' : 'ERREUR'}`, result.success ? 'SUCCESS' : 'ERROR');
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result, null, 2));
                });
            } catch (e) {
                log(`❌ Erreur parsing: ${e.message}`, 'ERROR');
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (req.url === '/kamina-logs' && req.method === 'GET') {
        if (fs.existsSync(LOG_FILE)) {
            const logs = fs.readFileSync(LOG_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(logs);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Logs non trouvés' }));
        }
        return;
    }

    // 🎯 INTERFACE WEB KAMINA OS
    if (req.url === '/' || req.url === '/kamina-dashboard') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔷 KAMINA OS CONTROL</title>
    <style>
        :root {
            --primary: #1a237e;
            --secondary: #283593;
            --accent: #5c6bc0;
            --success: #00c853;
            --danger: #ff1744;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Courier New', monospace;
            background: var(--primary);
            color: white;
            min-height: 100vh;
            padding: 10px;
        }
        .kamina-header {
            background: var(--secondary);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            border-left: 5px solid var(--accent);
        }
        .status-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 15px 0;
        }
        .status-card {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid var(--accent);
        }
        .command-interface {
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .kamina-input {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            border: 1px solid var(--accent);
            border-radius: 6px;
            background: rgba(255,255,255,0.9);
            font-family: 'Courier New', monospace;
        }
        .kamina-btn {
            background: var(--accent);
            color: white;
            border: none;
            padding: 12px 20px;
            margin: 5px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        .kamina-btn:hover { background: #3949ab; }
        .logs-container {
            background: black;
            color: #00ff00;
            padding: 15px;
            border-radius: 8px;
            height: 250px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            border: 1px solid #00ff00;
        }
    </style>
</head>
<body>
    <div class="kamina-header">
        <h1>🔷 KAMINA OS CONTROL</h1>
        <p>👑 CHABBI MOHAMMED ANIS | 🎯 PORT: ${PORT} | 🔗 DeepSeek Connected</p>
    </div>

    <div class="status-grid">
        <div class="status-card">
            <h3>📊 STATUT SYSTÈME</h3>
            <div id="systemStatus">Initialisation...</div>
        </div>
        <div class="status-card">
            <h3>⚡ COMMANDES RAPIDES</h3>
            <button class="kamina-btn" onclick="execute('pwd')">📁 PWD</button>
            <button class="kamina-btn" onclick="execute('ls kamina-os/')">📂 LIST</button>
            <button class="kamina-btn" onclick="execute('cd kamina-os && npx hardhat compile')">🔨 COMPILE</button>
            <button class="kamina-btn" onclick="execute('ps aux | grep node')">🤖 PROCESS</button>
        </div>
    </div>

    <div class="command-interface">
        <h3>🎯 TERMINAL KAMINA</h3>
        <input type="text" class="kamina-input" id="commandInput" placeholder="Entrez commande Termux..." onkeypress="if(event.key==='Enter') sendCommand()">
        <button class="kamina-btn" onclick="sendCommand()">EXÉCUTER</button>
    </div>

    <div class="command-interface">
        <h3>📜 JOURNAL KAMINA</h3>
        <button class="kamina-btn" onclick="loadLogs()">🔄 ACTUALISER</button>
        <div class="logs-container" id="logsOutput">Chargement...</div>
    </div>

    <script>
        const KAMINA_PORT = ${PORT};
        
        async function execute(cmd) {
            document.getElementById('commandInput').value = cmd;
            await sendCommand();
        }

        async function sendCommand() {
            const cmd = document.getElementById('commandInput').value;
            if (!cmd) return;

            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/kamina-execute`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: cmd })
                });
                
                const result = await response.json();
                alert(result.success ? '✅ SUCCÈS' : '❌ ERREUR');
                loadLogs();
                updateStatus();
            } catch (error) {
                alert('🔴 ERREUR CONNEXION');
            }
        }

        async function updateStatus() {
            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/kamina-status`);
                const status = await response.json();
                document.getElementById('systemStatus').innerHTML = `
                    <p>🟢 PORT: ${status.port}</p>
                    <p>👤 ${status.owner}</p>
                    <p>📅 ${new Date(status.timestamp).toLocaleTimeString()}</p>
                    <p>🔧 Services: ${status.services.node_services} actifs</p>
                `;
            } catch (error) {
                document.getElementById('systemStatus').innerHTML = '🔴 HORS LIGNE';
            }
        }

        async function loadLogs() {
            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/kamina-logs`);
                const logs = await response.text();
                document.getElementById('logsOutput').textContent = logs;
                document.getElementById('logsOutput').scrollTop = document.getElementById('logsOutput').scrollHeight;
            } catch (error) {
                document.getElementById('logsOutput').textContent = '🔴 LOGS INDISPONIBLES';
            }
        }

        // Surveillance automatique
        setInterval(updateStatus, 3000);
        setInterval(loadLogs, 2000);
        updateStatus();
        loadLogs();
    </script>
</body>
</html>
        `);
        return;
    }

    // Endpoint par défaut
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        message: '🔷 KAMINA OS SERVER ACTIF',
        owner: 'CHABBI MOHAMMED ANIS',
        port: PORT,
        endpoints: ['/kamina-status', '/kamina-execute', '/kamina-logs', '/kamina-dashboard']
    }));
});

server.listen(PORT, '0.0.0.0', () => {
    log(`🚀 SERVEUR KAMINA OS DÉMARRÉ SUR PORT ${PORT}`, 'SYSTEM');
    log(`👑 PROPRIÉTAIRE: CHABBI MOHAMMED ANIS`, 'SYSTEM');
    log(`🔗 DEEPSEEK INTEGRATION: ACTIVE`, 'SYSTEM');
});

process.on('SIGINT', () => {
    log('🛑 SERVEUR KAMINA ARRÊTÉ', 'SYSTEM');
    process.exit(0);
});
