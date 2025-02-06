import { Carousel } from 'react-responsive-carousel'
import { ImageCarouselProps } from './interface'
import Image from 'next/image'

export const ImageCarousel = ({ images }: ImageCarouselProps) => {
  // console.log('IMAGES IN carousel', images)
  return (
    <Carousel
      showArrows
      showThumbs={false}
      showIndicators={true}
      showStatus={false}
      infiniteLoop
      autoPlay
    >
      {images.map((image) => (
        <div className="w-full h-[30rem] relative">
          <Image
            src={image}
            layout="fill"
            objectFit="contain"
            alt="Product image"
          />
        </div>
      ))}
    </Carousel>
  )
}
