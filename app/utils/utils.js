import CONFIG from "../../config/config.json";

export const calculateBravery = (bet) => {
  if (bet >= 0.01 && bet < 10000) {
    return 10;
  }
  if (bet >= 10000 && bet < 20000) {
    return 20;
  }
  if (bet >= 20000 && bet < 100000) {
    return 25;
  }
  if (bet >= 100000 && bet < 500000) {
    return 30;
  }
  if (bet >= 500000 && bet < 1000000) {
    return 40;
  }
  if (bet >= 1000000 && bet < 10000000) {
    return 60;
  }
  if (bet >= 10000000 && bet < 100000000) {
    return 85;
  }
  if (bet >= 100000000) {
    return 100;
  }
};

export const switchNetwork = async () => {
  let chainId, chainName, currrencyName, currencySymbol, RPC, blockExplorerUrl;

  chainId = CONFIG.WEB3.NETWORK.POLYGON.CHAIN_ID;
  chainName = CONFIG.WEB3.NETWORK.POLYGON.CHAIN_NAME;
  currrencyName = CONFIG.WEB3.NETWORK.POLYGON.CURRENCY_NAME;
  currencySymbol = CONFIG.WEB3.NETWORK.POLYGON.CURRENCY_SYMBOL;
  RPC = CONFIG.WEB3.NETWORK.POLYGON.RPC_PUBLIC;
  blockExplorerUrl = CONFIG.WEB3.NETWORK.POLYGON.BLOCK_EXPLORER;

  if (window.ethereum) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainId,
                chainName: chainName,
                nativeCurrency: {
                  name: currrencyName,
                  symbol: currencySymbol,
                  decimals: 18,
                },
                rpcUrls: [RPC],
                blockExplorerUrls: [blockExplorerUrl],
                iconUrls: [""],
              },
            ],
          });
        } catch (addError) {
          console.log("Did not add network");
        }
      }
    }
  }
};
