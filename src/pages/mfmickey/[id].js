import { tryFetch } from "../../utils.mjs";

export async function GET({ params, ...rest }) {
  const formats = {
    png: {
      type: "image/png",
      ext: "png",
    },
    webp: {
      type: "image/webp",
      ext: "webp",
    },
    json: {
      type: "application/json",
      ext: "json",
    },
  };

  const isTxId = params.id.startsWith("0x") && params.id.length === 66;
  const isSha = params.id && params.id.length === 40;

  if (isTxId || isSha) {
    const txUrl = `https://api.ethscriptions.com/api/ethscriptions/${params.id}`;
    const shaUrl = `https://api.ethscriptions.com/api/ethscriptions/exists/${params.id}`;

    const res = await fetch(isTxId ? txUrl : shaUrl).then((x) => x.json());

    if (res.error) {
      return new Response(JSON.stringify({ error: res.error }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }

    const {
      content_uri,
      current_owner,
      creator,
      sha,
      creation_timestamp,
      ethscription_number,
      mimetype,
    } = isSha && res.result ? res.ethscription : res;
    const item = {
      sha,
      creator,
      current_owner,
      creation_timestamp,
      ethscription_number,
      mimetype,
      content_uri,
    };

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const { origin } = new URL(rest.url);
  const { buf: imgBuf, type } = await tryFetch(origin, params.id);

  return new Response(imgBuf, {
    status: 200,
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=31536000",
    },
  });

  // const fmt = formats[rest.url.searchParams.get("format") || "png"];

  // if (fmt.ext === "png") {
  //   // proxy through ipfs, cuz we cannot host all 1928 pngs on github, haha
  //   const res = await fetch(
  //     `https://bafybeigsgx2fx52lb2ikpilj3jaigdiaspk3d4i7fu7vbjl5tc6c7aacey.ipfs.dweb.link/${params.id}.png`,
  //   );

  //   return new Response(res.body, {
  //     status: 200,
  //     headers: {
  //       "content-type": "image/png",
  //       "cache-control": "public, max-age=31536000",
  //     },
  //   });
  // }
}
