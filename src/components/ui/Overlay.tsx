'use client';

import { useEffect, useRef } from 'react';
import { cn } from './cn';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Shared behavior: scroll-lock, Esc-to-close, focus trap, restore focus. */
function useOverlay(open: boolean, onClose: () => void, panelRef: React.RefObject<HTMLDivElement | null>) {
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Move focus into the panel.
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      lastFocused.current?.focus?.();
    };
  }, [open, onClose, panelRef]);
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  className?: string;
}

export function Drawer({ open, onClose, title, children, side = 'right', className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, panelRef);

  return (
    <div
      aria-hidden={!open}
      className={cn('fixed inset-0 z-[80]', !open && 'pointer-events-none')}
    >
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'absolute top-0 h-full w-full max-w-[420px] bg-ink-850 shadow-soft outline-none',
          'flex flex-col transition-transform duration-300 ease-luxe',
          side === 'right' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
          'border-l border-[var(--line)]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, panelRef);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-[80] flex items-center justify-center p-4',
        !open && 'pointer-events-none',
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-ink-850 shadow-soft outline-none',
          'border border-[var(--line)] rounded-lg transition-all duration-300 ease-luxe',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
