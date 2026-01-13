# Docker Setup - Social Network Application

## Обзор

Приложение полностью докеризировано и включает:
- Next.js приложение (порт 3002)
- PostgreSQL база данных (порт 5433)
- Вариативное хранилище файлов (AWS S3 или локальное)

## Быстрый старт

### 1. Настройка переменных окружения

Используйте файл `.env.docker` для конфигурации:

```bash
cp .env.docker .env.docker.local
```

Отредактируйте `.env.docker` по необходимости.

### 2. Запуск приложения

```bash
# Запустить все сервисы
docker compose --env-file .env.docker up -d

# Или с пересборкой
docker compose --env-file .env.docker up -d --build
```

### 3. Проверка статуса

```bash
# Проверить статус контейнеров
docker compose ps

# Просмотр логов
docker logs social-app
docker logs social-app-postgres
```

### 4. Остановка приложения

```bash
# Остановить все сервисы
docker compose down

# Остановить и удалить volumes (БД и файлы)
docker compose down -v
```

## Конфигурация хранилища файлов

### Локальное хранилище (по умолчанию)

В `.env.docker` установите:
```bash
USE_AWS_STORAGE=false
LOCAL_STORAGE_PATH=/app/uploads
PUBLIC_URL=http://localhost:3002
```

Файлы будут сохраняться в Docker volume `uploads_data`.

### AWS S3 хранилище

В `.env.docker` установите:
```bash
USE_AWS_STORAGE=true

# AWS Configuration
AWS_REGION=us-east-1
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
SES_ACCESS_KEY_ID=your_ses_access_key
SES_SECRET_ACCESS_KEY=your_ses_secret_key
```

## Доступ к приложению

После запуска:
- Веб-интерфейс: http://localhost:3002
- PostgreSQL: localhost:5433 (внутри Docker сети: postgres:5432)

## Полезные команды

### Управление контейнерами

```bash
# Перезапуск одного сервиса
docker compose restart app

# Просмотр логов в реальном времени
docker compose logs -f app

# Выполнение команды внутри контейнера
docker exec -it social-app sh
```

### Управление базой данных

```bash
# Подключение к PostgreSQL
docker exec -it social-app-postgres psql -U socialapp -d socialapp

# Backup базы данных
docker exec social-app-postgres pg_dump -U socialapp socialapp > backup.sql

# Restore базы данных
docker exec -i social-app-postgres psql -U socialapp socialapp < backup.sql
```

### Prisma команды

```bash
# Применить миграции
docker exec social-app npx prisma migrate deploy

# Открыть Prisma Studio
docker exec social-app npx prisma studio
```

## Переменные окружения

### Обязательные переменные

- `AUTH_SECRET` - секретный ключ для NextAuth (генерируется автоматически)
- `DATABASE_URL` - строка подключения к PostgreSQL (настраивается автоматически)

### Опциональные переменные

#### OAuth провайдеры
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` - GitHub OAuth
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` - Google OAuth
- `AUTH_FACEBOOK_ID`, `AUTH_FACEBOOK_SECRET` - Facebook OAuth

#### Хранилище
- `USE_AWS_STORAGE` - использовать AWS S3 (true/false)
- `LOCAL_STORAGE_PATH` - путь для локальных файлов
- `PUBLIC_URL` - публичный URL приложения

## Volumes

Приложение использует следующие volumes:

- `postgres_data` - данные PostgreSQL
- `uploads_data` - загруженные файлы (при USE_AWS_STORAGE=false)

```bash
# Просмотр volumes
docker volume ls | grep social-app

# Удаление volumes
docker volume rm social-app_diplom_postgres_data
docker volume rm social-app_diplom_uploads_data
```

## Troubleshooting

### Порт 5432 уже занят

Если PostgreSQL уже запущен на хосте, порт изменен на 5433.
Для изменения отредактируйте `docker-compose.yml`:

```yaml
ports:
  - "ВАШИ_ПОРТ:5432"
```

### Ошибки миграций Prisma

```bash
# Сбросить базу данных и применить миграции
docker compose down -v
docker compose up -d
```

### Проблемы с OpenSSL

Убедитесь, что в Dockerfile установлен OpenSSL:
```dockerfile
RUN apk add --no-cache openssl
```

### Логи показывают ошибки AWS

Если `USE_AWS_STORAGE=false`, игнорируйте предупреждения об AWS.
Переменные AWS используются только при `USE_AWS_STORAGE=true`.

## Production Deployment

Для production окружения:

1. Измените `AUTH_SECRET` на криптостойкий ключ
2. Настройте SSL/TLS reverse proxy (nginx, traefik)
3. Используйте managed PostgreSQL (не Docker контейнер)
4. Настройте backups базы данных
5. Настройте мониторинг и логирование
6. Используйте Docker secrets для sensitive данных

## Разработка

Для разработки лучше использовать:

```bash
npm run dev
```

Docker конфигурация оптимизирована для production.
