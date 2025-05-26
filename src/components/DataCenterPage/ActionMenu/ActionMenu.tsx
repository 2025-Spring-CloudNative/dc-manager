import { useSession } from "@features/user/hooks/useUser"
import { can } from "@lib/rbac"

import styles from "./ActionMenu.module.scss"
const ActionMenu: React.FC<{
    type: "Room" | "Rack" | "Machine"
    onDelete: () => void
    onAdd?: () => void
    onThird?: () => void
    onForth?: () => void
    onCloseMenu: () => void
}> = ({ type, onDelete, onAdd, onThird, onForth, onCloseMenu }) => {
    // usage, inside component
    const { data: user } = useSession()
    const subtype =
        type === "Room" ? "Rack" : type === "Rack" ? "Machine" : null
    return can(user, "delete", type) ||
        (subtype && can(user, "create", subtype)) ||
        can(user, "update", type) ? (
        <div
            className={styles.roomButtonEdit}
            style={{ position: "absolute", zIndex: 1000 }} // zIndex for the menu itself
            onClick={(e) => e.stopPropagation()}
        >
            {can(user, "delete", type) ? (
                <button
                    className={styles.delRoom}
                    onClick={() => {
                        onDelete()
                        onCloseMenu()
                    }}
                >
                    <span
                        className={styles.subButtonTitle}
                    >{`刪除${type}`}</span>
                </button>
            ) : null}
            {onAdd && subtype && can(user, "create", subtype) && (
                <button
                    className={styles.addRack}
                    onClick={() => {
                        onAdd()
                        onCloseMenu()
                    }}
                >
                    <span
                        className={styles.subButtonTitle}
                    >{`[+]${subtype}`}</span>
                </button>
            )}
            {onThird && can(user, "update", type) && (
                <button
                    className={styles.selectService}
                    onClick={() => {
                        onThird()
                        onCloseMenu()
                    }}
                >
                    <span className={styles.subButtonTitle}>
                        {type === "Room"
                            ? "修改Room"
                            : type === "Rack"
                            ? "選擇Service"
                            : "修改Machine"}
                    </span>
                </button>
            )}
            {type === "Rack" && onForth && can(user, "update", type) && (
                <button
                    className={styles.selectService}
                    onClick={() => {
                        onForth()
                        onCloseMenu()
                    }}
                >
                    <span className={styles.subButtonTitle}>修改Rack</span>
                </button>
            )}
        </div>
    ) : (
        <div />
    )
}

export default ActionMenu
