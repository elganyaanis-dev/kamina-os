const fs = require('fs');
const path = require('path');

// 🎯 CONFIGURATION RAPIDE
const COMM_DIR = '/sdcard/kamina-instant';
const DEEPSEEK_IN = path.join(COMM_DIR, 'deepseek_to_termux.txt');
const TERMUX_OUT = path.join(COMM_DIR, 'termux_to_deepseek.txt');
const HEARTBEAT = path.join(COMM_DIR, 'heartbeat.txt');

// 🎯 INITIALISATION
if (!fs.existsSync(COMM_DIR)) {
    fs.mkdirSync(COMM_DIR, { recursive: true });
    console.log("🔷 DOSSIER INSTANT CRÉÉ: " + COMM_DIR);
}

console.log("🚀 SYSTÈME INSTANTANÉ ACTIVÉ");
console.log("📁 Canal: " + COMM_DIR);
console.log("👑 CHABBI MOHAMMED ANIS");

let messageCount = 0;

// 🎯 SURVEILLANCE HAUTE FRÉQUENCE (100ms)
setInterval(() => {
    // 1. Vérifier les messages DeepSeek
    if (fs.existsSync(DEEPSEEK_IN)) {
        const message = fs.readFileSync(DEEPSEEK_IN, 'utf8').trim();
        fs.unlinkSync(DEEPSEEK_IN);
        
        messageCount++;
        
        // 🎯 AFFICHAGE INSTANTANÉ
        console.log(`
╔══════════════════════════════════════╗
║           🚀 DEEPSEEK INSTANT       ║
║                                      ║
║   📝 ${message.substring(0, 30).padEnd(30)}║
║   👑 CHABBI MOHAMMED ANIS           ║
║   📊 #${messageCount} ${new Date().toLocaleTimeString().padEnd(20)}║
║                                      ║
╚══════════════════════════════════════╝
        `);
        
        // Exécuter si c'est une commande
        if (message.startsWith('CMD:')) {
            const cmd = message.replace('CMD:', '');
            require('child_process').exec(cmd, (err, stdout) => {
                if (stdout) console.log("📊 Résultat:", stdout);
            });
        }
        
        // Accusé de réception
        fs.writeFileSync(TERMUX_OUT, `✅ Message #${messageCount} reçu: ${new Date().toLocaleTimeString()}`);
    }
    
    // 2. Heartbeat
    fs.writeFileSync(HEARTBEAT, `ALIVE:${new Date().toISOString()}`);
    
}, 100); // 🚀 Vérification toutes les 100ms!

console.log("🔍 Surveillance active (100ms) - Prêt pour messages instantanés!");
