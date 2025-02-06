// HorizontalProductList.tsx
import React from 'react'
import { useState, useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import ProductCard from '../ProductCard'
import axios from '../../utils/axios'
import styles from './HorizontalProductList.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

const HorizontalProductList = () => {
  const [products, setProducts] = useState([])
  const itemsPerSlide = 2

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const productinfo = []
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const productData = response.data.data.data
        productData.map((product) => {
          productinfo.push({
            productId: product._id,
            name: product.name,
            image: product.image_url,
          })
        })
        // console.log(productinfo)
        setProducts(productinfo)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    token != null ? fetchData() : ''
  }, [])

  const renderSlides = () => {
    const slides = []
    for (let i = 0; i < products.length; i += itemsPerSlide) {
      const slideProducts = products.slice(i, i + itemsPerSlide)
      slides.push(
        <div key={`slide-${i}`} className={styles.slide}>
          {slideProducts.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      )
    }
    return slides
  }

  return (
    <div className={styles.carouselWrapper}>
      <Carousel
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        axis="horizontal"
        infiniteLoop
        className={styles['carousel']}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className={`${styles['control-arrow']} ${styles['control-prev']}`}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className={`${styles['control-arrow']} ${styles['control-next']}`}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )
        }
      >
        {renderSlides()}
      </Carousel>
    </div>
  )
}

export default HorizontalProductList
