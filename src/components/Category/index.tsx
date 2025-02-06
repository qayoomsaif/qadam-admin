import React from 'react'
import Image from 'next/image'

import styles from './Category.module.scss'
import { useRouter } from 'next/router'

interface CategoryProps {
  categoryId: string
  image: string
  categoryName: string
}

const Category: React.FC<CategoryProps> = ({
  categoryId,
  image,
  categoryName,
}) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`./category/653d0a8bb21cdd2e23bf13fc`)
  }

  return (
    <div className="h-[20rem]" onClick={handleClick}>
      <div className="w-[10rem]">
        <Image
          src={image}
          alt={categoryName}
          width={500}
          height={200}
          className="w-[20rem] h-[5rem]"
        />
      </div>
      <h1 className={styles.name}>{categoryName}</h1>
    </div>
  )
}

export default Category
