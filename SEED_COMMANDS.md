# Seed Commands - Краткая справка

## Docker команды

```bash
# 1. Запустить seed после первого запуска приложения
docker compose exec app npm run seed:docker

# 2. Посмотреть список созданных пользователей
docker compose exec app npm run list-users

# 3. Полный перезапуск с новой базой и seed
docker compose down -v
docker compose --env-file .env.docker up -d --build
docker compose exec app npm run seed:docker
docker compose exec app npm run list-users
```

## Локальные команды

```bash
# 1. Seed без сброса базы
npm run seed

# 2. Полный сброс базы и seed
npm run prisma:seed

# 3. Просмотр пользователей
npm run list-users
```

## Что создается

| Данные | Количество |
|--------|-----------|
| Пользователи | 100 |
| Посты | 300 |
| Подписки | 500-1500 |
| Лайки на посты | 9,000-21,000 |
| Комментарии | 600-2,400 |
| Лайки на комментарии | 6,000-24,000 |
| Ответы на комментарии | 180-720 |
| Разговоры | 30 |
| Сообщения | 150-450 |

## Полезные команды

```bash
# Статус контейнеров
docker compose ps

# Логи приложения
docker compose logs -f app

# Логи базы данных
docker compose logs -f postgres

# Подключиться к базе напрямую
docker compose exec postgres psql -U socialapp -d socialapp

# Проверить статус миграций
docker compose exec app npx prisma migrate status

# Применить миграции вручную
docker compose exec app npx prisma migrate deploy
```

## Проверка данных в базе

```sql
-- Подключиться к базе
docker compose exec postgres psql -U socialapp -d socialapp

-- Проверить количество записей
SELECT
  (SELECT COUNT(*) FROM "User") as users,
  (SELECT COUNT(*) FROM "Post") as posts,
  (SELECT COUNT(*) FROM "Follow") as follows,
  (SELECT COUNT(*) FROM "PostLike") as post_likes,
  (SELECT COUNT(*) FROM "Comment") as comments,
  (SELECT COUNT(*) FROM "Message") as messages;

-- Получить список пользователей
SELECT id, username, email, name FROM "User" LIMIT 10;

-- Выйти
\q
```

## Файлы документации

- **SEED.md** - Подробная документация по seeding
- **TESTING.md** - Инструкция по тестированию приложения
- **DOCKER_QUICKSTART.md** - Быстрый старт с Docker
- **DOCKER.md** - Полная документация по Docker

## Быстрый старт

```bash
# 1. Запустить Docker
docker compose --env-file .env.docker up -d --build

# 2. Подождать ~30 секунд

# 3. Запустить seed (займет 2-5 минут)
docker compose exec app npm run seed:docker

# 4. Получить список пользователей
docker compose exec app npm run list-users

# 5. Открыть приложение
# http://localhost:3002

# 6. Войти используя email любого пользователя
```

## Устранение проблем

```bash
# Если seed не работает, проверьте миграции
docker compose exec app npx prisma migrate status

# Применить миграции
docker compose exec app npx prisma migrate deploy

# Если база не запускается
docker compose logs postgres

# Если приложение не запускается
docker compose logs app

# Перезапустить все
docker compose restart
```
