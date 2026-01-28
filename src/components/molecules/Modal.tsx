import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../atoms'
import { cn } from '../../utils/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'half'
  children: ReactNode
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  zIndex?: number
}

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  zIndex = 50,
}: ModalProps) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-6xl',
    half: 'w-[50vw] max-w-none',
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose()
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" />

      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-slate-900/40 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 animate-scaleIn',
          size === 'half' ? sizes[size] : `w-full ${sizes[size]}`
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
                aria-label="Close modal"
              >
                <Icon name="close" size="md" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default Modal
