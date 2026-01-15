import type { AriaSelectProps } from '@react-types/select';
import { useSelectState } from 'react-stately';
import { useSelect, HiddenSelect, useButton } from 'react-aria';
import { ForwardedRef, SVGProps, forwardRef, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { useObjectRef } from '@react-aria/utils';
import SvgClose from '@/svg_components/Close';
import SvgArrowChevronDown from '@/svg_components/ArrowChevronDown';
import Button from './Button';
import { Popover } from './Popover';
import { ListBox } from './SelectListBox';

interface SelectProps<T> extends AriaSelectProps<T> {
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const Select = forwardRef(
  ({ Icon, ...props }: SelectProps<object>, forwardedRef: ForwardedRef<HTMLButtonElement>) => {
    // Create state based on the incoming props
    const state = useSelectState(props);

    // Get props for child elements from useSelect
    const ref = useObjectRef(forwardedRef);
    const { labelProps, triggerProps, valueProps, menuProps, errorMessageProps } = useSelect(props, state, ref);

    // Get props for the button based on the trigger props from useSelect
    const { buttonProps } = useButton(triggerProps, ref);
    const isThereASelectedValue = !!state.selectedItem;

    const { label, name, errorMessage } = props;
    const isError = errorMessage !== undefined;

    // For clearing value: https://github.com/adobe/react-spectrum/issues/4986#issuecomment-1703337523
    const clear = useCallback(() => state.setSelectedKey(null!), [state]);
    const open = useCallback(() => state.open(), [state]);

    return (
      <>
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-[50%] z-10 translate-y-[-50%]">
              <Icon
                className={cn(
                  'transition-colors duration-200',
                  isError ? 'stroke-destructive-foreground' : 'stroke-muted-foreground'
                )}
                width={20}
                height={20}
              />
            </div>
          )}

          <button
            {...labelProps}
            type="button"
            className={cn(
              'pointer-events-none absolute z-10 cursor-pointer text-muted-foreground transition-all duration-200',
              isThereASelectedValue ? 'top-2 translate-y-0 text-xs font-medium' : 'top-[50%] translate-y-[-50%] text-base font-normal',
              Icon ? 'left-12' : 'left-4',
              isError ? 'text-destructive-foreground' : 'text-muted-foreground',
              state.isOpen && 'text-primary',
            )}
            onClick={open}>
            {label}
          </button>
          <HiddenSelect state={state} triggerRef={ref} label={label} name={name} />
          <button
            {...buttonProps}
            type="button"
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-border bg-background px-4 pb-2 pt-7 text-left text-foreground shadow-sm outline-none transition-all duration-200',
              'hover:border-muted-foreground/50',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              Icon ? 'pl-12' : 'px-4',
              isError && 'border-destructive-foreground bg-destructive/30 focus:border-destructive-foreground focus:ring-destructive-foreground/20',
              state.isOpen && 'border-primary ring-2 ring-primary/20',
            )}>
            <span
              {...valueProps}
              // Visually hide the 'Select an option' text
              className={cn(!isThereASelectedValue && 'text-transparent')}>
              {isThereASelectedValue ? state.selectedItem.rendered : 'Select an option'}
            </span>
            <div className={cn(
              'absolute right-3 top-[50%] z-[1] translate-y-[-50%] p-2',
              isThereASelectedValue && 'hidden'
            )}>
              <SvgArrowChevronDown
                className={cn(
                  'h-5 w-5 stroke-muted-foreground transition-transform duration-200',
                  state.isOpen && 'rotate-180 stroke-primary'
                )}
              />
            </div>
          </button>
          {state.isOpen && (
            <Popover state={state} triggerRef={ref} placement="bottom start" className="min-w-[200px]">
              <ListBox {...menuProps} state={state} />
            </Popover>
          )}
          <div className={cn(
            'absolute right-2 top-[50%] z-[1] translate-y-[-50%]',
            !isThereASelectedValue && 'hidden'
          )}>
            <Button
              Icon={SvgClose}
              iconClassName="stroke-muted-foreground hover:stroke-foreground transition-colors"
              mode="ghost"
              size="small"
              onPress={clear}
              aria-label="Clear"
            />
          </div>
        </div>
        {isError && (
          <p className="mt-2 text-sm font-medium text-destructive-foreground" {...errorMessageProps}>
            {errorMessage as string}
          </p>
        )}
      </>
    );
  },
);

Select.displayName = 'Select';
