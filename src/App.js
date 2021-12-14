import "./App.css";
import { useEffect, useState } from "react";
const { io } = require("socket.io-client");
const socket = io("http://165.232.176.178:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [pushToMessages, setPushToMessages] = useState("");
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (pushToMessages === "") return;
    setMessages([pushToMessages, ...messages]);
    setPushToMessages("");
  }, [pushToMessages, messages]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setPushToMessages(msg);
    });
  }, []);

  return (
    <div className="App">
      {messages.map((message) => (
        <h4>{message}</h4>
      ))}

      <input
        type="text"
        value={messageInput}
        onChange={(e) => {
          if (e.target.value === "") {
            console.log("stopped typing");
            socket.emit("stop-typing");
          } else if (e.target.value.split("").length === 1) {
            socket.emit("start-typing");
          }
          setMessageInput(e.target.value);
        }}
        style={{
          width: "100vw",
          height: "10vh",
          position: "fixed",
          //top: "95vh",
          bottom: 0,
          left: "0",
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            //setPushToMessages(`You: ${messageInput}`);
            socket.emit("message", messageInput);
            setMessageInput("");
          }
        }}
      />
      {/*<button
        style={{
          width: "20vw",
          height: "6vh",
          border: "none",
          position: "fixed",
          //top: "95vh",
          bottom: 0,
          left: "82vw",
          background: "#000",
          color: "#fff",
          border: "none",
          outline: "none",
        }}
        onClick={() => {
          //setPushToMessages(`You: ${messageInput}`);
          socket.emit("message", messageInput);
          setMessageInput("");
        }}
      >
        Send
        </button>*/}
    </div>
  );
}

export default App;
