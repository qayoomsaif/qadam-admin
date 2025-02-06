import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import styles from './ImageCarousel.module.scss'
import Image from 'next/image'
import { IoChevronForwardOutline, IoChevronBackOutline } from 'react-icons/io5'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

interface ImageCarouselProp {
  images: string[]
}

const ImageCarousel: React.FC<ImageCarouselProp> = ({ images }) => {
  return (
    <Carousel
      showThumbs={false}
      showIndicators={true}
      showStatus={false}
      infiniteLoop
      autoPlay
      className="relative"
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            className="absolute left-[1rem] top-[40%] rounded-full bg-gray-500/50 p-4 z-10"
          >
            <IoChevronBackOutline color="white" fontSize="2rem" />
          </button>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            className="absolute right-[1rem] top-[40%] rounded-full bg-gray-500/50 p-4"
          >
            <IoChevronForwardOutline color="white" fontSize="2rem" />
          </button>
        )
      }
    >
      {images?.map((image, index) => (
        // <div key={index}>
        <Image
          src={image}
          alt={`Carousel Image ${index + 1}`}
          width={200}
          height={100}
          objectFit="cover"
        />
        // </div>
      ))}
    </Carousel>
  )
}

export default ImageCarousel
