import { useRouter } from 'next/router'
import { BreadcrumbsProps } from './interface'
import Link from 'next/link'

export const BreadCrumbs = ({ crumbs }: BreadcrumbsProps) => {
  const router = useRouter()

  return (
    <div className="text-sm font-[500]">
      {crumbs.map((crumb, index) => (
        <span className="mx-1" key={index}>
          {index > 0 && <span className="mx-1">/</span>}
          {crumb.isLastChild ? (
            <span className="text-primary-blue-600 font-[600]">
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.path} legacyBehavior>
              <a className="no-underline text-neutral-gray-500">
                {crumb.label}
              </a>
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
