import { Link } from "react-router-dom"
import styles from "./NvBar.module.scss"
import dcms from "@/assets/DCMS.png"

const navItems = [
    { text: "編輯機櫃", href: "/cabinet" },
    { text: "編輯機器", href: "/ManagementPage" },
    { text: "登入系統", href: "/login" },
]

const NvBar = () => {
    return (
        <header className={styles.headerBar}>
            <Link to="/">
                <img src={dcms} alt="DCMS" className={styles.logoImage} />
            </Link>
            <nav className={styles.navBar}>
                {navItems.map((item, index) => (
                    <Link key={index} to={item.href} className={styles.navLink}>
                        {item.text}
                    </Link>
                ))}
            </nav>
        </header>
    )
}

export default NvBar
