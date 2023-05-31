import { PropsWithChildren } from 'react'

export const PageHeader = ({ children }: PropsWithChildren) => {
  return <div className='page-header'>{children}</div>
}
