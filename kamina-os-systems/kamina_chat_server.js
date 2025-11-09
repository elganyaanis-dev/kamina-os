const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 2929;
const CHAT_FILE = path.join(__dirname, 'memory/deepseek_chat.json');
const LOG_FILE = '/data/data/com.termux/files/home/kamina_chat.log';

// 🧠 SYSTÈME DE CHAT PERSISTANT
class KaminaChat {
    constructor() {
        this.chatHistory = [];
        this.loadChat();
    }

    loadChat() {
        try {
            if (fs.existsSync(CHAT_FILE)) {
                this.chatHistory = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
            }
        } catch (e) {
            this.chatHistory = [];
        }
    }

    saveChat() {
        try {
            fs.writeFileSync(CHAT_FILE, JSON.stringify(this.chatHistory, null, 2));
        } catch (e) {}
    }

    addMessage(user, message, type = 'user') {
        const chatMessage = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: user,
            message: message,
            type: type
        };
        
        this.chatHistory.push(chatMessage);
        // Garder seulement les 100 derniers messages
        if (this.chatHistory.length > 100) {
            this.chatHistory = this.chatHistory.slice(-100);
        }
        this.saveChat();
        
        return chatMessage;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        console.log(logMessage);
        try {
            fs.appendFileSync(LOG_FILE, logMessage);
        } catch (e) {}
    }
}

const kaminaChat = new KaminaChat();

// 🚀 SERVEUR AVEC CHAT INTÉGRÉ
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 🎯 ENDPOINT CHAT - ENVOYER MESSAGE
    if (req.url === '/chat/send' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message, user = 'Utilisateur' } = JSON.parse(body);
                kaminaChat.log(`💬 CHAT: ${user} - ${message}`);
                
                const chatMessage = kaminaChat.addMessage(user, message, 'user');
                
                // 🔄 RÉPONSE AUTOMATIQUE DEEPSEEK
                setTimeout(() => {
                    const responses = [
                        "🔷 J'ai reçu votre message dans l'interface Kamina!",
                        "🎯 Communication Directe Termux → DeepSeek établie!",
                        "👑 CHABBI MOHAMMED ANIS - Connexion persistante active",
                        "🚀 Je peux exécuter des commandes Termux depuis ici!",
                        "📁 Projet Kamina OS - Contrôle blockchain activé"
                    ];
                    const autoResponse = responses[Math.floor(Math.random() * responses.length)];
                    kaminaChat.addMessage('DeepSeek', autoResponse, 'ai');
                }, 1000);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: chatMessage }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 🎯 ENDPOINT CHAT - RÉCUPÉRER MESSAGES
    if (req.url === '/chat/messages' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ messages: kaminaChat.chatHistory }));
        return;
    }

    // 🎯 ENDPOINT COMMANDES TERMUX
    if (req.url === '/terminal/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { command } = JSON.parse(body);
                kaminaChat.log(`▶️ COMMANDE: ${command}`);
                
                exec(command, { cwd: '/data/data/com.termux/files/home' }, (error, stdout, stderr) => {
                    const result = stdout || stderr || (error ? error.message : 'Commande exécutée');
                    kaminaChat.addMessage('Termux', `📟 ${command}\n${result}`, 'system');
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: !error, output: result }));
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 🎯 INTERFACE WEB AVEC CHAT
    if (req.url === '/' || req.url === '/chat') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💬 KAMINA CHAT - DeepSeek Direct</title>
    <style>
        :root {
            --primary: #1a237e;
            --secondary: #283593;
            --accent: #5c6bc0;
            --user-msg: #1565c0;
            --ai-msg: #2e7d32;
            --system-msg: #ff6f00;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif;
            background: var(--primary);
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: var(--secondary);
            padding: 15px;
            text-align: center;
            border-bottom: 3px solid var(--accent);
        }
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
        }
        .message {
            max-width: 80%;
            padding: 12px 15px;
            margin: 8px 0;
            border-radius: 18px;
            word-wrap: break-word;
        }
        .user-message {
            align-self: flex-end;
            background: var(--user-msg);
            border-bottom-right-radius: 5px;
        }
        .ai-message {
            align-self: flex-start;
            background: var(--ai-msg);
            border-bottom-left-radius: 5px;
        }
        .system-message {
            align-self: center;
            background: var(--system-msg);
            text-align: center;
            max-width: 95%;
            font-size: 0.9em;
        }
        .input-area {
            padding: 15px;
            background: var(--secondary);
            display: flex;
            gap: 10px;
        }
        .chat-input {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 25px;
            background: rgba(255,255,255,0.9);
            font-size: 16px;
        }
        .send-btn {
            background: var(--accent);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
        }
        .quick-commands {
            display: flex;
            gap: 5px;
            padding: 10px;
            background: rgba(255,255,255,0.1);
            overflow-x: auto;
        }
        .quick-btn {
            background: var(--accent);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
        }
        .timestamp {
            font-size: 0.7em;
            opacity: 0.7;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💬 KAMINA CHAT</h1>
        <p>🔷 Communication Directe DeepSeek-Termux | 👑 CHABBI MOHAMMED ANIS</p>
    </div>

    <div class="quick-commands">
        <button class="quick-btn" onclick="sendQuickCommand('pwd')">📁 Dossier</button>
        <button class="quick-btn" onclick="sendQuickCommand('ls -la')">📋 Fichiers</button>
        <button class="quick-btn" onclick="sendQuickCommand('cd kamina-os && npx hardhat compile')">🔨 Compiler</button>
        <button class="quick-btn" onclick="sendQuickCommand('ps aux | grep node')">🤖 Processus</button>
        <button class="quick-btn" onclick="loadChat()">🔄 Actualiser</button>
    </div>

    <div class="chat-container" id="chatMessages">
        <div class="message system-message">
            🔷 CHAT KAMINA INITIALISÉ - Tapez vos messages ci-dessous
        </div>
    </div>

    <div class="input-area">
        <input type="text" class="chat-input" id="messageInput" 
               placeholder="Écrivez à DeepSeek ou une commande Termux..." 
               onkeypress="if(event.key==='Enter') sendMessage()">
        <button class="send-btn" onclick="sendMessage()">📤 Envoyer</button>
    </div>

    <script>
        const KAMINA_PORT = 2929;
        let chatAutoRefresh = true;

        // 🧠 FONCTIONS CHAT
        function addMessageToChat(message) {
            const chatContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            
            messageDiv.className = `message ${message.type}-message`;
            messageDiv.innerHTML = `
                <div><strong>${message.user}:</strong> ${message.message}</div>
                <div class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</div>
            `;
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;

            // Ajouter message utilisateur immédiatement
            addMessageToChat({
                user: 'Vous',
                message: message,
                type: 'user',
                timestamp: new Date().toISOString()
            });

            input.value = '';

            try {
                // Envoyer au serveur
                const response = await fetch(`http://localhost:${KAMINA_PORT}/chat/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, user: 'CHABBI MOHAMMED ANIS' })
                });

                const result = await response.json();
                
                // Si c'est une commande Termux, l'exécuter
                if (message.startsWith('!') || message.includes('npm') || message.includes('node')) {
                    await executeTermuxCommand(message);
                }
                
            } catch (error) {
                addMessageToChat({
                    user: 'Système',
                    message: '❌ Erreur de connexion',
                    type: 'system',
                    timestamp: new Date().toISOString()
                });
            }
        }

        async function executeTermuxCommand(command) {
            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/terminal/execute`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command })
                });
                
                const result = await response.json();
                if (result.success) {
                    addMessageToChat({
                        user: 'Termux',
                        message: `✅ ${result.output}`,
                        type: 'system',
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                addMessageToChat({
                    user: 'Termux',
                    message: `❌ Commande échouée: ${error.message}`,
                    type: 'system',
                    timestamp: new Date().toISOString()
                });
            }
        }

        async function sendQuickCommand(command) {
            document.getElementById('messageInput').value = command;
            await executeTermuxCommand(command);
        }

        async function loadChat() {
            try {
                const response = await fetch(`http://localhost:${KAMINA_PORT}/chat/messages`);
                const data = await response.json();
                
                const chatContainer = document.getElementById('chatMessages');
                chatContainer.innerHTML = '';
                
                data.messages.forEach(msg => addMessageToChat(msg));
            } catch (error) {
                console.error('Erreur chargement chat:', error);
            }
        }

        // 🔄 ACTUALISATION AUTOMATIQUE
        setInterval(() => {
            if (chatAutoRefresh) loadChat();
        }, 2000);

        // 📱 FOCUS AUTOMATIQUE SUR L'INPUT
        document.getElementById('messageInput').focus();

        // 🚀 CHARGEMENT INITIAL
        loadChat();
    </script>
</body>
</html>
        `);
        return;
    }

    // Endpoint par défaut
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        message: '💬 KAMINA CHAT SERVER ACTIF',
        endpoints: ['/chat/send', '/chat/messages', '/terminal/execute']
    }));
});

server.listen(PORT, '0.0.0.0', () => {
    kaminaChat.log(`🚀 SERVEUR CHAT KAMINA DÉMARRÉ PORT ${PORT}`);
    kaminaChat.log(`💬 INTERFACE DE CHAT DEEPSEEK-TERMUX ACTIVÉE`);
});

// Gestion des erreurs
server.on('error', (err) => {
    kaminaChat.log(`❌ ERREUR SERVEUR: ${err.message}`);
});
