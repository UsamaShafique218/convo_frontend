import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
 

  const [form, setForm] = useState({ 
    author: "",
    content: "", 
    eventDate: "",
    isPublished: true,
  });
 
  const toast = useRef(null);

  // View
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPost, setViewPost] = useState(null);
  const [loadingView, setLoadingView] = useState(false);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

   

  const fetchPosts = () => {
  setLoading(true);
   fetch("/api/posts")
    .then((res) => res.json())
    .then((res) => {
      if (res?.status === 200 && Array.isArray(res?.data?.posts)) {
        setPosts(res.data.posts);
      } else {
        setPosts([]);
      }
      setLoading(false);
    })
    .catch(() => {
      setPosts([]);
      setLoading(false);
    });
};

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const compare = (a, b, key) => {
    if (key === "eventDate" || key === "createdAt") {
      const aTime = a[key] ? new Date(a[key]).getTime() : 0;
      const bTime = b[key] ? new Date(b[key]).getTime() : 0;
      return aTime - bTime;
    }
    
    // Handle author object comparison
    if (key === "author") {
      const aVal = typeof a[key] === 'object' ? a[key]?.name || "" : a[key] || "";
      const bVal = typeof b[key] === 'object' ? b[key]?.name || "" : b[key] || "";
      return aVal.toString().toLowerCase().localeCompare(bVal.toString().toLowerCase());
    }
    
    const aVal = (a[key] ?? "").toString().toLowerCase();
    const bVal = (b[key] ?? "").toString().toLowerCase();
    return aVal.localeCompare(bVal);
  };

  const processedData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let filtered = posts.filter((p) => {
      // Convert all values to string for searching, handling author object
      const searchString = Object.entries(p)
        .map(([key, value]) => {
          if (key === "author" && typeof value === 'object') {
            return value.name || "";
          }
          return value || "";
        })
        .join(" ")
        .toLowerCase();
      
      return searchString.includes(q);
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const cmp = compare(a, b, sortConfig.key);
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }
    return filtered;
  }, [posts, searchQuery, sortConfig]);

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
  
  // View
 

  const handleView = (id) => {
    setLoadingView(true);
    setShowViewModal(true);
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.status === 200) {
          setViewPost(res.data.post || res.data);
        } else {
          setViewPost(null);
        }
      })
      .catch(() => setViewPost(null))
      .finally(() => setLoadingView(false));
  };


  

  return (
    <div className="flex flex-col p-6">
      <h4 className="page_title mb-4 text-xl font-bold">Posts</h4> 
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
        {/* <button className="all_btn pt_12 pb_12" onClick={() => setShowModal(true)}>Add Post</button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full min-w-[723px] table_main">
          <thead>
            <tr>
              {["author", "content",  "eventDate", "createdAt"].map((col) => (
                <th
                  key={col}
                  className="cursor-pointer border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400"
                  onClick={() => handleSort(col)}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortConfig.key === col && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              <th className="border-b py-3 px-5 text-[11px] font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="py-4 text-center">Loading...</td></tr>
            ) : currentData.length === 0 ? (
              <tr><td colSpan="6" className="py-4 text-center">No posts found.</td></tr>
            ) : currentData.map((p) => (
              <tr key={p._id}>
                 <td className="py-[10px] px-5 border-b">
                  {typeof p.author === 'object' ? p.author.name || "-" : p.author || "-"}
                </td>
                <td className="py-[10px] px-5 border-b">{p.content ? `${p.content.substring(0, 50)}${p.content.length > 50 ? '...' : ''}` : "-"}</td> 
                <td className="py-[10px] px-5 border-b">{p.eventDate ? new Date(p.eventDate).toLocaleDateString() : "-"}</td>
                <td className="py-[10px] px-5 border-b">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                <td className="py-[10px] px-5 border-b text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="all_btn" onClick={() => handleView(p._id)}>View</button> 
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
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>&lt;</button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-sm ${currentPage === page ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-700"}`}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&gt;</button>
        </div>
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <span>Show per Page:</span>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <Toast ref={toast} />
      <ConfirmDialog />
 

      {/* View Modal */}
{showViewModal && (
  <div className="popup_main">
    <div className="popup_main_inner max-w-[800px]">
      <div className="popup_header">
        <h3>Post Detail</h3>
        <div className="popup_icon">
          <button onClick={() => { setShowViewModal(false); setViewPost(null); }}>✕</button>
        </div>
      </div>
      <div className="popup_body p-4">
        {loadingView ? (
          <div className="text-center py-6">Loading...</div>
        ) : !viewPost ? (
          <div className="text-center py-6">No details found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {/* 👇 yaha pe updated Object.entries wala code paste karo */}
            {Object.entries(viewPost).map(([key, value]) => {
              let displayValue = "-";

              if (key === "author") {
                displayValue = value?.name || "-";
              } 
              else if (Array.isArray(value)) {
                displayValue = value.length ? value.join(", ") : "-";
              } 
              else if (typeof value === "object" && value !== null) {
                if (value.name) {
                  displayValue = value.name; 
                } else {
                  displayValue = Object.entries(value)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ");
                }
              } 
              else if (key.toLowerCase().includes("date")) {
                displayValue = value ? new Date(value).toLocaleString() : "-";
              } 
              else {
                displayValue = value?.toString();
              }

              return (
                <p key={key}>
                  <strong>{key}:</strong> {displayValue}
                </p>
              );
            })}

            <div className="flex gap-2 mt-6 justify-end col-span-2">
              <button
                type="button"
                onClick={() => { setShowViewModal(false); setViewPost(null); }}
                className="all_btn gray_color"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}


    </div>
  );
}