import { useEffect, useRef, useState } from "react";
import "./JoinDialog.css";

export default function JoinDialog({ onJoin }) {
  const dialog = useRef(null);
  const [fallbackName] = useState(() => `Guest ${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("username").trim();
    onJoin(name || fallbackName);
  };

  return (
    <dialog ref={dialog} className="join-dialog" aria-labelledby="join-title" onCancel={(event) => event.preventDefault()}>
      <form onSubmit={handleSubmit}>
        <h2 id="join-title">Chalkboard</h2>
        <label htmlFor="username">Pick a name others will see</label>
        <input id="username" name="username" type="text" maxLength={24} placeholder={fallbackName} autoFocus />
        <button type="submit">Start drawing</button>
      </form>
    </dialog>
  );
}
