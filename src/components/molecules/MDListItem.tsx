import type { ReactNode } from 'react'

interface MDListItemProps {
  children: ReactNode
}

export const MDListItem = ({ children }: MDListItemProps) => {
  return (
    <div className="py-2 px-3 bg-slate-900/40 rounded-md mb-1.5 text-sm text-slate-300">
      {children}
    </div>
  )
}
