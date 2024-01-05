import fs from "node:fs/promises";
import path from "node:path";
import pMapSeries from "p-map-series";
import metadata from "./data/metadata.json" assert { type: "json" };
import {
  createCollectionManifest,
  sha256,
  getEthscriptionBySha,
} from "./src/utils.mjs";

// NOTE: run in node, and make sure to update the mimetype before running
const { data: tokens } = metadata;

const files = await fs.readdir("./data/images");

const extmap = {
  ".png": "image/png",
  ".gif": "image/gif",
};

console.log(files);

const items = await pMapSeries(files, async (filename) => {
  const filepath = path.join("./data/images", filename);
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);
  const id = Number(basename);
  const { attributes } = tokens[id - 1] || {};

  if (!attributes) {
    throw new Error("oops");
  }

  const imageBase64 = await fs.readFile(filepath, { encoding: "base64" });
  const sha = await sha256(`data:${extmap[extname]};base64,${imageBase64}`);

  attributes.push({ trait_type: "sha256", value: sha });

  const ethscription = await getEthscriptionBySha(sha);
  const ethscription_id =
    ethscription.data && ethscription.data.result
      ? ethscription.data.ethscription.transaction_hash
      : "";

  const item = {
    sha,
    id,
    name: `MfMickey #${id}`,
    description: `Ethscription MfMickeys, minted on January 4, 2024. Homage to Mfers, Mfpurrs, and Mickey Mouse.`,
    item_attributes: attributes,
    external_url: `https://mfmickeys.vercel.app/images/${filename}`,
    ethscription_id,
  };

  console.log(item);
  return item;
});

console.log(items.length);
// // can update collection options/settings here, like discord_link, name, description, etc..
const collectionManifest = createCollectionManifest();

collectionManifest.collection_items = items;

await fs.writeFile(
  "./public/metadata-after-soldout.json",
  JSON.stringify(collectionManifest, null, 2),
);
