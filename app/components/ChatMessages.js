import React, { useState, useEffect, useContext } from "react";
import { TableRow, TableCell, Text, ResponsiveContext, Grommet } from "grommet";
import Axios from "axios";
import "./App.css";
import { CrashContext } from "../contexts/CrashContext";

const customTheme = {
  table: {
    body: {
      pad: { vertical: "xxxsmall", horizontal: "xxsmall" },
    },
  },
};

const ChatMessages = ({ socket, color }) => {
  const [recentMessages, setRecentMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { url } = useContext(CrashContext);
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    if (!loaded) {
      Axios.post(url + "latest-messages").then((results) => {
        setRecentMessages(results.data.messages.reverse());
        setLoaded(true);
      });
    }
    const messageHandler = (receivedMessages) => {
      if (recentMessages !== receivedMessages) {
        setRecentMessages([...recentMessages, receivedMessages]);
      }
    };

    socket.on("messaging", messageHandler);

    return () => {
      socket.off("messaging");
    };
  }, [socket, recentMessages]);

  const renderMessages = (messageSize) => (
    <div className="messageBox">
      <Grommet theme={customTheme}>
        {recentMessages.map((d) => (
          <TableRow key={d.id}>
            <TableCell size="xxxsmall">
              <TableCell>
                <Text color={color} size={messageSize} weight="bold">
                  {d.username}:{" "}
                </Text>
                <Text size={messageSize}>{d.message}</Text>
              </TableCell>
            </TableCell>
          </TableRow>
        ))}
      </Grommet>
    </div>
  );

  return (
    <>
      {size === "small" && renderMessages("12px")}
      {size === "medium" && renderMessages("xsmall")}
      {(size === "large" || size === "xlarge") && renderMessages("small")}
    </>
  );
};

export default ChatMessages;
