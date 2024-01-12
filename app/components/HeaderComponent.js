import React, { useContext } from "react";
import {
  Header,
  Anchor,
  Box,
  ResponsiveContext,
  Menu,
  Button,
  Text,
} from "grommet";
import { Money, Cube, Alert, User, Add, Atm, HelpBook } from "grommet-icons";
import { CrashContext } from "../contexts/CrashContext";

const AccountButton = ({ shortAdress, color, label }) => (
  <Button
    icon={<User />}
    secondary
    color={color}
    label={<Text size="small">{label + shortAdress}</Text>}
    gap="small"
  />
);

const HeaderComponent = () => {
  const size = useContext(ResponsiveContext);
  const {
    userName,
    loggedIn,
    color,
    setModalOpen,
    setIsDeposit,
    setIsWithdraw,
    gameBalance,
    setHowItWorksModalOpen,
    shortAdress,
  } = useContext(CrashContext);

  const userLabel = userName ? userName + ": " : "";
  const accountDisplay = loggedIn ? (
    <>
      <Box justify="end" direction="row" gap="small">
        <AccountButton
          shortAdress={shortAdress}
          color={color}
          label={userLabel}
        />

        <Button
          icon={<Add />}
          primary
          color={color}
          label={<Text size="small">DEPOSIT</Text>}
          gap="small"
          onClick={() => {
            setIsDeposit(true);
            setModalOpen(true);
          }}
        />
        <Button
          icon={<Atm />}
          primary
          color={color}
          label={<Text size="small">WITHDRAW</Text>}
          gap="small"
          onClick={() => {
            setIsWithdraw(true);
            setModalOpen(true);
          }}
        />
        <Button
          secondary
          color={color}
          label={
            <Text size="small">
              GAME BALANCE: {Number(gameBalance).toFixed(2)} TEST
            </Text>
          }
          gap="small"
        />
      </Box>
    </>
  ) : (
    <Button
      icon={<Alert />}
      secondary
      color={color}
      disabled={true}
      label={
        <Text size="small">You must be connected with MetaMask to play!</Text>
      }
    />
  );

  const buyButton = (
    <Anchor
      href="https://quickswap.exchange/#/swap?swapIndex=0&currency0=ETH&currency1=0xb5e0CFe1B4dB501aC003B740665bf43192cC7853"
      label={
        <Button
          primary
          color={color}
          icon={<Money />}
          label={
            <Text size={size === "small" ? "medium" : "large"}>
              <Text size="small">BUY TEST</Text>
            </Text>
          }
        />
      }
    />
  );

  const howItWorksButton = (
    <Button
      primary
      color={color}
      icon={<HelpBook />}
      label={
        <Text size={size === "small" ? "medium" : "large"}>
          <Text size="small">HOW IT WORKS</Text>
        </Text>
      }
      onClick={() => setHowItWorksModalOpen(true)}
    />
  );

  return (
    <Header
      background="#171717"
      pad="medium"
      height={size === "small" ? "55px" : size === "medium" ? "67px" : "77px"}
    >
      <Box animation="slideRight">
        <Box justify="end" direction="row" gap="small">
          <Button
            secondary
            color={color}
            label={
              <Text size={size === "small" ? "medium" : "large"}>CRASH</Text>
            }
            justify="center"
            background="#171717"
          />
          {size !== "small" && buyButton}
          {size !== "small" && howItWorksButton}
        </Box>
      </Box>
      <Box justify="end" direction="row" gap="medium">
        {size === "small" ? (
          <Menu
            a11yTitle="Navigation Menu"
            dropProps={{ align: { top: "bottom", right: "right" } }}
            icon={<Cube size="medium" color={color} />}
            items={[{ label: buyButton, href: "#" }, { label: accountDisplay }]}
          />
        ) : (
          accountDisplay
        )}
      </Box>
    </Header>
  );
};

export default HeaderComponent;
