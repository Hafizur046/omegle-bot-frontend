import "./App.css";
import { useEffect, useState } from "react";
const { io } = require("socket.io-client");
//const socket = io("http://165.232.176.178:3000");
const socket = io("http://192.168.0.4:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => {
      setIsTyping(false);
      setMessages((currentMessages) => [msg, ...currentMessages]);
    });
    socket.on("started-typing", () => {
      setIsTyping(true);
    });
    socket.on("stopped-typing", () => {
      setIsTyping(false);
    });
  }, []);

  return (
    <div className="App">
      <h4>{isTyping && "Stranger: Typing...."}</h4>
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
            socket.emit("message", messageInput);
            setMessageInput("");
          }
        }}
      />
    </div>
  );
}

export default App;
