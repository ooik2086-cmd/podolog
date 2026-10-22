# Сервер: пікірлер және сайт

`server.mjs` дайын сайтты (`dist/`) береді және пікірлер API-ін жүргізеді. Тәуелділік жоқ, Node.js 20+ жеткілікті.

## Іске қосу (VPS, Ubuntu)

```bash
npm ci && npm run build          # dist/ жасалады
ADMIN_PASSWORD='ұзын-құпия-сөз' TRUST_PROXY=1 COOKIE_SECURE=1 node server/server.mjs
```

Пікірлер `server/data/reviews.json` файлында сақталады. Бұл файлды күнде сақтық көшірмеге алу керек.

### systemd (`/etc/systemd/system/podolog.service`)

```ini
[Unit]
Description=Podolog site
After=network.target

[Service]
WorkingDirectory=/srv/podolog
ExecStart=/usr/bin/node server/server.mjs
Environment=PORT=8080 HOST=127.0.0.1 TRUST_PROXY=1 COOKIE_SECURE=1
EnvironmentFile=/etc/podolog.env
Restart=always
User=podolog

[Install]
WantedBy=multi-user.target
```

`/etc/podolog.env` (тек root оқиды, `chmod 600`):

```
ADMIN_PASSWORD=...
TG_BOT_TOKEN=...   # міндетті емес: жаңа пікір туралы Telegram хабарламасы
TG_CHAT_ID=...
```

### nginx

```nginx
server {
  server_name example.kz www.example.kz;
  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

HTTPS сертификаты: `certbot --nginx`.

## API

| Әдіс | Жол | Не істейді |
|---|---|---|
| GET | `/api/reviews?limit=3` | Сайттағы пікірлер (жасырылғандарсыз) |
| POST | `/api/reviews` | Жаңа пікір, бірден жарияланады |
| GET | `/admin` | Әкімші беті (құпия сөзбен) |
| PATCH/DELETE | `/api/admin/reviews/:id` | Жасыру/көрсету, өшіру |

Қорғаныс: сілтеме, email, телефон нөмірі бар пікір қабылданбайды; бір IP-ден сағатына 3, тәулігіне 6 пікір; боттарға жасырын өріс; форма 3 секундтан тез жіберілсе қабылданбайды; әкімшіге кіру 15 минутта 5 қате әрекетпен шектеледі.
