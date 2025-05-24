import styles from "./ActionMenu.module.scss";
const ActionMenu: React.FC<{
    type: "room" | "rack" | "machine";
    onDelete: () => void;
    onAdd?: () => void;
    onThird?: () => void;
    onForth?: () => void;
    onCloseMenu: () => void;
}> = ({ type, onDelete, onAdd, onThird, onForth, onCloseMenu }) => {

    return (
        <div
            className={styles.roomButtonEdit}
            style={{ position: "absolute", zIndex: 1000 }} // zIndex for the menu itself
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles.roomCtrlMenu}>
                <button className={styles.delRoom} onClick={() => { onDelete(); onCloseMenu(); }}>
                    <span className={styles.subButtonTitle}>{`刪除${type === "room" ? "Room" : type === "rack" ? "Rack" : "Machine"}`}</span>
                </button>
                {onAdd && (
                    <button className={styles.addRack} onClick={() => { onAdd(); onCloseMenu(); }}>
                        <span className={styles.subButtonTitle}>{type === "room" ? "[+]Rack" : type === "rack" ? "[+]Host" : "[+]Host"}</span>
                    </button>
                )}
                {onThird && (
                    <button className={styles.selectService} onClick={() => { onThird(); onCloseMenu(); }}>
                        <span className={styles.subButtonTitle}>
                            {type === "room" ? "修改Room" : type === "rack" ? "選擇Service" : "修改Machine"}
                        </span>
                    </button>
                )}
                {type === "rack" && onForth && (
                    <button className={styles.selectService} onClick={() => { onForth(); onCloseMenu(); }}>
                        <span className={styles.subButtonTitle}>
                            修改Rack
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActionMenu;