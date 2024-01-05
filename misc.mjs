// import fs from "node:fs/promises";
// import holders from "./mfpurrs-holders-va.json" assert { type: "json" };

// // // // const json = await fetch("https://api.wgw.lol/v1/snapshot/mfpurrs").then((x) =>
// // // //   x.json(),
// // // // );

// const data = holders.reduce((acc, address) => {
//   acc[address.toLowerCase()] = true;
//   return acc;
// }, {});

// // // // console.log(json.data.unique.holders);

// await fs.writeFile("./public/allowlists/mfpurrs-va.json", JSON.stringify(data));
