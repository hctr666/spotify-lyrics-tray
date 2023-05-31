import { PropsWithChildren } from 'react'

export const PageContent = ({
  noHeader = false,
  children,
}: PropsWithChildren<{ noHeader?: boolean }>) => {
  return (
    <div
      className={`page-content${noHeader ? ' page-content--no-header' : ''}`}
    >
      {children}
    </div>
  )
}
