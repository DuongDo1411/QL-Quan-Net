// pages/api/transaction/index.js
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

const ManageTransactions = () => {
  const [transactionList, setTransactionList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactionList(data);
      } else {
        console.error("Error fetching transactions");
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactionList.filter((transaction) =>
    transaction.customer.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Danh Sách Giao Dịch</h2>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
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
                <th>Tên Khách Hàng</th>
                <th>Thời Gian Bắt Đầu</th>
                <th>Thời Gian Kết Thúc</th>
                <th>Chi Phí</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr key={transaction.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{transaction.customer.username}</td>
                  <td>{new Date(transaction.startTime).toLocaleString()}</td>
                  <td>
                    {transaction.endTime
                      ? new Date(transaction.endTime).toLocaleString()
                      : "Đang tiến hành"}
                  </td>
                  <td>
                    {transaction.cost
                      ? `${Math.floor(transaction.cost).toLocaleString()} VNĐ`
                      : "Chưa xác định"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <span>
              Hiển thị {indexOfFirstTransaction + 1} đến{" "}
              {indexOfLastTransaction} trong {filteredTransactions.length} giao
              dịch
            </span>
            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastTransaction >= filteredTransactions.length}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
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

export default ManageTransactions;
