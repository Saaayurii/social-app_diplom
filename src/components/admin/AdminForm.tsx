'use client';

import { useForm, FieldValues, Path, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { TextInput } from '@/components/ui/TextInput';
import { Textarea } from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'switch' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

interface AdminFormProps<T extends FieldValues> {
  fields: FormField<T>[];
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  submitLabel?: string;
  backPath: string;
  title: string;
}

export function AdminForm<T extends FieldValues>({
  fields,
  schema,
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
  backPath,
  title,
}: AdminFormProps<T>) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      router.push(backPath);
      router.refresh();
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  const renderField = (field: FormField<T>) => {
    const error = errors[field.name]?.message as string | undefined;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <TextInput
                label={field.label}
                type={field.type}
                value={controllerField.value ?? ''}
                onChange={(val) => {
                  if (field.type === 'number') {
                    controllerField.onChange(val ? Number(val) : '');
                  } else {
                    controllerField.onChange(val);
                  }
                }}
                errorMessage={error}
                isDisabled={field.disabled}
                placeholder={field.placeholder}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Textarea
                label={field.label}
                value={controllerField.value ?? ''}
                onChange={controllerField.onChange}
                errorMessage={error}
                isDisabled={field.disabled}
                placeholder={field.placeholder}
              />
            )}
          />
        );

      case 'select':
        return (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <select
              {...register(field.name)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              disabled={field.disabled}
            >
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <input
              type="datetime-local"
              {...register(field.name)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              disabled={field.disabled}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register(field.name)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              disabled={field.disabled}
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="grid gap-6">
            {fields.map((field) => (
              <div key={field.name}>
                {renderField(field)}
                {field.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {field.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" mode="ghost" onPress={() => router.push(backPath)}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
