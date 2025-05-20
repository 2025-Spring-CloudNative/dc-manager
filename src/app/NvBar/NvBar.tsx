import { Link } from "react-router-dom"
import AccountMenu from "@components/shared/AccountMenu"
import styles from "./NvBar.module.scss"
import dcms from "@/assets/DCMS.png"

const navItems = [
    { text: "資料中心", href: "/DatacenterPage" },
    { text: "網路設定", href: "/network" },
    { text: "服務管理", href: "/service" },
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
                <AccountMenu />
            </nav>
        </header>
    )
}

export default NvBar
