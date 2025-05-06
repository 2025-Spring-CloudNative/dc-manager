import type { RouteObject } from "react-router-dom"
import { createBrowserRouter } from "react-router-dom"

import AppLayout from "@/app/AppLayout"
import MainPage from "@pages/MainPage"
import DataCenterPage from "@/pages/DataCenterPage"
import NotFound from "@components/shared/NotFound"

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
            { index: true, element: <MainPage /> },
            { path: "DataCenterPage", element: <DataCenterPage /> },

            // any unmatched child goes to 404
            { path: "*", element: <NotFound /> },
        ],
    },
]

const router = createBrowserRouter(routes)
export default router
