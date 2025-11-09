const fs = require('fs');
// Surveiller les SMS pour des commandes DeepSeek
setInterval(() => {
    // Vérifier un fichier partagé
    if (fs.existsSync('/sdcard/Download/deepseek_cmd.txt')) {
        const command = fs.readFileSync('/sdcard/Download/deepseek_cmd.txt', 'utf8');
        if (command.includes('DEEPSEEK:')) {
            console.log("📱 COMMANDE SMS:", command);
            // Exécuter la commande
            require('child_process').exec(command.replace('DEEPSEEK:', ''), (err, stdout) => {
                if (stdout) console.log("📤 RÉSULTAT:", stdout);
            });
            fs.unlinkSync('/sdcard/Download/deepseek_cmd.txt');
        }
    }
}, 10000);
