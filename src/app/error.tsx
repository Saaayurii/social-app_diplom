'use client';

import { ErrorPage } from '@/components/ErrorPage';
import { ErrorServer } from '@/svg_components';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      code="500"
      title="Ошибка сервера"
      description="Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже."
      icon={<ErrorServer className="h-24 w-24 stroke-destructive-foreground" />}
      showRetryButton
      onRetry={reset}
    />
  );
}
