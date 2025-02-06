import styles from './BuyingOptionsCard.module.scss'

interface BuyingOptionsCardProps{
    setCurrentOffer: any,
    productOffer: any;
  }

const BuyingOptionsCard:React.FC<BuyingOptionsCardProps> = ({setCurrentOffer, productOffer}) => {
    return (
        <div>
            
                <div className={styles.container} onClick={()=>{setCurrentOffer(productOffer)}}>
                    <div className={styles.details}>
                        <p>Women Shoes High Quality</p>
                        <p className={styles.seller}>{productOffer.vendor.name}</p>
                        <p className={styles.seller}>{productOffer.totalScore}</p>
                    </div>
                    <div className={styles.price}>
                        <p>Price: {productOffer.price}</p>
                    </div>
                </div>
        </div>
    )
}

export default BuyingOptionsCard