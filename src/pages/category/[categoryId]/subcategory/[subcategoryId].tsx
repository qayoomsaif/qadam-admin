import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Loader from '../../../../components/loader/Loader';
import ProductCard from '../../../../components/ProductCard/ProductCard';
import { RootState } from '../../../../store';
import { AppPage } from '../../../../components/layout/AppPage'
import { getProductsBySubCategory } from '../../../../utils/services';
import { Constants } from '../../../../utils/Constants';
// import { CategoryI, Subcategory } from '../../interface';
interface CategoryI {
  _id: string;
  name: string;
  image_url: string;
  product_count: number;
  subcategory: Subcategory[];
}

interface Subcategory {
  _id: string;
  category_id: string;
  name: string;
  image_url: string;
  product_count: number;
}
const Category = () => {
  const router = useRouter();
  const { categoryId, subcategoryId } = router.query;
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [productsData, setProductsData] = useState<{ [key: string]: any }>({});
  const [selectedCategory, setSelectedCategory] = useState<CategoryI | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<Subcategory | null>(null);
  const [page, setPage] = useState(1);
  const nextPageRef = useRef(true);

  const handleTabClick = (tabId: string) => {
    setPage(1)
    setActiveTab(tabId);
  };

  useEffect(() => {
    if (selectedCategory && activeTab) {
      const activeSubCat = selectedCategory.subcategory.find((subCat: Subcategory) => subCat._id === activeTab);
      setActiveSubCategory(activeSubCat);
    }
  }, [activeTab]);

  useEffect(() => {
    if (categories.length > 0) {
      const selectedCategory = categories.find((category) => category._id === categoryId);
      if (selectedCategory) {
        setSelectedCategory(selectedCategory);
        setActiveTab(subcategoryId as string);
        setIsLoading(false);
      }
    }
  }, [categoryId, categories, subcategoryId]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setIsLoading(true);
  //     try {
  //       const data = { categoryId, subcategoryId: activeTab, page };
  //       const response = await getProductsBySubCategory(data);
  //       setProductsData((prev) => {
  //         if (page === 1) {
  //           return response.data;
  //         } else {
  //           return [...prev.data, ...response.data.data];
  //         }
  //       });
  //       nextPageRef.current = response.data.pagination.hasNext;
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //     finally {
  //       setIsLoading(false);
  //     }
  //   };
  
  //   if (categoryId && activeTab) {
  //     fetchProducts();
  //   }
  // }, [categoryId, activeTab, page]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = { categoryId, subcategoryId: activeTab, page, itemPerPage: Constants.general.itemPerPage };
        const response = await getProductsBySubCategory(data);
        setProductsData((prevProducts) => ({
          ...prevProducts,
          [activeTab]: page === 1 ? response.data : [...(prevProducts[activeTab]?.data ?? []), ...response.data.data]}));
        nextPageRef.current = response.data.pagination.hasNext;
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // if (categoryId && activeTab) {
    if (categoryId && activeTab && (!productsData[activeTab] && page === 1)) {
      fetchProducts();
    }
  }, [categoryId, activeTab, page]);

  useEffect(() => {
    console.log("sub category productsData: ", productsData);
  }, [productsData])

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop >=
  //         document.documentElement.offsetHeight - 80 &&
  //       nextPageRef.current
  //     ) {
  //       setPage((prevPage) => prevPage + 1);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  return (
          <AppPage
            crumbs={[
              {
                label: "Home",
                path: '/home',
                isLastChild: false
              },
              {
                label: selectedCategory ? selectedCategory.name : "loading...",
                path: `/category/${selectedCategory ? selectedCategory._id : "loading"}`,
                isLastChild: false
              },
              {
                label: activeSubCategory ? activeSubCategory.name : "loading",
                path: '',
                isLastChild: true
              }
            ]}>
          {selectedCategory && (
            <div className="mt-20 mb-4 border-b overflow-x-auto">
              <ul className="overflow-x-auto flex flex-nowrap text-sm font-medium text-center whitespace-nowrap mb-1" id="default-styled-tab" role="tablist">
                {selectedCategory.subcategory
                  // .filter((subcategory: any) => subcategory.product_count > 0)
                  .map((subcategory: any) => (
                    <li className="me-2" key={subcategory._id} role="presentation">
                      <button
                        className={`font-[600] text-lg inline-block p-4 rounded-t-lg ${
                          activeTab === subcategory._id ? 'text-[#ffffff] bg-accent-orange-500 hover:bg-accent-orange-600' : 'hover:text-accent-orange-500'
                        }`}
                        onClick={() => handleTabClick(subcategory._id)}
                        type="button"
                        role="tab"
                        aria-controls={`styled-${subcategory._id}`}
                        aria-selected={activeTab === subcategory._id}
                      >
                        {subcategory.name}
                      </button>

                    </li>
                  ))}
              </ul>

              <div id="default-styled-tab-content mt-1">
                {selectedCategory.subcategory.map((subcategory: any) => (
                  <div key={subcategory._id} id={`styled-${subcategory._id}`} role="tabpanel" aria-labelledby={`${subcategory._id}-tab`}
                    className={`p-4 rounded-lg bg-gray-50 ${activeTab === subcategory._id ? '' : 'hidden'}`}>
                    
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {subcategory.product_count === 0 ? <h6>No products available for {subcategory.name}</h6> : <ProductCard productData={productsData.data}/>}
                      </div>
                      {/* <ProductCard /> */}
                      {isLoading && subcategory.product_count > 0 && (
                        <div className='flex justify-center'>
                          <Loader />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </AppPage>
  );
};

export default Category;
