'use client';

import { DropdownMenuButton } from '@/components/ui/DropdownMenuButton';
import { HamburgerMenu } from '@/svg_components';
import { useRouter } from 'next/navigation';
import { Key, useCallback } from 'react';
import { Item, Section } from 'react-stately';

export function HomeMobileDropdownMenu() {
  const router = useRouter();
  const onAction = useCallback((key: Key) => router.push(key as string), [router]);
  return (
    <DropdownMenuButton key="home-dropdown-menu" label="Меню" onAction={onAction} Icon={HamburgerMenu}>
      <Section>
        <Item key="/terms">Условия</Item>
        <Item key="/privacy-policy">Конфиденциальность</Item>
        <Item key="/login">Войти</Item>
        <Item key="/register">Регистрация</Item>
      </Section>
    </DropdownMenuButton>
  );
}
