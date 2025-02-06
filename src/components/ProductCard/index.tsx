import React from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.scss';
import Star from '../../assets/StarHalf.svg';
import Share from '../../assets/ShareFat.svg';
import Favourite from '../../assets/favourite.svg';
import { useRouter } from 'next/router';
import { Carousel } from 'react-responsive-carousel';

interface Product{
  productId: string
  name: string;
  image: string[],
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { productId, name, image } = product;
  const router = useRouter();
  const handleClick = () => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className={styles.productCard}>

      <div className={styles.productImageContainer}>
        <div className={styles.favoriteIcon}>
          <Image src={Favourite} alt="Favorite Icon" width={16} height={16}/>
        </div>
        {/* <img src={image[0]} alt={name} className={styles.productImage}/> */}

        <Carousel
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        showArrows={false}
        infiniteLoop
      >
        {image?.map((image, index) => (
          <div key={index}>
            <Image src={image} alt={`Carousel Image ${index + 1}`} width={450} height={450} />
          </div>
        ))}
      </Carousel>
      </div>

      <div className={styles.productInfo}  onClick={handleClick}>
        <h1 className={styles.heading}>{name}</h1>
        {/* <span className={styles.rating}>
            <Image src={Star} alt="Star Icon"/>
            <span>{product.rating}</span>
        </span> */}

        {/* <h1 className={styles['small-heading']}>starting from</h1>
        <span className={styles.price}>
            <p>${price.toFixed(2)}</p>
            <Image src={Share} alt="Share Icon"/>
        </span> */}
          <span className={styles.price}>
            <Image src={Share} alt="Share Icon"/>
        </span>

      </div>
    </div>
  );
};

export default ProductCard;
