
// Frontend Career Tracker App for Scrimba Frontend Developer Career Path
// Enhanced UI (React + Tailwind CSS)

import { useEffect, useState } from 'react';

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
    const key = today.toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem(key)) || {};
    schedule.push({
      date: new Date(today),
      expectedHours: dailyGoal,
      actualHours: saved.actualHours || 0,
      debt: saved.debt || 0
    });
    today.setDate(today.getDate() + 1);
  }
  return schedule;
}

export default function TrackerApp() {
  const [schedule, setSchedule] = useState(generateSchedule(START_DATE, END_DATE, DAILY_GOAL));
  const [weeklyDebt, setWeeklyDebt] = useState(0);

  useEffect(() => {
    const debt = schedule.reduce((acc, day) => acc + day.debt, 0);
    setWeeklyDebt(debt);
  }, [schedule]);

  const logDay = (index, actualHours) => {
    if (actualHours < 0 || actualHours > 24) return;

    setSchedule(prev => {
      const updated = [...prev];
      const day = updated[index];
      const diff = day.expectedHours - actualHours;
      day.actualHours = actualHours;
      day.debt = diff > 0 ? diff : 0;

      const key = day.date.toISOString().slice(0, 10);
      localStorage.setItem(key, JSON.stringify({ actualHours, debt: day.debt }));

      return updated;
    });
  };

  const totalLogged = schedule.reduce((acc, day) => acc + day.actualHours, 0);
  const percentDone = ((HOURS_COMPLETED + totalLogged) / TOTAL_HOURS) * 100;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scrimba Frontend Career Tracker</h1>

      <div className="mb-6">
        <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: `${percentDone}%` }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Progress: {percentDone.toFixed(1)}%</p>
      </div>

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
                defaultValue={day.actualHours}
                onBlur={(e) => logDay(index, parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className={`text-sm mt-1 ${day.debt > 0 ? 'text-red-500' : 'text-green-600'}`}>
              Expected: {day.expectedHours}h | Done: {day.actualHours}h | Debt: {day.debt}h
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">📊 Weekly Debt</h2>
      <div className={`p-3 rounded-xl shadow text-lg ${weeklyDebt > 0 ? 'bg-yellow-100' : 'bg-green-100'}`}>
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
