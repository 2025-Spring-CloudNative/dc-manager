import { useState } from "react"
import styles from "./UserProfilePage.module.scss"
import { useSession } from "@features/user/hooks/useUser"
import { mapRoleToString } from "@/features/user/types"
import UpdateUserInfoModal from "@components/UserProfilePage/UpdateUserInfoModal"
import ResetUserPasswordModal from "@components/UserProfilePage/ResetUserPasswordModal"

export default function UserProfilePage() {
    const { data: user, isLoggedIn } = useSession()
    const [editOpen, setEditOpen] = useState(false)
    const [resetOpen, setResetOpen] = useState(false)

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>帳戶資訊</h1>

            <div className={styles.card}>
                <Field label="姓名" value={user?.name} />
                <Field label="Email" value={user?.email} />
                <Field label="權限" value={mapRoleToString(user?.role)} />
            </div>

            {/* TODO */}
            <div className={styles.actions}>
                <button
                    className={styles.button}
                    onClick={() => setEditOpen(true)}
                    disabled={!isLoggedIn}
                >
                    編輯資訊
                </button>
                <button
                    className={styles.button}
                    onClick={() => setResetOpen(true)}
                    disabled={!isLoggedIn}
                >
                    重設密碼
                </button>
            </div>
            <UpdateUserInfoModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
            />
            <ResetUserPasswordModal
                isOpen={resetOpen}
                onClose={() => setResetOpen(false)}
            />
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
