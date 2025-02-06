import React, { useEffect, useState } from 'react'
import Slider, { Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import ProductCard from '../ProductCard'
import styles from './CategorySlider.module.scss'
import axios from '../../utils/axios'
import Category from '../Category'

const CategorySlider = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const categoriesData = response.data.data
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    token != null ? fetchData() : ''
  }, [])

  const [sliderSettings, setSliderSettings] = useState<Settings>({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  })

  return (
    <div className={styles.container}>
      <Slider
        {...sliderSettings}
        prevArrow={<button className={`prev-arrow ${styles.customArrow}`} />}
        nextArrow={<button className={`next-arrow ${styles.customArrow}`} />}
      >
        {categories.map((category, index) => (
          <div key={`${category.id}-${index}`} className="mx-4">
            <Category
              key={category.id}
              categoryId={category._id}
              categoryName={category.name}
              image={
                'https://qadam-images.s3.us-east-1.amazonaws.com/1703708551546.png'
              }
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default CategorySlider
