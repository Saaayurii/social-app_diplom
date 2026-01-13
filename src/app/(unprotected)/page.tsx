'use client';

import { ButtonLink } from '@/components/ui/ButtonLink';
import React from 'react';
import { motion } from 'framer-motion';

function TechStackCard({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <h4 className="relative text-lg font-semibold text-card-foreground">{header}</h4>
      <p className="relative mt-2 text-muted-foreground">{children}</p>
    </motion.div>
  );
}

export default function Page() {
  return (
    <main>
      <div className="mt-28 flex flex-col items-center sm:mt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 text-sm font-medium text-card-foreground ring-1 ring-primary/30">
            Донецкий государственный университет
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 px-5 text-center text-3xl font-bold leading-tight sm:text-6xl"
        >
          <span className="bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
            Социальная сеть
          </span>
          <br />
          <span className="text-foreground">
            для студентов и преподавателей ДонГУ
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-2xl px-5 text-center text-muted-foreground"
        >
          Общайтесь, делитесь знаниями и развивайтесь вместе с университетским сообществом
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <ButtonLink href="/login" size="medium">
            Войти
          </ButtonLink>
          <ButtonLink href="/register" size="medium" mode="secondary">
            Регистрация
          </ButtonLink>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-32 pb-16"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-5xl">
            <span className="bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
              Технологии
            </span>
          </h2>
          <p className="mt-4 px-4 text-lg text-muted-foreground">
            Современный стек для надёжного и быстрого веб-приложения
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:gap-5">
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
          ].map(({ header, details }, index) => (
            <motion.div
              key={header}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
            >
              <TechStackCard header={header}>
                {details}
              </TechStackCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
