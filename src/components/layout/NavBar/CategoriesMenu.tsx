// import { MenuButton, Menu, MenuItem, MenuList, Button } from '@chakra-ui/react'
// import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
// import { CategoriesMenuProps } from './interface'
// import { useMemo, useState } from 'react'
// import { ICategory } from '../../../lib/schema/categories'
// import classNames from 'classnames'
// import { useRouter } from 'next/router'

// export const CategoriesMenu = ({ categories }: CategoriesMenuProps) => {
//   const router = useRouter()

//   const [activeCategory, setActiveCategory] = useState<ICategory | null>()
//   const subCategoryItems = useMemo(() => {
//     if (activeCategory) {
//       return activeCategory.subcategory
//     }
//   }, [activeCategory])
//   return (
//     <Menu  >
//       <MenuButton
//         background="transparent"
//         fontSize="1rem"
//         size="sm"
//         as={Button}
//         marginLeft="2rem"
//         rightIcon={<ChevronDownIcon />}
//       >
//         Categories
//       </MenuButton>
//       <MenuList width="18rem" position="relative" onMouseLeave={() => setActiveCategory(null)}>
//         {categories?.map((category) => {
//           const categoryClasses = classNames(
//             'py-1 px-4 flex justify-between cursor-pointer hover:bg-slate-200',
//             {'bg-slate-200': activeCategory?._id === category._id})
//           return (
//             <div className={categoryClasses} onClick={() => router.push(`/category/${category._id}`)} onMouseEnter={() => setActiveCategory(category)}
//             // onMouseLeave={() => setActiveCategory(null)}
//               onChange={(e) => {e.preventDefault()}}>
//               {category.name}
//               <ChevronRightIcon />
//             </div>
//           )
//         })}
//         {activeCategory && (
//           <MenuList width="18rem" height="100%" position="absolute" top={0} right="-18rem">
//             {subCategoryItems?.map((category) => {
//               return (
//                 <div className="py-1 px-4 flex justify-between hover:bg-slate-200 cursor-pointer"
//                   onClick={() => {
//                     // isOpen
//                     router.push(`/category/${category.category_id}/subcategory/${category._id}`)
//                   }} >
//                   {category.name}
//                 </div>
//               )
//             })}
//           </MenuList>
//         )}
//       </MenuList>
//     </Menu>
//   )
// }

import { MenuButton, Menu, MenuItem, MenuList, Button } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { CategoriesMenuProps } from './interface'
import { useMemo, useState } from 'react'
import { ICategory } from '../../../lib/schema/categories'
import classNames from 'classnames'
import { useRouter } from 'next/router'

export const CategoriesMenu = ({ categories }: CategoriesMenuProps) => {
  const router = useRouter()

  const [activeCategory, setActiveCategory] = useState<ICategory | null>()
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add state for menu open/close

  const handleCategoryClick = () => {
    setIsMenuOpen(false);
  };

  const handleSubcategoryClick = () => {
    setIsMenuOpen(false); // Close the menu when a subcategory is clicked
  };

  const subCategoryItems = useMemo(() => {
    if (activeCategory) {
      return activeCategory.subcategory
    }
  }, [activeCategory])

  return (
    <Menu isOpen={isMenuOpen} >
      <MenuButton
        background="transparent"
        fontSize="1rem"
        size="sm"
        as={Button}
        marginLeft="2rem"
        rightIcon={<ChevronDownIcon />}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Categories
      </MenuButton>
      <MenuList width="18rem" position="relative" onMouseLeave={() => setActiveCategory(null)}>
        {categories?.map((category, i) => {
          const categoryClasses = classNames(
            'py-1 px-4 flex justify-between cursor-pointer hover:bg-slate-200',
            {'bg-slate-200': activeCategory?._id === category._id})
          return (
            <div key={i} className={categoryClasses} 
              onMouseEnter={() => setActiveCategory(category)}
              onClick={() => {
                setIsMenuOpen(false);
                router.push(`/category/${category._id}`)
              }}
              onChange={(e) => {e.preventDefault()}}>
                {category.name}
                <ChevronRightIcon />
            </div>
          )
        })}
        {activeCategory && (
          <MenuList width="18rem" height="100%" position="absolute" top={0} right="-18rem">
            {subCategoryItems?.map((category) => {
              return (
                <div className="py-1 px-4 flex justify-between hover:bg-slate-200 cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // router.push(`/category/${category.category_id}/subcategory/${category._id}`)
                    router.push(`/category/${category.category_id}?subcategory=${category._id}`)
                  }} >
                  {category.name}
                </div>
              )
            })}
          </MenuList>
        )}
      </MenuList>
    </Menu>
  )
}
