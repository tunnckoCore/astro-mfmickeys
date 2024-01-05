import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { goerli, mainnet } from "viem/chains";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "d10035f161c5f127080ec9ea31f372d1";

// 2. Create wagmiConfig
const metadata = {
  name: "WGW Launchpad",
  description: "Wiggle Ethscribor",
  url: "https://wgw.lol",
  icons: ["https://avatars.githubusercontent.com/u/5038030"],
};

const chains = [mainnet, goerli];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export default function App({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
