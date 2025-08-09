"use client";
import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  TrendingUp,
  Calendar,
  Receipt,
  Sparkles,
  Eye,
  EyeOff,
  Menu,
  X,
} from "lucide-react";
import { loadExpenses, updateExpenses, Expense } from "../lib/storage";

const categories = [
  {
    value: "Zepto/Blinkit",
    icon: "🛒",
    color: "from-purple-700 to-purple-900",
  },
  {
    value: "Swiggy/Zomato",
    icon: "🍕",
    color: "from-red-500 to-orange-600",
  },
  {
    value: "Office Lunch",
    icon: "🍲",
    color: "from-emerald-500 to-teal-600",
  },
  {
    value: "Needs 24",
    icon: "🏪",
    color: "from-green-500 to-lime-600",
  },
  {
    value: "Rapido",
    icon: "🏍️",
    color: "from-yellow-300 to-yellow-500",
  },
  {
    value: "Shopping",
    icon: "👕",
    color: "from-pink-500 to-rose-600",
  },
  {
    value: "Investing",
    icon: "📈",
    color: "from-indigo-500 to-purple-600",
  },
  {
    value: "Bills",
    icon: "🧾",
    color: "from-yellow-500 to-amber-600",
  },
];

const amountSuggestions = [50, 100, 200, 500, 1000, 2000, 5000];

export default function ExpenseTracker() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState("Zepto/Blinkit");
  const [subCategory, setSubCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [activeView, setActiveView] = useState("form"); // 'form' or 'records'

  const getTodayExpenses = () => {
    const today = new Date().toISOString().slice(0, 10);
    return loadExpenses().filter((expense) => expense.date === today);
  };

  useEffect(() => {
    setExpenses(getTodayExpenses());
  }, []);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const allExpenses = loadExpenses();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    const updatedExpenses = [newExpense, ...allExpenses];
    updateExpenses(updatedExpenses);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    const allExpenses = loadExpenses();
    const filteredExpenses = allExpenses.filter((e) => e.id !== id);
    updateExpenses(filteredExpenses);
    setExpenses(getTodayExpenses());
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      const amt = parseFloat(amount);
      if (!amt || !category) {
        alert("Please add amount and category");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      addExpense({
        date,
        category,
        subCategory,
        amount: amt,
        note: note || undefined,
      });

      setExpenses(getTodayExpenses());
      setAmount("");
      setNote("");
      setSubCategory("");
      setShowSuccess(true);

      // Switch to records view on mobile after adding
      if (window.innerWidth < 1024) {
        setActiveView("records");
      }

      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Expense added successfully!</span>
          </div>
        </div>
      )}

      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveView("form")}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            activeView === "form"
              ? "bg-gradient-to-r from-cyan-500 to-emerald-900 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Add Expense
        </button>
        <button
          onClick={() => setActiveView("records")}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            activeView === "records"
              ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Today's Records
        </button>
      </div>

      {/* Desktop: Side by Side, Mobile: Stacked with Toggle */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Form Panel */}
        <div
          className={`w-full lg:w-2/5 ${
            activeView === "form" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-cyan-900 p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Add Expense</h2>
                  <p className="text-purple-100 text-sm">
                    Track your daily spending
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Date */}
              <div className="space-y-3">
                <label
                  htmlFor="date"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  max={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* Category */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Receipt className="w-4 h-4" />
                  Category
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {categories.map((c) => {
                    const selected = category === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          selected
                            ? `bg-gradient-to-br ${c.color} shadow-xl scale-105`
                            : "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <span className="text-2xl">{c.icon}</span>
                          <span
                            className={`text-xs font-bold truncate w-full text-center ${
                              selected
                                ? "text-white"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {c.value.split("/")[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub Category */}
              <div className="space-y-3">
                <label
                  htmlFor="subCategory"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  🏷️ Sub Category (optional)
                </label>
                <input
                  id="subCategory"
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="e.g. Groceries, Restaurant"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* Amount */}
              <div className="space-y-4">
                <label
                  htmlFor="amount"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  <TrendingUp className="w-4 h-4" />
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg select-none">
                    ₹
                  </span>
                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 p-4 text-xl font-bold rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {amountSuggestions.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        amount === amt.toString()
                          ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <label
                  htmlFor="note"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  📝 Note (optional)
                </label>
                <input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Team lunch, Monthly groceries"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSubmit}
                className={`relative w-full py-4 mt-6 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300 transform overflow-hidden group ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-95"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Expense
                    </>
                  )}
                </span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Records Panel */}
        <div
          className={`flex-1 ${
            activeView === "records" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-900 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Today's Expenses</h2>
                    <p className="text-blue-100 text-sm">
                      {new Date().toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHideAmounts(!hideAmounts)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-white"
                  title={hideAmounts ? "Show amounts" : "Hide amounts"}
                >
                  {hideAmounts ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Content */}
              {expenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 select-none">
                  <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl border border-gray-300 dark:border-gray-600">
                    <div className="text-6xl mb-4 opacity-50">📊</div>
                    <p className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      No expenses yet
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Start tracking your spending today!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Expenses List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {expenses.map((expense, index) => {
                      const cat = categories.find(
                        (c) => c.value === expense.category
                      );
                      return (
                        <div
                          key={expense.id}
                          className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <div
                                className={`p-3 bg-gradient-to-br ${cat?.color} rounded-2xl shadow-lg flex items-center justify-center`}
                              >
                                <span className="text-xl">{cat?.icon}</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-gray-100 truncate text-lg">
                                  {expense.subCategory || expense.category}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm truncate mt-1">
                                  {expense.category}{" "}
                                  {expense.note && `• ${expense.note}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {hideAmounts
                                  ? "••••"
                                  : `₹${expense.amount.toLocaleString(
                                      "en-IN"
                                    )}`}
                              </p>
                              <button
                                onClick={() => deleteExpense(expense.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                                aria-label="Delete expense"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-600">
                      <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                        Today's Total
                      </span>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {hideAmounts
                          ? "••••••"
                          : `₹${totalAmount.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
