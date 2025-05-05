import { Link } from "react-router-dom"
import styles from "./NotFound.module.scss"

export default function NotFound() {
    return (
        <section className={styles.wrapper}>
            <h1 className={styles.code}>404</h1>
            <p className={styles.message}>Sorry, the page doesn't exist.</p>

            <Link to="/" className={styles.homeBtn}>
                ← Back to Home
            </Link>
        </section>
    )
}
