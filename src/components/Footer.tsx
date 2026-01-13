'use client';

import { Feather, Mail, Phone } from '@/svg_components';
import { LogoText } from '@/components/LogoText';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import Link from 'next/link';
import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Кнопка смены темы */}
        <div className="mb-6 flex justify-end">
          <ThemeSwitch />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Логотип и описание */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Feather className="stroke-primary" width={32} height={32} />
              <LogoText className="text-xl" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Социальная сеть для студентов и преподавателей Донецкого государственного университета
            </p>
          </div>

          {/* Полезные ссылки */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Полезные ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Условия использования
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail width={16} height={16} className="stroke-primary" />
                <a
                  href="mailto:support@dongu-social.edu"
                  className="transition-colors hover:text-primary"
                >
                  support@dongu-social.edu
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone width={16} height={16} className="mt-0.5 stroke-primary" />
                <span>Донецкий государственный университет</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Разделитель и копирайт */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} Донецкий государственный университет. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
