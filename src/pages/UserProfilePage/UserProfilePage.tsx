import styles from "./UserProfilePage.module.scss"
import { useSession } from "@features/user/hooks/useUser"

export default function UserProfilePage() {
    const { data: user } = useSession()

    function onEditInfo() {}

    function onResetPassword() {}

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>帳戶資訊</h1>

            <div className={styles.card}>
                <Field label="姓名" value={user?.name} />
                <Field label="Email" value={user?.email} />
                <Field label="權限" value={user?.role} />
            </div>

            {/* TODO */}
            <div className={styles.actions}>
                <button className={styles.button} onClick={onEditInfo}>
                    Edit Info
                </button>
                <button className={styles.button} onClick={onResetPassword}>
                    Reset Password
                </button>
            </div>
        </section>
    )
}

function Field({ label, value }: { label: string; value?: string }) {
    return (
        <p className={styles.field}>
            <span className={styles.label}>{label}:</span>{" "}
            <span className={styles.value}>{value ?? "—"}</span>
        </p>
    )
}
