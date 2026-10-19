import { useState } from "react";
import { io } from "socket.io-client";
import Chalkboard from "../Chalkboard/Chalkboard";
import JoinDialog from "../JoinDialog/JoinDialog";

export default function App() {
  const [socket, setSocket] = useState(null);

  // The page is served by the same server that hosts Socket.IO, so io() needs no URL.
  const join = (username) => setSocket(io({ query: { username } }));

  return socket ? <Chalkboard socket={socket} /> : <JoinDialog onJoin={join} />;
}
