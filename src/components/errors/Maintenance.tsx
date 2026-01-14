'use client';

import { ErrorServer } from '@/svg_components';

export function Maintenance() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <ErrorServer className="h-24 w-24 stroke-primary" />
        </div>

        <h1 className="mb-3 text-2xl font-semibold text-foreground">Технические работы</h1>

        <p className="mb-8 text-muted-foreground">
          Сайт временно недоступен в связи с проведением технических работ. Пожалуйста, попробуйте позже.
        </p>

        <div className="inline-block rounded-xl bg-card px-6 py-4">
          <p className="text-sm text-muted-foreground">Мы скоро вернёмся!</p>
        </div>
      </div>
    </div>
  );
}
