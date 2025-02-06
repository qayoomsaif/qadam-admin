import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import carousel1 from '@/assets/carousel1.svg'

const HeroCarousel = () => {
  return (
    <Carousel showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop autoPlay>
      <div>
        <img src='@/assets/carousel1.svg' alt="Hero Image 1" />
        <p className="legend">Caption for Image 1</p>
      </div>
      <div>
        <img src="/hero-image2.jpg" alt="Hero Image 2" />
        <p className="legend">Caption for Image 2</p>
      </div>
      <div>
        <img src="/hero-image3.jpg" alt="Hero Image 3" />
        <p className="legend">Caption for Image 3</p>
      </div>
    </Carousel>
  );
};

export default HeroCarousel;
