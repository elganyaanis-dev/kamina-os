#!/bin/bash
# Service qui utilise wake-locks et priorité Android

while true; do
    # Empêcher le sommeil du CPU
    termux-wake-lock
    
    # Vérifier les canaux de communication
    check_communications
    
    # Maintenir le service actif
    sleep 60
    
    # Journal de présence
    echo "[$(date)] 🔷 Service Kamina actif" >> /sdcard/kamina_presence.log
done

check_communications() {
    # 1. Vérifier fichiers partagés
    [ -f /sdcard/deepseek_cmd.txt ] && process_command
    
    # 2. Vérifier presse-papier
    check_clipboard
    
    # 3. Vérifier notifications
    check_notifications
    
    # 4. Émettre un heartbeat
    echo "ALIVE" > /sdcard/kamina_heartbeat.txt
}

process_command() {
    CMD=$(cat /sdcard/deepseek_cmd.txt)
    echo "🔷 EXÉCUTION: $CMD"
    eval $CMD
    rm /sdcard/deepseek_cmd.txt
}
