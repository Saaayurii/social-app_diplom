import { ErrorPage } from '@/components/ErrorPage';
import { ErrorSearch } from '@/svg_components';

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Страница не найдена"
      description="Страница, которую вы ищете, не существует или была перемещена."
      icon={<ErrorSearch className="h-24 w-24 stroke-primary" />}
    />
  );
}
