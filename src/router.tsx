// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App"; // Import App as the layout
import { MainPage } from "./pages/Mainpage/MainPage";
import CabinetPage from "./pages/Cabinetpage/CabinetPage";
import { ElementDcManagePage } from "./pages/Machinepage/MachinePage";
import LoginPage from "./pages/Loginpage/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Use App as the layout
    children: [
      {
        index: true,
        element: <MainPage />, // MainPage content
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
