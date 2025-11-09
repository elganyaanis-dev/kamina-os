const fs = require('fs');
let lastClipboard = '';

setInterval(() => {
    termux-clipboard-get > /tmp/current_clip.txt 2>/dev/null
    const current = fs.readFileSync('/tmp/current_clip.txt', 'utf8').trim();
    
    if (current && current !== lastClipboard && current.startsWith('DEEPSEEK:')) {
        console.log("📋 MESSAGE PRESSE-PAPIER:", current);
        lastClipboard = current;
        
        // Traiter le message DeepSeek
        const message = current.replace('DEEPSEEK:', '');
        console.log("🔷 DeepSeek dit:", message);
    }
}, 5000);
