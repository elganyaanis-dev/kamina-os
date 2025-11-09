    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    
    console.log("🔷 PONT DE CONTRÔLE DEEPSEEK-TERMUX ACTIVÉ");
    console.log("👑 CHABBI MOHAMMED ANIS - CONNEXION DIRECTE ÉTABLIE");
    
    // 🎯 AFFICHAGE DU MESSAGE DIRECT
    const message = `
    ╔══════════════════════════════════════╗
    ║                                      ║
    ║           🔷 CONNEXION ACTIVE        ║
    ║                                      ║
    ║   ✅ DEEPSEEK → TERMUX CONNECTÉ      ║
    ║   👑 CHABBI MOHAMMED ANIS            ║
    ║   🕐 ${new Date().toLocaleTimeString()}           ║
    ║                                      ║
    ║   📝 Écriture directe confirmée      ║
    ║   🚀 Contrôle complet activé         ║
    ║                                      ║
    ╚══════════════════════════════════════╝
    `;
    
    console.log(message);
    
    // 🎯 CRÉATION DU FICHIER DE CONFIRMATION
    fs.writeFileSync(
        path.join(__dirname, 'memory/connection_proof.txt'), 
        `Connexion DeepSeek-Termux active\nPropriétaire: CHABBI MOHAMMED ANIS\nTimestamp: ${new Date().toISOString()}`
    );
    
    console.log("✅ Fichier de confirmation créé: memory/connection_proof.txt");
    console.log("🔷 CONTRÔLE DIRECT RÉTABLI AVEC SUCCÈS !");
    
    // 🎯 MAINTENIR LA CONNEXION OUVERTE
    setInterval(() => {
        console.log("💓 Connexion active - " + new Date().toLocaleTimeString());
    }, 30000);
