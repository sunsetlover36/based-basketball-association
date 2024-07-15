import {
  type ChangeEvent,
  forwardRef,
  type DetailedHTMLProps,
  type FC,
  type InputHTMLAttributes,
  type JSX,
} from 'react';
import { type FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  customProps?: {
    error?: FieldError;
    inputClassName?: string;
    imgPreview?: string | null;
    uploadLabel?: JSX.Element;
    numOnly?: boolean;
    minNum?: number;
    maxNum?: number;
  };
}
export const Input: FC<InputProps> = forwardRef((props, ref) => {
  const {
    customProps: {
      inputClassName,
      error,
      imgPreview,
      uploadLabel,
      numOnly,
      minNum,
      maxNum,
    } = {},
    ...restProps
  } = props;
  const { type, id, className, label } = restProps;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (numOnly) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');

      if (minNum && e.target.value !== '') {
        if (Number(e.target.value) < minNum) {
          e.target.value = minNum.toString();
        }
      }

      if (maxNum) {
        if (Number(e.target.value) > maxNum) {
          e.target.value = maxNum.toString();
        }
      }
    }

    restProps.onChange?.(e);
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={type === 'file' ? undefined : id}
          className={cn(type !== 'file' && 'cursor-pointer select-none')}
        >
          {label}
        </label>
      )}
      {imgPreview && (
        <div className="mb-2 border rounded-lg p-2 border-white">
          <img
            src={imgPreview}
            alt="Preview"
            className="max-w-[200px] max-h-[200px] object-cover mx-auto rounded-lg"
          />
        </div>
      )}

      <div>
        {type === 'file' && uploadLabel && (
          <label htmlFor={id} className="cursor-pointer select-none">
            {uploadLabel}
          </label>
        )}
        <input
          {...restProps}
          onChange={handleChange}
          ref={ref}
          className={cn(
            type !== 'file' &&
              'bg-[#ffffff] rounded-lg px-2 py-1 w-full outline-none',
            error && 'border-red-600',
            inputClassName
          )}
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
});
