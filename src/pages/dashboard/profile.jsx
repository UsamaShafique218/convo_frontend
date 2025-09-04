// src/pages/dashboard/Profile.jsx
import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../widgets/layout/dashboard-navbar"; 
import Sidenav from "../../widgets/layout/sidenav"; 
import routes from "../../routes";  // <-- yahan se routes import karo

export default function Profile() {
   const [user, setUser] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        email: parsed.email || "",
        department: parsed.department || "",
        role: parsed.role || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert("Profile updated successfully!");
  };

  if (!user) {
    return (
      <div className="flex">
        {/* Sidebar */}
        <Sidenav routes={routes} /> 
        <div className="flex-1">
          {/* Top Navbar */}
          <DashboardNavbar />
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold">No User Found</h2>
            <p>Please login again to see your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile_page_wrapper">
      {/* Sidebar */}
      <Sidenav routes={routes} /> 
      {/* Top Navbar */}
      <DashboardNavbar />

      <div className="profile_page">
      <div className="profile_page_inner">
        <h2 className="page_title">My Profile</h2>

        {/* Profile Info */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profileImage || "/img/person.svg"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <h3 className="text-xl font-semibold">{user.name || "-"}</h3>
              <p className="text-gray-600">{user.email || "-"}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div className="form_row">
            <div className="form_row_li w-full">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div className="form_row">
            <div className="form_row_li w-full">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="form_row">
            <div className="form_row_li w-full">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter department"
              />
            </div>
          </div>

          <div className="form_row">
            <div className="form_row_li w-full">
              <label className="form-label">Role</label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter role"
              />
            </div>
          </div>

          <div className="popup_btns">
            <button type="submit" className="all_btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    </div>
  );
}
