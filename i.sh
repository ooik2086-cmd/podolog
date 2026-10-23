#!/usr/bin/env bash
# «Подолог» сайтын серверге орнату (Ubuntu 22.04/24.04).
# Іске қосу:  curl -fsSL https://raw.githubusercontent.com/ooik2086-cmd/podolog/server/deploy/install.sh | sudo bash
# Не істейді: Node.js 20, nginx, certbot орнатады; сайтты GitHub-тағы «server» тармағынан алады;
# әкімші құпия сөзін сұрайды; сервисті іске қосады; әр 5 минут сайын жаңартуды өзі тексереді.
set -euo pipefail
trap 'echo; echo "ҚАТЕ: $LINENO-жолда тоқтады. Экранның скриншотын жіберіңіз."' ERR
DOMAIN=podology.com.kz
REPO=https://github.com/ooik2086-cmd/podolog.git
APP=/opt/podolog
DATA=/var/lib/podolog

[ "$(id -u)" = 0 ] || { echo "sudo арқылы іске қосыңыз"; exit 1; }
export DEBIAN_FRONTEND=noninteractive

echo "==> 1/6 Пакеттер"
A="apt-get -o DPkg::Lock::Timeout=600"
echo "   (жаңа серверде Ubuntu өзі жаңарып жатуы мүмкін, сонда бірнеше минут күтеді)"
$A update -qq
$A install -y -qq ca-certificates curl git nginx certbot python3-certbot-nginx ufw >/dev/null
if ! command -v node >/dev/null || [ "$(node -v | cut -c2- | cut -d. -f1)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null
  $A install -y -qq nodejs >/dev/null
fi

echo "==> 2/6 Сайт файлдары"
id podolog >/dev/null 2>&1 || useradd --system --home "$APP" --shell /usr/sbin/nologin podolog
if [ -d "$APP/.git" ]; then git -C "$APP" fetch -q origin server && git -C "$APP" reset -q --hard origin/server
else rm -rf "$APP"; git clone -q --depth 1 -b server "$REPO" "$APP"; fi
mkdir -p "$DATA"; chown -R podolog:podolog "$DATA"

echo "==> 3/6 Әкімші құпия сөзі"
if [ ! -f /etc/podolog.env ]; then
  while :; do
    read -rsp "Әкімші бөліміне жаңа құпия сөз ойлап табыңыз (кемінде 10 таңба): " P1 </dev/tty; echo
    read -rsp "Қайталаңыз: " P2 </dev/tty; echo
    [ "$P1" = "$P2" ] && [ ${#P1} -ge 10 ] && break
    echo "Сәйкес емес немесе 10 таңбадан қысқа. Қайта жазыңыз."
  done
  umask 077
  printf 'PORT=8080\nHOST=127.0.0.1\nDIST_DIR=%s/dist\nDATA_DIR=%s\nTRUST_PROXY=1\nADMIN_PASSWORD=%s\n' "$APP" "$DATA" "$P1" > /etc/podolog.env
  chmod 600 /etc/podolog.env
else echo "бұрыннан бар, өзгертілмеді (/etc/podolog.env)"; fi

# WhatsApp хабарламасы (CallMeBot): кілт әлі енгізілмесе ғана сұраймыз, Enter басса өткізіп жібереді
if ! grep -q '^WA_APIKEY=' /etc/podolog.env; then
  echo "Жаңа пікір мен ұсыныс WhatsApp-қа келсін десеңіз, CallMeBot кілтін жазыңыз (жоқ болса Enter басыңыз)."
  read -rp "CallMeBot apikey: " WAK </dev/tty
  if [ -n "$WAK" ]; then
    read -rp "Хабарлама келетін WhatsApp нөмірі [+77059525231]: " WAP </dev/tty
    printf 'WA_PHONE=%s\nWA_APIKEY=%s\n' "${WAP:-+77059525231}" "$WAK" >> /etc/podolog.env
  fi
fi

echo "==> 4/6 Сервис"
cat > /etc/systemd/system/podolog.service <<UNIT
[Unit]
Description=Podolog site
After=network.target
[Service]
EnvironmentFile=/etc/podolog.env
ExecStart=/usr/bin/node $APP/server/server.mjs
User=podolog
Restart=always
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=$DATA
[Install]
WantedBy=multi-user.target
UNIT
# Жаңарту: GitHub-та өзгеріс болса, тартып алып, сервисті қайта қосады
cat > /usr/local/bin/podolog-update <<UPD
#!/bin/sh
cd $APP || exit 1
git fetch -q origin server || exit 0
[ "\$(git rev-parse HEAD)" = "\$(git rev-parse origin/server)" ] && exit 0
git reset -q --hard origin/server && systemctl restart podolog
UPD
chmod 755 /usr/local/bin/podolog-update
cat > /etc/systemd/system/podolog-update.service <<UNIT
[Unit]
Description=Podolog update from GitHub
[Service]
Type=oneshot
ExecStart=/usr/local/bin/podolog-update
UNIT
cat > /etc/systemd/system/podolog-update.timer <<UNIT
[Unit]
Description=Podolog update every 5 min
[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
UNIT
systemctl daemon-reload
systemctl enable -q --now podolog podolog-update.timer
systemctl restart podolog

echo "==> 5/6 nginx"
cat > /etc/nginx/sites-available/podolog <<NGX
server {
  listen 80;
  listen [::]:80;
  server_name $DOMAIN www.$DOMAIN _;
  client_max_body_size 1m;
  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
NGX
ln -sf /etc/nginx/sites-available/podolog /etc/nginx/sites-enabled/podolog
rm -f /etc/nginx/sites-enabled/default
nginx -t -q && systemctl reload nginx
ufw allow OpenSSH >/dev/null; ufw allow 'Nginx Full' >/dev/null; ufw --force enable >/dev/null

echo "==> 6/6 HTTPS"
IP=$(curl -fsS -4 https://api.ipify.org || true)
DNSIP=$(getent ahostsv4 $DOMAIN | awk 'NR==1{print $1}' || true)
if [ -n "$IP" ] && [ "$IP" = "$DNSIP" ]; then
  certbot --nginx -n --agree-tos --register-unsafely-without-email --redirect -d $DOMAIN -d www.$DOMAIN || \
  certbot --nginx -n --agree-tos --register-unsafely-without-email --redirect -d $DOMAIN || true
else
  echo "Домен әлі бұл серверге бағытталмаған (домен: ${DNSIP:-жоқ}, сервер: ${IP:-?})."
  echo "DNS-ті ауыстырғаннан кейін осы команданы қайта іске қосыңыз, HTTPS сонда қосылады."
fi

sleep 1
if curl -fsS -o /dev/null http://127.0.0.1:8080/; then echo; echo "ДАЙЫН. Сайт жұмыс істеп тұр. Сервер IP: ${IP:-белгісіз}"
else echo; echo "Сервис іске қосылмады: journalctl -u podolog -n 50"; fi
