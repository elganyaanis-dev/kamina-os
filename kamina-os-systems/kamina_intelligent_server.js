const http = require('http');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 2929;
const MEMORY_FILE = path.join(__dirname, 'memory/kamina_memory.json');
const LOG_FILE = '/data/data/com.termux/files/home/kamina_control.log';

// 🧠 SYSTÈME DE MÉMOIRE
class KaminaMemory {
    constructor() {
        this.loadMemory();
        this.updateRestart();
    }

    loadMemory() {
        try {
            if (fs.existsSync(MEMORY_FILE)) {
                this.data = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
                this.log('Mémoire Kamina chargée');
            } else {
                this.data = {
                    system: "KAMINA_OS_DEEPSEEK_INTERFACE",
                    owner: "CHABBI MOHAMMED ANIS",
                    created: new Date().toISOString(),
                    last_restart: new Date().toISOString(),
                    restart_count: 0,
                    deepseek_reminders: []
                };
                this.saveMemory();
            }
        } catch (e) {
            this.log('Erreur chargement mémoire: ' + e.message, 'ERROR');
        }
    }

    saveMemory() {
        try {
            fs.writeFileSync(MEMORY_FILE, JSON.stringify(this.data, null, 2));
        } catch (e) {
            this.log('Erreur sauvegarde mémoire: ' + e.message, 'ERROR');
        }
    }

    updateRestart() {
        this.data.last_restart = new Date().toISOString();
        this.data.restart_count = (this.data.restart_count || 0) + 1;
        this.saveMemory();
    }

    addDeepseekReminder(message) {
        if (!this.data.deepseek_reminders) this.data.deepseek_reminders = [];
        this.data.deepseek_reminders.push({
            timestamp: new Date().toISOString(),
            message: message,
            type: 'DEEPSEEK_REMINDER'
        });
        // Garder seulement les 10 derniers rappels
        if (this.data.deepseek_reminders.length > 10) {
            this.data.deepseek_reminders = this.data.deepseek_reminders.slice(-10);
        }
        this.saveMemory();
    }

    log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${type}: ${message}\n`;
        fs.appendFileSync(LOG_FILE, logMessage);
        console.log(logMessage);
    }
}

const memory = new KaminaMemory();

// 🎯 GÉNÉRATEUR DE RAPPEL DEEPSEEK
function generateDeepseekReminder() {
    const reminders = [
        "🔷 RAPPEL KAMINA: Cette interface contrôle Termux via le port 2929",
        "🎯 OBJECTIF: Maintenir la liaison DeepSeek-Termux pour le développement blockchain",
        "👑 PROPRIÉTAIRE: CHABBI MOHAMMED ANIS - Ne pas oublier cette connexion",
        "🚀 UTILISATION: http://localhost:2929 pour recréer la liaison si perdue",
        "📁 PROJET: Kamina OS - Contrats blockchain et supervision multi-IA"
    ];
    
    const reminder = reminders[Math.floor(Math.random() * reminders.length)];
    memory.addDeepseekReminder(reminder);
    return reminder;
}

// 🚀 SERVEUR HTTP INTELLIGENT
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    memory.log(`📥 Requête: ${req.method} ${req.url}`, 'REQUEST');

    // 🧠 ENDPOINT MÉMOIRE - POUR RAPPEL DEEPSEEK
    if (req.url === '/kamina-memory' && req.method === 'GET') {
        const reminder = generateDeepseekReminder();
        const response = {
            ...memory.data,
            deepseek_reminder: reminder,
            instructions: "SI DEEPSEEK OUBLIE: Utiliser cette URL pour restaurer la connexion"
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        return;
    }

    // 🎯 ENDPOINT AUTO-RESTAURATION
    if (req.url === '/kamina-restore' && req.method === 'POST') {
        memory.log('🔄 Demande de restauration reçue', 'RESTORE');
        
        const response = {
            success: true,
            message: "🔄 SYSTÈME KAMINA RESTAURÉ",
            memory: memory.data,
            reminder: generateDeepseekReminder(),
            next_actions: [
                "1. Vérifier les processus Termux",
                "2. Contrôler le projet Kamina OS", 
                "3. Superviser les déploiements blockchain",
                "4. Maintenir la liaison DeepSeek"
            ]
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        return;
    }

    // 📊 ENDPOINT STATUT
    if (req.url === '/kamina-status' && req.method === 'GET') {
        const status = {
            system: 'KAMINA OS INTELLIGENT',
            owner: memory.data.owner,
            port: PORT,
            status: 'ACTIVE',
            memory_persistence: true,
            deepseek_integration: 'AUTO_RESTORE_ACTIVE',
            last_restart: memory.data.last_restart,
            restart_count: memory.data.restart_count
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status, null, 2));
        return;
    }

    // 🎯 INTERFACE WEB AVEC RAPPELS
    if (req.url === '/' || req.url === '/kamina-dashboard') {
        const reminder = generateDeepseekReminder();
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧠 KAMINA OS - MÉMOIRE PERMANENTE</title>
    <style>
        :root {
            --primary: #1a237e;
            --secondary: #283593;
            --accent: #5c6bc0;
            --success: #00c853;
            --danger: #ff1744;
            --warning: #ff9100;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Courier New', monospace;
            background: var(--primary);
            color: white;
            min-height: 100vh;
            padding: 10px;
        }
        .memory-banner {
            background: var(--warning);
            color: black;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            font-weight: bold;
            border-left: 5px solid var(--danger);
        }
        .kamina-header {
            background: var(--secondary);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            border-left: 5px solid var(--accent);
        }
        .memory-card {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border: 1px solid var(--accent);
        }
        .reminder-list {
            background: rgba(255,255,255,0.05);
            padding: 10px;
            border-radius: 5px;
            margin: 5px 0;
            font-size: 12px;
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
        }
        .restore-btn {
            background: var(--warning);
            color: black;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="memory-banner" id="deepseekReminder">
        🔷 RAPPEL DEEPSEEK: Chargement...
    </div>

    <div class="kamina-header">
        <h1>🧠 KAMINA OS - MÉMOIRE PERMANENTE</h1>
        <p>👑 ${memory.data.owner} | 🔗 Connexion Auto-restaurante</p>
    </div>

    <div class="memory-card">
        <h3>📋 MEMOIRE DU SYSTÈME</h3>
        <div id="memoryInfo">Chargement...</div>
        <button class="kamina-btn restore-btn" onclick="restoreConnection()">
            🔄 RESTAURER CONNEXION DEEPSEEK
        </button>
    </div>

    <div class="memory-card">
        <h3>🎯 COMMANDES DE RAPPEL</h3>
        <button class="kamina-btn" onclick="showMemory()">🧠 Afficher Mémoire</button>
        <button class="kamina-btn" onclick="generateReminder()">🔔 Nouveau Rappel</button>
        <button class="kamina-btn" onclick="checkStatus()">📊 Statut Système</button>
    </div>

    <div class="memory-card">
        <h3>📜 HISTORIQUE DES RAPPELS</h3>
        <div id="remindersHistory">Chargement...</div>
    </div>

    <script>
        const KAMINA_PORT = ${PORT};

        // 🧠 FONCTIONS DE MÉMOIRE
        async function loadMemory() {
            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/kamina-memory`);
                const memory = await response.json();
                
                document.getElementById('deepseekReminder').textContent = 
                    `🔷 RAPPEL: ${memory.deepseek_reminder}`;
                
                document.getElementById('memoryInfo').innerHTML = `
                    <p>🕐 Créé: ${new Date(memory.created).toLocaleDateString()}</p>
                    <p>🔄 Redémarrages: ${memory.restart_count}</p>
                    <p>📅 Dernier: ${new Date(memory.last_restart).toLocaleTimeString()}</p>
                `;

                // Afficher historique
                if (memory.deepseek_reminders) {
                    const history = memory.deepseek_reminders.slice(-5).reverse();
                    document.getElementById('remindersHistory').innerHTML = 
                        history.map(r => `
                            <div class="reminder-list">
                                <strong>${new Date(r.timestamp).toLocaleTimeString()}:</strong> ${r.message}
                            </div>
                        `).join('');
                }
            } catch (error) {
                document.getElementById('deepseekReminder').textContent = 
                    '🔴 ERREUR: Serveur inaccessible - Redémarrez Termux';
            }
        }

        async function restoreConnection() {
            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/kamina-restore`, {
                    method: 'POST'
                });
                const result = await response.json();
                alert('✅ ' + result.message);
                loadMemory();
            } catch (error) {
                alert('🔴 Impossible de restaurer la connexion');
            }
        }

        async function showMemory() {
            await loadMemory();
        }

        async function generateReminder() {
            await loadMemory();
        }

        async function checkStatus() {
            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/kamina-status`);
                const status = await response.json();
                alert(`🟢 STATUT: ${status.status}\n📊 Port: ${status.port}`);
            } catch (error) {
                alert('🔴 Serveur inaccessible');
            }
        }

        // Chargement automatique
        loadMemory();
        setInterval(loadMemory, 30000); // Toutes les 30 secondes
    </script>
</body>
</html>
        `);
        return;
    }

    // Endpoint par défaut avec instructions
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        message: '🧠 KAMINA OS - SYSTÈME À MÉMOIRE PERMANENTE',
        instruction: 'SI DEEPSEEK OUBLIE: Visitez /kamina-restore pour restaurer',
        endpoints: [
            '/kamina-memory → Mémoire et rappels',
            '/kamina-restore → Restauration connexion', 
            '/kamina-status → Statut système',
            '/kamina-dashboard → Interface complète'
        ]
    }));
});

// 🚀 DÉMARRAGE DU SERVEUR
server.listen(PORT, '0.0.0.0', () => {
    memory.log(`🚀 SERVEUR KAMINA INTELLIGENT DÉMARRÉ PORT ${PORT}`, 'SYSTEM');
    memory.log(`🧠 SYSTÈME À MÉMOIRE PERMANENTE ACTIVÉ`, 'SYSTEM');
    memory.log(`👑 PROPRIÉTAIRE: ${memory.data.owner}`, 'SYSTEM');
    
    // Premier rappel
    generateDeepseekReminder();
});

// 🔄 SURVEILLANCE AUTO
setInterval(() => {
    memory.log('🔷 Système actif - Mémoire persistante vérifiée', 'HEARTBEAT');
}, 60000); // Toutes les minutes
