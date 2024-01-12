import React, { useState, useContext } from "react";
import {
  Box,
  Grid,
  Button,
  TextInput,
  Form,
  ResponsiveContext,
  Text,
  Spinner,
} from "grommet";
import { Send, ChatOption } from "grommet-icons";
import ChatMessages from "./ChatMessages.js";
import { CrashContext } from "../contexts/CrashContext.js";
import "./App.css";

const UsernameForm = ({ onSubmit, color, size }) => (
  <Form onSubmit={(event) => onSubmit(event)}>
    <Box direction="row" gap="small" animation="fadeIn" responsive={true}>
      <TextInput
        name="username"
        placeholder="Type Username..."
        size={size === "small" ? "xsmall" : "small"}
      />
      <Button
        secondary
        type="submit"
        icon={<ChatOption />}
        label="CHAT!"
        alignSelf="stretch"
        color={color}
      />
    </Box>
  </Form>
);

const MessageForm = ({ value, onChange, onSubmit, color, disabled, size }) => (
  <Form onSubmit={(event) => onSubmit(event)}>
    <Box
      direction="row"
      gap="small"
      fill={true}
      justify="center"
      animation="fadeIn"
      responsive={true}
    >
      <TextInput
        placeholder="Type Here..."
        value={value}
        onChange={onChange}
        disabled={disabled}
        size={size === "small" ? "xsmall" : "small"}
        name="message"
      />
      <Button
        secondary
        type="submit"
        icon={<Send />}
        label={<Text size="small">SEND</Text>}
        disabled={disabled}
        color={color}
      />
    </Box>
  </Form>
);

const ChatComponent = () => {
  const [value, setValue] = useState("");
  const size = useContext(ResponsiveContext);
  const {
    userName,
    isReady,
    color,
    setMessage,
    socket,
    addPlayer,
    firstLoading,
    accounts,
    chatLoading,
    setChatLoading,
  } = useContext(CrashContext);

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    const formValue = event.value;
    addPlayer(formValue.username);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const formValue = event.value;
    setMessage(formValue.message);
    setValue("");
  };

  const handleInputChange = (event) => setValue(event.target.value);

  const getGridRows = () => {
    switch (size) {
      case "small":
        return ["small", "xxsmall"];
      case "medium":
        return ["230px", "xxsmall"];
      case "large":
      case "xlarge":
        return ["330px", "xxsmall"];
      default:
        return ["auto", "xxsmall"];
    }
  };

  return (
    <>
      <Box
        gridArea="chat"
        background="#1B1B1B"
        justify="center"
        fill={true}
        round="xsmall"
        pad="small"
        animation="zoomOut"
      >
        <Box fill={true}>
          <Grid
            rows={getGridRows()}
            columns={["auto"]}
            areas={[
              { name: "messagingBox", start: [0, 0], end: [0, 0] },
              { name: "sendingBox", start: [0, 1], end: [0, 1] },
            ]}
            gap="small"
            responsive
          >
            <>
              {chatLoading ? (
                <Box
                  justify="center"
                  align="center"
                  gap="small"
                  responsive={true}
                  background="#171717"
                >
                  <Spinner />
                </Box>
              ) : (
                <>
                  <>
                    {isReady() ? (
                      <>
                        {userName ? (
                          <>
                            <Box animation="fadeIn" responsive={true}>
                              <ChatMessages socket={socket} color={color} />
                            </Box>
                            <MessageForm
                              value={value}
                              onChange={handleInputChange}
                              onSubmit={handleMessageSubmit}
                              color={color}
                              disabled={false}
                              size={size}
                            />
                          </>
                        ) : (
                          <>
                            <Box
                              justify="center"
                              align="center"
                              gap="small"
                              responsive={true}
                              background="#171717"
                            >
                              <UsernameForm
                                onSubmit={handleUsernameSubmit}
                                color={color}
                                size={size}
                              />
                            </Box>
                            <MessageForm
                              value={value}
                              onChange={handleInputChange}
                              setMessage={setMessage}
                              color={color}
                              disabled={true}
                              size={size}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <ChatMessages socket={socket} color={color} />
                        <MessageForm
                          value={value}
                          onChange={handleInputChange}
                          onSubmit={handleMessageSubmit}
                          color={color}
                          disabled={true}
                          size={size}
                        />
                      </>
                    )}
                  </>
                </>
              )}
            </>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ChatComponent;
