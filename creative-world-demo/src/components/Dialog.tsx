import { useEffect, useId, useRef } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  variant?: 'case' | 'drawer';
  /** Element to return focus to when closing. */
  returnFocus?: HTMLElement | null;
  children: React.ReactNode;
  closeLabel?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: traps focus, closes on Esc / backdrop / close button,
 * and returns focus to the element that opened it.
 */
export default function Dialog({ open, onClose, title, variant = 'drawer', returnFocus, children, closeLabel = 'Close' }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = returnFocus ?? (document.activeElement as HTMLElement | null);
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('[data-autofocus]')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Return focus after the panel unmounts.
      requestAnimationFrame(() => {
        // Another dialog took over (e.g. Work list → case): leave focus there.
        if (document.querySelector('.dialog')) return;
        prev?.focus?.({ preventScroll: true });
      });
    };
  }, [open, returnFocus]);

  if (!open) return null;

  return (
    <div className={`dialog-root dialog-root--${variant}`}>
      <div className="dialog-backdrop" onClick={onClose} />
      <div
        className={`dialog dialog--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
      >
        <div className="dialog-head">
          <h2 id={titleId} className="dialog-title">
            {title}
          </h2>
          <button type="button" className="btn-ghost" onClick={onClose} data-autofocus>
            {closeLabel} <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
}
