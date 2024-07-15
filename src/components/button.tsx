import { type ReactNode, type FC, useState, MouseEventHandler } from 'react';

import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'muted' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  return (
    <button
      {...props}
      disabled={disabled}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => {
        setIsMouseDown(false);
        if (onMouseLeave) {
          onMouseLeave();
        }
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={cn(
        'text-base md:text-lg focus:outline-none rounded-md shadow-sm shadow-gray-600 transition-all duration-100',
        isMouseDown ? 'translate-y-0.5' : 'translate-y-0',
        variant === 'primary' &&
          'bg-white text-black px-4 py-1 hover:bg-gray-300',
        variant === 'muted' &&
          'inline-flex justify-center border-2 border-gray-300 shadow-sm px-4 py-1 bg-white text-base text-gray-700 hover:bg-gray-300 focus:outline-none',
        variant === 'ghost' &&
          'border-none hover:bg-gray-200 hover:text-blue-600 px-4 py-1',
        variant === 'error' &&
          'bg-red-700 text-white px-4 py-1 hover:bg-red-600',
        disabled && 'opacity-50 cursor-not-allowed',
        size === 'sm' && 'text-sm md:text-base px-3 py-1',
        size === 'lg' && 'text-lg md:text-xl px-6 py-2',
        className
      )}
    >
      {children}
    </button>
  );
};
