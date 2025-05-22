import { Link } from "react-router-dom"
import styles from "./AccountMenu.module.scss"
import { useSession, useLogoutMutation } from "@features/user/hooks/useUser"

const unLoggedInDropdownItems = [
    { text: "登入", href: "/login" },
    { text: "註冊帳號", href: "/register" },
]

const loggedInDropdownItems = [{ text: "帳戶資訊", href: "/user" }]

function AccountMenu() {
    const { isLoggedIn } = useSession()
    const logoutMutation = useLogoutMutation()

    const dropdownItems = isLoggedIn ? loggedInDropdownItems : unLoggedInDropdownItems

    function handleLogout() {
        logoutMutation.mutate()
    }

    return (
        <div className={styles.dropdown}>
            {/* the visible trigger */}
            <span className={styles.navLink}>帳戶</span>

            {/* hidden until :hover */}
            <div className={styles.dropdownContent}>
                {isLoggedIn ? (
                    <button className={styles.dropdownButton} onClick={handleLogout} type="button">
                        登出
                    </button>
                ) : null}

                {dropdownItems.map((item, index) => (
                    <Link
                        key={`account-menu-${index}`}
                        to={item.href}
                        className={styles.dropdownLink}
                    >
                        {item.text}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default AccountMenu
