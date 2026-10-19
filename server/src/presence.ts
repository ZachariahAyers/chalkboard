import type { User } from "../../shared/protocol.ts";

/** Who is connected, in join order. */
export function createPresence() {
  const users = new Map<string, string>();

  return {
    join(id: string, name: string): void {
      users.set(id, name);
    },
    leave(id: string): void {
      users.delete(id);
    },
    list(): User[] {
      return Array.from(users, ([id, name]) => ({ id, name }));
    },
  };
}
