import { Outlet } from "react-router-dom"

const App = () => {
    return (
        <div>
            {/* Layout: Main content */}
            <main>
                <Outlet />{" "}
                {/* This will render the content of the child routes */}
            </main>
        </div>
    )
}

export default App
