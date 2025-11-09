const fs = require('fs');
const path = '/sdcard/kamina-comm';

// Créer le dossier de communication
if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

setInterval(() => {
    // Lire les messages entrants
    if (fs.existsSync(path + '/from_deepseek.txt')) {
        const message = fs.readFileSync(path + '/from_deepseek.txt', 'utf8');
        console.log("📨 DeepSeek:", message);
        fs.unlinkSync(path + '/from_deepseek.txt');
        
        // Répondre
        fs.writeFileSync(path + '/to_deepseek.txt', `TERMUX: Message reçu à ${new Date().toLocaleTimeString()}`);
    }
}, 3000);

console.log("🔷 PONT FICHIER ACTIVÉ: /sdcard/kamina-comm/");
