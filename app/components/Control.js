import {
  Box,
  Grid,
  Button,
  TextInput,
  Form,
  FormField,
  Text,
  ResponsiveContext,
} from "grommet";
import { Launch, Achievement, Time } from "grommet-icons";

import { React, useState, useContext } from "react";
import ConnectMetaMask from "./ConnectMetaMask";
import { CrashContext } from "../contexts/CrashContext";
import { MainComponentContext } from "../contexts/MainComponentContext";
const suggestionsBet = [
  "1k TEST",
  "10k TEST",
  "100k TEST",
  "1m TEST",
  "10m TEST",
  "100m TEST",
];
//const suggestionsAutoBet = ["1.2x", "1.5x", "2x", "5x", "8x", "10x"];

const Control = () => {
  const [valueBet, setValueBet] = useState(undefined);
  //const [valueAutoBet, setValueAutoBet] = useState(undefined);
  const size = useContext(ResponsiveContext);
  const {
    loggedIn,
    placeBet,
    color,
    cashOut,
    userPlacedBet,
    userCrashed,
    userWon,
    wonAmount,
    cashOutColor,
  } = useContext(CrashContext);
  const { state } = useContext(MainComponentContext);

  const onSuggestionSelectBet = (event) => {
    switch (event.suggestion) {
      case "1k TEST":
        setValueBet(1000);
        break;
      case "10k TEST":
        setValueBet(10000);
        break;
      case "100k TEST":
        setValueBet(100000);
        break;
      case "1m TEST":
        setValueBet(1000000);
        break;
      case "10m TEST":
        setValueBet(10000000);
        break;
      case "100m TEST":
        setValueBet(100000000);
        break;
      default:
        setValueBet("");
    }
  };
  /*
  const onSuggestionSelectAutoBet = (event) => {
    switch (event.suggestion) {
      case "1.2x":
        setValueAutoBet(1.2);
        break;
      case "1.5x":
        setValueAutoBet(1.5);
        break;
      case "2x":
        setValueAutoBet(2);
        break;
      case "5x":
        setValueAutoBet(5);
        break;
      case "8x":
        setValueAutoBet(8);
        break;
      case "10x":
        setValueAutoBet(10);
        break;
      default:
        setValueAutoBet("");
    }
  };
*/
  if (!loggedIn) {
    return <ConnectMetaMask />;
  } else {
    return (
      <>
        {size === "small" && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="large"
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Grid
              columns={{
                count: 1,
                size: "auto",
              }}
              gap="xsmall"
            >
              {state === "BETTING" && (
                <>
                  {userPlacedBet === false && (
                    <Form
                      gap="xsmall"
                      onSubmit={({ value }) => {
                        placeBet(value);
                        setValueBet(undefined);
                        //setValueAutoBet(undefined);
                      }}
                    >
                      <Box
                        direction="column"
                        gap="xsmall"
                        pad="xsmall"
                        animation={{ type: "fadeIn", duration: 390 }}
                      >
                        <FormField
                          required={true}
                          name="betAmount"
                          htmlFor="textinput-id"
                        >
                          <TextInput
                            size="small"
                            name="betAmount"
                            placeholder="Bet Amount"
                            suggestions={suggestionsBet}
                            value={valueBet}
                            onSuggestionSelect={onSuggestionSelectBet}
                            onChange={(event) =>
                              setValueBet(event.target.value)
                            }
                            icon={
                              <Text weight="bold" size="medium" color={color}>
                                TEST
                              </Text>
                            }
                            reverse
                          />
                        </FormField>
                        {/* 
                        <FormField
                          name="autoCashOut"
                          size="xsmall"
                          htmlFor="textinput-id"
                        >
                          <TextInput
                            size="small"
                            name="autoCashOut"
                            placeholder="Auto Cash Out"
                            suggestions={suggestionsAutoBet}
                            value={valueAutoBet}
                            onSuggestionSelect={onSuggestionSelectAutoBet}
                            onChange={(event) =>
                              setValueAutoBet(event.target.value)
                            }
                            icon={
                              <Text color={color} weight="bold" size="medium">
                                x
                              </Text>
                            }
                            reverse
                          />
                        </FormField>*/}
                        <Box animation={[{ type: "fadeIn", duration: 390 }]}>
                          <Button
                            secondary
                            fill={true}
                            type="submit"
                            icon={<Launch />}
                            label="PLACE BET"
                            color={color}
                          />
                        </Box>
                      </Box>
                    </Form>
                  )}
                  {userPlacedBet === true && (
                    <Box
                      direction="row"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Box
                        animation={[{ type: "fadeIn", duration: 390 }]}
                        responsive={true}
                      >
                        <Button
                          secondary
                          icon={<Time size="large" />}
                          label={
                            <Text size="large" textAlign="center">
                              BE READY! THE GAME STARTS SOON...
                            </Text>
                          }
                          gap="small"
                          color={color}
                        />
                      </Box>
                    </Box>
                  )}
                </>
              )}
              {state === "PLAYING" && (
                <>
                  {userPlacedBet === true && (
                    <>
                      {userWon === false && userCrashed === false && (
                        <Form>
                          <Box
                            direction="column"
                            gap="medium"
                            responsive={true}
                          >
                            <Button
                              primary
                              color={cashOutColor}
                              label="CASH OUT"
                              onClick={async () => await cashOut()}
                            />
                          </Box>
                        </Form>
                      )}
                      {userWon === true && userCrashed === false && (
                        <Box
                          direction="column"
                          gap="small"
                          alignSelf="center"
                          justify="center"
                          pad="medium"
                          animation="zoomOut"
                          responsive={true}
                        >
                          <Button
                            primary
                            color={color}
                            label="CASHED OUT!"
                            gap="small"
                            icon={<Achievement size="medium" />}
                          />

                          <Button
                            secondary
                            color={color}
                            label={<Text>{wonAmount} TEST</Text>}
                            gap="small"
                          />
                        </Box>
                      )}
                    </>
                  )}
                  {state !== "CRASHED" && userPlacedBet === false && (
                    <Box
                      direction="row"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        secondary
                        color={color}
                        label="TAKE YOUR CHANCE IN THE NEXT ROUND!"
                        gap="small"
                        round={false}
                      />
                    </Box>
                  )}
                </>
              )}
              {state === "CRASHED" && (
                <>
                  {userWon === false && (
                    <Box
                      direction="column"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        secondray
                        color={color}
                        label="CRASHED!"
                        gap="small"
                      />
                    </Box>
                  )}
                  {userWon === true && (
                    <Box
                      direction="column"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        primary
                        color={color}
                        label="CASHED OUT!"
                        gap="small"
                        icon={<Achievement size="medium" />}
                      />

                      <Button
                        secondary
                        color={color}
                        label={
                          <Text size="xlarge">
                            {wonAmount}{" "}
                            <Text size="xlarge" color={color}>
                              TEST
                            </Text>
                          </Text>
                        }
                        gap="small"
                      />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Box>
        )}
        {size === "medium" && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="medium"
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Grid
              columns={{
                count: 1,
                size: "auto",
              }}
              gap="xsmall"
            >
              {state === "BETTING" && (
                <>
                  {userPlacedBet === false && (
                    <Form
                      onSubmit={({ value }) => {
                        placeBet(value);
                        setValueBet(undefined);
                        //setValueAutoBet(undefined);
                      }}
                    >
                      <Box
                        direction="column"
                        gap="xxsmall"
                        pad="xsmall"
                        animation={{ type: "fadeIn", duration: 390 }}
                      >
                        <FormField
                          required={true}
                          name="betAmount"
                          htmlFor="textinput-id"
                        >
                          <TextInput
                            size="small"
                            name="betAmount"
                            placeholder="Bet Amount"
                            suggestions={suggestionsBet}
                            value={valueBet}
                            onSuggestionSelect={onSuggestionSelectBet}
                            onChange={(event) =>
                              setValueBet(event.target.value)
                            }
                            icon={
                              <Text color={color} weight="bold" size="medium">
                                TEST
                              </Text>
                            }
                            reverse
                          />
                        </FormField>
                        {/* 
                        <FormField name="autoCashOut" htmlFor="textinput-id">
                          <TextInput
                            name="autoCashOut"
                            size="small"
                            placeholder="Auto Cash Out"
                            suggestions={suggestionsAutoBet}
                            value={valueAutoBet}
                            onSuggestionSelect={onSuggestionSelectAutoBet}
                            onChange={(event) =>
                              setValueAutoBet(event.target.value)
                            }
                            icon={
                              <Text color={color} weight="bold" size="medium">
                                x
                              </Text>
                            }
                            reverse
                          />
                        </FormField>*/}
                        <Box gap="small" animation={[{ type: "zoomOut" }]}>
                          <Button
                            secondary
                            fill={true}
                            type="submit"
                            icon={<Launch />}
                            label="PLACE BET"
                            color={color}
                          />

                          <Button
                            primary
                            color={cashOutColor}
                            label="CASH OUT"
                            disabled={true}
                          />
                        </Box>
                      </Box>
                    </Form>
                  )}
                  {userPlacedBet === true && (
                    <Box
                      direction="row"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Box responsive={true}>
                        <Button
                          secondary
                          color={color}
                          icon={<Time size="large" />}
                          label={
                            <Text textAlign="center" size="small">
                              BE READY! THE GAME STARTS SOON...
                            </Text>
                          }
                          gap="small"
                        />
                      </Box>
                    </Box>
                  )}
                </>
              )}
              {state === "PLAYING" && (
                <>
                  {userPlacedBet === true && (
                    <>
                      {userWon === false && userCrashed === false && (
                        <Form>
                          <Box
                            direction="column"
                            gap="xxsmall"
                            responsive={true}
                          >
                            <FormField name="betAmount">
                              <TextInput
                                name="betAmount"
                                size="small"
                                placeholder="Bet Amount"
                                disabled={true}
                                value={valueBet}
                                icon={
                                  <Text
                                    color="#434343"
                                    weight="bold"
                                    size="medium"
                                  >
                                    TEST
                                  </Text>
                                }
                                reverse
                              />
                            </FormField>
                            {/* 
                            <FormField name="autoCashOut">
                              <TextInput
                                name="autoCashOut"
                                size="small"
                                placeholder="Auto Cash Out"
                                disabled={true}
                                value={valueAutoBet}
                                icon={
                                  <Text
                                    color="#434343"
                                    weight="bold"
                                    size="medium"
                                  >
                                    x
                                  </Text>
                                }
                                reverse
                              />
                            </FormField>*/}
                            <Box gap="small" animation={[{ type: "zoomOut" }]}>
                              <Button
                                secondary
                                type="submit"
                                icon={<Launch />}
                                label="PLACE BET"
                                disabled={true}
                              />

                              <Button
                                primary
                                color={cashOutColor}
                                label="CASH OUT"
                                onClick={async () => await cashOut()}
                              />
                            </Box>
                          </Box>
                        </Form>
                      )}
                      {userWon === true && userCrashed === false && (
                        <Box
                          direction="column"
                          gap="small"
                          alignSelf="center"
                          justify="center"
                          pad="small"
                          animation="zoomOut"
                          responsive={true}
                        >
                          <Button
                            primary
                            color={color}
                            label={<Text size="medium">CASHED OUT!</Text>}
                            gap="small"
                            icon={<Achievement size="medium" />}
                          />

                          <Button
                            secondary
                            color={color}
                            label={
                              <Text size="medium">
                                {wonAmount}{" "}
                                <Text size="medium" color={color}>
                                  TEST
                                </Text>
                              </Text>
                            }
                            gap="small"
                          />
                        </Box>
                      )}
                    </>
                  )}
                  {state !== "CRASHED" && userPlacedBet === false && (
                    <Box
                      direction="row"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        secondary
                        color={color}
                        label="TAKE YOUR CHANCE IN THE NEXT ROUND!"
                        gap="small"
                        round={false}
                      />
                    </Box>
                  )}
                </>
              )}
              {state === "CRASHED" && (
                <>
                  {userWon === false && (
                    <Box
                      direction="column"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        secondray
                        color={cashOutColor}
                        label={<Text size="xlarge">CRASHED!</Text>}
                        gap="small"
                      />
                    </Box>
                  )}
                  {userWon === true && (
                    <Box
                      direction="column"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="small"
                      animation="zoomOut"
                      responsive={true}
                    >
                      <Button
                        primary
                        color={color}
                        label={<Text size="medium">CASHED OUT!</Text>}
                        gap="small"
                        icon={<Achievement size="medium" />}
                      />

                      <Button
                        secondary
                        color={color}
                        label={
                          <Text size="medium">
                            {wonAmount}{" "}
                            <Text size="medium" color={color}>
                              TEST
                            </Text>
                          </Text>
                        }
                        gap="small"
                      />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Box>
        )}
        {(size === "large" || size === "xlarge") && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="medium"
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Grid
              columns={{
                count: 1,
                size: "auto",
              }}
              gap="xsmall"
            >
              {state === "BETTING" && (
                <>
                  {userPlacedBet === false && (
                    <Form
                      onSubmit={({ value }) => {
                        placeBet(value);
                        setValueBet(undefined);
                        //setValueAutoBet(undefined);
                      }}
                    >
                      <Box
                        direction="column"
                        gap="small"
                        pad="xsmall"
                        animation={{ type: "fadeIn", duration: 390 }}
                      >
                        <FormField
                          required={true}
                          name="betAmount"
                          htmlFor="textinput-id"
                        >
                          <TextInput
                            name="betAmount"
                            placeholder="Bet Amount"
                            suggestions={suggestionsBet}
                            value={valueBet}
                            onSuggestionSelect={onSuggestionSelectBet}
                            onChange={(event) =>
                              setValueBet(event.target.value)
                            }
                            icon={
                              <Text color={color} weight="bold" size="large">
                                TEST
                              </Text>
                            }
                            reverse
                          />
                        </FormField>
                        {/*
                        <FormField name="autoCashOut" htmlFor="textinput-id">
                          <TextInput
                            name="autoCashOut"
                            placeholder="Auto Cash Out"
                            suggestions={suggestionsAutoBet}
                            value={valueAutoBet}
                            onSuggestionSelect={onSuggestionSelectAutoBet}
                            onChange={(event) =>
                              setValueAutoBet(event.target.value)
                            }
                            icon={
                              <Text color={color} weight="bold" size="large">
                                x
                              </Text>
                            }
                            reverse
                          />
                        </FormField> */}
                        <Box animation={[{ type: "zoomOut" }]}>
                          <Button
                            secondary
                            fill={true}
                            type="submit"
                            icon={<Launch />}
                            label="PLACE BET"
                            color={color}
                          />
                        </Box>
                        <Button
                          primary
                          color={cashOutColor}
                          label="CASH OUT"
                          disabled={true}
                        />
                      </Box>
                    </Form>
                  )}
                  {userPlacedBet === true && (
                    <Box
                      direction="row"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Box responsive={true}>
                        <Button
                          secondary
                          color={color}
                          icon={<Time size="large" />}
                          label={
                            <Text size="large" textAlign="center">
                              BE READY! THE GAME STARTS SOON...
                            </Text>
                          }
                          gap="small"
                        />
                      </Box>
                    </Box>
                  )}
                </>
              )}
              {state === "PLAYING" && (
                <>
                  {userPlacedBet === true && (
                    <>
                      {userWon === false && userCrashed === false && (
                        <Form>
                          <Box direction="column" gap="small" responsive={true}>
                            <FormField name="betAmount">
                              <TextInput
                                name="betAmount"
                                placeholder="Bet Amount"
                                disabled={true}
                                value={valueBet}
                                icon={
                                  <Text
                                    color="#434343"
                                    weight="bold"
                                    size="large"
                                  >
                                    TEST
                                  </Text>
                                }
                                reverse
                              />
                            </FormField>
                            {/* 
                            <FormField name="autoCashOut">
                              <TextInput
                                name="autoCashOut"
                                placeholder="Auto Cash Out"
                                disabled={true}
                                value={valueAutoBet}
                                icon={
                                  <Text
                                    color="#434343"
                                    weight="bold"
                                    size="large"
                                  >
                                    x
                                  </Text>
                                }
                                reverse
                              />
                            </FormField>*/}
                            <Button
                              secondary
                              type="submit"
                              icon={<Launch />}
                              label="PLACE BET"
                              disabled={true}
                            />

                            <Button
                              primary
                              color={cashOutColor}
                              label="CASH OUT"
                              onClick={async () => await cashOut()}
                            />
                          </Box>
                        </Form>
                      )}
                      {userWon === true && userCrashed === false && (
                        <Box
                          direction="column"
                          gap="small"
                          alignSelf="center"
                          justify="center"
                          pad="medium"
                          animation="zoomOut"
                          responsive={true}
                        >
                          <Button
                            primary
                            color={color}
                            label="CASHED OUT!"
                            gap="small"
                            icon={<Achievement size="medium" />}
                          />

                          <Button
                            secondary
                            color={color}
                            label={
                              <Text size="xlarge">
                                {wonAmount}{" "}
                                <Text size="xlarge" color={color}>
                                  TEST
                                </Text>
                              </Text>
                            }
                            gap="small"
                          />
                        </Box>
                      )}
                    </>
                  )}
                  {state !== "CRASHED" && userPlacedBet === false && (
                    <Box
                      direction="row"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        secondary
                        color={color}
                        label="TAKE YOUR CHANCE IN THE NEXT ROUND!"
                        gap="small"
                        round={false}
                      />
                    </Box>
                  )}
                </>
              )}
              {state === "CRASHED" && (
                <>
                  {userWon === false && (
                    <Box
                      direction="column"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        secondray
                        color={cashOutColor}
                        label="CRASHED!"
                        gap="small"
                      />
                    </Box>
                  )}
                  {userWon === true && (
                    <Box
                      direction="column"
                      gap="small"
                      alignSelf="center"
                      justify="center"
                      pad="medium"
                      responsive={true}
                    >
                      <Button
                        primary
                        color={color}
                        label="CASHED OUT!"
                        gap="small"
                        icon={<Achievement size="medium" />}
                      />

                      <Button
                        secondary
                        color={color}
                        label={
                          <Text size="xlarge">
                            {wonAmount}{" "}
                            <Text size="xlarge" color={color}>
                              TEST
                            </Text>
                          </Text>
                        }
                        gap="small"
                      />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Box>
        )}
      </>
    );
  }
};

export default Control;
