import type { RouteObject } from "react-router-dom"
import { createBrowserRouter } from "react-router-dom"

import AppLayout from "@app/AppLayout"
import MainPage from "@pages/MainPage"
import DataCenterPage from "@pages/DataCenterPage"
import IPmanagementPage from "@/pages/IPmanagementPage"
import LoginPage from "@pages/LoginPage"
import RegisterPage from "@pages/RegisterPage"
import UserProfilePage from "@pages/UserProfilePage"
import NotFound from "@components/shared/NotFound"
import RequireLogin from "./RequireLogin"

/**
 * Central place to build the data router.
 * You can apply future `lazy`, `loader`, `action`, or `errorElement`
 * options here without touching the app entry.
 */
const routes: RouteObject[] = [
    {
        path: "/",
        element: <AppLayout />,
        children: [
            // public routes
            { index: true, element: <MainPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },

            // protected routes
            {
                element: <RequireLogin />,
                children: [
                    { path: "user", element: <UserProfilePage /> },
                    { path: "DataCenterPage", element: <DataCenterPage /> },
                    { path: "IPmanagementPage", element: <IPmanagementPage /> },
                ],
            },

            // any unmatched child goes to 404
            { path: "*", element: <NotFound /> },
        ],
    },
]

const router = createBrowserRouter(routes)
export default router
