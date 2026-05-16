import { isSameDay } from "date-fns";
import {  type ReactNode} from "react";
import { HabitContext, type Habit} from "./useHabits"
import { useLocalStoarge } from "../components/hooks/useLocalStorage";


type HabitProviderProps = {
    children: ReactNode
}
// export const HabitContext = createContext<null | Context>(null)

export function HabitProvider ( {children}: HabitProviderProps) {
      const [habits, setHabits] = useLocalStoarge<Habit[]>("Habits",[])


  function addHabit(name: string) {
    setHabits( [
      ...habits,
      { id:crypto.randomUUID(),name, completion:[new Date()]},
    ] )
  }

   function deleteHabit(id: string) {
    setHabits( curr=> curr.filter(h=> h.id !== id) )
  }

    function toggleHabit(id:string, date:Date){
      setHabits(curr =>
        curr.map(h => {
          if (h.id !== id) return h

          const alreadayDone = h.completion.some(c =>isSameDay(c, date))
          const completion = alreadayDone
           ? h.completion.filter(c =>!isSameDay(c, date))
           : [...h.completion, date]

           return {...h, completion}
        }),
      )
      }
    
    return (<HabitContext value={{habits, addHabit , toggleHabit, deleteHabit}}>
        {children}
    </HabitContext>
    )
}

