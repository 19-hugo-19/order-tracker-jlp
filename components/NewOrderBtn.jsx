import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./NewOrderBtn.module.css"
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"

export default function NewOrderBtn({ clickFct }) {
    return(
        <div className={styles.mainContainer} onClick={clickFct}>
            <FontAwesomeIcon icon={faCirclePlus}/>
            <h4>Nouvelle commande</h4>
        </div>
    )
}