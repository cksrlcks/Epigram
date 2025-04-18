'use client';

import {
  ButtonHTMLAttributes,
  createContext,
  Dispatch,
  HTMLAttributes,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import { focusTrapWithArrow } from '@/utils/focusTrap';
import { cn } from '@/utils/helper';

const DropdownStateContext = createContext<{
  isOpen: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
} | null>(null);
const DropdownDispatchContext = createContext<{
  setIsOpen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

function useDropdownState() {
  const context = useContext(DropdownStateContext);
  if (!context) {
    throw new Error('드롭다운 컨텍스트는 드롭다운 컨텍스트 프로바이더 내부에서 사용해주세요');
  }
  return context;
}

function useDropdownDispatch() {
  const context = useContext(DropdownDispatchContext);
  if (!context) {
    throw new Error('드롭다운 컨텍스트는 드롭다운 컨텍스트 프로바이더 내부에서 사용해주세요');
  }
  return context;
}

export function Dropdown({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentDropdown = dropdownRef.current;
    if (!currentDropdown) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    currentDropdown.addEventListener('keydown', handleKeyDown);

    return () => {
      currentDropdown.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <DropdownStateContext.Provider value={{ isOpen, dropdownRef }}>
      <DropdownDispatchContext.Provider value={{ setIsOpen }}>
        <div ref={dropdownRef} {...props}>
          {children}
        </div>
      </DropdownDispatchContext.Provider>
    </DropdownStateContext.Provider>
  );
}

export function DropdownTrigger({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const { isOpen } = useDropdownState();
  const { setIsOpen } = useDropdownDispatch();

  return (
    <button
      type='button'
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      aria-haspopup='true'
      className={cn('group cursor-pointer leading-none', className)}
      data-dropdown-trigger
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenu({
  children,
  className,
  direction = 'vertical',
  ...props
}: PropsWithChildren<HTMLMotionProps<'ul'> & { direction?: 'vertical' | 'horizontal' }>) {
  const { isOpen, dropdownRef } = useDropdownState();
  const menuRef = useRef<HTMLUListElement>(null);

  const focusFirstElement = () => {
    if (menuRef.current && isOpen) {
      const focusable = menuRef.current.querySelector<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
  };

  const focusTrigger = () => {
    dropdownRef.current?.querySelector<HTMLButtonElement>('[data-dropdown-trigger]')?.focus();
  };

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const menu = menuRef.current;

    menu.addEventListener('keydown', (e) => focusTrapWithArrow(e, direction));
    return () => {
      menu.removeEventListener('keydown', (e) => focusTrapWithArrow(e, direction));
    };
  }, [isOpen, direction]);

  return (
    <AnimatePresence onExitComplete={focusTrigger}>
      {isOpen && (
        <motion.ul
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.1 }}
          className={className}
          role='menu'
          onAnimationStart={focusFirstElement}
          {...props}
        >
          {children}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}

export function DropdownItem({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLLIElement>>) {
  const { setIsOpen } = useDropdownDispatch();

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <li onClick={handleClick} role='menuitem' {...props}>
      {children}
    </li>
  );
}
