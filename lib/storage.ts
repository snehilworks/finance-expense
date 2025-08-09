export type Expense = {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  subCategory?: string;
  amount: number;
  note?: string;
};

const KEY = "expense_tracker_v1";

export const loadExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Expense[];
  } catch (e) {
    console.error("load error", e);
    return [];
  }
};

export const saveExpenses = (items: Expense[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const addExpense = (expense: Omit<Expense, "id">) => {
  const items = loadExpenses();
  const newItem: Expense = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    ...expense,
  };
  items.push(newItem);
  saveExpenses(items);
  return newItem;
};

export const updateExpenses = (items: Expense[]) => {
  saveExpenses(items);
};

export const clearAll = () => {
  localStorage.removeItem(KEY);
};

export function getTodayExpenses(): Expense[] {
  const today = new Date().toISOString().slice(0, 10);
  const expenses = loadExpenses();
  return expenses.filter((expense) => expense.date === today);
}

// For testing purposes
export function _clearStorage() {
  clearAll();
}
