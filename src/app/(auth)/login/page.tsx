import Link from 'next/link';
import { UserAuthForm } from '../UserAuthForm';

export const metadata = {
  title: 'ДонГУ Сеть | Вход',
};

export default function Page() {
  return (
    <>
      <h1 className="mb-5 text-5xl font-bold">Вход</h1>
      <p className="mb-4 text-lg text-muted-foreground">Введите email для входа</p>
      <UserAuthForm mode="login" />
      <p className="text-lg text-muted-foreground">Ещё нет аккаунта?</p>
      <p className="cursor-pointer text-lg font-semibold text-primary-accent hover:opacity-90">
        <Link href="/register" prefetch>
          Создать аккаунт
        </Link>
      </p>
    </>
  );
}
