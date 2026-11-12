import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const menus = [
  { name: "Dashboard", path: "/dashboard", roles: ["employee", "manager", "admin"] },
  { name: "Apply Leave", path: "/leaves/apply", roles: ["employee", "manager"] },
  { name: "My Leaves", path: "/leaves/my", roles: ["employee", "manager"] },
  { name: "Team Requests", path: "/leaves/team", roles: ["manager"] },
  { name: "All Leave Requests", path: "/admin/leaves", roles: ["admin"] },
  { name: "Manage Users", path: "/admin/users", roles: ["admin"] },
  { name: "Leave Types", path: "/admin/leave-types", roles: ["admin"] },
  { name: "Holidays", path: "/admin/holidays", roles: ["admin"] },
  { name: "Profile", path: "/profile", roles: ["employee", "manager", "admin"] },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // sidebar open on mobile

  const myMenu = menus.filter((menu) => menu.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen md:flex">
      {/* mobile background*/}
      {open && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setOpen(false)}></div>}

      {/* sidebar */}
      <aside
        className={
          "fixed top-0 left-0 h-full w-60 bg-green-800 text-white p-4 z-30 transition-transform md:static md:h-auto md:translate-x-0 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <h2 className="text-xl font-bold mb-6">Leave Manager</h2>
        {myMenu.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              "block px-4 py-2 rounded mb-1 text-sm " + (isActive ? "bg-green-600" : "hover:bg-green-700")
            }
          >
            {menu.name}
          </NavLink>
        ))}
      </aside>

      {/* right side */}
      <div className="flex-1 min-w-0">
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
          <button className="md:hidden text-2xl text-green-800" onClick={() => setOpen(true)}>
            &#9776;
          </button>
          <p className="text-sm text-gray-700 ml-auto mr-4">
            {user.name} <span className="text-green-700 capitalize">({user.role})</span>
          </p>
          <Button color="gray" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
