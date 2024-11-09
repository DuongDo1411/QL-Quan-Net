// pages/api/customers/[id].js
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editModal, setEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedBalance, setEditedBalance] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [depositModal, setDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        console.error("Error fetching customers");
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditedUsername(customer.username);
    setEditedBalance(customer.balance);
    setEditedPassword(""); // Reset password field
    setEditModal(true);
  };

  // Xử lý cập nhật thông tin khách hàng
  const handleUpdate = async () => {
    const updatedCustomer = {
      username: editedUsername,
      balance: parseFloat(editedBalance), // Convert balance to a float
      ...(editedPassword && { password: editedPassword }), // Only include password if it's not empty
    };

    // Send update request
    const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
      method: "PATCH", // Changed method to PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCustomer),
    });

    if (res.ok) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === selectedCustomer.id
            ? { ...customer, ...updatedCustomer }
            : customer
        )
      );
      setEditModal(false);
    } else {
      console.error("Error updating customer");
    }
  };

  const handleDeposit = async () => {
    const depositAmountParsed = parseFloat(depositAmount);
    let bonus = 0;

    if (depositAmountParsed > 500000) {
      bonus = depositAmountParsed * 0.3;
    } else if (depositAmountParsed > 200000) {
      bonus = depositAmountParsed * 0.2;
    } else if (depositAmountParsed > 100000) {
      bonus = depositAmountParsed * 0.1;
    }

    const updatedBalance =
      selectedCustomer.balance + depositAmountParsed + bonus;

    const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ balance: updatedBalance }),
    });

    if (res.ok) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === selectedCustomer.id
            ? { ...customer, balance: updatedBalance }
            : customer
        )
      );
      setDepositModal(false);
      setDepositAmount(0);
    } else {
      console.error("Error depositing amount");
    }
  };

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    console.log(`Deleting customer with ID: ${selectedCustomer.id}`);

    const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCustomers(
        customers.filter((customer) => customer.id !== selectedCustomer.id)
      );
      setDeleteModal(false);
    } else {
      console.error("Error deleting customer");
    }
  };
  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ`;
  };
  return (
    <Layout>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Danh Sách Khách Hàng</h2>
          <Link href={"/AddCustomerForm"}>
            <button className="btn btn-primary">Thêm Khách Hàng</button>
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
                <th>Số Tiền Trong Tài Khoản</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{customer.username}</td>
                  <td>{formatCurrency(customer.balance)}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setDepositModal(true);
                      }}
                    >
                      Nạp Tiền
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(customer)}
                    >
                      Sửa
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(customer)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <span>
              Showing {indexOfFirstCustomer + 1} to {indexOfLastCustomer} of{" "}
              {filteredCustomers.length} entries
            </span>
            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastCustomer >= filteredCustomers.length}
              >
                Next
              </button>
            </div>
          </div>

          {/* Popup Modal for Deposit */}
          {depositModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Nạp Tiền</h3>
                <input
                  type="number"
                  placeholder="Số tiền nạp"
                  className="form-control mb-3"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleDeposit}>
                  Nạp
                </button>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => setDepositModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Popup Modal for Delete Confirmation */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác Nhận Xóa</h3>
            <p>Bạn có chắc chắn muốn xóa khách hàng này?</p>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Xóa
            </button>
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setDeleteModal(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal for Editing */}
      {editModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chỉnh Sửa Khách Hàng</h3>
            <input
              type="text"
              placeholder="Tên khách hàng"
              className="form-control mb-3"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
            />
            <input
              type="number"
              placeholder="Số tiền trong tài khoản"
              className="form-control mb-3"
              value={editedBalance}
              onChange={(e) => setEditedBalance(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới (nếu có)"
              className="form-control mb-3"
              value={editedPassword}
              onChange={(e) => setEditedPassword(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleUpdate}>
              Cập Nhật
            </button>
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setEditModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
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
          padding: 12px;
          border: 1px solid #e0e0e0;
        }
        .hope-table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .hope-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .hope-table tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </Layout>
  );
};

export default CustomerList;
