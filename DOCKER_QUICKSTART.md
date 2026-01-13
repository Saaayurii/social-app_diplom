# Docker Quick Start

## Запуск приложения (3 команды)

### 1. Проверьте настройки
```bash
cat .env.docker
```

По умолчанию используется локальное хранилище файлов (`USE_AWS_STORAGE=false`)

### 2. Запустите контейнеры
```bash
docker compose --env-file .env.docker up -d --build
```

### 3. Откройте приложение
```
http://localhost:3002
```

## Управление

### Остановить
```bash
docker compose down
```

### Посмотреть логи
```bash
docker logs social-app -f
```

### Статус
```bash
docker compose ps
```

## Заполнение базы тестовыми данными

### Запустить seed (после первого запуска)
```bash
docker compose exec app npm run seed:docker
```

Это создаст:
- 100 пользователей с профилями
- 300 постов
- Подписки, лайки, комментарии
- 30 разговоров с сообщениями
- Уведомления

### Посмотреть список пользователей
```bash
docker compose exec app npm run list-users
```

**Документация:**
- `SEED_COMMANDS.md` - Краткая справка по всем seed командам
- `SEED.md` - Подробная документация
- `TESTING.md` - Инструкция по тестированию

## Переключение хранилища

### Использовать AWS S3
Отредактируйте `.env.docker`:
```bash
USE_AWS_STORAGE=true
AWS_REGION=us-east-1
S3_ACCESS_KEY_ID=ваш_ключ
S3_SECRET_ACCESS_KEY=ваш_секрет
S3_BUCKET_NAME=ваш_bucket
```

Перезапустите:
```bash
docker compose restart app
```

### Использовать локальное хранилище
Отредактируйте `.env.docker`:
```bash
USE_AWS_STORAGE=false
```

Перезапустите:
```bash
docker compose restart app
```

## Сервисы

- **Web App**: http://localhost:3002
- **PostgreSQL**: localhost:5433
  - User: `socialapp`
  - Password: `socialapp123`
  - Database: `socialapp`

## Полная документация

См. `DOCKER.md` для подробной информации.
