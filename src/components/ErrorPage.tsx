'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { BackArrow } from '@/svg_components';

type ErrorPageProps = {
  code: string;
  title: string;
  description: string;
  icon: ReactNode;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
};

export function ErrorPage({
  code,
  title,
  description,
  icon,
  showHomeButton = true,
  showRetryButton = false,
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">{icon}</div>

        {/* Error Code */}
        <div className="mb-2 text-7xl font-bold text-primary">{code}</div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-semibold text-foreground">{title}</h1>

        {/* Description */}
        <p className="mb-8 text-muted-foreground">{description}</p>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {showHomeButton && (
            <Link href="/feed">
              <Button mode="primary" size="medium" Icon={BackArrow}>
                На главную
              </Button>
            </Link>
          )}
          {showRetryButton && onRetry && (
            <Button mode="secondary" size="medium" onPress={onRetry}>
              Попробовать снова
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
