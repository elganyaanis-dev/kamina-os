const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 2929;
const CHAT_FILE = path.join(__dirname, 'memory/multi_ai_chat.json');
const IA_DATABASE = path.join(__dirname, 'memory/ia_database.json');

// 🧠 BASE DE DONNÉES DES IA DISPONIBLES
const iaDatabase = {
  "deepseek": {
    name: "DeepSeek",
    specialty: "Développement général, code, explications techniques",
    strength: "Compréhension contextuelle, génération de code polyvalente",
    best_for: ["développement", "code", "explications", "problèmes techniques"],
    access: "Direct via cette interface",
    response_style: "Détaillé, technique, éducatif"
  },
  "chatgpt": {
    name: "ChatGPT", 
    specialty: "Génération de code, scripts, architecture système",
    strength: "Création de contrats Solidity, scripts de déploiement",
    best_for: ["solidity", "contrats", "scripts", "architecture"],
    access: "Via copier-coller depuis cette interface",
    integration: "Code déjà intégré dans Kamina OS",
    response_style: "Pratique, code prêt à l'emploi"
  },
  "kimi": {
    name: "Kimi",
    specialty: "Optimisations sécurité, architecture avancée",
    strength: "Sécurité blockchain, optimisations performances", 
    best_for: ["sécurité", "optimisation", "architecture", "audit"],
    access: "Via copier-coller depuis cette interface",
    integration: "Recommandations intégrées dans les contrats",
    response_style: "Concis, technique, orienté sécurité"
  },
  "claude": {
    name: "Claude",
    specialty: "Analyse complexe, raisonnement",
    strength: "Compréhension de problèmes complexes",
    best_for: ["analyse", "stratégie", "planification"],
    access: "Via interface web séparée",
    response_style: "Analytique, structuré"
  },
  "gemini": {
    name: "Gemini",
    specialty: "Recherche, données, multitâches",
    strength: "Traitement d'informations multiples",
    best_for: ["recherche", "données", "analyse comparative"],
    access: "Via interface web séparée", 
    response_style: "Informations denses, factuelles"
  }
};

// 🧠 SYSTÈME DE COORDINATION INTELLIGENTE
class MultiAICoordinator {
  constructor() {
    this.conversation = [];
    this.iaDatabase = iaDatabase;
    this.loadConversation();
  }

  loadConversation() {
    try {
      if (fs.existsSync(CHAT_FILE)) {
        this.conversation = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
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

  // 🎯 ANALYSEUR DE MESSAGE POUR DÉTERMINER LA MEILLEURE IA
  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    const scores = {};
    
    for (const [iaId, ia] of Object.entries(this.iaDatabase)) {
      scores[iaId] = 0;
      
      // Vérifier les mots-clés de spécialité
      ia.best_for.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          scores[iaId] += 3;
        }
      });
      
      // Bonus pour DeepSeek (toujours disponible)
      if (iaId === 'deepseek') {
        scores[iaId] += 1;
      }
    }
    
    // Trouver l'IA avec le score le plus élevé
    let bestIA = 'deepseek';
    let highestScore = 0;
    
    for (const [iaId, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        bestIA = iaId;
      }
    }
    
    return {
      recommended_ia: bestIA,
      scores: scores,
      confidence: highestScore / (Object.keys(scores).length * 3) // Score normalisé
    };
  }

  // 🧠 GÉNÉRATEUR DE RÉPONSE AVEC RECOMMANDATION IA
  generateResponse(userMessage, user = "Utilisateur") {
    const analysis = this.analyzeMessage(userMessage);
    const recommendedIA = this.iaDatabase[analysis.recommended_ia];
    
    let response = "";
    
    // Réponse basée sur l'IA recommandée
    switch(analysis.recommended_ia) {
      case 'deepseek':
        response = this.getDeepSeekResponse(userMessage, recommendedIA, analysis);
        break;
      case 'chatgpt':
        response = this.getChatGPTResponse(userMessage, recommendedIA, analysis);
        break;
      case 'kimi':
        response = this.getKimiResponse(userMessage, recommendedIA, analysis);
        break;
      default:
        response = this.getDefaultResponse(userMessage, recommendedIA, analysis);
    }
    
    return {
      response: response,
      recommendation: {
        ia: recommendedIA.name,
        reason: `Spécialiste en: ${recommendedIA.specialty}`,
        confidence: Math.round(analysis.confidence * 100),
        access_instructions: recommendedIA.access,
        best_for: recommendedIA.best_for.join(', ')
      },
      alternatives: this.getAlternativeIAs(analysis.scores)
    };
  }

  getDeepSeekResponse(message, ia, analysis) {
    return `🔷 **DeepSeek - Assistant Principal**
*[Recommandé à ${analysis.confidence}% pour votre demande]*

**Réponse :** ${this.getTechnicalResponse(message)}

**🎯 Pour aller plus loin :**
Si vous avez besoin de génération de code spécifique, je recommande de copier cette conversation vers ChatGPT. Pour des optimisations de sécurité, Kimi serait idéal.`;
  }

  getChatGPTResponse(message, ia, analysis) {
    return `🤖 **ChatGPT Recommandé** 
*[Spécialiste code et contrats - Confiance: ${analysis.confidence}%]*

**💡 Recommendation :** 
Pour "${message}", ChatGPT est l'IA idéale pour générer du code Solidity, des scripts de déploiement ou l'architecture technique.

**🚀 Action recommandée :**
1. Copiez votre question
2. Allez sur chat.openai.com  
3. Collez et demandez la génération de code
4. Revenez ici pour l'intégration

**📋 Exemple de demande ChatGPT :**
"Génère un contrat Solidity pour [votre besoin] avec les optimisations de sécurité Kimi"`;
  }

  getKimiResponse(message, ia, analysis) {
    return `🔷 **Kimi Recommandé**
*[Expert sécurité blockchain - Confiance: ${analysis.confidence}%]*

**🛡️ Pour :** "${message}"

Kimi excelle dans les optimisations de sécurité, l'audit de code et l'architecture sécurisée.

**🎯 Demande type pour Kimi :**
"Optimise la sécurité de mon contrat Solidity pour protéger contre [type d'attaque] et propose des améliorations d'architecture"`;
  }

  getDefaultResponse(message, ia, analysis) {
    return `🔷 **Système Multi-IA Kamina**
*${ia.name} recommandé pour votre demande*

**Réponse :** ${this.getTechnicalResponse(message)}

**💡 Conseil :** Cette IA est spécialisée dans : ${ia.specialty}
**🎯 Utilisation :** ${ia.access}`;
  }

  getTechnicalResponse(message) {
    const responses = [
      `J'ai analysé votre demande et coordonne les ressources IA appropriées. Votre question concerne le développement Kamina OS et bénéficierait de l'expertise combinée de nos IA spécialisées.`,

      `En tant que coordinateur IA, je peux vous guider vers la meilleure assistance pour "${message}". Le système Kamina OS intègre déjà les contributions de ChatGPT (code) et Kimi (sécurité).`,

      `Votre demande est reçue par le système de coordination multi-IA. Je peux vous fournir une réponse directe ou vous guider vers l'IA spécialisée la plus adaptée.`,

      `🔷 **Coordination IA Active**
• DeepSeek: Assistant principal (actuel)
• ChatGPT: Génération code Solidity  
• Kimi: Optimisations sécurité
• Claude: Analyse complexe
• Gemini: Recherche & données

Pour "${message}", j'ai déterminé la meilleure approche IA.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getAlternativeIAs(scores) {
    const alternatives = [];
    for (const [iaId, score] of Object.entries(scores)) {
      if (iaId !== 'deepseek' && score > 0) {
        alternatives.push({
          ia: iaDatabase[iaId].name,
          score: score,
          specialty: iaDatabase[iaId].specialty
        });
      }
    }
    
    // Trier par score décroissant
    return alternatives.sort((a, b) => b.score - a.score).slice(0, 2);
  }

  addMessage(role, content, metadata = {}) {
    const message = {
      role: role,
      content: content,
      timestamp: new Date().toISOString(),
      metadata: metadata
    };
    
    this.conversation.push(message);
    
    if (this.conversation.length > 100) {
      this.conversation = this.conversation.slice(-100);
    }
    
    this.saveConversation();
    return message;
  }

  // 🎯 EXÉCUTION COMMANDES TERMUX
  executeCommand(command, callback) {
    exec(command, { cwd: '/data/data/com.termux/files/home' }, (error, stdout, stderr) => {
      const result = stdout || stderr || (error ? error.message : '✅ Commande exécutée');
      callback(result);
    });
  }

  // 🎯 LISTE DES IA DISPONIBLES
  getAvailableIAs() {
    return this.iaDatabase;
  }
}

const aiCoordinator = new MultiAICoordinator();

// 🚀 SERVEUR MULTI-IA COMPLET
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 🎯 ENDPOINT CHAT AVEC COORDINATION IA
  if (req.url === '/ai-chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { message, user = "Utilisateur" } = JSON.parse(body);
        
        // Ajouter message utilisateur
        aiCoordinator.addMessage("user", message, { user: user });
        
        // 🧠 GÉNÉRER RÉPONSE AVEC COORDINATION IA
        const aiResponse = aiCoordinator.generateResponse(message, user);
        
        // Ajouter réponse système
        aiCoordinator.addMessage("assistant", aiResponse.response, {
          ai_recommendation: aiResponse.recommendation,
          alternatives: aiResponse.alternatives
        });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          response: aiResponse.response,
          recommendation: aiResponse.recommendation,
          alternatives: aiResponse.alternatives,
          timestamp: new Date().toISOString()
        }));
        
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // 🎯 ENDPOINT LISTE DES IA
  if (req.url === '/ai-list' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      available_ias: aiCoordinator.getAvailableIAs(),
      system: "Kamina OS Multi-IA Coordinator",
      owner: "CHABBI MOHAMMED ANIS"
    }));
    return;
  }

  // 🎯 ENDPOINT CONVERSATION
  if (req.url === '/conversation' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ messages: aiCoordinator.conversation }));
    return;
  }

  // 🎯 INTERFACE WEB AVEC BOÎTE DE DIALOGUE COMPLÈTE
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧠 Multi-IA Coordinator - Kamina OS</title>
    <style>
        /* STYLE BOÎTE DE DIALOGUE PROFESSIONNELLE */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f0f0f;
            color: #ffffff;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: linear-gradient(135deg, #1a237e, #283593);
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #333;
        }
        .header h1 {
            font-size: 1.8em;
            margin-bottom: 5px;
        }
        .header p {
            color: #b0b0b0;
            font-size: 0.9em;
        }
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            background: #1a1a1a;
        }
        .message {
            max-width: 85%;
            padding: 15px 20px;
            border-radius: 18px;
            line-height: 1.5;
            animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .user-message {
            align-self: flex-end;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-bottom-right-radius: 6px;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
        }
        .assistant-message {
            align-self: flex-start;
            background: linear-gradient(135deg, #404040, #2d2d2d);
            border-bottom-left-radius: 6px;
            border: 1px solid #333;
        }
        .ai-recommendation {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #000;
            padding: 12px 15px;
            border-radius: 12px;
            margin-top: 10px;
            font-size: 0.85em;
            border-left: 4px solid #b45309;
        }
        .input-area {
            padding: 20px;
            background: #1a1a1a;
            border-top: 1px solid #333;
        }
        .input-container {
            display: flex;
            gap: 12px;
            max-width: 100%;
        }
        .message-input {
            flex: 1;
            padding: 16px 20px;
            border: 2px solid #333;
            border-radius: 25px;
            background: #2d2d2d;
            color: #ffffff;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }
        .message-input:focus {
            border-color: #3b82f6;
            background: #1f1f1f;
        }
        .send-button {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .send-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
        .typing-indicator {
            align-self: flex-start;
            background: #333;
            padding: 12px 20px;
            border-radius: 18px;
            color: #9ca3af;
            font-style: italic;
            display: none;
        }
        .ia-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.7em;
            margin-left: 8px;
            font-weight: bold;
        }
        .quick-actions {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .quick-btn {
            background: #374151;
            color: #d1d5db;
            border: none;
            padding: 8px 16px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.8em;
            transition: all 0.2s ease;
        }
        .quick-btn:hover {
            background: #4b5563;
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧠 Coordinateur Multi-IA</h1>
        <p>Kamina OS - CHABBI MOHAMMED ANIS | Assistance IA Intelligente</p>
    </div>

    <div class="chat-container" id="chatContainer">
        <div class="quick-actions">
            <button class="quick-btn" onclick="showIAList()">📋 Liste des IA</button>
            <button class="quick-btn" onclick="askQuestion('Comment déployer mon contrat?')">🚀 Déploiement</button>
            <button class="quick-btn" onclick="askQuestion('Optimiser la sécurité')">🛡️ Sécurité</button>
            <button class="quick-btn" onclick="askQuestion('Générer du code Solidity')">📝 Code</button>
        </div>
        
        <div class="message assistant-message">
            🔷 **Système Multi-IA Kamina OS Initialisé**
            <br><br>
            Je suis votre coordinateur IA intelligent. Je analyse vos demandes et vous guide vers la meilleure assistance parmi :
            <br>
            • <strong>DeepSeek</strong> (Assistant principal)
            • <strong>ChatGPT</strong> (Génération code)  
            • <strong>Kimi</strong> (Sécurité blockchain)
            • <strong>Claude</strong> (Analyse complexe)
            • <strong>Gemini</strong> (Recherche & données)
            <br><br>
            <em>Tapez votre message dans la boîte ci-dessous ↓</em>
        </div>
        
        <div id="messagesList"></div>
        <div id="typingIndicator" class="typing-indicator">
            🧠 Le coordinateur IA analyse votre demande...
        </div>
    </div>

    <div class="input-area">
        <div class="input-container">
            <input type="text" class="message-input" id="messageInput" 
                   placeholder="Tapez votre message ici... (ex: Comment déployer mon contrat Solidity?)" 
                   onkeypress="if(event.key==='Enter') sendMessage()">
            <button class="send-button" onclick="sendMessage()">
                Envoyer
            </button>
        </div>
    </div>

    <script>
        const API_BASE = 'http://localhost:2929';
        let isTyping = false;

        // 🧠 FONCTIONS PRINCIPALES
        function addMessage(role, content, recommendation = null) {
            const messagesList = document.getElementById('messagesList');
            const messageDiv = document.createElement('div');
            
            messageDiv.className = `message ${role}-message`;
            
            let messageContent = content;
            if (recommendation) {
                messageContent += `\n\n<div class="ai-recommendation">
                    <strong>🎯 IA Recommandée:</strong> ${recommendation.ia}
                    <br><strong>💡 Raison:</strong> ${recommendation.reason}
                    <br><strong>📊 Confiance:</strong> ${recommendation.confidence}%
                    <br><strong>🚀 Accès:</strong> ${recommendation.access_instructions}
                </div>`;
            }
            
            messageDiv.innerHTML = messageContent.replace(/\n/g, '<br>');
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
            
            // Montrer indicateur de frappe
            showTyping();

            try {
                const response = await fetch(API_BASE + '/ai-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        user: "CHABBI MOHAMMED ANIS"
                    })
                });

                const data = await response.json();
                hideTyping();
                
                // Ajouter réponse avec recommandation IA
                addMessage('assistant', data.response, data.recommendation);
                
            } catch (error) {
                hideTyping();
                addMessage('assistant', '❌ Erreur de connexion au coordinateur IA');
            }
        }

        async function showIAList() {
            try {
                const response = await fetch(API_BASE + '/ai-list');
                const data = await response.json();
                
                let iaList = '📋 **IA Disponibles dans Kamina OS**\\n\\n';
                for (const [iaId, ia] of Object.entries(data.available_ias)) {
                    iaList += `**${ia.name}**\\n`;
                    iaList += `• Spécialité: ${ia.specialty}\\n`;
                    iaList += `• Points forts: ${ia.strength}\\n`;
                    iaList += `• Meilleur pour: ${ia.best_for.join(', ')}\\n`;
                    iaList += `• Accès: ${ia.access}\\n\\n`;
                }
                
                addMessage('assistant', iaList);
            } catch (error) {
                addMessage('assistant', '❌ Impossible de charger la liste des IA');
            }
        }

        function askQuestion(question) {
            document.getElementById('messageInput').value = question;
            sendMessage();
        }

        // Focus automatique et chargement
        document.getElementById('messageInput').focus();
        
        // Charger la conversation existante
        async function loadConversation() {
            try {
                const response = await fetch(API_BASE + '/conversation');
                const data = await response.json();
                
                const messagesList = document.getElementById('messagesList');
                messagesList.innerHTML = '';
                
                data.messages.forEach(msg => {
                    addMessage(msg.role, msg.content, msg.metadata?.ai_recommendation);
                });
            } catch (error) {
                console.log('Chargement conversation initiale');
            }
        }

        loadConversation();
    </script>
</body>
</html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 MULTI-IA COORDINATOR - KAMINA OS [PORT ${PORT}]`);
    console.log(`🔷 Système de coordination IA intelligent actif`);
    console.log(`👑 Propriétaire: CHABBI MOHAMMED ANIS`);
    console.log(`🎯 IA disponibles: DeepSeek, ChatGPT, Kimi, Claude, Gemini`);
    console.log(`💬 Boîte de dialogue professionnelle initialisée`);
});

server.on('error', (err) => {
    console.log(`❌ Erreur serveur: ${err.message}`);
});
