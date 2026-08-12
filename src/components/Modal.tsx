import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <p className="text-lg font-semibold text-stone-900">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Close
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
        {footer ? <div className="border-t border-stone-200 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  )
}
