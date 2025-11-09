const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 2930;
console.log("🔷 DÉMARRAGE KAMINA OS CORRIGÉ...");

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 🎯 PAGE AVEC VRAI CLAVIER COMME DEEPSEEK
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💬 Kamina Chat - DeepSeek Style</title>
    <style>
        /* STYLE EXACT COMME DEEPSEEK */
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
            text-align: center;
        }
        
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message {
            max-width: 85%;
            padding: 15px 20px;
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
        
        /* 🎯 ZONE DE SAISIE */
        .input-area {
            padding: 15px;
            background: #2d2d2d;
            border-top: 1px solid #404040;
        }
        .input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        .message-input {
            flex: 1;
            padding: 15px 20px;
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
            padding: 15px 25px;
            border-radius: 24px;
            cursor: pointer;
            font-weight: 600;
        }
        
        /* 🎯 CLAVIER VIRTUEL PROFESSIONNEL */
        .virtual-keyboard {
            background: #1a1a1a;
            padding: 10px;
            border-radius: 10px;
            border: 1px solid #333;
        }
        .keyboard-row {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-bottom: 6px;
        }
        .key {
            background: #444;
            border: none;
            border-radius: 6px;
            padding: 12px 8px;
            color: white;
            font-size: 16px;
            cursor: pointer;
            min-width: 40px;
            transition: all 0.2s;
        }
        .key:hover {
            background: #555;
        }
        .key:active {
            background: #3b82f6;
            transform: scale(0.95);
        }
        .key-space {
            flex: 2;
            background: #3b82f6;
        }
        .key-send {
            background: #10b981;
            font-weight: bold;
        }
        .key-delete {
            background: #ef4444;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💬 Kamina Chat</h1>
        <p>👑 CHABBI MOHAMMED ANIS | 🔷 Interface DeepSeek</p>
    </div>

    <div class="chat-container" id="chatContainer">
        <div class="message assistant-message">
            🔷 **Bienvenue dans Kamina Chat !**
            <br><br>
            Cette interface a le <strong>vrai clavier comme DeepSeek</strong>
            <br>
            Tapez votre message ci-dessous ↓
        </div>
        <div id="messagesList"></div>
    </div>

    <div class="input-area">
        <div class="input-container">
            <input type="text" class="message-input" id="messageInput" 
                   placeholder="Tapez votre message ici..." 
                   onkeypress="if(event.key==='Enter') sendMessage()">
            <button class="send-button" onclick="sendMessage()">Envoyer</button>
        </div>
        
        <!-- 🎯 VRAI CLAVIER COMME DEEPSEEK -->
        <div class="virtual-keyboard">
            <!-- Rangée 1 -->
            <div class="keyboard-row">
                <button class="key" onclick="addToInput('a')">a</button>
                <button class="key" onclick="addToInput('z')">z</button>
                <button class="key" onclick="addToInput('e')">e</button>
                <button class="key" onclick="addToInput('r')">r</button>
                <button class="key" onclick="addToInput('t')">t</button>
                <button class="key" onclick="addToInput('y')">y</button>
                <button class="key" onclick="addToInput('u')">u</button>
                <button class="key" onclick="addToInput('i')">i</button>
                <button class="key" onclick="addToInput('o')">o</button>
                <button class="key" onclick="addToInput('p')">p</button>
            </div>
            
            <!-- Rangée 2 -->
            <div class="keyboard-row">
                <button class="key" onclick="addToInput('q')">q</button>
                <button class="key" onclick="addToInput('s')">s</button>
                <button class="key" onclick="addToInput('d')">d</button>
                <button class="key" onclick="addToInput('f')">f</button>
                <button class="key" onclick="addToInput('g')">g</button>
                <button class="key" onclick="addToInput('h')">h</button>
                <button class="key" onclick="addToInput('j')">j</button>
                <button class="key" onclick="addToInput('k')">k</button>
                <button class="key" onclick="addToInput('l')">l</button>
                <button class="key" onclick="addToInput('m')">m</button>
            </div>
            
            <!-- Rangée 3 -->
            <div class="keyboard-row">
                <button class="key" onclick="addToInput('w')">w</button>
                <button class="key" onclick="addToInput('x')">x</button>
                <button class="key" onclick="addToInput('c')">c</button>
                <button class="key" onclick="addToInput('v')">v</button>
                <button class="key" onclick="addToInput('b')">b</button>
                <button class="key" onclick="addToInput('n')">n</button>
                <button class="key" onclick="addToInput(',')">,</button>
                <button class="key" onclick="addToInput(';')">;</button>
                <button class="key" onclick="addToInput('.')">.</button>
                <button class="key key-delete" onclick="deleteLastChar()">⌫</button>
            </div>
            
            <!-- Rangée spéciale -->
            <div class="keyboard-row">
                <button class="key" onclick="addToInput('!')">!</button>
                <button class="key" onclick="addToInput('?')">?</button>
                <button class="key" onclick="addToInput('@')">@</button>
                <button class="key key-space" onclick="addToInput(' ')">ESPACE</button>
                <button class="key" onclick="addToInput('#')">#</button>
                <button class="key" onclick="addToInput('$')">$</button>
                <button class="key key-send" onclick="sendMessage()">📤 ENVOYER</button>
            </div>
        </div>
    </div>

    <script>
        // 🧠 FONCTIONS CLAVIER
        function addToInput(char) {
            const input = document.getElementById('messageInput');
            input.value += char;
            input.focus();
        }
        
        function deleteLastChar() {
            const input = document.getElementById('messageInput');
            input.value = input.value.slice(0, -1);
            input.focus();
        }
        
        // 🧠 FONCTIONS CHAT
        function addMessage(role, content) {
            const messagesList = document.getElementById('messagesList');
            const messageDiv = document.createElement('div');
            
            messageDiv.className = 'message ' + role + '-message';
            messageDiv.textContent = content;
            
            messagesList.appendChild(messageDiv);
            scrollToBottom();
        }
        
        function scrollToBottom() {
            const container = document.getElementById('chatContainer');
            container.scrollTop = container.scrollHeight;
        }
        
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Ajouter message utilisateur
            addMessage('user', message);
            input.value = '';
            input.focus();
            
            // Réponse automatique
            setTimeout(() => {
                const responses = [
                    '🔷 Message reçu: "' + message + '"\n👑 CHABBI MOHAMMED ANIS\n💬 Interface DeepSeek active',
                    '🎯 Votre message: "' + message + '"\n🚀 Système Kamina OS opérationnel',
                    '💡 Traitement: "' + message + '"\n🔷 Clavier virtuel fonctionnel'
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                addMessage('assistant', response);
            }, 1000);
        }
        
        // Focus automatique
        document.getElementById('messageInput').focus();
    </script>
</body>
</html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('✅ KAMINA OS CORRIGÉ: http://localhost:' + PORT);
    console.log('🎯 VRAI CLAVIER COMME DEEPSEEK');
    console.log('👑 CHABBI MOHAMMED ANIS');
});

server.on('error', (err) => {
    console.log('❌ Erreur:', err.message);
});
