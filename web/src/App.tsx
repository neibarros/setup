import "./styles/global.css";

import { Habit } from "./components/Habit";


export function App() {
  return (
    <>
      <Habit completed={3} />
      <Habit completed={18} />
      <Habit completed={20} />
      <Habit completed={39} />
    </>
  );
}
