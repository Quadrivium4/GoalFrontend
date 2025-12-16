import { MdArrowBackIos } from "react-icons/md"
import styles from "./PageHeader.module.css"
import { Link } from "react-router-dom"

export const PageHeader = ({title, action, goBack}: {title: String, action: React.JSX.Element, goBack?: () => void}) =>{


   return <div className={styles.header}>
        <div className={styles.content}>
            <div className={styles.back}>
                {goBack && <MdArrowBackIos size={24} onClick={goBack}/>}
            </div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.action}>
                {action}
            </div>
        </div>
          
          <div className={styles.borderBottom}></div>
    </div>
}