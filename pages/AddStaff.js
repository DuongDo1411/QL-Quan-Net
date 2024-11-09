// pages/AddStaff.js
import Layout from "@/components/Layout";
import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter để điều hướng
import bcrypt from "bcryptjs"; // Import bcryptjs để mã hóa mật khẩu

const AddStaff = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff"); // Đặt mặc định cho role là 'staff'
  const router = useRouter(); // Khởi tạo router để điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mã hóa mật khẩu trước khi gửi
    const hashedPassword = await bcrypt.hash(password, 10); // Sử dụng bcrypt để mã hóa mật khẩu

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: hashedPassword, role }),
    });

    if (res.ok) {
      const newStaff = await res.json();
      console.log("Staff added:", newStaff);
      // Reset form fields
      setUsername("");
      setPassword("");
      setRole("staff"); // Reset role về giá trị mặc định
      // Điều hướng đến trang danh sách nhân viên (có thể là /staff hoặc một trang khác)
      router.push("/ManageStaff");
    } else {
      console.error("Error adding staff");
      // Xử lý lỗi
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="form">
        <h3 className="text-center">Thêm Nhân Viên</h3>
        <div>
          <label htmlFor="username">Tên Đăng Nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mật Khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Vai Trò:</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary mt-2" type="submit">
          Thêm Nhân Viên
        </button>
      </form>
    </Layout>
  );
};

export default AddStaff;
