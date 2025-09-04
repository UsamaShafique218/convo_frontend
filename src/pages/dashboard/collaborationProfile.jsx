import React, { useState, useEffect } from "react";

function CollaborationProfile() {
  const [profiles, setProfiles] = useState([]); // multiple profiles list
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    skills: "",
  });
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // edit mode check
  const [editId, setEditId] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/collaboration-profile");
      const data = await res.json();
      if (data.status === 200) {
        setProfiles(data.data || []);
      } else {
        setProfiles([]);
        setMessage(data.message || "No profiles found.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error fetching profiles.");
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Create / Update Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "/api/collaboration-profile";
      let method = "POST";

      if (isEditing) {
        url = `/api/collaboration-profile/update/${editId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message || (isEditing ? "Profile updated!" : "Profile created!"));
      setShowPopup(false);
      setFormData({ userId: "", name: "", email: "", skills: "" });
      setIsEditing(false);
      setEditId(null);
      fetchProfiles();
    } catch (error) {
      console.error(error);
      setMessage("Error saving profile.");
    }
  };

  // Delete profile
  const deleteProfile = async (id) => {
    try {
      const res = await fetch(`/api/collaboration-profile/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setMessage(data.message || "Profile deleted.");
      fetchProfiles();
    } catch (error) {
      console.error(error);
      setMessage("Error deleting profile.");
    }
  };

  // Edit profile
  const editProfile = (profile) => {
    setFormData({
      userId: profile.userId,
      name: profile.name,
      email: profile.email,
      skills: profile.skills,
    });
    setIsEditing(true);
    setEditId(profile._id);
    setShowPopup(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Collaboration Profiles</h1>

      <div className="user_header flex items-center justify-end pb-3">
        <div className="search_main">
          <input type="text" placeholder="Search..." className="search_input" value=""></input>
        </div>
        {/* Create Button */}
        <button
          onClick={() => {
            setFormData({ userId: "", name: "", email: "", skills: "" });
            setIsEditing(false);
            setShowPopup(true);
          }}
          className="all_btn pt_12 pb_12"
        >
          Create Profile
        </button>
      </div> 

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="font-semibold mb-4">
              {isEditing ? "Edit Profile" : "Create Profile"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="userId"
                placeholder="User ID"
                value={formData.userId}
                onChange={handleChange}
                className="border p-2 w-full"
                required
                disabled={isEditing} // editing me userid change na ho
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
                className="border p-2 w-full"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profiles Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[723px] table_main">
          <thead>
            <tr className="bg-gray-200">
              <th className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">User ID</th>
              <th className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Name</th>
              <th className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Email</th>
              <th className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Skills</th>
              <th className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td className="py-[10px] px-5 border-b border-blue-gray-50">0</td>
            <td className="py-[10px] px-5 border-b border-blue-gray-50">Dummy User</td>
            <td className="py-[10px] px-5 border-b border-blue-gray-50">dummy@example.com</td>
            <td className="py-[10px] px-5 border-b border-blue-gray-50">HTML, CSS</td>
            <td className="py-[10px] px-5 border-b border-blue-gray-50 text-center">
              <div className="flex items-center justify-center gap-2">
                <i className="edit_dlt_icon" onClick={() => editProfile(profile)}>
                  <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </i>
                <i onClick={() => deleteProfile(profile._id)} className="edit_dlt_icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="24" height="24" fill="red">
                    <path d="M 14.984375 2.4863281 A 1 1 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1 1 0 0 0 7.5 5 L 6 5 A 1 1 0 1 0 6 7 L 24 7 A 1 1 0 1 0 24 5 L 22.5 5 A 1 1 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1 1 0 0 0 14.984375 2.4863281 z M 6 9 L 7.8 24.2 C 7.9 25.2 8.8 26 9.8 26 H 20.2 C 21.2 26 22.1 25.2 22.2 24.2 L 24 9 Z" />
                  </svg>
                </i>  
              </div>
            </td>
          </tr>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile._id} className="text-center">
                  <td className="p-2 border">{profile.userId}</td>
                  <td className="p-2 border">{profile.name}</td>
                  <td className="p-2 border">{profile.email}</td>
                  <td className="p-2 border">{profile.skills}</td>
                  <td className="p-2 border flex gap-2 justify-center"> 
                    <div className="flex items-center justify-center gap-2">
                      <i className="edit_dlt_icon" onClick={() => editProfile(profile)}>
                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </i>
                      <i onClick={() => deleteProfile(profile._id)} className="edit_dlt_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="24" height="24" fill="red">
                          <path d="M 14.984375 2.4863281 A 1 1 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1 1 0 0 0 7.5 5 L 6 5 A 1 1 0 1 0 6 7 L 24 7 A 1 1 0 1 0 24 5 L 22.5 5 A 1 1 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1 1 0 0 0 14.984375 2.4863281 z M 6 9 L 7.8 24.2 C 7.9 25.2 8.8 26 9.8 26 H 20.2 C 21.2 26 22.1 25.2 22.2 24.2 L 24 9 Z" />
                        </svg>
                      </i> 

                    </div>
                  </td>  
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="5">
                  No profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> 
      {/* Message */}
      {message && <p className="text-blue-600">{message}</p>}
    </div>
  );
}

export default CollaborationProfile;
