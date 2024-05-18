import React, { useEffect, useRef } from 'react';
import { useClickAway } from 'react-use';

import { cn } from '@/lib/utils';
import { Button } from './button';

export const Modal = ({
  showModal,
  setShowModal,
  title,
  children,
  className,
  fixedButton = false,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [setShowModal]);

  useClickAway(ref, () => setShowModal(false));

  if (!showModal) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className={cn(
            'inline-block align-bottom bg-white rounded-lg text-left overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-h-[800px] relative',
            className
          )}
          ref={ref}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              'flex justify-end items-center mx-4 mb-4',
              fixedButton && 'sticky bottom-4 right-4'
            )}
          >
            <Button variant="muted" onClick={() => setShowModal(false)}>
              Close [Esc]
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
