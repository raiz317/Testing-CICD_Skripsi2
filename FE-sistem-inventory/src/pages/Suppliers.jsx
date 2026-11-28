import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import AddSupplierModal from "../components/AddSupplierModal.jsx";
import EditSupplierModal from "../components/EditSupplierModal.jsx";
import "../styles/supplier.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Suppliers(props) {
  const { suppliers, setSuppliers, user, onLogout } = props;
  const name = user ? user.username : "Pengguna";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [addSupplierForm, setAddSupplierForm] = useState({
    supplier: "",
    industry: "",
    email: "",
    phone: "",
  });

  const uniqueIndustries = useMemo(() => {
    return [...new Set(suppliers.map((sup) => sup.industry))];
  }, [suppliers]);

  const [editingSupplier, setEditingSupplier] = useState({
    id: "",
    supplier: "",
    industry: "",
    email: "",
    phone: "",
  });

  const [filter, setFilter] = useState({
    industry: "",
    searchQuery: "",
  });

  // ===== PAGINATION STATE =====
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  function handleSearchAndFilter(event) {
    const { name, value } = event.target;
    setFilter((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    setCurrentPage(1); // reset ke halaman 1
  }

  function handleFormSupplier(event) {
    const { name, value } = event.target;
    setAddSupplierForm((prevSupplier) => ({
      ...prevSupplier,
      [name]: value,
    }));
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (
      !addSupplierForm.supplier ||
      !addSupplierForm.industry ||
      !addSupplierForm.email ||
      !addSupplierForm.phone
    ) {
      alert("Tolong isi semua kolom formulir!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/suppliers", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier: addSupplierForm.supplier,
          industry: addSupplierForm.industry,
          email: addSupplierForm.email,
          phone: addSupplierForm.phone,
        }),
      });

      if (!response.ok) throw new Error("Gagal menambah supplier");
      const insertedSupplier = await response.json();

      setSuppliers((prevSupplier) => [...prevSupplier, insertedSupplier]);
      setAddSupplierForm({ supplier: "", industry: "", email: "", phone: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan supplier ke server.");
    }
  }

  function openEditModal(supplier) {
    setEditingSupplier(supplier);
    setIsEditModalOpen(true);
  }

  function handleEditFormChange(event) {
    const { name, value } = event.target;
    setEditingSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleFormEditSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/suppliers/${editingSupplier.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplier: editingSupplier.supplier,
            industry: editingSupplier.industry,
            email: editingSupplier.email,
            phone: editingSupplier.phone,
          }),
        },
      );

      if (!response.ok) throw new Error("Gagal mengedit supplier");

      setSuppliers((prevSupplier) => {
        return prevSupplier.map((sup) => {
          if (sup.id === editingSupplier.id) {
            return {
              id: editingSupplier.id,
              supplier: editingSupplier.supplier,
              industry: editingSupplier.industry,
              email: editingSupplier.email,
              phone: editingSupplier.phone,
            };
          }
          return sup;
        });
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data supplier di server.");
    }
  }

  async function deleteSupplier(id) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus supplier ini?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/suppliers/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Gagal menghapus supplier");
      setSuppliers((prevValue) => prevValue.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus supplier dari server.");
    }
  }

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchIndustry =
        filter.industry === "" ||
        supplier.industry.toLowerCase() === filter.industry.toLowerCase();
      const matchSearch =
        filter.searchQuery === "" ||
        supplier.supplier
          .toLowerCase()
          .includes(filter.searchQuery.toLowerCase()) ||
        supplier.industry
          .toLowerCase()
          .includes(filter.searchQuery.toLowerCase());
      return matchIndustry && matchSearch;
    });
  }, [suppliers, filter]);

  // ===== PAGINATION LOGIC =====
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (safeCurrentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          safeCurrentPage - 1,
          safeCurrentPage,
          safeCurrentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div>
      <Sidebar user={name} onLogout={onLogout} />
      <div className="supplier-content">
        <div className="header-supplier">
          <h2>Supplier Management</h2>
          <button
            className="btn-add-supplier"
            onClick={() => setIsModalOpen(true)}
          >
            Add Supplier
          </button>
        </div>

        <div className="filter-search-supplier">
          <div className="filter-supplier">
            <div className="filter-group">
              <label htmlFor="industrySelect" className="filter-label">
                Industry
              </label>
              <div className="select-wrapper">
                <select
                  id="industrySelect"
                  name="industry"
                  value={filter.industry}
                  onChange={handleSearchAndFilter}
                  className="filter-select"
                >
                  <option value="">Pilih Industry</option>
                  {uniqueIndustries.map((ind, index) => (
                    <option key={index} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="search-group">
              <input
                type="text"
                name="searchQuery"
                placeholder="Search Supplier..."
                value={filter.searchQuery}
                onChange={handleSearchAndFilter}
                className="search-input"
                autoComplete="off"
              />
            </div>
            <div className="button-group">
              <button type="button" className="btn-search">
                Search
              </button>
              <button
                type="button"
                className="btn-clear"
                onClick={() => {
                  setFilter({ industry: "", searchQuery: "" });
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="table-low-item">
            <h2>Daftar Supplier</h2>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Supplier</th>
                    <th>Industry</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSuppliers.length > 0 ? (
                    currentSuppliers.map((supplier, index) => (
                      <tr key={supplier.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{supplier.supplier}</td>
                        <td>{supplier.industry}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.phone}</td>
                        <td>
                          <IconButton
                            className="btn-edit-supplier"
                            onClick={() => openEditModal(supplier)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className="btn-del-supplier"
                            onClick={() => deleteSupplier(supplier.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          color: "#64748b",
                          padding: "24px",
                        }}
                      >
                        Supplier tidak ditemukan...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ===== PAGINATION UI ===== */}
            {totalItems > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Menampilkan {startIndex + 1}–{Math.min(endIndex, totalItems)}{" "}
                  dari {totalItems} supplier
                </div>

                <div className="pagination-controls">
                  <div className="items-per-page">
                    <label htmlFor="itemsPerPage">Tampilkan:</label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="items-per-page-select"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                  >
                    ‹ Prev
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="pagination-ellipsis"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`pagination-btn ${
                          page === safeCurrentPage ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                  >
                    Next ›
                  </button>
                </div>
              </div>
            )}

            <AddSupplierModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              addSupplierForm={addSupplierForm}
              handleFormSupplier={handleFormSupplier}
              handleFormSubmit={handleFormSubmit}
            />

            <EditSupplierModal
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              editingSupplier={editingSupplier}
              handleEditFormChange={handleEditFormChange}
              handleFormEditSubmit={handleFormEditSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
