export interface BreadcrumbsProps {
  crumbs: {
    label: string
    path: string
    isLastChild: boolean
  }[]
}
