import styles from "./Modal.module.scss"

function Modal({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}) {
    if (!isOpen) return null
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) =>
                    e.stopPropagation()
                } /* don’t close on inner click */
            >
                <button className={styles.close} onClick={onClose}>
                    x
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal
