import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';

interface PermissionModalProps {
  isOpen: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

type ConfirmOptions = Pick<
  PermissionModalProps,
  'title' | 'description' | 'confirmText' | 'cancelText'
>;

type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

// ----------------------------------------------------
// The modal
// ----------------------------------------------------
const PermissionModal = ({
  isOpen,
  title = 'Permission Required',
  description = 'Do you want to proceed with this action?',
  confirmText = 'Accept',
  cancelText = 'Decline',
  onConfirm,
  onCancel,
}: PermissionModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = original;
    };
  }, [isOpen, onCancel]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden transition-all transform scale-100"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <div className="text-gray-600 mb-8">{description}</div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ----------------------------------------------------
// Global confirm system
// ----------------------------------------------------
const ConfirmContext = createContext<ConfirmFn | null>(null);

interface InternalState extends ConfirmOptions {
  isOpen: boolean;
}

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<InternalState>({ isOpen: false });
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((options = {}) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setState({ isOpen: true, ...options });
    });
  }, []);

  const settle = useCallback((result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <PermissionModal
        isOpen={state.isOpen}
        title={state.title}
        description={state.description}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  );
};

// ----------------------------------------------------
// Hook
// ----------------------------------------------------
export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a <ConfirmProvider>');
  }
  return ctx;
};

export default PermissionModal;