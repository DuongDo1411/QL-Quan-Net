import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const Computer = () => {
  const [computers, setComputers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState({});
  const [selectedComputerId, setSelectedComputerId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchComputers();
      await fetchCustomers();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (computers.length > 0) {
      fetchActiveTransactions();
    }
  }, [computers]);

  const fetchComputers = async () => {
    try {
      const res = await fetch("/api/computers");
      if (!res.ok) throw new Error("Error fetching computers");
      const data = await res.json();
      setComputers(data);
    } catch (error) {
      console.error("Error fetching computers:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Error fetching customers");
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchActiveTransactions = async () => {
    try {
      for (const computer of computers) {
        const res = await fetch(
          `/api/transactions/active?computerId=${computer.id}`
        );
        if (!res.ok) throw new Error("Error checking active transaction");
        const data = await res.json();
        setActiveTransaction((prev) => ({
          ...prev,
          [computer.id]: data.active ? data.transaction : null,
        }));
      }
    } catch (error) {
      console.error("Error checking active transactions:", error);
    }
  };

  const startTransaction = async () => {
    if (!selectedCustomerId || !selectedComputerId) {
      console.error("Chưa chọn khách hàng hoặc máy tính");
      return;
    }
    const computer = computers.find((comp) => comp.id === selectedComputerId);

    try {
      const res = await fetch("/api/transactions/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: parseInt(selectedCustomerId),
          computerId: selectedComputerId,
          ratePerHour: parseInt(computer.pricing),
        }),
      });

      if (!res.ok) throw new Error("Error starting transaction");

      const transaction = await res.json();
      setActiveTransaction((prev) => ({
        ...prev,
        [selectedComputerId]: transaction,
      }));

      await fetch(`/api/computers/${selectedComputerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "in-use" }),
      });
      setShowModal(false);
      setSelectedCustomerId(null);
      setSelectedComputerId(null);
    } catch (error) {
      console.error("Error starting transaction:", error);
    }
  };

  const endTransaction = async (computerId) => {
    const transaction = activeTransaction[computerId];
    if (!transaction) return;

    const computer = computers.find((comp) => comp.id === computerId);

    try {
      const res = await fetch("/api/transactions/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: transaction.id,
          customerId: transaction.customerId,
          ratePerHour: parseInt(computer.pricing),
        }),
      });

      if (!res.ok) throw new Error("Error ending transaction");

      const { transaction: updatedTransaction } = await res.json();

      await fetch(`/api/computers/${computerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "available" }),
      });

      setActiveTransaction((prev) => ({
        ...prev,
        [computerId]: null,
      }));
    } catch (error) {
      console.error("Error ending transaction:", error);
    }
  };

  return (
    <>
      {/* <Link href={"/AddComputerForm"}>
        <button className="btn btn-primary ms-3">Thêm Máy Tính</button>
      </Link> */}
      <div className="container-fluid content-inner mt-2 py-0">
        <div className="row">
          {computers.map((computer) => (
            <div key={computer.id} className="col-lg-3 col-md-6 mb-4">
              <div className="card backround-images">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setSelectedCustomerId(null);
                        setSelectedComputerId(computer.id);
                      }}
                      className="bg-white rounded p-3 btn btn-icon">
                      <svg
                        className="icon-20"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                          d="M12 5v14m7-7H5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div className="text-end">
                      <h3 className="card-title text-black">
                        Máy Tính {computer.name}
                      </h3>
                      <p className="text-black">
                        <strong>Giá: </strong>
                        {computer.pricing} / Giờ
                      </p>
                      {activeTransaction[computer.id] &&
                        !activeTransaction[computer.id].endTime && (
                          <button
                            onClick={() => endTransaction(computer.id)}
                            className="btn btn-danger mt-2">
                            Kết Thúc
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn Khách Hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            value={selectedCustomerId || ""}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="form-select">
            <option value="" disabled>
              Chọn khách hàng
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.username}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={startTransaction}>
            Bắt Đầu Giao Dịch
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Computer;
