import { lazy, Suspense, useState } from "react";
import JoinDialog from "../JoinDialog/JoinDialog.tsx";
import "./App.css";

// The board pulls in p5, so it loads only once someone has joined.
const Chalkboard = lazy(() => import("../Chalkboard/Chalkboard.tsx"));

export default function App() {
  const [name, setName] = useState<string | null>(null);

  if (name === null) return <JoinDialog onJoin={setName} />;

  return (
    <Suspense fallback={<p className="app-loading">Loading the board…</p>}>
      <Chalkboard name={name} />
    </Suspense>
  );
}
