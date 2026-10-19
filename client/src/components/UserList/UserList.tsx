import type { User } from "../../../../shared/protocol.ts";
import "./UserList.css";

interface Props {
  users: User[];
}

export default function UserList({ users }: Props) {
  return (
    <aside className="user-list" aria-label="People at the board">
      <h3>Users ({users.length})</h3>
      {users.length === 0 ? (
        <p className="user-list__empty">Connecting…</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}
