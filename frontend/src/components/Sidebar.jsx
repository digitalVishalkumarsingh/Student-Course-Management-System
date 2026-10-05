import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserPlus,
  LogOut,
  GraduationCap,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const role = user?.role;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          <GraduationCap size={25} />
        </div>

        <div>
          <span>EduManage</span>

          <small>
            {role === "admin"
              ? "Administration"
              : "Student Portal"}
          </small>
        </div>

      </div>

      <nav className="sidebar-nav">

        <NavLink to="/" end>
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        {/* ADMIN ONLY */}

        {role === "admin" && (
          <>
            <NavLink to="/students">
              <Users size={19} />
              Students
            </NavLink>

            <NavLink to="/courses">
              <BookOpen size={19} />
              Courses
            </NavLink>

            <NavLink to="/enrollments">
              <UserPlus size={19} />
              Enrollments
            </NavLink>
          </>
        )}

        {/* STUDENT ONLY */}

        {role === "student" && (
          <NavLink to="/courses">
            <BookOpen size={19} />
            My Courses
          </NavLink>
        )}

      </nav>

      <div className="sidebar-user">

        <div className="sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="sidebar-user-info">
          <strong>
            {user?.name || "User"}
          </strong>

          <span>
            {role === "admin"
              ? "Administrator"
              : "Student"}
          </span>
        </div>

      </div>

      <button
        className="logout-btn"
        onClick={logout}
      >
        <LogOut size={19} />
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;
