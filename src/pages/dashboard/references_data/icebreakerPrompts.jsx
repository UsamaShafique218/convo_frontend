import React, { useEffect, useState } from "react";

function IcebreakerPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPrompt, setEditPrompt] = useState("");

  // Fetch all prompts
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = () => {
    fetch("/api/icebreaker-prompts")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setPrompts(data.data);
        }
      })
      .catch((err) => console.error("Error fetching icebreaker prompts:", err));
  };

  // Add new prompt
  const handleAdd = () => {
    if (!newPrompt.trim()) return;

    fetch("/api/icebreaker-prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPrompt, isActive: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 201) {
          setPrompts([...prompts, data.data]);
          setNewPrompt("");
        }
      })
      .catch((err) => console.error("Error adding prompt:", err));
  };

  // Delete prompt
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) return;

    fetch(`/api/icebreaker-prompts/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setPrompts(prompts.filter((p) => p._id !== id));
        }
      })
      .catch((err) => console.error("Error deleting prompt:", err));
  };

  // Start editing
  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditPrompt(currentName);
  };

  // Update prompt
  const handleUpdate = (id) => {
    fetch(`/api/icebreaker-prompts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editPrompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setPrompts(
            prompts.map((p) =>
              p._id === id ? { ...p, name: editPrompt } : p
            )
          );
          setEditingId(null);
          setEditPrompt("");
        }
      })
      .catch((err) => console.error("Error updating prompt:", err));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Icebreaker Prompts</h1>

      {/* Add new prompt */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          placeholder="Enter new prompt"
          className="border p-2 flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {prompts.length === 0 ? (
        <p className="text-gray-500">No icebreaker prompts available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Prompt</th>
              <th className="border border-gray-300 p-2">Active</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((item, index) => (
              <tr key={item._id}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{item._id}</td>
                <td className="border border-gray-300 p-2">
                  {editingId === item._id ? (
                    <input
                      type="text"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      className="border p-1 w-full"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.isActive ? "✅ Yes" : "❌ No"}
                </td>
                <td className="border border-gray-300 p-2 flex gap-2">
                  {editingId === item._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(item._id, item.name)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IcebreakerPrompts;
