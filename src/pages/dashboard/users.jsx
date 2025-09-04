import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    birthday: "",
    currentCity: "",
    homeTown: "",
    genderId: "",
    role: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const toast = useRef(null);


  // show user detail 
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [loadingView, setLoadingView] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((res) => {
        if (res?.status === 200 && Array.isArray(res?.data)) {
          const formatted = res.data.map((u) => ({
            ...u,
            isActive: u.isActive ?? true,
          }));
          setUsers(formatted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const compare = (a, b, key) => {
    if (key === "birthday" || key === "createdAt") {
      const aTime = a[key] ? new Date(a[key]).getTime() : 0;
      const bTime = b[key] ? new Date(b[key]).getTime() : 0;
      return aTime - bTime;
    }
    const aVal = (a[key] ?? "").toString().toLowerCase();
    const bVal = (b[key] ?? "").toString().toLowerCase();
    return aVal.localeCompare(bVal);
  };

  const processedData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let filtered = users.filter((u) =>
      Object.values(u)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const cmp = compare(a, b, sortConfig.key);
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }
    return filtered;
  }, [users, searchQuery, sortConfig]);

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentData = processedData.slice(start, end);

  const getPageNumbers = () => {
    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // CRUD Handlers
  const handleCreate = (e) => {
    e.preventDefault();
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.status === 201) {
          toast.current?.show({ severity: "success", summary: "Created", detail: "User added", life: 2500 });
          setShowModal(false);
          setForm({
            name: "",
            email: "",
            birthday: "",
            currentCity: "",
            homeTown: "",
            genderId: "",
            role: "",
            isActive: true,
          });
          fetchUsers();
        } else {
          toast.current?.show({ severity: "error", summary: "Error", detail: res?.message || "Failed", life: 3000 });
        }
      });
  };

  const startEdit = (u) => {
    setEditingId(u._id);
    setForm({ ...u });
    setShowEditModal(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editingId) return;
    fetch(`/api/users/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.status === 200) {
          toast.current?.show({ severity: "success", summary: "Updated", detail: "User updated", life: 2500 });
          setShowEditModal(false);
          setEditingId(null);
          setForm({
            name: "",
            email: "",
            birthday: "",
            currentCity: "",
            homeTown: "",
            genderId: "",
            role: "",
            isActive: true,
          });
          fetchUsers();
        } else {
          toast.current?.show({ severity: "error", summary: "Error", detail: res?.message || "Failed", life: 3000 });
        }
      });
  };

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
    confirmDialog({
      message: "Do you want to delete this user?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: onDeleteAccept,
      reject: () => setPendingDeleteId(null),
    });
  };

  const onDeleteAccept = () => {
    if (!pendingDeleteId) return;
    fetch(`/api/users/${pendingDeleteId}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((res) => {
        if (res?.status === 200) {
          toast.current?.show({ severity: "info", summary: "Deleted", detail: "User removed", life: 2500 });
          fetchUsers();
        } else {
          toast.current?.show({ severity: "warn", summary: "Failed", detail: res?.message || "Could not delete", life: 3000 });
        }
      })
      .finally(() => setPendingDeleteId(null));
  };





  // View handler
  const handleView = (id) => {
    setLoadingView(true);
    setShowViewModal(true);
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.status === 200) {
          setViewUser(res.data);
        } else {
          setViewUser(null);
        }
      })
      .catch(() => setViewUser(null))
      .finally(() => setLoadingView(false));
  };


  return (
    <div className="flex flex-col p-6">
      <h4 className="page_title mb-4 text-xl font-bold">Users</h4> 

      <div className="user_header flex items-center justify-end pb-3">
        <div className="search_main">
          <input
          type="text"
          placeholder="Search..."
          className="search_input"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
        />
        </div> 
        <button className="all_btn pt_12 pb_12" onClick={() => setShowModal(true)}>Add User</button>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="w-full min-w-[723px] table_main">
          <thead className="">
            <tr>
              {["name","email","birthday","currentCity","homeTown","genderId","role","createdAt"].map((col) => (
                <th key={col} className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400" onClick={() => handleSort(col)}>
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortConfig.key === col && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              <th className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="py-4 text-center">Loading...</td></tr>
            ) : currentData.length === 0 ? (
              <tr><td colSpan="9" className="py-4 text-center">No users found.</td></tr>
            ) : currentData.map((u) => (
              <tr key={u._id}>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.name}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.email}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.birthday ? new Date(u.birthday).toLocaleDateString() : "-"}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.currentCity}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.homeTown}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.genderId}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.role}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                <td className="py-[10px] px-5 border-b border-blue-gray-50 text-center"> 
                  <div className="flex items-center justify-center gap-2">
                    <i className="edit_dlt_icon" onClick={() => startEdit(u)}>
                      <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </i>
                    <i onClick={() => confirmDelete(u._id)} className="edit_dlt_icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="24" height="24" fill="red">
                        <path d="M 14.984375 2.4863281 A 1 1 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1 1 0 0 0 7.5 5 L 6 5 A 1 1 0 1 0 6 7 L 24 7 A 1 1 0 1 0 24 5 L 22.5 5 A 1 1 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1 1 0 0 0 14.984375 2.4863281 z M 6 9 L 7.8 24.2 C 7.9 25.2 8.8 26 9.8 26 H 20.2 C 21.2 26 22.1 25.2 22.2 24.2 L 24 9 Z" />
                      </svg>
                    </i>

                    <button className="all_btn" onClick={() => handleView(u._id)}>View</button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t pt-2 pagination_main">
        <div className="text-gray-700 text-sm font-medium">Total Records: {totalItems}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded border text-gray-600 disabled:opacity-30" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>&lt;</button>
          {getPageNumbers().map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded border text-sm ${currentPage === page ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-700"}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&gt;</button>
        </div> 
        <div className="text-sm text-gray-700 flex items-center gap-2 show_page">
          <span>Show per Page:</span>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded px-2 py-1 text-sm">
            {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Add Modal */}
      {showModal && (
        <div className="popup_main">
          <div className="popup_main_inner max-w-[600px]">
            <div className="popup_header">
              <h3>Add User</h3> 
              <div class="popup_icon"><button onClick={() => setShowModal(false)}>✕</button></div>
            </div>
            <div className="popup_body p-4">
              <form className="space-y-3" onSubmit={handleCreate}>
                <div className="grid grid-cols-2 gap-4">
                  {["name","email","birthday","currentCity","homeTown","genderId","role"].map((key) => (
                    <div key={key} className="flex flex-col">
                      <label className="form-label">{key.charAt(0).toUpperCase()+key.slice(1)}</label>
                      <input
                        type={key==="birthday"?"date":"text"}
                        value={form[key]}
                        onChange={(e)=>setForm({...form,[key]:e.target.value})}
                        required
                        className="form-control"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e)=>setForm({...form,isActive:e.target.checked})} id="isActiveAdd"/>
                  <label htmlFor="isActiveAdd">Active</label>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={()=>setShowModal(false)} className="all_btn gray_color">Cancel</button>
                  <button type="submit" className="all_btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="popup_main">
          <div className="popup_main_inner max-w-[600px]">
            <div className="popup_header flex justify-between items-center">
              <h3>Edit User</h3> 
              <div className="popup_icon">
                <button onClick={() => setShowEditModal(false)}>✕</button>
              </div>
            </div>
            <div className="popup_body p-4">
              <form className="space-y-3" onSubmit={handleEdit}>
                <div className="grid grid-cols-2 gap-4">
                  {["name","email","birthday","currentCity","homeTown","genderId","role"].map((key) => (
                    <div key={key} className="flex flex-col">
                      <label className="form-label">{key.charAt(0).toUpperCase()+key.slice(1)}</label>
                      <input
                        type={key==="birthday"?"date":"text"}
                        value={form[key]}
                        onChange={(e)=>setForm({...form,[key]:e.target.value})}
                        required
                        className="form-control"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e)=>setForm({...form,isActive:e.target.checked})} id="isActiveEdit"/>
                  <label htmlFor="isActiveEdit">Active</label>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={()=>setShowEditModal(false)} className="all_btn gray_color">Cancel</button>
                  <button type="submit" className="all_btn">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


  
      {/* View Modal */}
      {showViewModal && (
        <div className="popup_main">
          <div className="popup_main_inner max-w-[800px]">
            <div className="popup_header flex justify-between items-center">
              <h3>User detail</h3>
              <div className="popup_icon">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewUser(null);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="popup_body p-4">
              {loadingView ? (
                <div className="text-center py-6">Loading...</div>
              ) : !viewUser ? (
                <div className="text-center py-6">No details found.</div>
              ) : (
                <>
                  {/* Profile Image */}
                  {/* {viewUser.profileImage && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={viewUser.profileImage}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    </div>
                  )} */}

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2"> 
                    <p><strong>Name:</strong> {viewUser.name || "-"}</p>
                    <p><strong>Email:</strong> {viewUser.email || "-"}</p>
                    <p><strong>Birthday:</strong> {viewUser.birthday ? new Date(viewUser.birthday).toLocaleDateString() : "-"}</p>
                    <p><strong>Age:</strong> {viewUser.age ?? "-"}</p>
                    <p><strong>Current City:</strong> {viewUser.currentCity || "-"}</p>
                    <p><strong>Home Town:</strong> {viewUser.homeTown || "-"}</p>
                    <p><strong>Pronounce:</strong> {viewUser.pronounce || "-"}</p>
                    <p><strong>Gender:</strong> {viewUser.gender?.name || "-"}</p>
                    <p><strong>Orientation:</strong> {viewUser.orientation?.name || "-"}</p>
                    <p><strong>Work:</strong> {viewUser.work?.name || "-"}</p>
                    <p><strong>Communication Style:</strong> {viewUser.communicationStyle?.name || "-"}</p>
                    <p><strong>Love Language:</strong> {viewUser.loveLanguage?.name || "-"}</p>
                    <p><strong>Role:</strong> {viewUser.role || "-"}</p>
                    <p><strong>Profile Type:</strong> {viewUser.profileType || "-"}</p>
                    <p><strong>Registration Step:</strong> {viewUser.registrationStep}</p>
                    <p><strong>Registration Complete:</strong> {viewUser.isRegistrationComplete ? "Yes" : "No"}</p>
                    <p><strong>Member Since:</strong> {viewUser.memberSince || "-"}</p>
                    <p><strong>Verification Status:</strong> {viewUser.verificationStatus || "-"}</p>
                    <p><strong>Premium:</strong> {viewUser.isPremium ? "Yes" : "No"}</p>
                    <p><strong>Profile Completion:</strong> {viewUser.profileCompletion}%</p>
                    <p><strong>Profile Views:</strong> {viewUser.profileViews}</p>
                    <p><strong>Matches:</strong> {viewUser.matches}</p>
                    <p><strong>Likes:</strong> {viewUser.likes}</p>
                    <p><strong>Super Likes:</strong> {viewUser.superLikes}</p>
                  </div>

                  {/* Interests as badges */}
                  {viewUser.interests?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium">Interests:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {viewUser.interests.map((int) => (
                          <span key={int.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {int.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Icebreaker Prompts */}
                  {viewUser.icebreakerPrompts?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium">Icebreaker Prompts:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {viewUser.icebreakerPrompts.map((p) => (
                          <li key={p._id}>
                            <strong>{p.question}</strong> – {p.answer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Photos */}
                  {/* {viewUser.photos?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium">Photos:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {viewUser.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={`http://localhost:5000/uploads/profile-photos/${photo}`}
                            alt="user"
                            className="w-20 h-20 rounded-lg object-cover border"
                          />
                        ))}
                      </div>
                    </div>
                  )} */}

                  {/* Close Button */}
                  <div className="flex gap-2 mt-6 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowViewModal(false);
                        setViewUser(null);
                      }}
                      className="all_btn gray_color"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}








    </div>
  );
}
