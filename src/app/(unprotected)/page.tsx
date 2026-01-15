'use client';

import { ButtonLink } from '@/components/ui/ButtonLink';
import React from 'react';
import { motion } from 'framer-motion';
import {
  BuildingBusinessOffice,
  Mail,
  Phone,
  WorldNet,
  TwoPeople,
  Comment,
  Heart,
  Feather,
  NotificationBell,
  Camera
} from '@/svg_components';

function TechStackCard({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <h4 className="relative text-lg font-semibold text-card-foreground">{header}</h4>
      <p className="relative mt-2 text-sm text-muted-foreground">{children}</p>
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-7 w-7 stroke-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-primary sm:text-5xl">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground sm:text-base">{label}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 text-sm font-medium text-card-foreground ring-1 ring-primary/30">
              <BuildingBusinessOffice className="h-4 w-4 stroke-primary" />
              Донецкий государственный университет
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-center text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Социальная сеть
            </span>
            <br />
            <span className="text-foreground">
              для студентов и преподавателей
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground"
          >
            Общайтесь, делитесь знаниями и развивайтесь вместе с университетским сообществом.
            Платформа для эффективного взаимодействия внутри ДонГУ.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <ButtonLink href="/login" size="medium">
              Войти в систему
            </ButtonLink>
            <ButtonLink href="/register" size="medium" mode="secondary">
              Создать аккаунт
            </ButtonLink>
          </motion.div>
        </div>
      </section>

      {/* About University Section */}
      <section className="bg-secondary/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                О Донецком государственном университете
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
              Один из ведущих университетов региона с богатой историей и традициями
            </p>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BuildingBusinessOffice className="h-6 w-6 stroke-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">История</h3>
              <p className="mt-3 text-muted-foreground">
                Донецкий государственный университет основан в 1937 году. За более чем 85 лет
                университет подготовил десятки тысяч специалистов высшей квалификации для
                различных отраслей науки и экономики.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <TwoPeople className="h-6 w-6 stroke-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">Миссия</h3>
              <p className="mt-3 text-muted-foreground">
                Подготовка высококвалифицированных специалистов, способных решать сложные
                задачи современности. Развитие научного потенциала и внедрение инновационных
                образовательных технологий.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6 md:col-span-2 lg:col-span-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Feather className="h-6 w-6 stroke-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">Образование</h3>
              <p className="mt-3 text-muted-foreground">
                Университет включает множество факультетов: физико-технический, математический,
                химический, биологический, исторический, филологический, экономический,
                юридический и другие.
              </p>
            </motion.div>
          </div>

          {/* University Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-4"
          >
            <StatCard value="85+" label="лет истории" />
            <StatCard value="12" label="факультетов" />
            <StatCard value="10тыс+" label="студентов" />
            <StatCard value="500+" label="преподавателей" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Возможности платформы
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Всё необходимое для общения и взаимодействия в университетском сообществе
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Feather,
                title: 'Публикации',
                description: 'Делитесь новостями, идеями и материалами с коллегами и однокурсниками',
              },
              {
                icon: Comment,
                title: 'Сообщения',
                description: 'Общайтесь в личных диалогах с другими участниками сообщества',
              },
              {
                icon: TwoPeople,
                title: 'Подписки',
                description: 'Следите за обновлениями интересных вам пользователей',
              },
              {
                icon: Heart,
                title: 'Реакции',
                description: 'Оценивайте публикации и комментарии других участников',
              },
              {
                icon: NotificationBell,
                title: 'Уведомления',
                description: 'Получайте оповещения о важных событиях и активности',
              },
              {
                icon: Camera,
                title: 'Медиафайлы',
                description: 'Загружайте фото и видео к своим публикациям',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="bg-secondary/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Технологии
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Современный стек для надёжного и быстрого веб-приложения
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {[
              { header: 'TypeScript', details: 'Строго типизированный код для надёжности' },
              { header: 'Next.js 14', details: 'App router, серверные компоненты' },
              { header: 'React 18', details: 'Современная библиотека для UI' },
              { header: 'Prisma', details: 'Типобезопасная ORM для базы данных' },
              { header: 'NextAuth.js', details: 'Безопасная авторизация' },
              { header: 'React Query', details: 'Кэширование и синхронизация данных' },
              { header: 'Tailwind CSS', details: 'Утилитарные стили для компонентов' },
              { header: 'PostgreSQL', details: 'Надёжная реляционная база данных' },
            ].map(({ header, details }, index) => (
              <motion.div
                key={header}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <TechStackCard header={header}>{details}</TechStackCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Контакты
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Свяжитесь с нами для получения дополнительной информации
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <BuildingBusinessOffice className="h-7 w-7 stroke-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Адрес</h3>
              <p className="mt-2 text-muted-foreground">
                283001, г. Донецк,<br />
                ул. Университетская, 24
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Phone className="h-7 w-7 stroke-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Телефон</h3>
              <p className="mt-2 text-muted-foreground">
                +7 (856) 302-07-52<br />
                Приёмная комиссия
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Mail className="h-7 w-7 stroke-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Email</h3>
              <p className="mt-2 text-muted-foreground">
                info@donnu.ru<br />
                Общие вопросы
              </p>
            </motion.div>
          </div>

          {/* Map or additional info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="flex flex-col items-center justify-between gap-6 p-8 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Официальный сайт университета
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Узнайте больше о факультетах, программах обучения и поступлении
                </p>
              </div>
              <a
                href="https://donnu.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-accent"
              >
                <WorldNet className="h-5 w-5 stroke-current" />
                donnu.ru
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Присоединяйтесь к сообществу ДонГУ
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Станьте частью университетской социальной сети уже сегодня.
              Общайтесь, делитесь знаниями и находите единомышленников.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/register" size="medium">
                Зарегистрироваться
              </ButtonLink>
              <ButtonLink href="/login" size="medium" mode="secondary">
                У меня есть аккаунт
              </ButtonLink>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
