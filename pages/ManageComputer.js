// pages/api/computers/[id].js
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";

const ManageComputer = () => {
  const [computers, setComputers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editModal, setEditModal] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedPricing, setEditedPricing] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchComputers = async () => {
      const res = await fetch("/api/computers");
      if (res.ok) {
        const data = await res.json();
        setComputers(data);
      } else {
        console.error("Error fetching computers");
      }
    };

    fetchComputers();
  }, []);

  const filteredComputers = computers.filter((computer) =>
    computer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastComputer = currentPage * itemsPerPage;
  const indexOfFirstComputer = indexOfLastComputer - itemsPerPage;
  const currentComputers = filteredComputers.slice(
    indexOfFirstComputer,
    indexOfLastComputer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (computer) => {
    setSelectedComputer(computer);
    setEditedName(computer.name);
    setEditedType(computer.type);
    setEditedStatus(computer.status);
    setEditedPricing(computer.pricing);
    setEditModal(true);
  };

  // Xử lý cập nhật thông tin máy tính
  const handleUpdate = async () => {
    const updatedComputer = {
      name: editedName,
      type: editedType,
      status: editedStatus,
      pricing: editedPricing,
    };
    if (confirm("Cập nhật thông tin?") == true) {
      alert("Đã cập nhật");
    } else {
      return;
    }
    // Gửi yêu cầu cập nhật
    const res = await fetch(`/api/computers/${selectedComputer.id}`, {
      method: "PATCH", // Changed method to PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedComputer),
    });

    if (res.ok) {
      setComputers((prevComputers) =>
        prevComputers.map((computer) =>
          computer.id === selectedComputer.id
            ? { ...computer, ...updatedComputer }
            : computer
        )
      );
      setEditModal(false);
    } else {
      console.error("Error updating computer");
    }
  };

  const handleDelete = (computer) => {
    setSelectedComputer(computer);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    console.log(`Deleting computer with ID: ${selectedComputer.id}`);

    const res = await fetch(`/api/computers/${selectedComputer.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setComputers(
        computers.filter((computer) => computer.id !== selectedComputer.id)
      );
      setDeleteModal(false);
    } else {
      console.error("Error deleting computer");
    }
  };

  return (
    <Layout>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Danh Sách Máy Tính</h2>
          <Link href={"/AddComputerForm"}>
            <button className="btn btn-primary">Thêm Máy Tính</button>
          </Link>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "900px" }}
            />
          </div>

          <table className="hope-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Loại</th>
                <th>Trạng Thái</th>
                <th>Giá</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {currentComputers.map((computer, index) => (
                <tr key={computer.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{computer.name}</td>
                  <td>{computer.type}</td>
                  <td>{computer.status}</td>
                  <td>{computer.pricing}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(computer)}>
                      Sửa
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(computer)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <span>
              Showing {indexOfFirstComputer + 1} to {indexOfLastComputer} of{" "}
              {filteredComputers.length} entries
            </span>
            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}>
                Previous
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastComputer >= filteredComputers.length}>
                Next
              </button>
            </div>
          </div>

          {/* Popup Modal for Delete Confirmation */}
          {deleteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Xác Nhận Xóa</h3>
                <p>Bạn có chắc chắn muốn xóa máy tính này?</p>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Xóa
                </button>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => setDeleteModal(false)}>
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Popup Modal for Editing */}
          {editModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Chỉnh Sửa Máy Tính</h3>
                <input
                  type="text"
                  placeholder="Tên máy tính"
                  className="form-control mb-3"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Loại máy tính"
                  className="form-control mb-3"
                  value={editedType}
                  onChange={(e) => setEditedType(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Trạng thái"
                  className="form-control mb-3"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Giá"
                  className="form-control mb-3"
                  value={editedPricing}
                  onChange={(e) => setEditedPricing(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleUpdate}>
                  Cập Nhật
                </button>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => setEditModal(false)}>
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .hope-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          text-align: center;
        }
        .hope-table th,
        .hope-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        .hope-table th {
          background-color: #f2f2f2;
        }
      `}</style>
    </Layout>
  );
};

export default ManageComputer;
