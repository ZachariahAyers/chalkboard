import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { LIMITS } from "../../../../shared/protocol.ts";
import "./JoinDialog.css";

interface Props {
  onJoin: (name: string) => void;
}

export default function JoinDialog({ onJoin }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [fallbackName] = useState(() => `Guest ${String(Math.floor(Math.random() * 1000))}`);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = new FormData(event.currentTarget).get("username");
    const name = typeof typed === "string" ? typed.trim() : "";
    onJoin(name || fallbackName);
  };

  return (
    <dialog
      ref={dialog}
      className="join-dialog"
      aria-labelledby="join-title"
      onCancel={(event) => {
        event.preventDefault();
      }}
    >
      <form onSubmit={handleSubmit}>
        <h2 id="join-title">Chalkboard</h2>
        <label htmlFor="username">Pick a name others will see</label>
        <input
          id="username"
          name="username"
          type="text"
          maxLength={LIMITS.nameLength}
          placeholder={fallbackName}
          autoComplete="nickname"
          autoFocus
        />
        <button type="submit">Start drawing</button>
      </form>
    </dialog>
  );
}
