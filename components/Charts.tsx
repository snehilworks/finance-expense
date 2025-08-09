"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { loadExpenses } from "../lib/storage";
import { useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Define your categories with colors (match your expense tracker colors)
const categoryColors: Record<string, string> = {
  "Zepto/Blinkit": "#7c3aed", // bg-purple-600
  "Swiggy/Zomato": "#dc2626", // bg-red-600
  "Office Lunch": "#f97316", // bg-orange-600
  Groceries: "#16a34a", // bg-green-600
  Commute: "#2563eb", // bg-blue-600
  Shopping: "#db2777", // bg-pink-600
  Investing: "#14b8a6", // bg-teal-600
  Bills: "#eab308", // bg-yellow-500
};

export default function Charts() {
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM

  const [data, setData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });
  const [weekly, setWeekly] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });

  useEffect(() => {
    refresh();
  }, [month]);

  const refresh = () => {
    const all = loadExpenses();
    const [y, m] = month.split("-");
    const monthly = all.filter((it) => it.date.startsWith(`${y}-${m}`));

    const byCat: Record<string, number> = {};
    monthly.forEach((it) => {
      byCat[it.category] = (byCat[it.category] || 0) + it.amount;
    });

    setData({ labels: Object.keys(byCat), values: Object.values(byCat) });

    // weekly totals in the month
    const weeks: Record<string, number> = {};
    monthly.forEach((it) => {
      const d = new Date(it.date);
      const weekIdx = `${y}-${m}-w${Math.ceil(d.getDate() / 7)}`;
      weeks[weekIdx] = (weeks[weekIdx] || 0) + it.amount;
    });
    setWeekly({ labels: Object.keys(weeks), values: Object.values(weeks) });
  };

  // Generate color array for categories present in data
  const pieColors = data.labels.map(
    (label) => categoryColors[label] || "#888888"
  );

  return (
    <div className="space-y-4">
      <div className="card bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Monthly Charts</h3>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="text-sm border rounded px-2 py-1 bg-gray-800 border-gray-700 text-gray-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {data.labels.length === 0 ? (
              <div className="text-sm text-gray-500">No data</div>
            ) : (
              <Pie
                data={{
                  labels: data.labels,
                  datasets: [
                    {
                      data: data.values,
                      backgroundColor: pieColors,
                      borderColor: "#222",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: { color: "#ddd" },
                    },
                  },
                }}
              />
            )}
          </div>

          <div>
            {weekly.labels.length === 0 ? (
              <div className="text-sm text-gray-500">No data</div>
            ) : (
              <Bar
                data={{
                  labels: weekly.labels,
                  datasets: [
                    {
                      label: "Weekly spend",
                      data: weekly.values,
                      backgroundColor: "#2563eb", // consistent blue color for bars
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      ticks: { color: "#ddd" },
                      grid: { color: "#333" },
                    },
                    y: {
                      ticks: { color: "#ddd" },
                      grid: { color: "#333" },
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      labels: { color: "#ddd" },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
