import React from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-2xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-card-foreground">{title}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="px-4 py-8 sm:px-0">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Условия использования</h1>
        <p className="mt-3 text-muted-foreground">
          Последнее обновление: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 mb-8">
        <p className="text-center text-lg">
          Добро пожаловать в социальную сеть для студентов и преподавателей Донецкого государственного университета.
          Используя наш сервис, вы соглашаетесь с данными условиями использования.
        </p>
      </div>

      <Section title="1. Принятие условий">
        <p>
          Получая доступ к платформе и используя её, вы подтверждаете, что прочитали, поняли и согласны соблюдать
          настоящие Условия использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наш сервис.
        </p>
        <p>
          Платформа предназначена исключительно для студентов, преподавателей и сотрудников Донецкого государственного
          университета. Регистрация требует подтверждения вашей принадлежности к университету.
        </p>
      </Section>

      <Section title="2. Регистрация и учётная запись">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card title="Требования к регистрации">
            <ul className="list-inside list-disc space-y-2">
              <li>Вам должно быть не менее 16 лет</li>
              <li>Необходима действующая университетская электронная почта</li>
              <li>Информация в профиле должна быть достоверной</li>
              <li>Один человек может иметь только одну учётную запись</li>
            </ul>
          </Card>
          <Card title="Безопасность аккаунта">
            <ul className="list-inside list-disc space-y-2">
              <li>Вы несёте ответственность за сохранность пароля</li>
              <li>Не передавайте доступ к аккаунту третьим лицам</li>
              <li>Немедленно сообщайте о подозрительной активности</li>
              <li>Используйте надёжный и уникальный пароль</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section title="3. Правила поведения и контент">
        <p className="font-semibold text-foreground">Запрещается публиковать контент, который:</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Неприемлемый контент">
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Содержит оскорбления или угрозы</li>
              <li>Пропагандирует дискриминацию</li>
              <li>Нарушает права других лиц</li>
              <li>Содержит ненормативную лексику</li>
            </ul>
          </Card>
          <Card title="Незаконный контент">
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Нарушает законодательство</li>
              <li>Защищён авторским правом</li>
              <li>Содержит вредоносное ПО</li>
              <li>Призывает к незаконным действиям</li>
            </ul>
          </Card>
          <Card title="Спам и мошенничество">
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Спам или массовая рассылка</li>
              <li>Мошеннические схемы</li>
              <li>Фишинг и обман</li>
              <li>Несанкционированная реклама</li>
            </ul>
          </Card>
        </div>
        <p className="mt-4">
          Мы оставляем за собой право модерировать контент и удалять публикации, нарушающие данные правила.
          Повторные нарушения могут привести к блокировке учётной записи.
        </p>
      </Section>

      <Section title="4. Интеллектуальная собственность">
        <p>
          Весь контент, который вы публикуете на платформе (тексты, изображения, видео), остаётся вашей
          собственностью. Однако, размещая контент, вы предоставляете нам неисключительную лицензию на его
          использование для функционирования и улучшения сервиса.
        </p>
        <p>
          Вы гарантируете, что имеете все необходимые права на публикуемый контент и что его размещение
          не нарушает права третьих лиц.
        </p>
      </Section>

      <Section title="5. Конфиденциальность данных">
        <Card title="Обработка персональных данных">
          <p className="mb-3">
            Мы обрабатываем ваши персональные данные в соответствии с действующим законодательством о защите данных.
            Подробную информацию о том, какие данные мы собираем и как их используем, можно найти в нашей{' '}
            <a href="/privacy-policy" className="text-primary underline hover:text-primary/80">
              Политике конфиденциальности
            </a>.
          </p>
          <p className="text-sm">
            Основные принципы: мы не продаём ваши данные третьим лицам, используем их только для улучшения
            сервиса и защищаем с помощью современных технологий шифрования.
          </p>
        </Card>
      </Section>

      <Section title="6. Ограничение ответственности">
        <p>
          Сервис предоставляется «как есть» без каких-либо гарантий. Мы не несём ответственности за:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>Контент, публикуемый пользователями</li>
          <li>Временную недоступность или технические сбои</li>
          <li>Потерю данных в результате технических проблем</li>
          <li>Любой ущерб, возникший в результате использования платформы</li>
        </ul>
      </Section>

      <Section title="7. Модерация и блокировка">
        <Card title="Меры воздействия">
          <p className="mb-3">
            При нарушении правил администрация может применить следующие меры:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                Предупреждение
              </span>
              <span className="text-sm">За первичные или незначительные нарушения</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="rounded-full bg-orange-500/20 px-2 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
                Временная блокировка
              </span>
              <span className="text-sm">От 24 часов до 30 дней</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                Постоянная блокировка
              </span>
              <span className="text-sm">За систематические или грубые нарушения</span>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="8. Изменения условий">
        <p>
          Мы оставляем за собой право изменять настоящие Условия использования. О существенных изменениях
          мы уведомим вас по электронной почте или через уведомления на платформе. Продолжая использовать
          сервис после вступления изменений в силу, вы соглашаетесь с обновлёнными условиями.
        </p>
      </Section>

      <Section title="9. Прекращение использования">
        <p>
          Вы можете в любой момент прекратить использование сервиса и удалить свою учётную запись через
          настройки профиля. После удаления аккаунта ваши личные данные будут удалены в соответствии с
          нашей политикой хранения данных.
        </p>
        <p>
          Мы также оставляем за собой право приостановить или удалить вашу учётную запись при нарушении
          данных условий.
        </p>
      </Section>

      <Section title="10. Контактная информация">
        <Card title="Связаться с нами">
          <p className="mb-2">
            Если у вас есть вопросы относительно данных Условий использования или работы платформы,
            вы можете связаться с нами:
          </p>
          <ul className="space-y-1 text-sm">
            <li><strong>Email:</strong> support@dongu-social.edu</li>
            <li><strong>Адрес:</strong> Донецкий государственный университет</li>
            <li><strong>Время работы:</strong> Пн-Пт, 9:00-18:00</li>
          </ul>
        </Card>
      </Section>

      <div className="mt-12 rounded-xl border-2 border-border bg-muted/50 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Используя платформу, вы подтверждаете, что являетесь членом сообщества Донецкого государственного
          университета и обязуетесь соблюдать академические стандарты и этику нашего университета.
        </p>
      </div>
    </main>
  );
}
