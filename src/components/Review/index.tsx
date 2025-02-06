import React from 'react';
import Image from 'next/image';
import styles from './review.module.scss';
import WomenShoes from '../../assets/WomenShoes.jpeg';
import Star from '../../assets/StarHalf.svg';

const Review = () => {
    return (
        <>
            <h1 className={styles["heading"]}>Product Reviews</h1>
            <div className={styles['container']}>
            <h1 className={styles["name"]}>Ali Ahmed</h1>
            <span className={styles.rating}>
            <Image src={Star} alt="Star Icon"/>
            <span>{4.1}</span>
            </span>
            <p className={styles['review']}>Lorem ipsum dolor sit amet consectetur. Varius accumsan volutpat phasellus et leo nibh malesuada in.</p>
            <Image src={WomenShoes} alt={'Women shoes'} className={styles.productImage}/>
            </div >
        </>
    )
}

export default Review;