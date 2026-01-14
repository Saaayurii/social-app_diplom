'use client';

import { ErrorPage } from '@/components/ErrorPage';
import { ErrorLock } from '@/svg_components';

export function Forbidden() {
  return (
    <ErrorPage
      code="403"
      title="Доступ запрещён"
      description="У вас нет прав для просмотра этой страницы."
      icon={<ErrorLock className="h-24 w-24 stroke-warning-foreground" />}
    />
  );
}
