import { useState } from "react";
import Papa from "papaparse";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "./App.css";

const COLORS = ["#6c63ff", "#4ecdc4", "#ff6b6b", "#ffd93d", "#a29bfe", "#fd79a8"];

export default function App() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => setData(result.data),
    });
  }

  function getTotal() {
    const total = data.reduce((sum, row) => {
      return sum + (parseFloat(row.Sales) || 0);
    }, 0);
    return total.toLocaleString();
  }

  function getAverage() {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, row) => sum + (parseFloat(row.Sales) || 0), 0);
    return (total / data.length).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function getChartData() {
    const grouped = {};
    data.forEach((row) => {
      const region = row.Region || "Unknown";
      const sales = parseFloat(row.Sales) || 0;
      grouped[region] = (grouped[region] || 0) + sales;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }

  const chartData = getChartData();

  return (
    <div>
      <h1>📊 Sales Dashboard</h1>
      <p className="subtitle">Upload a CSV file to visualize your sales data</p>

      <label className="upload-area">
        <div style={{ fontSize: "32px" }}>☁️</div>
        <p><span>Click to upload</span> a CSV file</p>
        {fileName && (
          <p style={{ color: "#4ecdc4", marginTop: "8px" }}>✅ {fileName} loaded</p>
        )}
        <input
          type="file"
          accept=".csv"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </label>

      {data.length > 0 && (
        <>
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="label">Total Sales</div>
              <div className="value">{getTotal()}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Average Sales</div>
              <div className="value">{getAverage()}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Total Rows</div>
              <div className="value">{data.length}</div>
            </div>
          </div>

          <div className="chart-box">
            <h2>Sales by Region</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3348" />
                <XAxis dataKey="name" tick={{ fill: "#9198b0", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9198b0", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1d27",
                    border: "1px solid #2e3348",
                    borderRadius: "8px",
                    color: "#e8eaf0",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}