import { Page } from '../Page/Page'
import { PageContent } from '../PageContent/PageContent'
import { PageHeader } from '../PageHeader/PageHeader'

export const PageCompound = Object.assign(Page, {
  Header: PageHeader,
  Content: PageContent,
})
