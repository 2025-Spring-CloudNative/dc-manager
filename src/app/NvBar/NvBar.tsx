import { Link } from "react-router-dom"
import AccountMenu from "@components/shared/AccountMenu"
import styles from "./NvBar.module.scss"
import dcms from "@/assets/DCMS.png"

import { useSession } from "@features/user/hooks/useUser"

const loggedInNavItems = [
    { text: "資料中心", href: "/DatacenterPage" },
    { text: "網路設定", href: "/network" },
    { text: "服務管理", href: "/service" },
]

function NvBar() {
    const { isLoggedIn } = useSession()

    const navItems = isLoggedIn ? loggedInNavItems : []

    return (
        <header className={styles.headerBar}>
            <Link to="/" className={styles.logoLink}>
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
