# 🚀 Быстрый старт с тестовыми данными

## За 4 команды к работающему приложению

```bash
# 1️⃣ Запустить Docker
docker compose --env-file .env.docker up -d --build

# 2️⃣ Заполнить базу тестовыми данными (займет 2-5 минут)
docker compose exec app npm run seed:docker

# 3️⃣ Получить список пользователей для входа
docker compose exec app npm run list-users

# 4️⃣ Открыть приложение в браузере
# http://localhost:3002
```

## 📊 Что будет создано

После выполнения seed в вашей базе данных будет:

| Данные | Количество |
|--------|-----------|
| 👤 Пользователи с профилями | 100 |
| 📝 Посты | 300 |
| 🤝 Подписки | 500-1,500 |
| ❤️ Лайки на посты | 9,000-21,000 |
| 💬 Комментарии | 600-2,400 |
| 👍 Лайки на комментарии | 6,000-24,000 |
| 💭 Ответы на комментарии | 180-720 |
| 💌 Разговоры | 30 |
| 📨 Сообщения | 150-450 |
| 🔔 Уведомления | Автоматически для всех действий |

## 🎯 Как войти в систему

После выполнения `docker compose exec app npm run list-users` вы увидите таблицу:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Username              │ Name                │ Posts │ Followers │ Following │
├────────────────────────────────────────────────────────────────────────────┤
│ alex_johnson          │ Alex Johnson        │     3 │        12 │         8 │
│ jane_smith            │ Jane Smith          │     3 │        15 │        10 │
│ john_doe              │ John Doe            │     3 │         8 │        12 │
...
```

Используйте **email** любого пользователя для входа.

## 🔄 Начать заново

```bash
# Удалить все данные и контейнеры
docker compose down -v

# Запустить заново
docker compose --env-file .env.docker up -d --build

# Заполнить базу
docker compose exec app npm run seed:docker

# Получить список пользователей
docker compose exec app npm run list-users
```

## ⚙️ Дополнительные команды

```bash
# Посмотреть логи приложения
docker compose logs -f app

# Статус контейнеров
docker compose ps

# Остановить без удаления данных
docker compose down

# Перезапустить приложение
docker compose restart app

# Добавить еще больше данных (не удаляя существующие)
docker compose exec app npm run seed:docker
```

## 📚 Полная документация

- **SEED_COMMANDS.md** - Все seed команды в одном месте
- **SEED.md** - Подробная документация по seeding
- **TESTING.md** - Что и как тестировать
- **DOCKER_QUICKSTART.md** - Docker quick start
- **DOCKER.md** - Полная Docker документация

## ❓ Проблемы?

```bash
# Проверить логи базы данных
docker compose logs postgres

# Проверить статус миграций
docker compose exec app npx prisma migrate status

# Применить миграции вручную
docker compose exec app npx prisma migrate deploy
```

---

**Время выполнения:**
- Запуск Docker: ~30 секунд
- Seed данных: 2-5 минут
- **Всего: ~3-6 минут** до полностью работающего приложения с данными

**Требования:**
- Docker и Docker Compose установлены
- Порты 3002 и 5433 свободны
- Минимум 2GB RAM для Docker
