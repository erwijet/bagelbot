import randomWords from "random-words";
import fetch from "node-fetch";

type Password = string;
type Wallet = string;
type Address = string;

export function getCoinEndpoint(path: string) {
  return `${process.env.COIN_ENDPOINT}/${path}`;
}

export function createNewPassword(): Password {
  return randomWords(10).join(" ") as Password;
}

export async function createWallet(password: string): Promise<Wallet> {
  const res = await fetch(getCoinEndpoint("operator/wallets"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  return (await res.json()).id as Wallet;
}

export async function createAddress(wallet: string, password: string): Promise<Address> {
  const res = await fetch(getCoinEndpoint(`operator/wallets/${wallet}/addresses`), {
    method: "POST",
    headers: {
      password,
    },
  });

  return (await res.json()).address as Address;
}

export async function newCoinUser(): Promise<[Password, Wallet, Address]> {
  const password = createNewPassword();
  const wallet = await createWallet(password);
  const address = await createAddress(wallet, password);

  return [password, wallet, address];
}
