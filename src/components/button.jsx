import { cn } from '@/lib/utils';

export const Button = ({
  variant = 'primary',
  children,
  className,
  disabled,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'text-base md:text-lg focus:outline-none',
        variant === 'primary' &&
          'border-2 border-blue-600 text-blue-600 px-4 py-1 hover:bg-blue-600 hover:text-white',
        variant === 'muted' &&
          'inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover:bg-gray-300 focus:outline-none',
        variant === 'ghost' &&
          'border-none hover:bg-transparent hover:text-blue-600 underline',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};
