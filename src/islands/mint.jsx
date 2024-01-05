import * as React from "react";
import WagmiWrapper from "./wagmi";
import Connect from "./connect";

// wc id: d10035f161c5f127080ec9ea31f372d1
// <img src={imgDataURL} alt="Mickey Mouse" width="64" height="64" />

export default ({ info }) => {
  return (
    <WagmiWrapper>
      <Connect client:load info={info} />
    </WagmiWrapper>
  );
};
