import { ReactNode } from 'react'

interface UITablePanelProps {
  children: ReactNode
  columns?: 1 | 2 | 3
}

export const UITablePanel = ({ children, columns = 2 }: UITablePanelProps) => {
  const gridClass = columns === 1 ? 'grid-cols-1' : columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'

  return (
    <div className={`grid ${gridClass} gap-3 mt-4 mb-4`}>
      {children}
    </div>
  )
}
