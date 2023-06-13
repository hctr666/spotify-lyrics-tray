import { PropsWithChildren } from 'react'
import classNames from 'classnames'

interface PageContentProps {
  noHeader?: boolean
  noPaddingX?: boolean
}

export const PageContent = ({
  noHeader = false,
  noPaddingX = false,
  children,
}: PropsWithChildren<PageContentProps>) => {
  const classes = classNames('page-content', {
    'page-content--no-header': noHeader,
    'px-0': noPaddingX,
  })
  return <div className={classes}>{children}</div>
}
