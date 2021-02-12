import styles from './Item.module.css'

interface ItemProps{
    name:string;
    type:string;
    size:number;
}
const Item: React.FC<ItemProps> = (props)=> {

    return(
        <>
        <div className={styles.item}>
            <div>
              <h3>{props.name}</h3>
              <p>{props.size}</p>
            </div>
            <img className={styles.image} src="/images/bin.png" width={25} height={25} alt="bin"/>
          </div>
        </>
    )
}
export default Item