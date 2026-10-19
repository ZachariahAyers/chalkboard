import "./UserPalette.css";

export default function UserPalette({ users }) {
  return (
    <aside className="user-palette">
      <h3>Users ({users.length})</h3>
      {users.length === 0 ? (
        <p className="user-palette__empty">No users online</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={`${user}-${index}`}>{user}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}
