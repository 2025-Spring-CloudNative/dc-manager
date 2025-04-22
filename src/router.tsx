// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import {MainPage} from "./pages/Mainpage/MainPage";
import CabinetPage from "./pages/Cabinetpage/CabinetPage";
import { ElementDcManagePage } from "./pages/Machinepage/MachinePage";
import LoginPage from "./pages/Loginpage/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />, // layout with navbar and <Outlet />
    children: [
      {
        index: true,
        element: <div>🏠 Welcome to the MainPage!</div>,
      },
      {
        path: "cabinet",
        element: <CabinetPage />,
      },
      {
        path: "machine",
        element: <ElementDcManagePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;
