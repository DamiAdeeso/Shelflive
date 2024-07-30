import React from "react";
import style from "./message.module.scss";

// icons
import { RiErrorWarningFill } from "react-icons/ri";
import { MdFileCopy } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { selectMessage } from "./messageSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

// variable for time to delete a message
const time = 5000;

// message component
function Message({ err, message, id, setMessages }) {
  // delete every message after time ms
  useEffect(() => {
    setTimeout(() => {
      setMessages((prv) => prv.filter((msg) => msg.id !== id));
    }, time);
  }, [id, setMessages]);

  return (
    <li data-color={err && "error"}>
      {err ? <RiErrorWarningFill /> : <AiFillMessage />}
      <p>{message}</p>
      {err && (
        <MdFileCopy
          data-style="pointer"
          onClick={() => navigator.clipboard.writeText(message)}
        />
      )}
    </li>
  );
}

export default function MessageComponent() {
  // set a list messages
  const [messages, setMessages] = useState([]);
  // get message from redux store
  const message = useSelector(selectMessage);

  // update the list messages after every new message
  useEffect(() => {
    if (message) setMessages((prv) => [...prv, message]);
  }, [message]);

  return (
    <ul className={style.root}>
      {messages.map((msg) => (
        <Message
          err={msg.err}
          message={msg.message}
          id={msg.id}
          key={msg.id}
          setMessages={setMessages}
        />
      ))}
    </ul>
  );
}
