import "./App.css";
import { useEffect, useState } from "react";

//socket shits
const { io } = require("socket.io-client");

function App() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const localScopeSocket = io("http://localhost:3000");
    setSocket(localScopeSocket);

    //initialization shits
    const username = localStorage.getItem("username") || prompt("Username:");
    const password = localStorage.getItem("password") || prompt("Password:");
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localScopeSocket.emit("init", { username: username, password: password });

    localScopeSocket.on("message", () => {
      //{ suffix: message.from, body: message.message },
      console.log(messages);
      setMessages([...messages, "shit1"]);
    });

    //setInterval(() => {
    //setMessages([...messages, { body: "shit" + Math.random() }]);
    //}, 5000);
  }, [messages]);

  return (
    <div className="App">
      {messages.map((message) => (
        <h4>
          {message.suffix}: {message.body}
        </h4>
      ))}

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button
        onClick={() => {
          socket?.emit("message", messageInput);
          setMessageInput("");
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
