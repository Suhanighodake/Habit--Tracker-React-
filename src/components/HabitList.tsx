//import { useHabits, type Habit } from "../context/HabitProvider";
import { useHabits, type Habit } from "../context/useHabits"
import { Button } from "./Button"

import {
  format,
  isFuture,
  isSameDay,
  subDays,
  isSameMonth,
} from "date-fns"

type HabitListProps = {
  visibleDates: Date[]
}

export function HabitList({ visibleDates }: HabitListProps) {
  const { habits } = useHabits()

  if (habits.length === 0) {
    return (
      <p className="text-center text-zinc-500 py-12">
        No Habits yet. Add one above to get started!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          visibleDates={visibleDates}
        />
      ))}
    </div>
  )
}

type HabitItemProps = {
  habit: Habit
  visibleDates: Date[]
}

function HabitItem({ habit, visibleDates }: HabitItemProps) {
  const { deleteHabit, toggleHabit } = useHabits()

  // Current streak
  const currentStreak = getCurrentStreak(habit.completion)

  // Best / Last streak
  const bestStreak = getBestStreak(habit.completion)

  // Monthly completed count
  const monthlyCount = getMonthlyCount(habit.completion)

  return (
    <div className="rounded-xl bg-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-medium text-white">
            {habit.name}
          </span>

          <div className="flex flex-wrap gap-3 text-sm">
            {/* Current Streak */}
            <span className="text-amber-400">
              🔥 Current: {currentStreak} Day
              {currentStreak !== 1 ? "s" : ""}
            </span>

            {/* Best Streak */}
            <span className="text-pink-400">
              🏆 Best: {bestStreak} Day
              {bestStreak !== 1 ? "s" : ""}
            </span>

            {/* Monthly Count */}
            <span className="text-green-400">
              ✅ {monthlyCount} Days This Month
            </span>
          </div>
        </div>

        <Button
          onClick={() => deleteHabit(habit.id)}
          variant="ghost-destructive"
          className="text-sm"
        >
          Delete
        </Button>
      </div>

      <div className="flex gap-1.5">
        {visibleDates.map((date) => (
          <Button
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg"
            key={date.toISOString()}
            disabled={isFuture(date)}
            onClick={() => toggleHabit(habit.id, date)}
            variant={
              habit.completion.some((d) => isSameDay(date, d))
                ? "primary"
                : "secondary"
            }
          >
            <span className="font-medium">
              {format(date, "EEE")}
            </span>

            <span>{format(date, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- CURRENT STREAK ---------------- */

function getCurrentStreak(completion: Date[]) {
  let streak = 0
  let date = new Date()

  while (completion.some((c) => isSameDay(c, date))) {
    streak++
    date = subDays(date, 1)
  }

  return streak
}

/* ---------------- BEST STREAK ---------------- */

function getBestStreak(completion: Date[]) {
  if (completion.length === 0) return 0

  const sortedDates = [...completion].sort(
    (a, b) => a.getTime() - b.getTime()
  )

  let best = 1
  let current = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = sortedDates[i - 1]
    const curr = sortedDates[i]

    const previousDay = subDays(curr, 1)

    if (isSameDay(previousDay, prev)) {
      current++
      best = Math.max(best, current)
    } else {
      current = 1
    }
  }

  return best
}

/* ---------------- MONTHLY COUNT ---------------- */

function getMonthlyCount(completion: Date[]) {
  const today = new Date()

  return completion.filter((date) =>
    isSameMonth(date, today)
  ).length
}