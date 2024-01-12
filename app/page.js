"use client";
import {
  Grommet,
  Footer,
  Text,
  ResponsiveContext,
  Spinner,
  Box,
} from "grommet";
import { grommet } from "grommet/themes";
import HeaderComponent from "./components/HeaderComponent";
import Main from "./components/Main";
import Crash from "../artifacts/Crash.json";
import Token from "../artifacts/wGHOST.json";
import { useEffect, useState } from "react";
import Axios from "axios";
import { deepMerge } from "grommet/utils";
import io from "socket.io-client";
import Web3 from "web3";
import { CrashContext } from "./contexts/CrashContext";
import CONFIG from "../config/config.json";
import Modal from "./components/Modal";
import HowItWorksModal from "./components/HowItWorksModal";
import { calculateBravery, switchNetwork } from "./utils/utils";

export default function Home() {
  //const url = "http://107.150.56.147:3003/";
  const url = "https://seahorse-app-dvw2l.ondigitalocean.app/";
  // const url = "http://localhost:3003/";
  const socket = io(url);
  const houseFee = 1;

  // web3 hooks
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [signature, setSignature] = useState(undefined);
  const [initiated, setInitiated] = useState(false);
  const [shortAdress, setShortAdress] = useState("");
  const [firstLoading, setFirstLoading] = useState(true);
  const [controlLoaded, setControlLoaded] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);

  const [metaMaskInstalled, setMetaMaskInstalled] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [gameBalance, setGameBalance] = useState(0);

  // chat hooks
  const [userName, setUserName] = useState(undefined);
  const [userAddress, setUserAddress] = useState("");
  const [playerExistsInDB, setplayerExistsInDB] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLoaded, setChatLoaded] = useState(false);

  // gameplay hooks
  const [userBetAmount, setUserBetAmount] = useState(0);
  const [userPlacedBet, setUserPlacedBet] = useState(false);
  const [userCrashed, setUserCrashed] = useState(false);
  const [userWon, setUserWon] = useState(false);
  const [wonAmount, setWonAmount] = useState(0);
  const [gameState, setGameState] = useState("");
  const [initiatedCashOut, setInitiatedCashOut] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(undefined);
  //const [autoCashOutMultiplier, setAutoCashOutMultiplier] = useState(undefined);
  const [color, setColor] = useState("#6FFFB0");
  const [cashOutColor, setCashOutColor] = useState("#FF4040");
  const [initColorBetting, setInitColorBetting] = useState(true);
  const [initColorWaiting, setInitColorWaiting] = useState(false);
  const [exitMultiplier, setExitMultiplier] = useState(undefined);
  const [exited, setExited] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      Axios.post(url + "balance", {
        address: accounts[0],
      }).then(async (response) => {
        if (response.data.balance) setGameBalance(response.data.balance);
        else setGameBalance(0);
      });
    }
  }, [accounts]);

  useEffect(() => {
    setChatLoading(true);
    if (window.ethereum && accounts.length > 0) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setplayerExistsInDB(false);
        setAccounts(accounts);
        setUserAddress(accounts[0]);
        setUserName("");
        setUserPlacedBet(false);
      });
    }
    setChatLoading(false);
  }, [accounts]);

  useEffect(() => {
    const init = async () => {
      isMetaMaskInstalled();
      if (!initiated && window.ethereum) {
        setInitiated(true);
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          Crash,
          CONFIG.WEB3.NETWORK.POLYGON.CONTRACT_ADDRESS
        );
        const token = new web3.eth.Contract(
          Token,
          CONFIG.WEB3.NETWORK.POLYGON.TOKEN_ADDRESS
        );
        setWeb3(web3);
        setContract(contract);
        setToken(token);
        await switchNetwork();
        const accs = await window.ethereum
          .request({
            method: "eth_accounts",
          })
          .catch((err) => {
            console.error(err);
          });
        setAccounts(accs);
        //const signature = await getSignature(accs[0]);
        //setSignature(signature);
      } else {
        setSignature(undefined);
      }
    };

    init();
  }, [initiated]);

  useEffect(() => {
    checkPlayerInDB();
  }, [accounts]);

  useEffect(() => {
    if (window.ethereum && !window.ethereum.isConnected) {
      setLoggedIn(false);
      setUserAddress("");
    }
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      setLoggedIn(true);
      setShortAdress(
        accounts[0].substring(0, 6) +
          "..." +
          accounts[0].substring(accounts[0].length - 4)
      );
    } else {
      setLoggedIn(false);
    }
  }, [accounts]);

  useEffect(() => {
    if (loggedIn !== undefined) setFirstLoading(false);
  }, [loggedIn]);

  useEffect(() => {
    if (accounts[0] && userName && message) {
      Axios.post(url + "chat", {
        address: userAddress,
        username: userName,
        message: message,
      }).then((response) => {
        socket.emit("messaging", {
          address: userAddress,
          username: userName,
          message: message,
        });
      });
    }
  }, [message]);

  useEffect(() => {
    if (userBetAmount > 0 && gameState === "BETTING" && userPlacedBet) {
      socket.emit("resultTableUserData", {
        user: userName
          ? userName
          : accounts[0].substring(0, 6) +
            "..." +
            accounts[0].substring(accounts[0].length - 4),
        bet: userBetAmount,
        bravery: calculateBravery(userBetAmount),
      });
    }
  }, [userName, userBetAmount, gameState, userPlacedBet]);

  useEffect(() => {
    if (
      userBetAmount > 0 &&
      wonAmount > 0 &&
      gameState === "PLAYING" &&
      userPlacedBet
    ) {
      socket.emit("resultTableUserData", {
        user: userName,
        at: cashOutMultiplier,
        bet: userBetAmount,
        profit: wonAmount - userBetAmount,
        bravery: calculateBravery(userBetAmount),
      });
    }
  }, [
    userName,
    userBetAmount,
    cashOutMultiplier,
    wonAmount,
    gameState,
    userPlacedBet,
  ]);

  useEffect(() => {
    if (userBetAmount > 0 && gameState === "CRASHED" && userPlacedBet) {
      socket.emit("resultTableUserData", {
        user: userName,
        at: cashOutMultiplier,
        bet: userBetAmount,
        profit: wonAmount - userBetAmount,
        bravery: calculateBravery(userBetAmount),
      });
    }
  }, [
    userName,
    cashOutMultiplier,
    userBetAmount,
    wonAmount,
    gameState,
    userPlacedBet,
  ]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (token && accounts) {
        try {
          const balanceWei = await token.methods.balanceOf(accounts[0]).call();
          // Convert the balance from Wei to ETH
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setWalletBalance(balanceEth);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [token, accounts, modalOpen]);

  useEffect(() => {
    if (initiatedCashOut && exitMultiplier && !exited) {
      setExited(true);
      setUserCrashed(false);
      socket.emit("cashout", {
        address: accounts[0],
        signature: signature,
        multiplier: exitMultiplier,
      });
    }
  }, [initiatedCashOut, exitMultiplier]);

  // Add username connection
  const addPlayer = async (userName) => {
    setChatLoading(true);
    if (userName !== null && accounts.length > 0) {
      Axios.post(url + "add-username", {
        address: accounts[0],
        username: userName,
      }).then(async (result) => {
        setUserName(userName);
      });
    }
    setChatLoading(false);
  };

  const checkPlayerInDB = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setChatLoading(true);
      if (accounts.length > 0) {
        Axios.post(url + "username", {
          address: accounts[0],
        }).then(async (response) => {
          if (await response.data.username) {
            setUserName(response.data.username);
            setplayerExistsInDB(true);
          } else {
            setplayerExistsInDB(false);
          }
        });
      }
      setChatLoading(false);
    }
  };

  const getSignature = async (account) => {
    const message =
      "This signature is required so the server can verify that you are the one who is placing bets and receiving payouts. Thank you!";
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, account],
    });

    return signature;
  };

  const isMetaMaskInstalled = () => {
    if (window.ethereum) setMetaMaskInstalled(true);
    else setMetaMaskInstalled(false);
  };

  const isReady = () => {
    return accounts.length > 0;
  };

  const deposit = async (value) => {
    // Check current allowance
    const allowance = BigInt(
      await token.methods
        .allowance(accounts[0], CONFIG.WEB3.NETWORK.POLYGON.CONTRACT_ADDRESS)
        .call()
    );

    // Convert the deposit value to BigInt for comparison
    const depositValue = BigInt(web3.utils.toWei(value.toString(), "ether"));

    // Check if the current allowance is less than the user's balance

    // Approve using the user's current balance as the max value
    if (allowance < depositValue)
      await token.methods
        .approve(
          CONFIG.WEB3.NETWORK.POLYGON.CONTRACT_ADDRESS,
          depositValue.toString()
        )
        .send({ from: accounts[0] });

    // Proceed with the deposit
    await contract.methods
      .deposit(depositValue.toString())
      .send({ from: accounts[0] });
  };

  const withdraw = async (amount) => {
    const withdrawalFee = await contract.methods.withdrawalFee().call();

    await contract.methods
      .requestWithdraw(web3.utils.toWei(amount.toString(), "ether"))
      .send({ from: accounts[0], value: withdrawalFee });
  };

  // Web3 betting
  const placeBet = async (value) => {
    //setAutoCashOutMultiplier(value.autoCashOut);
    if (gameState === "BETTING") {
      setUserBetAmount(value.betAmount);
      if (!signature) {
        const sign = await getSignature(accounts[0]);
        setSignature(sign);

        socket.emit("currentBets", {
          address: accounts[0],
          signature: sign,
          bet: value.betAmount,
        });
      } else {
        socket.emit("currentBets", {
          address: accounts[0],
          signature: signature,
          bet: value.betAmount,
        });
      }
    }
  };

  const cashOut = async () => {
    if (gameState === "PLAYING") {
      setInitiatedCashOut(true);
    }
  };

  /*
  async function autoCashOut(autoCashOutMultiplier) {
    if (gameState === "PLAYING") {
      setInitiatedCashOut(true);
      setUserCrashed(false);
      setUserWon(true);
      setWonAmount(userBetAmount * autoCashOutMultiplier);
      setCashOutMultiplier(autoCashOutMultiplier);
      setInitColorBetting(true);
    }
  }*/

  const customTheme = {
    spinner: { container: { color: "#00C781", size: "xlarge" } },
    tab: {
      color: "#F7F7F7",
      active: { color: color },
      hover: { color: color },
      border: {
        side: "bottom",
        size: "small",
        color: {
          dark: "#F7F7F7",
          light: "#F7F7F7",
        },
        active: {
          color: {
            dark: color,
            light: color,
          },
        },
        hover: {
          color: {
            dark: color,
            light: color,
          },
        },
      },
    },
    formField: {
      border: false,
    },
    button: {
      border: {
        radius: "4px",
      },
      hover: {
        color: "#81FCED",
      },
    },
    global: {
      colors: {
        text: {
          dark: "#F7F7F7",
          light: "#1B1B1B",
        },
      },
      focus: {
        border: {
          color: color,
        },
      },
      font: {
        family: "HelveticaNeueBd",
      },
      drop: {
        background: "#222222",
        shadowSize: "medium",
        extend: `
          font-size: 14px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          li {
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          }
          overflow: hidden;
        `,
      },
      elevation: {
        light: {
          xsmall: "0px 0px 5px #81FCED",
          xxsmall: "10px 10px 10px #81FCED",
          small: "0px 0px 0px #81FCED",
        },
        dark: {
          xsmall: "0px 0px 5px #81FCED",
          xxsmall: "10px 10px 10px #81FCED",
          medium: "0px 0px 0px #81FCED",
        },
      },
    },
    background: {
      color: "#171717",
    },
    dataTable: {
      header: {
        border: {
          color: "#1B1B1B",
          side: "bottom",
          size: "small",
        },
      },
    },
    menu: {
      background: "#171717",
    },
    text: {
      xxsmall: {
        size: "7px",
      },
    },
  };

  return (
    <Grommet
      theme={deepMerge(grommet, customTheme)}
      style={{
        backgroundColor: "#171717",
      }}
      overflow="auto"
      full
    >
      {firstLoading ? (
        <>
          <Box fill align="center" justify="center">
            <Spinner size="large" />
          </Box>
        </>
      ) : (
        <>
          <CrashContext.Provider
            value={{
              url,
              setUserName,
              userName,
              isReady,
              placeBet,
              loggedIn,
              accounts,
              playerExistsInDB,
              userAddress,
              checkPlayerInDB,
              color,
              setCashOutMultiplier,
              setMessage,
              userBetAmount,
              socket,
              chatLoaded,
              setChatLoaded,
              userPlacedBet,
              setUserBetAmount,
              setUserPlacedBet,
              userCrashed,
              setUserCrashed,
              userWon,
              setUserWon,
              setGameState,
              wonAmount,
              setWonAmount,
              cashOut,
              setInitiatedCashOut,
              setAccounts,
              setWeb3,
              setLoggedIn,
              cashOut,
              addPlayer,
              setColor,
              cashOutColor,
              setCashOutColor,
              initColorBetting,
              setInitColorBetting,
              initColorWaiting,
              setInitColorWaiting,
              metaMaskInstalled,
              modalOpen,
              setModalOpen,
              isDeposit,
              setIsDeposit,
              isWithdraw,
              setIsWithdraw,
              walletBalance,
              setWalletBalance,
              gameBalance,
              setGameBalance,
              deposit,
              withdraw,
              getSignature,
              setSignature,
              signature,
              setExitMultiplier,
              initiatedCashOut,
              setExited,
              howItWorksModalOpen,
              setHowItWorksModalOpen,
              shortAdress,
              controlLoaded,
              setControlLoaded,
              firstLoading,
              chatLoading,
              setChatLoading,
            }}
          >
            <HeaderComponent />
            <Main />
            <Footer
              background="#171717"
              pad={{ vertical: "xsmall", horizontal: "medium" }}
            >
              <ResponsiveContext.Consumer>
                {(size) =>
                  size === "small" ? (
                    <>
                      <Text textAlign="start" size="6px">
                        ©2023 CRASH. Enjoy! ❤️
                      </Text>
                      <Text textAlign="end" size="6px">
                        We take {houseFee}% house fee on each bet & accept only
                        TEST.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text textAlign="start" size="xsmall">
                        ©2023 CRASH. Have fun! ❤️
                      </Text>
                      <Text textAlign="end" size="xsmall">
                        We take {houseFee}% on each deposit & accept only TEST.
                      </Text>
                    </>
                  )
                }
              </ResponsiveContext.Consumer>
            </Footer>
            <Modal />
            <HowItWorksModal />
          </CrashContext.Provider>
        </>
      )}
    </Grommet>
  );
}
