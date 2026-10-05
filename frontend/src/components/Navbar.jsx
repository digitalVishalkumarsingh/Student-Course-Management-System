function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="navbar">
      <div>
        <h2>Student Course Management</h2>
        <p>Manage your students, courses and enrollments</p>
      </div>

      <div className="navbar-user">
        <div className="user-avatar">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <strong>{user.name || "User"}</strong>
          <span>{user.email || ""}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
