// import fs from "node:fs/promises";
// import holders from "./data/mfers-holders.json" assert { type: "json" };

// // const json = await fetch("https://api.wgw.lol/v1/snapshot/mfpurrs").then((x) =>
// //   x.json(),
// // );

// const data = holders.reduce((acc, { HolderAddress: address }) => {
//   acc[address.toLowerCase()] = true;
//   return acc;
// }, {});

// // console.log(json.data.unique.holders);

// await fs.writeFile("./data/mfers.json", JSON.stringify(data));
