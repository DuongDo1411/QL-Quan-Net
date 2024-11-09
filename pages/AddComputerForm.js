// components/AddComputerForm.js
import Layout from "@/components/Layout";
import { useState } from "react";

const AddComputerForm = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [pricing, setPricing] = useState(""); // Thêm trường pricing

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/computers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, type, status, pricing }), // Gửi pricing cùng với các trường khác
    });
    if (confirm("Thêm mới") === true) {
      alert("Đã thêm mới!");
    } else {
      return console.log("fail to save");
    }
    if (res.ok) {
      const newComputer = await res.json();
      console.log("Computer added:", newComputer);
      // Reset form fields or handle success
      setName("");
      setType("");
      setStatus("");
      setPricing(""); // Reset pricing
    } else {
      console.error("Error adding computer");
      // Handle error
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="form">
        <h3 className="text-center">Thêm Máy Tính</h3>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <input
            type="text"
            id="status"
            value={"available"}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="pricing">Pricing:</label>{" "}
          {/* Thêm label cho pricing */}
          <input
            type="text"
            id="pricing"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)} // Quản lý state cho pricing
            required
          />
        </div>
        <button className="btn btn-primary mt-2" type="submit">
          Add Computer
        </button>
      </form>
    </Layout>
  );
};

export default AddComputerForm;
