import Link from 'next/link';
import { UserAuthForm } from '../UserAuthForm';

export const metadata = {
  title: 'ДонГУ Сеть | Регистрация',
};

export default function Page() {
  return (
    <>
      <h1 className="mb-5 text-5xl font-bold">Регистрация</h1>
      <p className="mb-4 text-lg text-muted-foreground">Введите email для создания аккаунта</p>
      <UserAuthForm mode="register" />
      <p className="text-lg text-muted-foreground">Уже есть аккаунт?</p>
      <p className="cursor-pointer text-lg font-semibold text-primary-accent hover:opacity-90">
        <Link href="/login" prefetch>
          Войти
        </Link>
      </p>
    </>
  );
}
