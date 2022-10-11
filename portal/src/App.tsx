import * as React from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { BagelbotContext } from "./hooks/useBagelbotCtx";
import { Tab } from "../types/Tab";
import { Order } from "../types/Order";
import { Host } from "../types/Host";
import Navbar from "./components/Navbar";
import { PingSet } from "../types/PingSet";
import { Profile } from "../types/Profile";

const App = () => {
  const [tabs, setTabs] = useState([] as Tab[]);
  const [orders, setOrders] = useState([] as Order[]);
  const [hosts, setHosts] = useState([] as Host[]);
  const [coins, setCoins] = useState([] as number[]);
  const [pingSet, setPingSet] = useState({} as PingSet);
  const [profile, setProfile] = useState({} as Profile);

  const [loading, setLoading] = useState(true);

  const navigateTo = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("mybb-auth");

    const loadUserData = async () => {
      const tabRes = await fetch("https://api.bagelbot.lol/v1/me/tabs", {
        headers: { authorization: "Bearer " + token },
      });
      const orderRes = await fetch("https://api.bagelbot.lol/v1/me/orders", {
        headers: { authorization: "Bearer " + token },
      });
      const hostRes = await fetch("https://api.bagelbot.lol/v1/me/hosts", {
        headers: { authorization: "Bearer " + token },
      });
      const pingsetRes = await fetch('https://api.bagelbot.net/v1/me/notifications', {
        headers: { authorization: "Bearer " + token }
      });
      const coinRes = await fetch(
        "https://api.bagelbot.lol/v1/me/coin-history",
        {
          headers: { authorization: "Bearer " + token },
        }
      );
      const profileRes = await fetch(
        "https://api.bagelbot.lol/v1/me",
        {
          headers: { authorization: "Bearer " + token },
        }
      );

      setTabs(await tabRes.json());
      setOrders(await orderRes.json());
      setHosts(await hostRes.json());
      setCoins(await coinRes.json());
      setPingSet(await pingsetRes.json())
      setProfile(await profileRes.json());

      setLoading(false);
    };

    loadUserData().catch(() => {
      localStorage.removeItem("mybb-auth");
      navigateTo("/login");
    });
  }, []);

  if (loading)
    return (
      <Flex
        justify={"center"}
        align={"center"}
        style={{ height: "100vh", width: "100vw" }}
      >
        <Spinner />
      </Flex>
    );

  return (
    <BagelbotContext.Provider
      value={{ tabs, orders, hosts, coins, profile, pings: pingSet }}
    >
      <Navbar />
      <Outlet />
    </BagelbotContext.Provider>
  );
};

export default App;
