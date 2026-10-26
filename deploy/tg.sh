#!/usr/bin/env bash
# Telegram хабарламаларын қосу: жаңа пікір, ұсыныс, тапсырыс және құпия сөз коды Telegram-ға келеді.
# Іске қосу (серверде): bash /opt/podolog/deploy/tg.sh
set -euo pipefail
ENV=/etc/podolog.env
[ "$(id -u)" = 0 ] || { echo "root ретінде іске қосыңыз"; exit 1; }
js() { node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log(($1)??'')}catch{console.log('')}})"; }

echo "1) BotFather берген токенді қойыңыз (экранда көрінбейді) да, Enter басыңыз:"
read -rs TOK; echo
TOK=$(printf '%s' "$TOK" | tr -d '[:space:]')
NAME=$(curl -fsS "https://api.telegram.org/bot$TOK/getMe" 2>/dev/null | js 'j.ok&&j.result.username') || true
[ -n "$NAME" ] || { echo "Токен қате. BotFather-дан қайта көшіріп, тағы іске қосыңыз."; exit 1; }
echo "Бот табылды: @$NAME"
echo
echo "2) Telegram-да @$NAME ботын ашып, START (немесе кез келген сөз) жіберіңіз."
echo "   Жіберген соң осында Enter басыңыз."
read -r _
CHAT=""
for i in 1 2 3 4 5 6; do
  CHAT=$(curl -fsS "https://api.telegram.org/bot$TOK/getUpdates" 2>/dev/null | js 'j.ok&&j.result.length?(m=>m&&m.chat.id)((x=>x.message||x.my_chat_member||x.channel_post)(j.result[j.result.length-1])):""') || true
  [ -n "$CHAT" ] && break; sleep 3
done
[ -n "$CHAT" ] || { echo "Хабарлама табылмады. Ботқа START жіберіп, скриптті қайта іске қосыңыз."; exit 1; }

sed -i '/^TG_BOT_TOKEN=/d;/^TG_CHAT_ID=/d' "$ENV"
printf 'TG_BOT_TOKEN=%s\nTG_CHAT_ID=%s\n' "$TOK" "$CHAT" >> "$ENV"
chmod 600 "$ENV"
systemctl restart podolog
curl -fsS -X POST "https://api.telegram.org/bot$TOK/sendMessage" -H 'content-type: application/json' \
  -d "{\"chat_id\":\"$CHAT\",\"text\":\"✅ Подолог сайты қосылды. Жаңа пікір, ұсыныс, тапсырыс және құпия сөз коды осында келеді.\"}" >/dev/null && echo "ДАЙЫН: Telegram-ға тексеру хабарламасы жіберілді."
