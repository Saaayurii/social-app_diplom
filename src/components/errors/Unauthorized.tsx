'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ErrorLock, LogInSquare } from '@/svg_components';

export function Unauthorized() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <ErrorLock className="h-24 w-24 stroke-primary" />
        </div>

        <div className="mb-2 text-7xl font-bold text-primary">401</div>

        <h1 className="mb-3 text-2xl font-semibold text-foreground">Требуется авторизация</h1>

        <p className="mb-8 text-muted-foreground">
          Для доступа к этой странице необходимо войти в систему.
        </p>

        <Link href="/login">
          <Button mode="primary" size="medium" Icon={LogInSquare}>
            Войти в аккаунт
          </Button>
        </Link>
      </div>
    </div>
  );
}
