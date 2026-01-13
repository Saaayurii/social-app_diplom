import { ButtonLink } from '@/components/ui/ButtonLink';
import React from 'react';

function TechStackCard({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-5">
      <h4 className="text-lg font-semibold text-card-foreground">{header}</h4>

      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <div className="mt-28 flex flex-col items-center sm:mt-36">
        <p className="inline-block rounded-lg bg-card px-3 py-2 text-card-foreground">Донецкий государственный университет</p>
        <h1 className="mt-4 px-5 text-center text-2xl sm:text-5xl">
          Социальная сеть для студентов и преподавателей ДонГУ
        </h1>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/login" size="medium">
            Войти
          </ButtonLink>
          <ButtonLink href="/register" size="medium" mode="secondary">
            Регистрация
          </ButtonLink>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-3xl sm:text-5xl">Технологии</h2>
        <p className="mt-2 px-4 text-center text-lg text-muted-foreground">
          Это веб-приложение создано с использованием современных технологий.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 px-4 md:grid-cols-3">
          {[
            {
              header: 'TypeScript',
              details: 'Строго типизированный код для надёжности.',
            },
            {
              header: 'Next.js 14',
              details: 'App router, обработчики маршрутов, вложенные layout.',
            },
            { header: 'React 18', details: 'Серверные и клиентские компоненты.' },
            {
              header: 'Prisma',
              details: 'Типобезопасная и удобная ORM для базы данных.',
            },
            {
              header: 'NextAuth.js 5',
              details: 'Безопасная авторизация через email и OAuth.',
            },
            {
              header: 'React Query',
              details: 'Эффективная загрузка и кэширование данных.',
            },
            {
              header: 'Tailwind CSS',
              details: 'Утилитарные классы для создания компонентов.',
            },
            { header: 'Framer Motion', details: 'Анимации для компонентов.' },
            {
              header: 'React Aria',
              details: 'Хуки для обеспечения доступности компонентов.',
            },
            { header: 'Zod', details: 'Валидация форм.' },
            { header: 'AWS S3', details: 'Хранение фото и видео.' },
            { header: 'AWS SES', details: 'Отправка писем для подтверждения.' },
          ].map(({ header, details }) => (
            <TechStackCard header={header} key={header}>
              {details}
            </TechStackCard>
          ))}
        </div>
      </div>
    </main>
  );
}
