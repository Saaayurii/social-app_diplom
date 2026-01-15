import { cn } from '@/lib/cn';
import { resizeTextAreaHeight } from '@/lib/resizeTextAreaHeight';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { FormEvent, SVGProps, forwardRef, useCallback } from 'react';
import { AriaTextFieldProps, useTextField } from 'react-aria';
import SvgClose from '@/svg_components/Close';
import Button from './Button';

interface TextareaProps extends AriaTextFieldProps {
  className?: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, Icon, ...props }, forwardedRef) => {
    // Support forwarded refs: https://github.com/adobe/react-spectrum/pull/2293#discussion_r714337674
    const ref = useObjectRef(forwardedRef);
    const { labelProps, inputProps, errorMessageProps } = useTextField({ inputElementType: 'textarea', ...props }, ref);
    const { errorMessage, label } = props;
    const isError = errorMessage !== undefined;

    const clear = useCallback(() => {
      // Set the input value to an empty string and resize the textarea
      if (ref.current) {
        ref.current.value = '';
        resizeTextAreaHeight(ref.current);
      }
      // If `onChange` is provided, invoke it with an empty string
      if (props.onChange) {
        props.onChange('');
      }
    }, [props, ref]);

    return (
      <>
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-7 z-10">
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
          <textarea
            {...mergeProps(inputProps, {
              onInput: (e: FormEvent<HTMLTextAreaElement>) => {
                const textarea = e.target as HTMLTextAreaElement;
                resizeTextAreaHeight(textarea);
              },
              rows: 1,
              placeholder: ' ',
            })}
            ref={ref}
            className={cn(
              'peer block w-full resize-none overflow-hidden rounded-xl border border-border bg-background px-4 pb-3 pt-7 text-foreground shadow-sm outline-none transition-all duration-200',
              'hover:border-muted-foreground/50',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              Icon ? 'pl-12' : 'px-4',
              isError && 'border-destructive-foreground bg-destructive/30 focus:border-destructive-foreground focus:ring-destructive-foreground/20',
              className,
            )}
            rows={1}
            placeholder=" "
          />
          <label
            className={cn(
              'pointer-events-none absolute z-0 origin-left translate-y-0 cursor-text text-xs font-medium transition-all duration-200',
              'peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal',
              'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium',
              'top-2',
              Icon ? 'left-12' : 'left-4',
              isError ? 'text-destructive-foreground' : 'text-muted-foreground peer-focus:text-primary',
            )}
            {...labelProps}>
            {label}
          </label>
          <Button
            Icon={SvgClose}
            iconClassName="stroke-muted-foreground hover:stroke-foreground transition-colors"
            mode="ghost"
            size="small"
            onPress={clear}
            className="absolute right-2 top-6 z-[1] block opacity-0 transition-opacity peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100"
            aria-label="Clear"
          />
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

Textarea.displayName = 'Textarea';
