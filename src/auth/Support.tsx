import { useEffect } from "react"
import { Link } from "react-router-dom";
import styles from "./Support.module.css"
const Support = () => {

    return (
        <>
       
        <div className={styles.page}>
            <div className={styles.content}>
            <h1>Support</h1>
            <p>For information about data and privacy, checkout our <Link to={"/privacy-policy"}>Privacy Policy</Link>.</p>
            <p>If you have any doubts about the rules you should follow when using Our Services checkout our <Link to={"/terms-of-service"}>Terms of Service</Link>. </p>
            <p>For any questions, suggestions or additional information, please contact us at: <b>support@goalapp.it</b>.</p>
        </div>
        </div>
        </>
    )
}
export default Support