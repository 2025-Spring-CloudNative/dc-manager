import { useEffect, useState } from "react"
import Modal from "@components/shared/Modal/"
import styles from "./ResetUserPasswordModal.module.scss"

import { useSession, useResetUserPasswordMutation } from "@features/user/hooks/useUser"

interface ResetUserPasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

function ResetUserPasswordModal({ isOpen, onClose }: ResetUserPasswordModalProps) {
    const { data: user } = useSession()
    const resetMutation = useResetUserPasswordMutation()

    /* controlled inputs */
    const [oldPw, setOldPw] = useState("")
    const [newPw, setNewPw] = useState("")
    const [confirm, setConfirm] = useState("")

    /* Populate default values whenever the modal opens */
    useEffect(() => {
        if (isOpen) {
            setOldPw("")
            setNewPw("")
            setConfirm("")
        }
    }, [isOpen])

    /* derived validation flag */
    const mismatch = newPw !== confirm

    async function handleEditSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (mismatch) return // extra guard
        await resetMutation.mutateAsync(
            { userId: Number(user!.id), passwordData: { oldPassword: oldPw, newPassword: newPw } },
            {
                onSuccess: () => {
                    onClose() // close modal
                },
            }
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h1 className={styles.modalTitle}>重設密碼</h1>
            <form className={styles.form} onSubmit={handleEditSave}>
                <label>
                    舊密碼
                    <input
                        type="password"
                        value={oldPw}
                        onChange={(e) => setOldPw(e.target.value)}
                        name="oldPassword"
                        required
                    />
                </label>
                <label>
                    新密碼
                    <input
                        type="password"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        name="newPassword"
                        required
                    />
                </label>

                <label>
                    確認新密碼
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        name="confirmPassword"
                        required
                    />
                </label>

                {/* password-mismatch warning */}
                {mismatch && <p className={styles.error}>兩個新密碼不一致</p>}

                {resetMutation.isError && (
                    <p className={styles.error}>
                        {resetMutation.error instanceof Error
                            ? resetMutation.error.message
                            : "Reset failed"}
                    </p>
                )}

                <button
                    type="submit"
                    className={styles.buttonPrimary}
                    disabled={mismatch || resetMutation.isPending}
                >
                    {resetMutation.isPending ? "儲存中…" : "儲存"}
                </button>
            </form>
        </Modal>
    )
}

export default ResetUserPasswordModal
