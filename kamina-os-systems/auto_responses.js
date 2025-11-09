// 🧠 BASE DE CONNAISSANCE POUR RÉPONSES AUTONOMES
const knowledgeBase = {
  "salut": "🔷 Bonjour ! Je suis l'IA Kamina OS. Comment puis-vous aider?",
  "help": "🎯 Commandes disponibles: !pwd, !ls, !compile, !deploy, !status",
  "kamina": "👑 Propriétaire: CHABBI MOHAMMED ANIS | 🎯 Projet Blockchain Kamina OS",
  "blockchain": "📁 Contrats dans: kamina-os/contracts/ | Déploiement: scripts/deploy_advanced_token.sh",
  "deepseek": "🔗 Cette interface communique avec DeepSeek via le port 2929",
  "termux": "📱 Terminal Android - Base du projet Kamina OS",
  
  "commandes": `
🔧 COMMANDES RAPIDES:
!pwd - Dossier actuel
!ls - Lister fichiers  
!compile - Compiler contrats
!deploy - Déployer sur blockchain
!status - Statut système
!git - Synchroniser GitHub
  `,
  
  "projet": `
🚀 KAMINA OS - ÉTAT DU PROJET:
• Contrats: KaminaTokenAdvanced.sol (ERC20 sécurisé)
• Scripts: Déploiement et supervision
• Interface: Contrôle web sur port 2929
• Blockchain: Sepolia Testnet via Alchemy
• Propriétaire: CHABBI MOHAMMED ANIS
  `
};

function getAutoResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Réponses directes
  for (const [key, response] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Réponses intelligentes basiques
  if (lowerMessage.includes('comment')) {
    return "🔷 Consultez la base de connaissances avec 'help' ou 'commandes'";
  }
  
  if (lowerMessage.includes('erreur') || lowerMessage.includes('problem')) {
    return "🔧 Essayez: !status pour diagnostiquer, ou décrivez l'erreur en détail";
  }
  
  if (lowerMessage.startsWith('!')) {
    return "🎯 Commande reçue - exécution via Termux...";
  }
  
  // Réponse par défaut
  const defaultResponses = [
    "🔷 Message reçu dans l'interface Kamina OS",
    "🎯 Je traite votre demande via le système autonome",
    "👑 CHABBI MOHAMMED ANIS - Système Kamina actif", 
    "💡 Tapez 'help' pour voir les commandes disponibles",
    "🚀 Interface DeepSeek-Termux opérationnelle"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

module.exports = { getAutoResponse };
