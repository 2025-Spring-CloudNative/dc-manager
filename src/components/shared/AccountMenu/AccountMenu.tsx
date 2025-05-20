import { Link } from "react-router-dom"
import styles from "./AccountMenu.module.scss"
import { useSession, useLogoutMutation } from "@features/user/hooks/useUser"

function AccountMenu() {
    const { isLoggedIn } = useSession()
    const logoutMutation = useLogoutMutation()
    // const navigate = useNavigate()

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
                    <button
                        className={styles.dropdownButton}
                        onClick={handleLogout}
                        type="button"
                    >
                        登出
                    </button>
                ) : (
                    <Link to="/login" className={styles.dropdownButton}>
                        登入
                    </Link>
                )}

                <Link to="/user" className={styles.dropdownLink}>
                    帳戶資訊
                </Link>
            </div>
        </div>
    )
}

export default AccountMenu
