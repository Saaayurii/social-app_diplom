import { EditProfileForm } from '@/components/EditProfileForm';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

export const metadata = {
  title: 'ДонГУ Сеть | Настройка профиля',
};

export default function Page() {
  return (
    <ResponsiveContainer className="mx-auto my-4 px-4 md:px-0">
      <h1 className="mb-1 text-3xl font-bold">Добро пожаловать в ДонГУ Сеть!</h1>
      <p className="mb-4 text-muted-foreground">
        Пожалуйста, заполните профиль для продолжения. Обязательны только поля <b>имя</b> и <b>имя пользователя</b>.
      </p>
      <EditProfileForm redirectTo="/feed" />
    </ResponsiveContainer>
  );
}
