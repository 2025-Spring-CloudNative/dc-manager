// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
// import IndexPage from "./pages/IndexPage";
import {MainPage} from "./pages/Mainpage/MainPage";
// import ManagementPage from "./pages/ManagementPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // 帶有 <nav> 的主畫面框架
    children: [
    //   {
    //     index: true, // 相當於 path: ""
    //     element: <IndexPage />,
    //   },
    {
        path: "mainpage",
        element: <MainPage />, 
      },
    //   {
    //     path: "management",
    //     element: <ManagementPage />,
    //   },
      {
        path: "*", // fallback for not-found
        element: <MainPage />,
      },
    ],
  },
]);

export default router;
