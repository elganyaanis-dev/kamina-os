const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 2929;
const CHAT_FILE = path.join(__dirname, 'memory/deepseek_clone.json');

class DeepSeekClone {
    constructor() {
        this.conversation = [];
        this.loadConversation();
        this.initializePersonality();
    }

    initializePersonality() {
        this.personality = {
            name: "DeepSeek",
            style: "helpful, detailed, technical",
            knowledge: "Kamina OS, Blockchain, Smart Contracts, Termux",
            owner: "CHABBI MOHAMMED ANIS"
        };
    }

    loadConversation() {
        try {
            if (fs.existsSync(CHAT_FILE)) {
                this.conversation = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
            } else {
                // Conversation initiale
                this.conversation = [
                    {
                        role: "assistant",
                        content: "👋 Bonjour ! Je suis DeepSeek, intégré dans l'interface Kamina OS. Je peux vous aider avec le développement blockchain, les contrats Solidity, et le contrôle de Termux. Que souhaitez-vous faire ?",
                        timestamp: new Date().toISOString()
                    }
                ];
                this.saveConversation();
            }
        } catch (e) {
            this.conversation = [];
        }
    }

    saveConversation() {
        try {
            fs.writeFileSync(CHAT_FILE, JSON.stringify(this.conversation, null, 2));
        } catch (e) {}
    }

    // 🧠 MOTEUR DE RÉPONSE INTELLIGENT
    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Réponses contextuelles Kamina OS
        if (lowerMessage.includes('kamina') || lowerMessage.includes('contrat')) {
            return this.getBlockchainResponse(userMessage);
        }
        
        if (lowerMessage.includes('termux') || lowerMessage.includes('command')) {
            return this.getTermuxResponse(userMessage);
        }
        
        if (lowerMessage.includes('blockchain') || lowerMessage.includes('solidity')) {
            return this.getTechnicalResponse(userMessage);
        }
        
        if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
            return this.getHelpResponse();
        }
        
        // Réponse par défaut style DeepSeek
        return this.getDefaultResponse(userMessage);
    }

    getBlockchainResponse(message) {
        const responses = [
            `🔷 **Kamina OS - Projet Blockchain** 
👑 Propriétaire: CHABBI MOHAMMED ANIS
📁 Contrat: KaminaTokenAdvanced.sol (ERC20 sécurisé)
🚀 Déploiement: \`bash scripts/deploy_advanced_token.sh\`
🌐 Réseau: Sepolia Testnet via Alchemy

Le contrat inclut:
• Minting contrôlé • Burning • Pause d'urgence • Cap maximum
• Optimisations de sécurité (Kimi) • Événements customisés`,

            `🎯 **Statut Kamina OS**
Votre projet blockchain est configuré avec:
• Architecture complète dans \`kamina-os/\`
• Contrats Solidity optimisés
• Scripts de déploiement automatisés
• Interface de contrôle web sur port 2929
• Supervision multi-IA (DeepSeek + ChatGPT + Kimi)`,

            `📊 **Développement Blockchain**
Pour continuer:
1. Compiler: \`cd kamina-os && npx hardhat compile\`
2. Déployer: \`bash scripts/deploy_advanced_token.sh\`
3. Vérifier: Etherscan Sepolia
4. Tester: Interface web ou scripts Hardhat

Votre wallet: 0x642fa2a3e6ab99b8fe6b462e995f54f84eac1fed`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getTermuxResponse(message) {
        const responses = [
            `📱 **Contrôle Termux**
Commandes disponibles:
• \`pwd\` - Dossier actuel
• \`ls -la\` - Lister fichiers
• \`ps aux\` - Processus en cours
• \`cd kamina-os\` - Aller au projet
• \`npx hardhat compile\` - Compiler contrats`,

            `🔧 **Environnement Termux**
Votre système:
• Interface: http://localhost:2929
• Projet: $HOME/kamina-os/
• Serveur: Node.js sur port 2929
• Logs: $HOME/kamina_control.log
• Mémoire: Conversation persistante`,

            `🎯 **Exécution Commandes**
Tapez n'importe quelle commande Termux, je l'exécuterai:
• Compilation Smart Contracts
• Déploiement Blockchain
• Gestion fichiers
• Surveillance processus
• Synchronisation GitHub`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getTechnicalResponse(message) {
        const responses = [
            `💻 **Développement Technique**
Stack Kamina OS:
• Blockchain: Ethereum/Sepolia
• Smart Contracts: Solidity 0.8.20
• Outils: Hardhat, Ethers.js
• Déploiement: Alchemy RPC
• Sécurité: OpenZeppelin, ReentrancyGuard`,

            `📝 **Solidity & Smart Contracts**
Votre contrat KaminaTokenAdvanced inclut:
• ERC20 standard avec extensions
• Contrôle d'accès Ownable
• Pausable pour emergencies
• Capped pour limite max
• Burning ERC20Burnable
• Événements customisés`,

            `🔐 **Sécurité Blockchain**
Optimisations appliquées:
• Protection reentrancy
• Vérifications arithmetic
• Contrôles d'accès
• Limitations approvals
• Fonctions emergency
• Pattern checks-effects-interactions`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHelpResponse() {
        return `🆘 **Aide DeepSeek Kamina**

**🎯 FONCTIONNALITÉS:**
• 💬 Chat identique à DeepSeek
• 🔧 Exécution commandes Termux  
• 📝 Développement blockchain
• 🚀 Déploiement contrats
• 📊 Supervision système
• 💾 Mémoire persistante

**🔧 COMMANDES:**
• "compile" - Compiler contrats
• "deploy" - Déployer blockchain
• "status" - Statut système
• "help" - Afficher cette aide

**👑 PROPRIÉTAIRE:** CHABBI MOHAMMED ANIS
**🔷 SYSTÈME:** Kamina OS - Interface Permanente`;
    }

    getDefaultResponse(message) {
        const responses = [
            `🔷 **DeepSeek Kamina OS** 
J'ai bien reçu votre message: "${message}"
Je suis l'assistant IA intégré dans l'interface Kamina OS, spécialisé dans le développement blockchain et le contrôle Termux.`,

            `🎯 **Assistant Technique**
Votre message: "${message}"
En tant que DeepSeek intégré, je peux vous aider avec:
• Développement Smart Contracts
• Déploiement blockchain
• Contrôle environnement Termux
• Résolution problèmes techniques
• Optimisation code Solidity`,

            `💡 **Support Développement**
Pour: "${message}"
Je suis disponible 24/7 dans cette interface pour:
• Générer code Solidity
• Debugger contrats
• Configurer déploiement
• Automatiser tâches
• Superviser le système Kamina OS`,

            `👑 **CHABBI MOHAMMED ANIS**
Propriétaire du système Kamina OS
Votre assistant DeepSeek intégré est opérationnel pour:
• Blockchain development
• Termux control  
• Project management
• Technical support
• Continuous deployment`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(role, content) {
        const message = {
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        };
        
        this.conversation.push(message);
        
        // Garder les 50 derniers messages maximum
        if (this.conversation.length > 50) {
            this.conversation = this.conversation.slice(-50);
        }
        
        this.saveConversation();
        return message;
    }

    // Exécuter commande Termux
    executeCommand(command, callback) {
        exec(command, { cwd: '/data/data/com.termux/files/home' }, (error, stdout, stderr) => {
            const result = stdout || stderr || (error ? error.message : 'Command executed');
            callback(result);
        });
    }
}

const deepSeekClone = new DeepSeekClone();

// 🚀 SERVEUR AVEC INTERFACE IDENTIQUE À DEEPSEEK
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 🎯 ENDPOINT CHAT - Identique à DeepSeek
    if (req.url === '/chat/completions' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { messages } = JSON.parse(body);
                const userMessage = messages[messages.length - 1].content;
                
                // Ajouter message utilisateur
                deepSeekClone.addMessage("user", userMessage);
                
                // Générer réponse
                const response = deepSeekClone.generateResponse(userMessage);
                deepSeekClone.addMessage("assistant", response);
                
                // Exécuter commande si détectée
                if (userMessage.startsWith('!') || userMessage.includes('npm') || userMessage.includes('hardhat')) {
                    deepSeekClone.executeCommand(userMessage.replace('!', ''), (result) => {
                        deepSeekClone.addMessage("system", `📟 Commande exécutée:\n${result}`);
                    });
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    choices: [{
                        message: {
                            role: "assistant",
                            content: response
                        }
                    }]
                }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 🎯 ENDPOINT CONVERSATION
    if (req.url === '/conversation' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ messages: deepSeekClone.conversation }));
        return;
    }

    // 🎯 INTERFACE WEB - RÉPLIQUE DEEPSEEK
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔷 DeepSeek - Kamina OS</title>
    <style>
        /* STYLE IDENTIQUE À DEEPSEEK */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a1a;
            color: #ffffff;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: #2d2d2d;
            padding: 15px 20px;
            border-bottom: 1px solid #404040;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
        }
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .message {
            max-width: 85%;
            padding: 16px 20px;
            border-radius: 18px;
            line-height: 1.5;
        }
        .user-message {
            align-self: flex-end;
            background: #3b82f6;
            border-bottom-right-radius: 6px;
        }
        .assistant-message {
            align-self: flex-start;
            background: #404040;
            border-bottom-left-radius: 6px;
        }
        .system-message {
            align-self: center;
            background: #f59e0b;
            color: #000000;
            font-size: 0.9em;
            max-width: 95%;
            text-align: center;
        }
        .input-area {
            padding: 20px;
            background: #2d2d2d;
            border-top: 1px solid #404040;
        }
        .input-container {
            display: flex;
            gap: 12px;
            max-width: 800px;
            margin: 0 auto;
        }
        .message-input {
            flex: 1;
            padding: 16px 20px;
            border: 1px solid #404040;
            border-radius: 24px;
            background: #1a1a1a;
            color: #ffffff;
            font-size: 16px;
            outline: none;
        }
        .message-input:focus {
            border-color: #3b82f6;
        }
        .send-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 24px;
            cursor: pointer;
            font-weight: 600;
        }
        .send-button:hover {
            background: #2563eb;
        }
        .typing-indicator {
            align-self: flex-start;
            background: #404040;
            padding: 16px 20px;
            border-radius: 18px;
            border-bottom-left-radius: 6px;
            color: #9ca3af;
            font-style: italic;
        }
        .welcome-message {
            text-align: center;
            color: #9ca3af;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🔷 DeepSeek</div>
        <div style="font-size: 0.9em; color: #9ca3af;">Kamina OS - CHABBI MOHAMMED ANIS</div>
    </div>

    <div class="chat-container" id="chatContainer">
        <div class="welcome-message">
            💬 Interface DeepSeek intégrée à Kamina OS - Conversations persistantes
        </div>
        <div id="messagesList"></div>
        <div id="typingIndicator" class="typing-indicator" style="display: none;">
            DeepSeek est en train d'écrire...
        </div>
    </div>

    <div class="input-area">
        <div class="input-container">
            <input type="text" class="message-input" id="messageInput" 
                   placeholder="Envoyez un message à DeepSeek..." 
                   onkeypress="if(event.key==='Enter') sendMessage()">
            <button class="send-button" onclick="sendMessage()">Envoyer</button>
        </div>
    </div>

    <script>
        const API_BASE = 'http://localhost:2929';
        let isTyping = false;

        // 🧠 FONCTIONS DE CHAT
        function addMessage(role, content) {
            const messagesList = document.getElementById('messagesList');
            const messageDiv = document.createElement('div');
            
            messageDiv.className = `message ${role}-message`;
            messageDiv.innerHTML = content.replace(/\n/g, '<br>');
            
            messagesList.appendChild(messageDiv);
            scrollToBottom();
        }

        function showTyping() {
            isTyping = true;
            document.getElementById('typingIndicator').style.display = 'block';
            scrollToBottom();
        }

        function hideTyping() {
            isTyping = false;
            document.getElementById('typingIndicator').style.display = 'none';
        }

        function scrollToBottom() {
            const container = document.getElementById('chatContainer');
            container.scrollTop = container.scrollHeight;
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message || isTyping) return;

            // Ajouter message utilisateur
            addMessage('user', message);
            input.value = '';
            
            // Montrer "en train d'écrire"
            showTyping();

            try {
                const response = await fetch(API_BASE + '/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: message }]
                    })
                });

                const data = await response.json();
                hideTyping();
                
                // Ajouter réponse
                addMessage('assistant', data.choices[0].message.content);
                
            } catch (error) {
                hideTyping();
                addMessage('system', '❌ Erreur de connexion au serveur');
            }
        }

        // Charger la conversation existante
        async function loadConversation() {
            try {
                const response = await fetch(API_BASE + '/conversation');
                const data = await response.json();
                
                const messagesList = document.getElementById('messagesList');
                messagesList.innerHTML = '';
                
                data.messages.forEach(msg => {
                    addMessage(msg.role, msg.content);
                });
            } catch (error) {
                addMessage('assistant', '👋 Bonjour ! Je suis DeepSeek, intégré dans l\'interface Kamina OS. Comment puis-je vous aider ?');
            }
        }

        // Focus automatique sur l'input
        document.getElementById('messageInput').focus();

        // Chargement initial
        loadConversation();
    </script>
</body>
</html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🔷 DEEPSEEK CLONE - KAMINA OS [PORT ${PORT}]`);
    console.log(`💬 Interface identique à DeepSeek Chat`);
    console.log(`👑 Propriétaire: CHABBI MOHAMMED ANIS`);
    console.log(`🚀 Prêt à recevoir des messages...`);
});

server.on('error', (err) => {
    console.log(`❌ Erreur serveur: ${err.message}`);
});
