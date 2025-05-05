import { Link } from "react-router-dom"
import styles from "./NvBar.module.scss"
import dcms from "@/assets/DCMS.png"

const navItems = [
    { text: "資料中心", href: "/data-center" },
    { text: "網路設定", href: "/network" },
    { text: "服務管理", href: "/service" },
    { text: "帳戶", href: "/login" },
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
