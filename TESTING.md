# Быстрое тестирование приложения

## Полный цикл запуска и тестирования в Docker

### Шаг 1: Запуск приложения

```bash
# Запустить все сервисы
docker compose --env-file .env.docker up -d --build

# Проверить статус (дождаться пока все запустится)
docker compose ps

# Посмотреть логи (опционально)
docker compose logs -f app
```

### Шаг 2: Заполнить базу тестовыми данными

```bash
# Запустить seed скрипт
docker compose exec app npm run seed:docker
```

Это создаст:
- **100 пользователей** с реалистичными профилями
- **300 постов** (по 3 на пользователя)
- **500-1500 подписок** между пользователями
- **9000-21000 лайков** на посты
- **600-2400 комментариев**
- **6000-24000 лайков** на комментарии
- **180-720 ответов** на комментарии
- **30 разговоров** с сообщениями
- **Уведомления** для всех взаимодействий

**Время выполнения:** 2-5 минут

### Шаг 3: Открыть приложение

```
http://localhost:3002
```

### Шаг 4: Получить список пользователей

```bash
docker compose exec app npm run list-users
```

Эта команда покажет таблицу с username, email и статистикой для первых 20 пользователей.

### Шаг 5: Войти в систему

Используйте email любого пользователя из списка для входа. Все данные (имена, email, посты) сгенерированы библиотекой Faker.

---

## Что тестировать

После запуска seed вы можете проверить:

### 1. Лента постов
- Главная страница должна показывать посты от всех пользователей
- Должны быть видны лайки и комментарии

### 2. Профили пользователей
- Посмотрите разные профили
- Проверьте количество подписчиков/подписок
- Посты пользователей

### 3. Подписки
- Список подписчиков
- Список тех, на кого подписан пользователь

### 4. Комментарии
- Комментарии под постами
- Ответы на комментарии
- Лайки на комментариях

### 5. Сообщения
- Список разговоров
- История сообщений
- Отправка новых сообщений

### 6. Уведомления
- Уведомления о новых подписчиках
- Уведомления о лайках
- Уведомления о комментариях

---

## Очистка и перезапуск

### Очистить все и начать заново

```bash
# Остановить и удалить все контейнеры и данные
docker compose down -v

# Запустить заново
docker compose --env-file .env.docker up -d --build

# Заполнить базу снова
docker compose exec app npm run seed:docker
```

### Добавить больше данных (не очищая существующие)

```bash
docker compose exec app npm run seed:docker
```

Скрипт пропустит дублирующиеся подписки и лайки, но создаст новых пользователей и посты.

---

## Проверка данных напрямую в базе

```bash
# Подключиться к PostgreSQL
docker compose exec postgres psql -U socialapp -d socialapp

# Проверить количество записей
SELECT
  (SELECT COUNT(*) FROM "User") as users,
  (SELECT COUNT(*) FROM "Post") as posts,
  (SELECT COUNT(*) FROM "Follow") as follows,
  (SELECT COUNT(*) FROM "PostLike") as post_likes,
  (SELECT COUNT(*) FROM "Comment") as comments,
  (SELECT COUNT(*) FROM "CommentLike") as comment_likes,
  (SELECT COUNT(*) FROM "Conversation") as conversations,
  (SELECT COUNT(*) FROM "Message") as messages,
  (SELECT COUNT(*) FROM "Activity") as activities;

# Выйти
\q
```

---

## Примеры тестовых пользователей

После seed вы можете войти как любой из созданных пользователей.

### Получить список пользователей (рекомендуется):

```bash
docker compose exec app npm run list-users
```

Эта команда покажет красивую таблицу с пользователями и их статистикой.

### Альтернатива через SQL:

```bash
docker compose exec postgres psql -U socialapp -d socialapp -c "SELECT username, email FROM \"User\" LIMIT 20;"
```

**Примечание:** Все имена, username и email генерируются случайно библиотекой Faker.

---

## Устранение проблем

### База данных не запускается
```bash
docker compose logs postgres
```

### Приложение не запускается
```bash
docker compose logs app
```

### Seed не работает
```bash
# Проверить, что миграции применены
docker compose exec app npx prisma migrate status

# Применить миграции вручную
docker compose exec app npx prisma migrate deploy
```

### Порты заняты
Измените порты в `docker-compose.yml`:
- PostgreSQL: `5433:5432` → `5434:5432`
- App: `3002:3002` → `3003:3002`

---

## Полезные команды

```bash
# Перезапустить только приложение
docker compose restart app

# Остановить все
docker compose down

# Просмотр логов в реальном времени
docker compose logs -f

# Выполнить команду в контейнере
docker compose exec app <command>

# Открыть shell в контейнере
docker compose exec app sh
```

---

## Дополнительные ресурсы

- **SEED.md** - Подробная документация по seeding
- **DOCKER.md** - Полная документация по Docker
- **DOCKER_QUICKSTART.md** - Быстрый старт с Docker
