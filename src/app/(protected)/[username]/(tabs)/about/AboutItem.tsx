import { SVGProps } from 'react';

export function AboutItem({
  field,
  value,
  Icon,
}: {
  field: string;
  value: string | null;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-2 bg-secondary/50 p-2 sm:gap-3 sm:p-3">
        <Icon className="h-5 w-5 stroke-muted-foreground sm:h-5 sm:w-5" />
        <p className="text-sm font-medium text-muted-foreground sm:text-base">{field}</p>
      </div>
      <p className="flex flex-1 items-center self-stretch bg-background px-4">
        <span className="font-medium text-foreground sm:text-base">{value || 'Не указано'}</span>
      </p>
    </div>
  );
}
