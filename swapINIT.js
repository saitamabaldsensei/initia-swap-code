import { LCDClient, MnemonicKey, MsgExecute, Wallet, bcs } from "@initia/initia.js";

const lcd = new LCDClient("https://lcd.initia.xyz", {
  chainId: "interwoven-1",
  gasPrices: "0.015uinit",
  gasAdjustment: "1.5",
});

// Ganti dengan mnemonic kamu (jangan share ke siapa pun)
const key = new MnemonicKey({
  mnemonic: "your twelve word mnemonic here ...",
});

const wallet = new Wallet(lcd, key);

// Ganti dengan address pair dan metadata coin yang mau di-swap
const offerCoinMetadata = "0x..."; 
const pairObject = "0x...";        

async function simpleSwap() {
  const offerAmount = "1000000";
  const minReturn = "950000";

  const msg = new MsgExecute(
    wallet.key.accAddress,
    "0x1",
    "dex",
    "swap_script",
    [],
    [
      bcs.object().serialize(pairObject).toBase64(),
      bcs.object().serialize(offerCoinMetadata).toBase64(),
      bcs.u64().serialize(offerAmount).toBase64(),
      bcs.option(bcs.u64()).serialize(minReturn).toBase64(),
    ]
  );

  const tx = await wallet.createAndSignTx({
    msgs: [msg],
  });

  const result = await lcd.tx.broadcast(tx);
  console.log("Tx Hash:", result.txhash);
}

simpleSwap().catch(console.error);
