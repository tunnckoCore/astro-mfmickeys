import { useWeb3Modal } from "@web3modal/wagmi/react";

import {
  useAccount,
  // usePrepareSendTransaction,
  // useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import * as contract from "../contract.mjs";
import { useEffect, useState } from "react";

const pricing = {
  discount: "0.001",
  public: "0.002",
};

async function checkAllowlist(origin, name, address) {
  let res = null;
  try {
    res = await fetch(`${origin}/allowlists/${name}.json`)
      .then((res) => res.json())
      .then((x) => x[address]);
  } catch (e) {
    return false;
  }

  return res;
}

export default function ConnectButton({ info }) {
  const { open } = useWeb3Modal();
  let { address } = useAccount();
  const [price, setPrice] = useState("0.002");

  useEffect(() => {
    async function load() {
      const { origin } = new URL(window.location.href);
      const isMfer = await checkAllowlist(origin, "mfers", address);
      const isMfpurr = await checkAllowlist(origin, "mfpurrs", address);
      const isDigijoint = await checkAllowlist(origin, "digijoints", address);

      const price =
        isMfer || isMfpurr || isDigijoint ? pricing.discount : pricing.public;

      setPrice(price);
    }

    load();
  }, [address]);

  address = address?.toLowerCase();

  const isDeployer = address === contract.deployer.toLowerCase();

  const { config, error } = usePrepareContractWrite({
    address: contract.address,
    abi: [
      {
        inputs: [{ internalType: "string", name: "dataURI", type: "string" }],
        name: "ethscribe",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "ethscribe",
    args: [info.dataURL],
    chainId: contract.chainId,
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  const mintImage = async () => {
    const res = await getEthscriptionBySha(info.sha);

    if (res.error) {
      alert(res.error);
      return;
    }
    if (res.data?.result) {
      alert("This image has already been minted, page will reload!");
      window.location.reload();
      return;
    }
    if (info.ethscription.error) {
      alert(info.ethscription.error);
      return;
    }
    if (info.ethscription.result) {
      alert("This image has already been minted, page will reload!");
      window.location.reload();
      return;
    }

    console.log("info ->", JSON.stringify(info));
    console.log("contract ->", contract);

    // const { origin } = new URL(window.location.href);
    // const isMfer = await checkAllowlist(origin, "mfers", address);
    // const isMfpurr = await checkAllowlist(origin, "mfpurrs", address);
    // const isDigijoint = await checkAllowlist(origin, "digijoints", address);

    // const price =
    //   isMfer || isMfpurr || isDigijoint ? pricing.discount : pricing.public;

    await write?.({
      // value: isDeployer ? 0 : parseEther(price),
      value: parseEther(price),
    });
  };

  return (
    <>
      <button
        className={
          `rounded-md px-2 py-1.5 font-semibold` +
          (address ? " bg-purple-500" : " bg-blue-500")
        }
        onClick={() => open()}
      >
        {address ? "See Account" : "Connect"}
      </button>
      <div className="flex items-center justify-center gap-2 text-center">
        <div className="font-bold">MfMickey #{info.id}</div>
      </div>

      <div
        className={
          `flex w-full items-center justify-center` +
          (info.ethscription?.result ? "border-4 border-red-500" : "")
        }
      >
        <img
          className="h-96 w-full"
          src={info.url}
          alt={`Ethscription MfMickey #${info.id}`}
        />
      </div>
      <button
        className="rounded-md bg-green-500 px-2 py-1.5 font-semibold"
        onClick={mintImage}
      >
        Mint for {price} ETH
      </button>
      <button
        className="rounded-md bg-orange-500 px-2 py-1.5 font-semibold"
        onClick={() => window.location.reload()}
      >
        Randomize
      </button>
      {isLoading && <div>Wait a few seconds, minting...</div>}
      {error && (
        <div class="text-red-500">
          An error occurred preparing the transaction: {error?.message}
        </div>
      )}
      {isSuccess && (
        <div className="text-green-500">
          Successfully minted! Check out on{" "}
          <a
            target="_blank"
            className="text-blue-400"
            href={`https://${
              contract.chainId === 5 ? "goerli." : ""
            }ethscriptions.com/ethscriptions/${data?.hash}`}
          >
            ethscriptions.com
          </a>
          !
        </div>
      )}
    </>
  );
}