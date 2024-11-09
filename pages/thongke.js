import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2"; // Import biểu đồ cột và đường
import "chart.js/auto";
import Layout from "@/components/Layout";

const ThongKe = () => {
  const [transactions, setTransactions] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("/api/transactions");
      const result = await response.json();
      const isArrayResult = Array.isArray(result);
      if (isArrayResult) {
        setTransactions(result);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length === 0) return;

    // Thống kê doanh thu theo ngày (30 ngày gần nhất)
    const dailyStats = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.startTime).toLocaleDateString();
      acc[date] = (acc[date] || 0) + transaction.cost;
      return acc;
    }, {});

    // Lấy 30 ngày gần nhất
    const last30Days = Object.entries(dailyStats)
      .slice(-30)
      .map(([date, total]) => ({ date, total }));

    setDailyData(last30Days);

    // Thống kê doanh thu theo tháng (12 tháng gần nhất)
    const monthlyStats = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.startTime);
      const month = date.getMonth() + 1; // Lấy số tháng (0-11) và cộng thêm 1
      const year = date.getFullYear();
      const monthYear = `${month}/${year}`; // Định dạng tháng/năm (12/2024)

      acc[monthYear] = (acc[monthYear] || 0) + transaction.cost;
      return acc;
    }, {});

    // Lấy 12 tháng gần nhất
    const last12Months = Object.entries(monthlyStats)
      .slice(-12)
      .map(([monthYear, total]) => {
        const [month] = monthYear.split("/"); // Chỉ lấy số tháng
        return { month: month, total }; // Đối tượng mới chỉ có số tháng
      });

    setMonthlyData(last12Months);

    // Thống kê doanh thu theo năm
    const yearlyStats = transactions.reduce((acc, transaction) => {
      const year = new Date(transaction.startTime).getFullYear();
      acc[year] = (acc[year] || 0) + transaction.cost;
      return acc;
    }, {});

    setYearlyData(
      Object.entries(yearlyStats).map(([year, total]) => ({ year, total }))
    );
  }, [transactions]);

  // Cấu hình dữ liệu biểu đồ cho doanh thu theo ngày
  const dailyChartData = {
    labels: dailyData.map((item) => item.date),
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: dailyData.map((item) => item.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Màu nền cột
        borderColor: "rgba(75, 192, 192, 1)", // Màu viền cột
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình dữ liệu biểu đồ cho doanh thu theo tháng
  const monthlyChartData = {
    labels: monthlyData.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: monthlyData.map((item) => item.total),
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Màu nền đường
        borderColor: "rgba(153, 102, 255, 1)", // Màu viền đường
        borderWidth: 2,
        fill: true, // Điền màu dưới đường
      },
    ],
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-center mb-4 text-white">Thống kê doanh thu</h1>
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Biểu đồ doanh thu theo ngày (30 ngày gần nhất)
                </h5>
                <Bar data={dailyChartData} options={{ responsive: true }} />
              </div>
            </div>
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">
                  Biểu đồ doanh thu theo tháng (12 tháng gần nhất)
                </h5>
                <Line data={monthlyChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Doanh thu theo năm</h5>
                <ul className="list-group">
                  {yearlyData.map((item, index) => (
                    <li className="list-group-item" key={index}>
                      Năm {item.year}: {item.total.toLocaleString()} VNĐ
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThongKe;
