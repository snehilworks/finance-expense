import WeeklyTable from "../../components/WeeklyTable";

export default function Page() {
  return (
    <div className="space-y-4">
      <WeeklyTable />

      <div className="text-sm text-slate-500 mt-2">
        Tip: change the date in the top-right to view a specific week. Use Daily
        page to quickly add missed items.
      </div>
    </div>
  );
}
