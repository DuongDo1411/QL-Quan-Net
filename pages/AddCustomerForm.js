// components/AddCustomerForm.js
import Layout from "@/components/Layout";
import { useState } from "react";

const AddCustomerForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        balance: parseFloat(balance),
      }),
    });
    if (res.ok) {
      // Reset form và có thể thêm xử lý cập nhật danh sách khách hàng
      setUsername("");
      setPassword("");
      setBalance(0);
      alert("Customer added successfully");
    } else {
      alert("Failed to add customer");
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <form onSubmit={handleSubmit} className="form">
          <h3 className="text-center">Thêm Khách Hàng</h3>
          <div className="mb-3">
            <label className="form-label">Tên Đăng Nhập</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật Khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số Dư</label>
            <input
              type="number"
              className="form-control"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Thêm Khách Hàng
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCustomerForm;
