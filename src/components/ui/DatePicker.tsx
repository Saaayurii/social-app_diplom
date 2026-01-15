import { RefCallback, useCallback, useRef } from 'react';
import { useDatePickerState } from 'react-stately';
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria';
import SvgCalendar from '@/svg_components/Calendar';
import { cn } from '@/lib/cn';
import SvgClose from '@/svg_components/Close';
import { Calendar } from './Calendar';
import { DateField } from './DateField';
import { Popover } from './Popover';
import { ButtonNaked } from './ButtonNaked';
import { DatePickerDialog } from './DatePickerDialog';
import Button from './Button';

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  /**
   * Expose the button trigger to the parent component using a `RefCallback`,
   * this is useful for programmatic focusing, e.g. allows `react-hook-form`
   * to focus the date picker when there is an input error.
   */
  triggerRef: RefCallback<HTMLButtonElement>;
}

export function DatePicker({ triggerRef, ...props }: DatePickerProps) {
  const state = useDatePickerState(props);
  const ref = useRef(null);
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps, errorMessageProps } =
    useDatePicker(props, state, ref);
  const isError = props.errorMessage !== undefined;

  const clear = useCallback(() => {
    // For clearing value: https://github.com/adobe/react-spectrum/issues/4986#issuecomment-1703337523
    state.setDateValue(null!);
  }, [state]);
  const assignRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef(node);
    },
    [triggerRef],
  );

  return (
    <>
      <div
        className={cn(
          'relative flex-col rounded-xl border border-border bg-background pb-2 pr-4 pt-7 text-left shadow-sm outline-none transition-all duration-200',
          'hover:border-muted-foreground/50',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          isError && 'border-destructive-foreground bg-destructive/30 focus-within:border-destructive-foreground focus-within:ring-destructive-foreground/20',
        )}>
        <span
          {...labelProps}
          className={cn(
            'absolute left-12 top-2 text-xs font-medium transition-colors duration-200',
            isError ? 'text-destructive-foreground' : 'text-muted-foreground',
          )}>
          {props.label}
        </span>

        <ButtonNaked {...buttonProps} ref={assignRef} className="absolute left-4 top-[50%] translate-y-[-50%]">
          <SvgCalendar className="h-5 w-5 stroke-muted-foreground transition-colors duration-200 hover:stroke-foreground" />
        </ButtonNaked>
        <div {...groupProps} ref={ref} className="group ml-12 flex">
          <div className="relative flex items-center rounded-lg border border-border bg-background/50 px-2 py-1 transition-colors group-focus-within:border-primary/50 group-hover:border-muted-foreground/50">
            <DateField {...fieldProps} />
          </div>
        </div>
        {state.isOpen && (
          <Popover triggerRef={ref} state={state} placement="bottom start">
            <DatePickerDialog {...dialogProps}>
              <Calendar {...calendarProps} />
            </DatePickerDialog>
          </Popover>
        )}
        <Button
          Icon={SvgClose}
          iconClassName="stroke-muted-foreground hover:stroke-foreground transition-colors"
          mode="ghost"
          size="small"
          onPress={clear}
          className={cn('absolute right-2 top-[50%] z-[1] hidden translate-y-[-50%]', state.value !== null && 'block')}
          aria-label="Clear"
        />
      </div>
      {isError && (
        <p className="mt-2 text-sm font-medium text-destructive-foreground" {...errorMessageProps}>
          {props.errorMessage as string}
        </p>
      )}
    </>
  );
}
