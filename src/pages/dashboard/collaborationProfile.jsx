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

      {/* Create Button */}
      <button
        onClick={() => {
          setFormData({ userId: "", name: "", email: "", skills: "" });
          setIsEditing(false);
          setShowPopup(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Profile
      </button>

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
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Skills</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td className="border p-2 text-center">0</td>
            <td className="border p-2">Dummy User</td>
            <td className="border p-2">dummy@example.com</td>
            <td className="border p-2">HTML, CSS</td>
            <td className="border p-2 text-center">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
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
                    <button
                      onClick={() => editProfile(profile)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProfile(profile._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
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
