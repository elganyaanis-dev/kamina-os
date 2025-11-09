#!/bin/bash
# Ce script peut être appelé par Tasker
# Placez-le dans /sdcard/Tasker/

MESSAGE=$1
echo "🔷 TASKER -> TERMUX: $MESSAGE" >> ~/kamina-control/tasker.log

if [[ "$MESSAGE" == *"DEEPSEEK"* ]]; then
    # Exécuter une commande DeepSeek
    cd ~/kamina-control
    node -e "console.log('📱 Commande Tasker reçue: $MESSAGE')"
fi
