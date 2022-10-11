import useBagelbotCtx from "../hooks/useBagelbotCtx";
import {
  Flex,
  StatGroup,
  StatNumber,
  Stat,
  StatLabel,
  Tag,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

export default function () {
  const { hosts, tabs, coins, orders } = useBagelbotCtx();

  const percentCoinDelta =
    ((coins.at(coins.length - 1)! - coins.at(coins.length - 2)!) /
      coins.at(coins.length - 1)!) *
    100;

  const getTextForLastDeltaTime = (deltaTimeMs: number) => {
    const minSince = deltaTimeMs / (1000 * 60);
    const hrSince = minSince / 60;
    const dySince = hrSince / 24;

    if (minSince < 1) return "Just Now";
    if (hrSince < 1) return Math.floor(minSince) + " min ago";
    if (dySince < 1) return Math.floor(hrSince) + " hr ago";
    else return Math.floor(dySince) + " dy ago";
  };

  const getTextForLastTabTime = () => {
    if (tabs.length == 0) return "No Tabs";
    const msSinceLastTab = Date.now() - (tabs.sort((a, b) => b.opened_at - a.opened_at).at(0)?.opened_at ?? 0);
    return getTextForLastDeltaTime(msSinceLastTab);
  };

  const getTextForLastOrderTime = () => {
    if (orders.filter((order) => !order.future).length == 0) return "No Orders";
    const msSince =
      Date.now() -
      orders
        .filter((order) => !order.future)
        .sort((a, b) => b.created - a.created)
        .at(0)!.created;
    return getTextForLastDeltaTime(msSince);
  };

  const getTextForLastScheduledOrderTime = () => {
    if (orders.filter((order) => order.future).length == 0) return "No Orders";
    const msSince =
      Date.now() -
      orders
        .filter((order) => order.future)
        .sort((a, b) => b.created - a.created)
        .at(0)!.created;
    return getTextForLastDeltaTime(msSince);
  };

  return (
    <Flex gap={"8px"} align={"stretch"} style={{ margin: "16px", gap: "16px" }}>
      <StatGroup style={{ width: "100vw" }}>
        <Stat
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#EDF2F7",
            border: "solid 1px #f4f4f4",
            borderRadius: "4px",
            margin: "8px",
            padding: "8px",
          }}
        >
          <StatLabel>Wallet</StatLabel>
          <StatNumber>
            <Flex>
              {coins.at(coins.length - 1)}&nbsp;
              <Tag
                backgroundColor={'white'}
                style={{ maxHeight: "4px", alignSelf: "center" }}
                size={"sm"}
              >
                BXCN
              </Tag>
            </Flex>
          </StatNumber>
          <StatHelpText>
            <StatArrow type={percentCoinDelta >= 0 ? "increase" : "decrease"} />
            {percentCoinDelta.toFixed(2)}%
          </StatHelpText>
        </Stat>
        <Stat
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#EDF2F7",
            border: "solid 1px #f4f4f4",
            borderRadius: "4px",
            margin: "8px",
            padding: "8px",
          }}
        >
          <StatLabel>My Tabs</StatLabel>
          <StatNumber>
            <Flex>
              {tabs.length}&nbsp;
              <Tag
                backgroundColor={'white'}
                style={{ maxHeight: "4px", alignSelf: "center" }}
                size={"sm"}
              >
                closed
              </Tag>
            </Flex>
          </StatNumber>
          <StatHelpText>{getTextForLastTabTime()}</StatHelpText>
        </Stat>
        <Stat
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#EDF2F7",
            border: "solid 1px #f4f4f4",
            borderRadius: "4px",
            margin: "8px",
            padding: "8px",
          }}
        >
          <StatLabel>My Orders</StatLabel>

          <StatNumber>
            <Flex>
              {orders.filter((order) => !order.future).length}&nbsp;
              <Tag
                backgroundColor={'white'}
                style={{ maxHeight: "4px", alignSelf: "center" }}
                size={"sm"}
              >
                closed
              </Tag>
            </Flex>
          </StatNumber>
          <StatHelpText>{getTextForLastOrderTime()}</StatHelpText>
        </Stat>

        <Stat
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#EDF2F7",
            border: "solid 1px #f4f4f4",
            borderRadius: "4px",
            margin: "8px",
            padding: "8px",
          }}
        >
          <StatLabel>Scheduled</StatLabel>

          <StatNumber>
            <Flex>
              {orders.filter((order) => order.future).length}&nbsp;
              <Tag
                backgroundColor={'white'}
                style={{ maxHeight: "4px", alignSelf: "center" }}
                size={"sm"}
              >
                orders
              </Tag>
            </Flex>
          </StatNumber>
          <StatHelpText>{getTextForLastScheduledOrderTime()}</StatHelpText>
        </Stat>
        <Stat
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#EDF2F7",
            border: "solid 1px #f4f4f4",
            borderRadius: "4px",
            margin: "8px",
            padding: "8px",
          }}
        >
          <StatLabel>Hosts</StatLabel>

          <StatNumber>
            <Flex>
              {hosts.length}&nbsp;
              <Tag
                backgroundColor={'white'}
                style={{ maxHeight: "4px", alignSelf: "center" }}
                size={"sm"}
              >
                registered
              </Tag>
            </Flex>
          </StatNumber>
          <StatHelpText>Max 3 per user</StatHelpText>
        </Stat>
      </StatGroup>
    </Flex>
  );
}
