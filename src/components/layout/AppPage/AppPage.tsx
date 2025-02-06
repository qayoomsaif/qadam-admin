import { Footer } from '../../Footer'
import { BreadCrumbs } from '../Breadcrumbs'
import { NavBar } from '../NavBar'
import { AppPageProps } from './interface'

export const AppPage = ({ children, crumbs }: AppPageProps) => {
  return (
    <>
      <div className="w-full max-w-[1280px] mx-auto px-8 py-6">
        {crumbs && <BreadCrumbs crumbs={crumbs} />}
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-8 pb-8">{children}</div>
    </>
  )
}
