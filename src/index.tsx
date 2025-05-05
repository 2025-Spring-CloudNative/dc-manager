import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.scss"

import { RouterProvider } from "react-router-dom"
import AppProviders from "@app/providers/AppProviders"
import router from "@app/router"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProviders>
            <RouterProvider router={router} />
        </AppProviders>
    </StrictMode>
)
