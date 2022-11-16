import * as React from "react";
import { Order } from "../../types/Order";
import { Tab } from "../../types/Tab";
import { Host } from "../../types/Host";
import { PingSet } from "../../types/PingSet";
import { Profile } from "../../types/Profile";

export const BagelbotContext = React.createContext({
  orders: [] as Order[],
  hosts: [] as Host[],
  tabs: [] as Tab[],
  coins: [] as number[],
  pings: {} as PingSet,
  profile: {} as Profile
});

export default () => React.useContext(BagelbotContext);