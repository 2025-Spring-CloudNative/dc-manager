// src/pages/RootLayout.tsx
import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Index</Link></li>
          <li><Link to="/mainpage">Main Page</Link></li>
          <li><Link to="/management">Management</Link></li>
        </ul>
      </nav>
      <hr />
      <Outlet /> {/* 顯示子路由畫面 */}
    </div>
  );
}
