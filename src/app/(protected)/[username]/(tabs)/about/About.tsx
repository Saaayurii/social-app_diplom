import {
  AtSign,
  BuildingBusinessOffice,
  Bullhorn,
  Calendar,
  Heart,
  Mail,
  Other,
  Phone,
  Profile,
  WorldNet,
} from '@/svg_components';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { GetUser } from '@/types/definitions';
import { AboutItem } from './AboutItem';

const genderLabels: Record<string, string> = {
  MALE: 'Мужской',
  FEMALE: 'Женский',
  OTHER: 'Другой',
};

const relationshipLabels: Record<string, string> = {
  SINGLE: 'Не в отношениях',
  IN_A_RELATIONSHIP: 'В отношениях',
  ENGAGED: 'Помолвлен(а)',
  MARRIED: 'В браке',
};

export function About({ profile }: { profile: GetUser }) {
  const { username, email, name, birthDate, gender, relationshipStatus, phoneNumber, bio, website, address } = profile;
  return (
    <div className="flex flex-col gap-4">
      <AboutItem field="Имя пользователя" value={username} Icon={AtSign} />
      <AboutItem field="Эл. почта" value={email} Icon={Mail} />
      <AboutItem field="Имя" value={name} Icon={Profile} />
      <AboutItem
        field="Дата рождения"
        value={birthDate !== null ? format(new Date(birthDate), 'd MMMM yyyy', { locale: ru }) : null}
        Icon={Calendar}
      />
      <AboutItem field="Пол" value={gender && genderLabels[gender]} Icon={Other} />
      <AboutItem
        field="Семейное положение"
        value={relationshipStatus && relationshipLabels[relationshipStatus]}
        Icon={Heart}
      />
      <AboutItem field="О себе" value={bio} Icon={Bullhorn} />
      <AboutItem field="Телефон" value={phoneNumber} Icon={Phone} />
      <AboutItem field="Сайт" value={website} Icon={WorldNet} />
      <AboutItem field="Адрес" value={address} Icon={BuildingBusinessOffice} />
    </div>
  );
}
