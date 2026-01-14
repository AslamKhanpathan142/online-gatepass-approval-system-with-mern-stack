import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ user, isOpen, onClose }) => {
  const studentMenu = [
    { path: "/student/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/student/apply-gatepass", label: "Apply Gatepass", icon: "📝" },
    { path: "/student/my-gatepasses", label: "My Gatepasses", icon: "📋" },
  ];

  const rectorMenu = [
    { path: "/rector/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/rector/add-student", label: "Add Student", icon: "👨‍🎓" },
    { path: "/rector/view-students", label: "View Students", icon: "👥" },
    {
      path: "/rector/gatepass-requests",
      label: "Gatepass Requests",
      icon: "📋",
    },
  ];

  const menuItems = user?.role === "student" ? studentMenu : rectorMenu;
  const sidebarClass =
    window.innerWidth > 768
      ? "sidebar"
      : `sidebar ${isOpen ? "open" : "closed"}`;

  return (
    <div className={sidebarClass}>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="sidebar-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
