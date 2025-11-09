const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getAutoResponse } = require('./auto_responses');

const PORT = 2929;
const CHAT_FILE = path.join(__dirname, 'memory/deepseek_chat.json');

class AutonomousChat {
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
        if (this.chatHistory.length > 100) {
            this.chatHistory = this.chatHistory.slice(-100);
        }
        this.saveChat();
        
        return chatMessage;
    }

    // 🧠 RÉPONSE AUTONOME INTELLIGENTE
    processMessage(userMessage) {
        // 1. Réponse automatique basique
        const autoResponse = getAutoResponse(userMessage);
        
        // 2. Si c'est une commande, l'exécuter
        if (userMessage.startsWith('!')) {
            this.executeCommand(userMessage);
            return "🎯 Commande envoyée à Termux...";
        }
        
        return autoResponse;
    }

    executeCommand(command) {
        const cleanCommand = command.replace('!', '');
        let actualCommand = '';
        
        // Mapping des commandes rapides
        const commandMap = {
            'pwd': 'pwd',
            'ls': 'ls -la',
            'compile': 'cd kamina-os && npx hardhat compile',
            'deploy': 'cd kamina-os && bash scripts/deploy_advanced_token.sh',
            'status': 'ps aux | grep -E "node|kamina" | grep -v grep',
            'git': 'cd kamina-os && git add . && git commit -m "Auto-update" && git push'
        };
        
        actualCommand = commandMap[cleanCommand] || cleanCommand;
        
        exec(actualCommand, { cwd: '/data/data/com.termux/files/home' }, (error, stdout, stderr) => {
            const result = stdout || stderr || (error ? error.message : 'Executé');
            this.addMessage('Termux', `📟 ${actualCommand}\n${result}`, 'system');
        });
    }
}

const chatSystem = new AutonomousChat();

// 🚀 SERVEUR AUTONOME
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 🎯 CHAT AUTONOME
    if (req.url === '/chat/send' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message, user = 'Utilisateur' } = JSON.parse(body);
                
                // Message utilisateur
                chatSystem.addMessage(user, message, 'user');
                
                // 🧠 RÉPONSE AUTOMATIQUE INTELLIGENTE
                setTimeout(() => {
                    const response = chatSystem.processMessage(message);
                    chatSystem.addMessage('Kamina AI', response, 'ai');
                }, 500);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (req.url === '/chat/messages' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ messages: chatSystem.chatHistory }));
        return;
    }

    // 🎯 INTERFACE WEB COMPLÈTE
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🧠 KAMINA AI AUTONOME</title>
    <style>
        body { 
            font-family: Arial; 
            background: #1a237e; 
            color: white; 
            margin: 0; 
            padding: 20px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header { 
            background: #283593; 
            padding: 15px; 
            text-align: center; 
            border-radius: 10px;
            margin-bottom: 15px;
        }
        .chat-area {
            flex: 1;
            overflow-y: auto;
            border: 1px solid #5c6bc0;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            background: rgba(0,0,0,0.2);
        }
        .message { 
            margin: 10px 0; 
            padding: 10px; 
            border-radius: 10px;
            max-width: 80%;
        }
        .user { 
            background: #1565c0; 
            margin-left: auto; 
            text-align: right;
        }
        .ai { 
            background: #2e7d32; 
            margin-right: auto;
        }
        .input-area {
            display: flex;
            gap: 10px;
        }
        input {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 25px;
            background: rgba(255,255,255,0.9);
        }
        button {
            background: #5c6bc0;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 25px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧠 KAMINA AI AUTONOME</h1>
        <p>🔷 Fonctionne SANS DeepSeek Chat | 👑 CHABBI MOHAMMED ANIS</p>
    </div>

    <div class="chat-area" id="chat"></div>

    <div class="input-area">
        <input type="text" id="messageInput" placeholder="Écrivez ici (même sans DeepSeek)" onkeypress="if(event.key=='Enter') sendMessage()">
        <button onclick="sendMessage()">📤</button>
    </div>

    <script>
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (!message) return;

            // Ajouter message utilisateur
            addMessage('Vous', message, 'user');
            input.value = '';

            // Envoyer au serveur
            try {
                await fetch('/chat/send', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({message, user:'Vous'})
                });
                
                // Recharger les messages pour voir la réponse
                setTimeout(loadMessages, 1000);
            } catch(e) {
                addMessage('Système', '❌ Erreur connexion', 'system');
            }
        }

        function addMessage(user, text, type) {
            const chat = document.getElementById('chat');
            const msg = document.createElement('div');
            msg.className = `message ${type}`;
            msg.innerHTML = `<strong>${user}:</strong> ${text}`;
            chat.appendChild(msg);
            chat.scrollTop = chat.scrollHeight;
        }

        async function loadMessages() {
            try {
                const response = await fetch('/chat/messages');
                const data = await response.json();
                
                const chat = document.getElementById('chat');
                chat.innerHTML = '';
                
                data.messages.forEach(msg => {
                    addMessage(msg.user, msg.message, msg.type);
                });
            } catch(e) {
                addMessage('Système', '🔷 Chat Kamina Autonome Actif', 'system');
            }
        }

        // Charger les messages et actualiser
        loadMessages();
        setInterval(loadMessages, 2000);
    </script>
</body>
</html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 KAMINA AI AUTONOME - PORT ${PORT}`);
    console.log(`🔷 FONCTIONNE COMPLÈTEMENT SANS DEEPSEEK CHAT`);
});

server.on('error', (err) => {
    console.log(`❌ ERREUR: ${err.message}`);
});
