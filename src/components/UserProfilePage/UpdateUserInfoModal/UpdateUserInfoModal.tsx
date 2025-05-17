import { useEffect, useState } from "react"
import Modal from "@components/shared/Modal/"
import styles from "./UpdateUserInfoModal.module.scss"

import { useSession, useUpdateUserInfoMutation } from "@features/user/hooks/useUser"

interface UpdateUserInfoModalProps {
    isOpen: boolean
    onClose: () => void
}

function UpdateUserInfoModal({ isOpen, onClose }: UpdateUserInfoModalProps) {
    const { data: user } = useSession()
    const updateMutation = useUpdateUserInfoMutation()

    // local form state (controlled)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    /* Populate default values whenever the modal opens */
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name ?? "")
            setEmail(user.email ?? "")
        }
    }, [isOpen, user])

    async function handleEditSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await updateMutation.mutateAsync(
            { userId: Number(user!.id), userData: { name, email } },
            {
                onSuccess: () => {
                    onClose() // close modal
                },
            }
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h1 className={styles.modalTitle}>修改帳號資訊</h1>
            <form className={styles.form} onSubmit={handleEditSave}>
                <label>
                    Name
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        required
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        required
                    />
                </label>

                {updateMutation.isError && (
                    <p className={styles.error}>
                        {updateMutation.error instanceof Error
                            ? updateMutation.error.message
                            : "Update failed"}
                    </p>
                )}

                <button
                    type="submit"
                    className={styles.buttonPrimary}
                    disabled={updateMutation.isPending}
                >
                    {updateMutation.isPending ? "Saving…" : "Save"}
                </button>
            </form>
        </Modal>
    )
}

export default UpdateUserInfoModal
