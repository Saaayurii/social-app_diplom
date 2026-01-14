'use client';

import { Poppins } from 'next/font/google';
import { ErrorBan } from '@/svg_components';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru" className="dark">
      <body className={`flex min-h-screen flex-col bg-[rgb(10,15,12)] text-[rgb(235,255,245)] ${poppins.className}`}>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <ErrorBan className="h-24 w-24 stroke-[rgb(246,100,157)]" />
            </div>
            <div className="mb-2 text-7xl font-bold text-[rgb(34,197,94)]">500</div>
            <h1 className="mb-3 text-2xl font-semibold">Критическая ошибка</h1>
            <p className="mb-8 text-[rgb(180,200,190)]">
              Произошла критическая ошибка приложения. Пожалуйста, обновите страницу.
            </p>
            <button
              onClick={reset}
              className="rounded-xl bg-[rgb(34,197,94)] px-6 py-4 font-semibold text-[rgb(240,255,245)] transition-colors hover:bg-[rgb(74,222,128)]"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
