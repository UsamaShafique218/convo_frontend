import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export default function LoveLanguages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = () => {
    setLoading(true);
    fetch("/api/love-languages")
      .then((res) => res.json())
      .then((res) => {
        if (res?.status === 200 && Array.isArray(res?.data)) {
          const formatted = res.data.map((ind) => ({
            _id: ind._id,
            name: ind.name ?? "",
            category: ind.category ?? "",
            isActive: !!ind.isActive,
            createdAt: ind.createdAt || ind.updatedAt || null,
          }));
          setData(formatted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const compare = (a, b, key) => {
    if (key === "createdAt") {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    }
    if (key === "isActive") {
      const aVal = a.isActive ? "active" : "inactive";
      const bVal = b.isActive ? "active" : "inactive";
      return aVal.localeCompare(bVal);
    }
    const aVal = (a[key] ?? "").toString().toLowerCase();
    const bVal = (b[key] ?? "").toString().toLowerCase();
    return aVal.localeCompare(bVal);
  };

  const processedData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let filtered = data.filter((item) => {
      const status = item.isActive ? "active" : "inactive";
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        status.includes(q)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const cmp = compare(a, b, sortConfig.key);
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }
    return filtered;
  }, [data, searchQuery, sortConfig]);

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

  const handleCreate = (e) => {
    e.preventDefault();
    const payload = { name, category, isActive };

    fetch("/api/love-languages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.status === 201) {
          toast.current?.show({ severity: "success", summary: "Created", detail: "Record added", life: 2500 });
          setShowModal(false);
          setName("");
          setCategory("");
          setIsActive(true);
          fetchIndustries();
        } else {
          toast.current?.show({ severity: "error", summary: "Error", detail: res?.message || "Failed to create", life: 3000 });
        }
      });
  };

  const startEdit = (ind) => {
    setEditingId(ind._id);
    setName(ind.name);
    setCategory(ind.category); // <-- set category here
    setIsActive(!!ind.isActive);
    setShowEditModal(true);
  };

  const handleEdit = (e) => {
  e.preventDefault();
  if (!editingId) return;
  const payload = { name, category, isActive };

  fetch(`/api/love-languages/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((r) => r.json())
    .then((res) => {
      if (res?.status === 200) {
        toast.current?.show({ severity: "success", summary: "Updated", detail: "Record updated", life: 2500 });
        setShowEditModal(false);
        setEditingId(null);
        setName("");
        setCategory("");
        setIsActive(true);

        // Update locally instead of fetching all
        setData((prevData) =>
          prevData.map((item) =>
            item._id === editingId ? { ...item, name, category, isActive } : item
          )
        );
      } else {
        toast.current?.show({ severity: "error", summary: "Error", detail: res?.message || "Failed to update", life: 3000 });
      }
    });
};

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
    confirmDialog({
      message: "Do you want to delete this record?",
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
    fetch(`/api/love-languages/${pendingDeleteId}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((res) => {
        if (res?.status === 200) {
          toast.current?.show({ severity: "info", summary: "Deleted", detail: "Record removed", life: 2500 });
          fetchIndustries();
        } else {
          toast.current?.show({ severity: "warn", summary: "Failed", detail: res?.message || "Could not delete", life: 3000 });
        }
      })
      .finally(() => setPendingDeleteId(null));
  };

  return (
    <div className="flex flex-col user_table">
      <h4 className="page_title">Love Languages </h4>

      <div className="user_header flex items-center justify-end pb-3">
        <div className="search_main">
          <input
            className="search_input"
            type="text"
            placeholder="Search (name/category/status)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button className="all_btn pt_12 pb_12" onClick={() => setShowModal(true)}>
          Add Record
        </button>
      </div>

      <div className="rounded-0 border bg-white">
        <div className="px-0 pt-0 pb-[4px] table_wrapper">
          <table className="w-full min-w-[723px] table_main">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">
                  Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                {/* <th onClick={() => handleSort("category")} className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">
                  Category {sortConfig.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th> */}
                <th onClick={() => handleSort("isActive")} className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">
                  Status {sortConfig.key === "isActive" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-4 px-5">Loading...</td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 px-5">No records found.</td>
                </tr>
              ) : (
                currentData.map((row) => (
                  <tr key={row._id}>
                    <td className="py-[10px] px-5 border-b border-blue-gray-50">{row.name}</td>
                    {/* <td className="py-[10px] px-5 border-b border-blue-gray-50">{row.category}</td> */}
                    <td className="py-[10px] px-5 border-b border-blue-gray-50">{row.isActive ? "Active" : "Inactive"}</td>
                    <td className="py-[10px] px-5 border-b border-blue-gray-50 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <i className="edit_dlt_icon" onClick={() => startEdit(row)}>
                          <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </i>
                        <i onClick={() => confirmDelete(row._id)} className="edit_dlt_icon">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="24" height="24" fill="red">
                            <path d="M 14.984375 2.4863281 A 1 1 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1 1 0 0 0 7.5 5 L 6 5 A 1 1 0 1 0 6 7 L 24 7 A 1 1 0 1 0 24 5 L 22.5 5 A 1 1 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1 1 0 0 0 14.984375 2.4863281 z M 6 9 L 7.8 24.2 C 7.9 25.2 8.8 26 9.8 26 H 20.2 C 21.2 26 22.1 25.2 22.2 24.2 L 24 9 Z" />
                          </svg>
                        </i>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Pagination */}
      <div className="flex items-center justify-between border-t pt-2 pagination_main">
        <div className="text-gray-700 text-sm font-medium">Total Records: {totalItems}</div>

        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-2 py-1 rounded border text-gray-600 disabled:opacity-30">&lt;</button>
          {getPageNumbers().map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded border text-sm ${currentPage === page ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-700"}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-2 py-1 rounded border text-gray-600 disabled:opacity-30">&gt;</button>
        </div>

        <div className="text-sm text-gray-700 flex items-center gap-2 show_page">
          <span>Show per Page:</span>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded px-2 py-1 text-sm">
            {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="popup_main" aria-hidden="true">
          <div className="popup_main_inner">
            <div className="popup_header">
              <h3>Add Record</h3>
              <div className="popup_icon" onClick={() => setShowModal(false)}><button>✕</button></div>
            </div>
            <div className="p-4 popup_body">
              <form className="space-y-4" onSubmit={handleCreate}>
                <div className="form_row">
                  <div className="form_row_li w-full">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>
                <div className="form_row">
                  {/* <div className="form_row_li w-full">
                    <label className="form-label">Category</label>
                    <input type="text" className="form-control" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                  </div> */}
                </div>
                <div className="form_row">
                  <div className="form_row_li w-full flex items-center gap-2">
                    <input id="isActiveAdd" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    <label htmlFor="isActiveAdd" className="form-label">Active</label>
                  </div>
                </div>
                <div className="popup_btns">
                  <button type="button" className="all_btn gray_color" onClick={() => { setShowModal(false); setName(""); setIsActive(true); }}>Cancel</button>
                  <button type="submit" className="all_btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="popup_main" aria-hidden="true">
          <div className="popup_main_inner max-w-[600px]">
            <div className="popup_header">
              <h3>Edit Record</h3>
              <div className="popup_icon" onClick={() => setShowEditModal(false)}><button>✕</button></div>
            </div>
            <div className="p-4 popup_body">
              <form className="space-y-4" onSubmit={handleEdit}>
                <div className="form_row">
                  <div className="form_row_li w-full">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>
                <div className="form_row">
                  {/* <div className="form_row_li w-full">
                    <label className="form-label">Category</label>
                    <input type="text" className="form-control" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                  </div> */}
                </div>
                <div className="form_row">
                  <div className="form_row_li w-full flex items-center gap-2">
                    <input id="isActiveEdit" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    <label htmlFor="isActiveEdit" className="form-label">Active</label>
                  </div>
                </div>
                <div className="popup_btns">
                  <button type="button" className="all_btn gray_color" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="all_btn">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
