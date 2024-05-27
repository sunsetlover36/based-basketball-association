import { cn } from '@/lib/utils';

export const Button = ({
  variant = 'primary',
  size = 'md',
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
        'text-base md:text-lg focus:outline-none rounded-md',
        variant === 'primary' &&
          'border-2 border-blue-600 text-blue-600 px-4 py-1 hover:bg-blue-600 hover:text-white',
        variant === 'muted' &&
          'inline-flex justify-center border-2 border-gray-300 shadow-sm px-4 py-1 bg-white text-base text-gray-700 hover:bg-gray-300 focus:outline-none',
        variant === 'ghost' &&
          'border-none hover:bg-transparent hover:text-blue-600 underline',
        disabled && 'opacity-50 cursor-not-allowed',
        size === 'sm' && 'text-sm md:text-base px-3 py-1',
        className
      )}
    >
      {children}
    </button>
  );
};
