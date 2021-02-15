import styles from './Item.module.css'

interface ItemProps{
    name:string;
    type:string;
    size:string;
    delete:(filename:string)=>void;
}
const Item: React.FC<ItemProps> = (props)=> {
  const handleClick=()=>{
    props.delete(props.name);
  }
    return(
        <>
        <div className={styles.item}>
            <div>
              <h3>{props.name}</h3>
              <p>{props.size}</p>
            </div>
            <button onClick={handleClick}>
              <img className={styles.image}  src="/images/bin.png" width={25} height={25} alt="bin"/>
            </button>
            
          </div>
        </>
    )
}
export default Item
