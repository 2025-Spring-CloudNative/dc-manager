// src/router.tsx
import { createBrowserRouter } from "react-router-dom"
import App from "./App" // Import App as the layout
import MainPage from "./pages/MainPage"
import ManagementPage from "./pages/ManagementPage"
import IndexPage from "./pages/IndexPage"

// import CabinetPage from "./pages/Cabinetpage/CabinetPage";
// import { ElementDcManagePage } from "./pages/Machinepage/MachinePage";
// import LoginPage from "./pages/Loginpage/LoginPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // Use App as the layout
        children: [
            {
                index: true,
                element: <MainPage />, // Index page content
            },
            {
                path: "IndexPage",
                element: <IndexPage />, // MainPage content
            },
            {
                path: "ManagementPage",
                element: <ManagementPage />,
            },

            //TODO: ADD more page

            // {
            //   path: "machine",
            //   element: <ElementDcManagePage />,
            // },
            // {
            //   path: "login",
            //   element: <LoginPage />,
            // },
        ],
    },
])

export default router
