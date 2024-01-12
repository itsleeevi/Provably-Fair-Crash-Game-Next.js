import { Box, Grid, Spinner } from "grommet";
import { useEffect, useState, useContext } from "react";
import React from "react";
import { ResponsiveContext } from "grommet";
import Axios from "axios";
import MainCrashed from "./MainCrashed";
import MainBetting from "./MainBetting";
import Control from "./Control";
import ResultTable from "./ResultTable";
import Chat from "./Chat";
import ChartContainer from "./ChartContainer";
import { CrashContext } from "../contexts/CrashContext";
import { MainComponentContext } from "../contexts/MainComponentContext";

const columns = {
  small: ["auto"],
  medium: ["40%", "21%", "auto"],
  large: ["large", "medium", "auto"],
  xlarge: ["large", "medium", "auto"],
};

const rows = {
  small: ["small", "small", "auto", "medium"],
  medium: ["310px", "310px"],
  large: ["415px", "415px"],
  xlarge: ["large", "large"],
};

const fixedGridAreas = {
  small: [
    { name: "chart", start: [0, 0], end: [0, 0] },
    { name: "betting", start: [0, 1], end: [0, 1] },
    { name: "resultTable", start: [0, 3], end: [0, 3] },
    { name: "chat", start: [0, 2], end: [0, 2] },
  ],
  medium: [
    { name: "chart", start: [0, 0], end: [0, 0] },
    { name: "betting", start: [1, 0], end: [1, 0] },
    { name: "resultTable", start: [2, 0], end: [2, 1] },
    { name: "chat", start: [0, 1], end: [1, 1] },
  ],
  large: [
    { name: "chart", start: [0, 0], end: [0, 0] },
    { name: "betting", start: [1, 0], end: [1, 0] },
    { name: "resultTable", start: [2, 0], end: [2, 1] },
    { name: "chat", start: [0, 1], end: [1, 1] },
  ],
  xlarge: [
    { name: "chart", start: [0, 0], end: [0, 0] },
    { name: "betting", start: [1, 0], end: [1, 0] },
    { name: "resultTable", start: [2, 0], end: [2, 1] },
    { name: "chat", start: [0, 1], end: [1, 1] },
  ],
};

const Responsive = ({
  children,
  overrideColumns,
  overrideRows,
  areas,
  ...props
}) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      let columnsVal = columns;
      if (columns) {
        if (columns[size]) {
          columnsVal = columns[size];
        }
      }

      let rowsVal = rows;
      if (rows) {
        if (rows[size]) {
          rowsVal = rows[size];
        }
      }

      let areasVal = areas;
      if (areas && !Array.isArray(areas)) areasVal = areas[size];

      return (
        <Grid
          {...props}
          areas={!areasVal ? undefined : areasVal}
          rows={!rowsVal ? size : rowsVal}
          columns={!columnsVal ? size : columnsVal}
        >
          {children}
        </Grid>
      );
    }}
  </ResponsiveContext.Consumer>
);

const Main = () => {
  // Defining states
  const [state, setState] = useState(undefined); // BETTING, PLAYING, CRASHED
  const [data, setData] = useState([{ x: 0, y: 1 }]);
  const [crashPoint, setCrashPoint] = useState(1.0);
  const [resultTableAll, setResultTableAll] = useState([]);
  const [historyAll, setHistoryAll] = useState([]);
  const [connected, setConnected] = useState(false);
  const [chartArray, setChartArray] = useState([{ x: 0, y: 1 }]);
  const [bettingTime, setBettingTime] = useState(undefined);
  const [gameStartTime, setGameStartTime] = useState(0);
  const {
    loggedIn,
    color,
    setCashOutMultiplier,
    socket,
    userPlacedBet,
    setUserBetAmount,
    setUserPlacedBet,
    userCrashed,
    setUserCrashed,
    userWon,
    setUserWon,
    setGameState,
    setWonAmount,
    setInitiatedCashOut,
    setColor,
    setCashOutColor,
    setInitColorBetting,
    initColorWaiting,
    setInitColorWaiting,
    url,
    accounts,
    setGameBalance,
    setExited,
    setExitMultiplier,
    controlLoaded,
    setControlLoaded,
  } = useContext(CrashContext);

  useEffect(() => {
    socket.on("currentState", (receivedState) => {
      setState(receivedState);
      if (receivedState === "BETTING") setColor("#6FFFB0");
      if (receivedState === "CRASHED") {
        setData([{ x: 0, y: 1 }]);
        setInitiatedCashOut(false);
        setExited(false);
        setUserCrashed(false);
        setExitMultiplier(undefined);
      }
    });

    socket.on("crashEvent", (receivedCrashPoint) => {
      setCrashPoint(receivedCrashPoint);
    });

    socket.on("bettingTime", (receivedBettingTime) => {
      setBettingTime(receivedBettingTime);
    });

    socket.on("gameStartTime", (receivedGameStartTime) => {
      setGameStartTime(receivedGameStartTime);
    });
  }, []);

  useEffect(() => {
    socket.on("bet-confirmation", (receivedBetConfirmation) => {
      if (
        accounts.length > 0 &&
        receivedBetConfirmation.address.toLowerCase() ===
          accounts[0].toLowerCase() &&
        receivedBetConfirmation.success
      ) {
        setGameBalance(receivedBetConfirmation.balance);
        setUserPlacedBet(true);
        setInitColorWaiting(true);
      }
    });
  }, [accounts]);

  useEffect(() => {
    socket.on("cashout-confirmation", (confirmation) => {
      if (
        accounts.length > 0 &&
        confirmation.address.toLowerCase() === accounts[0].toLowerCase() &&
        confirmation.success
      ) {
        setUserWon(true);
        setInitColorBetting(true);
        setWonAmount(confirmation.prize);
        setCashOutMultiplier(confirmation.multiplier);
        setGameBalance(confirmation.balance);
      }
    });
  }, [accounts]);

  useEffect(() => {
    setGameState(state);
    if (state === "BETTING") {
      setUserBetAmount(0);
      setUserWon(false);
      setUserCrashed(false);
      setWonAmount(undefined);
      setCrashPoint(1.0);
      setConnected(false);
      setInitiatedCashOut(false);
      setWonAmount(0);
      setCashOutMultiplier(undefined);
    }
    if (state === "PLAYING") {
      setInitColorBetting(false);
      setInitColorWaiting(false);
    }
    if (state === "CRASHED") {
      setUserPlacedBet(false);
    }
  }, [state]);

  useEffect(() => {
    Axios.post(url + "history").then(async (result) => {
      setHistoryAll(await result.data.rounds);
    });
  }, [state]);

  useEffect(() => {
    socket.on("everyPlayer", (receivedData) => {
      setResultTableAll(receivedData);
    });
  }, []);

  useEffect(() => {
    if (state === "BETTING" && !userPlacedBet) {
      setColor("#6FFFB0");
      setCashOutColor("#FF4040");
    }
    if (state === "BETTING" && initColorWaiting) {
      setColor("#FFCA58");
    }
    if (state === "PLAYING") {
      setColor("#00C781");
      setCashOutColor("#FF4040");
    }
    if (state === "CRASHED" && userCrashed) {
      setColor("#FF4040");
    }
    if (state === "CRASHED" && userWon) {
      setColor("#00C781");
    }
    if (state === "CRASHED" && !userCrashed && !userWon) {
      setColor("#FF4040");
    }
    if (state === "CRASHED" && !loggedIn) {
      setColor("#FF4040");
    }
  }, [state]);

  useEffect(() => {
    if (state) setControlLoaded(true);
  }, [state]);

  return (
    <MainComponentContext.Provider
      value={{
        state,
        setState,
        data,
        setData,
        crashPoint,
        setCrashPoint,
        resultTableAll,
        historyAll,
        setResultTableAll,
        connected,
        setConnected,
        chartArray,
        setChartArray,
        bettingTime,
        setBettingTime,
        gameStartTime,
        setGameStartTime,
        controlLoaded,
      }}
    >
      <Box background="#222222">
        <Responsive
          rows={rows}
          columns={columns}
          gap="small"
          pad="small"
          areas={fixedGridAreas}
        >
          {controlLoaded ? (
            <>
              <Control />
            </>
          ) : (
            <>
              <Box
                gridArea="betting"
                background="#171717"
                align="center"
                justify="center"
                round="xsmall"
                pad="large"
                border={{ color: "#1B1B1B", size: "large" }}
              >
                <Spinner />
              </Box>
            </>
          )}

          <ResultTable />
          <Chat />
          {controlLoaded ? (
            <>
              {state === "BETTING" && <MainBetting />}
              {state === "PLAYING" && (
                <ChartContainer socket={socket} color={color} />
              )}
              {state === "CRASHED" && <MainCrashed />}
            </>
          ) : (
            <>
              <Box
                gridArea="chart"
                background="#171717"
                fill={true}
                pad="small"
                round="xsmall"
                responsive={true}
                border={{ color: "#1B1B1B", size: "large" }}
                align="center"
                justify="center"
              >
                <Spinner />
              </Box>
            </>
          )}
        </Responsive>
      </Box>
    </MainComponentContext.Provider>
  );
};

export default Main;
