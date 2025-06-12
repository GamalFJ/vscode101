// Frontend Career Tracker App for Scrimba Frontend Developer Career Path
// With UI (React + Tailwind CSS)

import { useState } from 'react';

const START_DATE = new Date('2025-05-23');
const END_DATE = new Date('2025-06-19');
const TOTAL_HOURS = 81.5;
const HOURS_COMPLETED = 3;
const DAILY_GOAL = 3;

const MODULE_BREAKDOWN = [
  { module: "Intro to HTML", hours: 5 },
  { module: "CSS Basics", hours: 7 },
  { module: "Responsive Design", hours: 6 },
  { module: "JavaScript Basics", hours: 12 },
  { module: "JavaScript ES6+", hours: 8 },
  { module: "Working with APIs", hours: 6 },
  { module: "React Basics", hours: 10 },
  { module: "Advanced React", hours: 8 },
  { module: "Career Projects", hours: 12.5 },
  { module: "Bonus & Portfolio", hours: 7 }
];

function generateSchedule(start, end, dailyGoal) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TOTAL_DAYS = Math.ceil((end - start) / MS_PER_DAY);
  const schedule = [];
  const today = new Date(start);

  for (let i = 0; i < TOTAL_DAYS; i++) {
    schedule.push({
      date: new Date(today),
      expectedHours: dailyGoal,
      actualHours: 0,
      debt: 0
    });
    today.setDate(today.getDate() + 1);
  }
  return schedule;
}

export default function TrackerApp() {
  const [schedule, setSchedule] = useState(generateSchedule(START_DATE, END_DATE, DAILY_GOAL));
  const [weeklyDebt, setWeeklyDebt] = useState(0);

  const logDay = (index, actualHours) => {
    setSchedule(prev => {
      const updated = [...prev];
      const diff = updated[index].expectedHours - actualHours;
      updated[index].actualHours = actualHours;
      updated[index].debt = diff > 0 ? diff : 0;

      setWeeklyDebt(prevDebt => {
        if (diff > 0) return prevDebt + diff;
        return Math.max(prevDebt - Math.abs(diff), 0);
      });

      return updated;
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scrimba Frontend Career Tracker</h1>

      <h2 className="text-xl font-semibold mb-2">📅 Daily Progress</h2>
      <div className="space-y-2">
        {schedule.map((day, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <span>{day.date.toDateString()}</span>
              <input
                type="number"
                placeholder="Hours"
                className="border p-1 rounded w-20 text-center"
                onBlur={(e) => logDay(index, parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Expected: {day.expectedHours}h | Done: {day.actualHours}h | Debt: {day.debt}h
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">📊 Weekly Debt</h2>
      <div className="bg-yellow-100 p-3 rounded-xl shadow text-lg">
        Remaining Weekly Debt: {weeklyDebt} hours
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">🧩 Module Plan</h2>
      <ul className="list-disc pl-5 space-y-1">
        {MODULE_BREAKDOWN.reduce((acc, mod, idx) => {
          const last = acc.length ? acc[acc.length - 1].cumulative : HOURS_COMPLETED;
          acc.push({
            ...mod,
            cumulative: last + mod.hours
          });
          return acc;
        }, []).map((mod, idx) => (
          <li key={idx}>{mod.module} — {mod.hours}h (Cumulative: {mod.cumulative.toFixed(1)}h)</li>
        ))}
      </ul>
    </div>
  );
}
