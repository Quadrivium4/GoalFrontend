import { useEffect } from "react"
import styles from "./TermsOfUse.module.css"
import { Link } from "react-router-dom";
const TermsOfUse = () => {

    return (
        <div className={styles.page}>
            <div className={styles.content}>
            <h1>Terms of Service</h1>
            <div className={styles.content}>
                
            <section className={styles.section}>
            <p>In this page you will find information about the rules you should follow when using Our Services</p>
            <p>It's important to read it with attention and check it periodically, since it can be modified</p>
            </section>
            <section id="dati-personali" className={styles.section}>
            <h3 className={styles.title}>Account creation</h3>

            <p>Since the User creates an account on Our Services, agrees his data being collected and used in the way it's defined in our <a href="./privacy-policiy">Privacy Policy</a></p>
            <p>The User can request the deletion of the account, and all the data related to it.</p>
            </section>
            <section className={styles.section}>
            <h3 className={styles.title}>Access to the app</h3>
            <p>Our services are not guaranteed to always be accessible, for example in case of server failures, maintenance or other exceptional cases</p>
            <p>We have the Right to suspend Our Services entirely or partially in any moment</p>
            </section>
             <section className={styles.section}>
            <h3 className={styles.title}>Use of the app</h3>
            <p>It is forbidden to upload to our services any type of inappropriate content, such as (but not limited) offensive or pornographic </p>
            <p>We have the Right to ban every user if any type of such content is detected</p>
            </section>
            <section className={styles.section}>
            <h3 className={styles.title}>Data and Security</h3>
            <p>We commit to provide adequate security measures to prevent as much as possible,unauthorized access and use of data</p>
            <p>However the User must be aware that there is no guarantee a data breach will never happen</p>
            </section>
            </div>
             </div>
        </div>
    )
}
export default TermsOfUse