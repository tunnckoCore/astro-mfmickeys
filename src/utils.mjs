export { encode as arrayBufferToBase64 } from "base64-arraybuffer";

export function genIds(len = 1928) {
  return Array.from({ length: len })
    .fill(0)
    .map((_, i) => i + 1);
}

export function getRandomIndex(len = 1928) {
  return Math.floor(Math.random() * len) + 1;
}

export function createCollectionManifest(options = {}) {
  return {
    name: "mfmickeys",
    description: `A delightful homage to the iconic Mfpurrs on Ethscriptions, the amusing Mfers on OpenSea, and the timeless charm of Mickey Mouse. This unique combo brings together the best of all worlds, blending the artistic allure of the Ethereum blockchain with the nostalgic magic of everyone's favorite mouse.`,
    total_supply: 1928,
    logo_image_uri: `esc://ethscriptions/0xc598906da15fa21e63c4b3acf40a41c3fc263963ce0deccefb5edaef54ba64b9/data`,
    banner_image_uri: "",
    background_color: "#001",
    twitter_link: "",
    website_link: "https://mfmickeys.vercel.app",
    discord_link: "",
    collection_items: [],

    ...options,
  };
}

export function toHex(x) {
  const buf = typeof x === "string" ? new TextEncoder().encode(x) : x;
  const hashArray = Array.from(buf);
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export async function sha256(msg, algo) {
  const hashBuffer = await crypto.subtle.digest(
    algo || "SHA-256",
    typeof msg === "string" ? new TextEncoder().encode(msg) : msg,
  );

  return toHex(new Uint8Array(hashBuffer));
}

export async function getEthscriptionBySha(sha) {
  let res;

  try {
    res = await fetch(
      `https://api.ethscriptions.com/api/ethscriptions/exists/${sha}`,
    );
    if (!res.ok) {
      return { error: "Failed to fetch /exists api" };
    }

    res = await res.json();
  } catch (e) {
    return { error: "Failed to check if ethscription exists" };
  }

  if (res?.result) {
    console.log("already exists", res);
    // alert("This image has already been minted, page will reload!");
    // window.location.reload();
    return { data: res };
  }

  return {};
}

export async function tryFetch(origin, id) {
  let ext = null;
  let resp = null;

  try {
    resp = await fetch(`${origin}/images/${id}.png`);

    if (!resp.ok) {
      throw new Error("not found");
    }

    ext = "png";
  } catch (e) {
    resp = null;
    ext = null;
  }

  if (!resp) {
    try {
      resp = await fetch(`${origin}/images/${id}.gif`);
      if (!resp.ok) {
        throw new Error("not found");
      }
      ext = "gif";
    } catch (er) {
      resp = null;
      ext = null;
    }
  }

  return { ext, resp };
}
