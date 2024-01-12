import { Box, Button, ResponsiveContext, Anchor } from "grommet";
import { Integration, Magic } from "grommet-icons";
import { React, useContext } from "react";

import { CrashContext } from "../contexts/CrashContext";

const ConnectMetaMask = () => {
  const { color, metaMaskInstalled, setAccounts } = useContext(CrashContext);

  async function getAccount() {
    if (typeof window !== "undefined" && window.ethereum) {
      await await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(async (accounts) => {
          setAccounts(await accounts);
        });
    }
  }

  const size = useContext(ResponsiveContext);

  if (metaMaskInstalled) {
    return (
      <>
        {size === "small" && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="xsmall"
            animation="zoomOut"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Box animation="fadeIn">
              <Button
                id="connectButton"
                secondary
                icon={<Integration />}
                label="CONNECT"
                onClick={async () => {
                  await getAccount();
                }}
                color={color}
              />
            </Box>
          </Box>
        )}
        {size === "medium" && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="xsmall"
            animation="zoomOut"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Box animation="fadeIn">
              <Button
                id="connectButton"
                secondary
                icon={<Integration size="medium" />}
                label="CONNECT"
                onClick={async () => {
                  await getAccount();
                }}
                color={color}
              />
            </Box>
          </Box>
        )}
        {(size === "large" || size === "large") && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="xsmall"
            animation="zoomOut"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Box animation="fadeIn">
              <Button
                id="connectButton"
                secondary
                size="xlarge"
                icon={<Integration />}
                label="CONNECT"
                onClick={async () => {
                  await getAccount();
                }}
                color={color}
              />
            </Box>
          </Box>
        )}
      </>
    );
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
            pad="xsmall"
            animation="zoomOut"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Box animation="fadeIn">
              <Anchor
                href="https://fwd.metamask.io"
                label={
                  <Button
                    id="connectButton"
                    secondary
                    icon={<Magic />}
                    label="INSTALL METAMASK"
                    color={color}
                  />
                }
              ></Anchor>
            </Box>
          </Box>
        )}
        {size === "medium" && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="xsmall"
            animation="zoomOut"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Box animation="fadeIn">
              <Anchor
                href="https://fwd.metamask.io"
                label={
                  <Button
                    id="connectButton"
                    secondary
                    icon={<Magic size="medium" />}
                    label="INSTALL METAMASK"
                    color={color}
                  />
                }
              ></Anchor>
            </Box>
          </Box>
        )}
        {(size === "large" || size === "large") && (
          <Box
            gridArea="betting"
            background="#171717"
            align="center"
            justify="center"
            round="xsmall"
            pad="xsmall"
            animation="zoomOut"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Box animation="fadeIn">
              <Anchor
                href="https://fwd.metamask.io"
                label={
                  <Button
                    id="connectButton"
                    secondary
                    size="xlarge"
                    icon={<Magic />}
                    label="INSTALL METAMASK"
                    color={color}
                  />
                }
              ></Anchor>
            </Box>
          </Box>
        )}
      </>
    );
  }
};

export default ConnectMetaMask;
