import { Outlet } from "react-router-dom"
// import styles from "./AppLayout.module.scss" // optional SCSS module

function AppLayout() {
    return (
        // <div className={styles.layout}
        <div>
            {/* Top-level nav / header could go here */}

            <main>
                <Outlet /> {/* renders the matched child route */}
            </main>
        </div>
    )
}

export default AppLayout
