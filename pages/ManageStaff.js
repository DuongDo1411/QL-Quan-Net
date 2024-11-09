// pages/api/staff/[id].js
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editModal, setEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [updatePasswordModal, setUpdatePasswordModal] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await fetch("/api/staff");

      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      } else {
        console.error("Error fetching staff");
      }
    };

    fetchStaff();
  }, []);

  const filteredStaff = staffList.filter((staff) =>
    staff.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStaff = currentPage * itemsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdatePassword = async () => {
    // Mã hóa mật khẩu mới trước khi gửi lên server
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 là số lần băm (salt rounds)

    const updatedPassword = {
      password: hashedPassword, // Sử dụng mật khẩu đã được mã hóa
    };

    const res = await fetch(`/api/staff/${selectedStaff.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPassword),
    });

    if (res.ok) {
      setUpdatePasswordModal(false);
      setNewPassword(""); // Reset password input
      window.location.reload();
      // Optionally refresh the staff list or provide a success message
    } else {
      console.error("Error updating password");
    }
  };
  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditedUsername(staff.username);
    setEditedRole(staff.role);
    setEditModal(true);
  };

  // Xử lý cập nhật thông tin nhân viên
  const handleUpdate = async () => {
    const updatedStaff = {
      username: editedUsername,
      role: editedRole,
    };

    // Gửi yêu cầu cập nhật
    const res = await fetch(`/api/staff/${selectedStaff.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStaff),
    });

    if (res.ok) {
      setStaffList((prevStaff) =>
        prevStaff.map((staff) =>
          staff.id === selectedStaff.id ? { ...staff, ...updatedStaff } : staff
        )
      );
      setEditModal(false);
    } else {
      console.error("Error updating staff");
    }
  };

  const handleDelete = (staff) => {
    setSelectedStaff(staff);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    const res = await fetch(`/api/staff/${selectedStaff.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setStaffList(staffList.filter((staff) => staff.id !== selectedStaff.id));
      setDeleteModal(false);
    } else {
      console.error("Error deleting staff");
    }
  };

  const handleConfirmChangePass = (staff) => {
    setSelectedStaff(staff);
    setUpdatePasswordModal(true);
  };

  return (
    <Layout>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Danh Sách Nhân Viên</h2>
          <Link href={"/AddStaff"}>
            <button className="btn btn-primary">Thêm Nhân Viên</button>
          </Link>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <form>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                style={{ width: "900px" }}
              />
            </form>
          </div>

          <table className="hope-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Đăng Nhập</th>
                <th>Vai Trò</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {currentStaff.map((staff, index) => (
                <tr key={staff.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{staff.username}</td>
                  <td>{staff.role}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleConfirmChangePass(staff)}>
                      Cập Nhật Mật Khẩu
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(staff)}>
                      Sửa
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(staff)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <span>
              Showing {indexOfFirstStaff + 1} to {indexOfLastStaff} of{" "}
              {filteredStaff.length} entries
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
                disabled={indexOfLastStaff >= filteredStaff.length}>
                Next
              </button>
            </div>
          </div>

          {/* Popup Modal for Delete Confirmation */}
          {deleteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Xác Nhận Xóa</h3>
                <p>Bạn có chắc chắn muốn xóa nhân viên này?</p>
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
                <h3>Chỉnh Sửa Nhân Viên</h3>
                <input
                  type="text"
                  placeholder="Tên Đăng Nhập"
                  className="form-control mb-3"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Vai Trò"
                  className="form-control mb-3"
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                />

                <button
                  className="btn btn-success"
                  onClick={() => handleUpdate()}>
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

          {updatePasswordModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Cập Nhật Mật Khẩu</h3>
                <input
                  type="password"
                  placeholder="Mật Khẩu Mới"
                  className="form-control mb-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={handleUpdatePassword}>
                  Cập Nhật
                </button>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => setUpdatePasswordModal(false)}>
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

export default ManageStaff;
