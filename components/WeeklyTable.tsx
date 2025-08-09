"use client";
import { useState, useEffect } from "react";
import {
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { loadExpenses, updateExpenses, Expense } from "../lib/storage";

const categories = [
  {
    value: "Zepto/Blinkit",
    icon: "🛒",
    color: "from-cyan-700 to-cyan-900",
  },
  { value: "Swiggy/Zomato", icon: "🍕", color: "from-red-500 to-orange-600" },
  { value: "Office Lunch", icon: "🍲", color: "from-emerald-500 to-teal-600" },
  { value: "Needs 24", icon: "🏪", color: "from-green-500 to-lime-600" },
  { value: "Rapido", icon: "🏍️", color: "from-yellow-300 to-yellow-500" },
  { value: "Shopping", icon: "👕", color: "from-pink-500 to-rose-600" },
  { value: "Investing", icon: "📈", color: "from-indigo-500 to-cyan-600" },
  { value: "Bills", icon: "🧾", color: "from-yellow-500 to-amber-600" },
];

function weekStart(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0-6
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatDateRange(start: Date, end: Date) {
  const startStr = start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const endStr = end.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

export default function WeeklyTable() {
  const [refDate, setRefDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [items, setItems] = useState<Expense[]>([]);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [previousWeekTotal, setPreviousWeekTotal] = useState<number>(0);

  useEffect(() => {
    loadForWeek(refDate);
    loadPreviousWeekTotal(refDate);
  }, [refDate]);

  const loadForWeek = (dateStr: string) => {
    const all = loadExpenses();
    const start = weekStart(dateStr);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const filtered = all.filter((it) => {
      const d = new Date(it.date);
      d.setHours(0, 0, 0, 0);
      return d >= start && d <= end;
    });
    setItems(filtered.sort((a, b) => a.date.localeCompare(b.date)));
  };

  const loadPreviousWeekTotal = (dateStr: string) => {
    const all = loadExpenses();
    const currentStart = weekStart(dateStr);
    const prevStart = new Date(currentStart);
    prevStart.setDate(currentStart.getDate() - 7);
    const prevEnd = new Date(prevStart);
    prevEnd.setDate(prevStart.getDate() + 6);

    const prevWeekExpenses = all.filter((it) => {
      const d = new Date(it.date);
      d.setHours(0, 0, 0, 0);
      return d >= prevStart && d <= prevEnd;
    });

    const prevTotal = prevWeekExpenses.reduce((s, i) => s + i.amount, 0);
    setPreviousWeekTotal(prevTotal);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const current = new Date(refDate);
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + (direction === "prev" ? -7 : 7));
    setRefDate(newDate.toISOString().slice(0, 10));
  };

  const goToCurrentWeek = () => {
    setRefDate(new Date().toISOString().slice(0, 10));
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const total = items.reduce((s, i) => s + i.amount, 0);
  const weeklyChange =
    previousWeekTotal > 0
      ? ((total - previousWeekTotal) / previousWeekTotal) * 100
      : 0;

  const grouped = items.reduce((acc: any, it) => {
    acc[it.category] = acc[it.category] || { total: 0, subs: {}, items: [] };
    acc[it.category].total += it.amount;
    acc[it.category].items.push(it);
    const sub = it.subCategory || "Other";
    acc[it.category].subs[sub] = (acc[it.category].subs[sub] || 0) + it.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(grouped).sort(
    ([, a]: any, [, b]: any) => b.total - a.total
  );

  const remove = (id: string) => {
    const all = loadExpenses().filter((x) => x.id !== id);
    updateExpenses(all);
    loadForWeek(refDate);
    loadPreviousWeekTotal(refDate);
  };

  const start = weekStart(refDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Weekly Overview</h2>
                <p className="text-indigo-100 text-sm">
                  {formatDateRange(start, end)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setHideAmounts(!hideAmounts)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-white"
              title={hideAmounts ? "Show amounts" : "Hide amounts"}
            >
              {hideAmounts ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateWeek("prev")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Week
            </button>

            <button
              onClick={goToCurrentWeek}
              className="px-4 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all duration-300 font-semibold"
            >
              Current Week
            </button>

            <button
              onClick={() => navigateWeek("next")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              Next Week
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    Total Spending
                  </p>
                  <p className="text-3xl font-black text-gray-900 dark:text-gray-100">
                    {hideAmounts
                      ? "••••••"
                      : `₹${total.toLocaleString("en-IN")}`}
                  </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                    Total Items
                  </p>
                  <p className="text-3xl font-black text-gray-900 dark:text-gray-100">
                    {items.length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-2xl">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div
              className={`bg-gradient-to-br ${
                weeklyChange >= 0
                  ? "from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20"
                  : "from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20"
              } rounded-2xl p-6 border ${
                weeklyChange >= 0
                  ? "border-red-200 dark:border-red-800"
                  : "border-green-200 dark:border-green-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`${
                      weeklyChange >= 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    } text-sm font-semibold`}
                  >
                    vs Last Week
                  </p>
                  <p className="text-3xl font-black text-gray-900 dark:text-gray-100">
                    {weeklyChange >= 0 ? "+" : ""}
                    {weeklyChange.toFixed(1)}%
                  </p>
                </div>
                <div
                  className={`p-3 ${
                    weeklyChange >= 0 ? "bg-red-500" : "bg-green-500"
                  } rounded-2xl`}
                >
                  {weeklyChange >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-500 p-6">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-xl">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Category Breakdown
              </h3>
              <p className="text-gray-900 text-sm">Detailed expense analysis</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
              <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl border border-gray-300 dark:border-gray-600">
                <div className="text-6xl mb-4 opacity-50">📊</div>
                <p className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  No expenses this week
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Start tracking your spending!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map(([cat, val]: any) => {
                const categoryConfig = categories.find((c) => c.value === cat);
                const isExpanded = expandedCategories.has(cat);
                const percentage = ((val.total / total) * 100).toFixed(1);

                return (
                  <div
                    key={cat}
                    className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                      onClick={() => toggleCategory(cat)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 bg-gradient-to-br ${
                              categoryConfig?.color ||
                              "from-gray-500 to-gray-700"
                            } rounded-2xl shadow-lg`}
                          >
                            <span className="text-2xl">
                              {categoryConfig?.icon || "📦"}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                {cat}
                              </h4>
                              <span className="text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full font-semibold">
                                {percentage}%
                              </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              {val.items.length} transaction
                              {val.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                              {hideAmounts
                                ? "••••"
                                : `₹${val.total.toLocaleString("en-IN")}`}
                            </p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                              <div
                                className={`bg-gradient-to-r ${
                                  categoryConfig?.color ||
                                  "from-gray-500 to-gray-700"
                                } h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={`transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        {/* Sub Categories */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {Object.entries(val.subs).map(([sub, amt]: any) => (
                              <div
                                key={sub}
                                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                      {sub}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {
                                        val.items.filter(
                                          (item: any) =>
                                            (item.subCategory || "Other") ===
                                            sub
                                        ).length
                                      }{" "}
                                      items
                                    </p>
                                  </div>
                                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                    {hideAmounts
                                      ? "••••"
                                      : `₹${amt.toLocaleString("en-IN")}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Individual Items */}
                          <div className="space-y-3">
                            <h5 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                              Individual Transactions
                            </h5>
                            {val.items
                              .sort((a: Expense, b: Expense) =>
                                b.date.localeCompare(a.date)
                              )
                              .map((item: Expense, index: number) => (
                                <div
                                  key={item.id}
                                  className="group flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full"></div>
                                      <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                          {item.subCategory || "Other"}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>
                                            {new Date(
                                              item.date
                                            ).toLocaleDateString("en-IN")}
                                          </span>
                                          {item.note && (
                                            <>
                                              <span>•</span>
                                              <span className="truncate max-w-40">
                                                {item.note}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                      {hideAmounts
                                        ? "••••"
                                        : `₹${item.amount.toLocaleString(
                                            "en-IN"
                                          )}`}
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        remove(item.id);
                                      }}
                                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                                      aria-label="Delete expense"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
