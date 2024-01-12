import React, { useState } from "react";
import {
  Box,
  Text,
  Form,
  FormField,
  Grid,
  TextInput,
  Button,
  Anchor,
  Spinner,
} from "grommet";
import { CrashContext } from "../contexts/CrashContext";
import styled from "styled-components";
import { useContext, useEffect } from "react";
import { Atm, Add } from "grommet-icons";

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
`;

const Modal = () => {
  const {
    modalOpen,
    color,
    setModalOpen,
    isDeposit,
    isWithdraw,
    setIsDeposit,
    setIsWithdraw,
    gameBalance,
    setGameBalance,
    walletBalance,
    deposit,
    accounts,
    token,
    socket,
    withdraw,
  } = useContext(CrashContext);
  const [valueDeposit, setValueDeposit] = useState(0);
  const [valueWithdraw, setValueWithdraw] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("deposit", async (receivedDepositMessage) => {
      const accs = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (
        receivedDepositMessage.success &&
        receivedDepositMessage.address.toLowerCase() ===
          accs[0].toString().toLowerCase()
      ) {
        setGameBalance(receivedDepositMessage.balance);
        setLoading(false);
        setModalOpen(false);
        setIsDeposit(false);
      }
    });

    socket.on("withdraw", async (receivedWithdrawMessage) => {
      const accs = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (
        receivedWithdrawMessage.success &&
        receivedWithdrawMessage.address.toLowerCase() ===
          accs[0].toString().toLowerCase()
      ) {
        setGameBalance(receivedWithdrawMessage.balance);
        setLoading(false);
        setModalOpen(false);
        setIsWithdraw(false);
      }
    });
  }, [accounts]);

  return (
    <>
      {modalOpen && (
        <ModalContainer>
          <Box
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="large"
            border={{ color: "#1B1B1B", size: "large" }}
            gap="medium"
            width="medium"
            height="300px"
          >
            <Grid
              columns={{
                count: 1,
                size: "auto",
              }}
              gap="xsmall"
            >
              {loading ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <Form
                    gap="xsmall"
                    onSubmit={({ value }) => {
                      if (isDeposit) setValueDeposit(value.amount);
                      if (isWithdraw) setValueWithdraw(value.amount);
                    }}
                  >
                    <Box
                      direction="column"
                      gap="xsmall"
                      pad="xsmall"
                      animation={{ type: "fadeIn", duration: 390 }}
                    >
                      <Text weight="bold" size="xsmall">
                        {isDeposit &&
                          "Wallet balance: " +
                            Number(walletBalance).toFixed(2) +
                            " TEST"}
                        {isWithdraw &&
                          "Game balance: " +
                            Number(gameBalance).toFixed(2) +
                            " TEST"}
                      </Text>
                      <FormField
                        required={true}
                        name="amount"
                        htmlFor="textinput-id"
                      >
                        <TextInput
                          size="small"
                          name="amount"
                          placeholder="Amount"
                          value={
                            <>
                              {isDeposit && valueDeposit}
                              {isWithdraw && valueWithdraw}
                            </>
                          }
                          onChange={(event) => {
                            if (isDeposit) setValueDeposit(event.target.value);
                            if (isWithdraw)
                              setValueWithdraw(event.target.value);
                          }}
                          icon={
                            <Text weight="bold" size="medium" color="#6FFFB0">
                              TEST
                            </Text>
                          }
                          reverse
                        />
                      </FormField>

                      <Box animation={[{ type: "fadeIn", duration: 390 }]}>
                        {isDeposit && (
                          <Button
                            secondary
                            fill={true}
                            type="submit"
                            icon={<Add />}
                            label="DEPOSIT"
                            color="#6FFFB0"
                            onClick={async () => {
                              setLoading(true);
                              await deposit(valueDeposit);
                            }}
                          />
                        )}
                        {isWithdraw && (
                          <Button
                            secondary
                            fill={true}
                            type="submit"
                            icon={<Atm />}
                            label="WITHDRAW"
                            color="#6FFFB0"
                            onClick={async () => {
                              setLoading(true);
                              await withdraw(valueWithdraw);
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Form>
                </>
              )}
            </Grid>
            <Anchor
              label="Close"
              color="#6FFFB0"
              onClick={() => {
                if (isDeposit) {
                  setIsDeposit(false);
                  setValueDeposit(0);
                } else if (isWithdraw) {
                  setIsWithdraw(false);
                  setValueWithdraw(0);
                }
                setModalOpen(false);
              }}
            />
          </Box>
        </ModalContainer>
      )}
    </>
  );
};

export default Modal;
