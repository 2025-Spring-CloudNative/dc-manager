import { Outlet } from "react-router-dom"
import NvBar from "./NvBar"
// import styles from "./AppLayout.module.scss" // optional SCSS module

function AppLayout() {
    return (
        // <div className={styles.layout}
        <div>
            {/* Top-level nav / header could go here */}
            <NvBar />
            <main>
                <Outlet /> {/* renders the matched child route */}
            </main>
        </div>
    )
}

export default AppLayout
