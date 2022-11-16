import React, { useState } from "react";
import {
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Toast,
  useToast,
  useStatStyles,
} from "@chakra-ui/react";
import useBagelbotCtx from "../../hooks/useBagelbotCtx";

const Notifications = () => {
  const { pings } = useBagelbotCtx();

  const [ openTabPing, setOpenTabPing ] = useState(pings.TAB_OPEN);

  const toast = useToast();

  function handleTabPingChange(v: boolean) {
    console.log({ v });
    setOpenTabPing(v);

    fetch("https://api.bagelbot.net/v1/me/notifications", {
      method: "PUT",
      headers: {
        authorization: "Bearer " + localStorage.getItem("mybb-auth"),
        'content-type': 'application/json'
      },
      body: JSON.stringify({ events: [v ? 'TAB_OPEN' : ''] })
    }).then((res) => {
      toast({
        title: "Success",
        description: "Your account preferences have been saved",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    });
  }

  return (
    <Flex direction={"column"} style={{ margin: "16px" }}>
      <Heading style={{ margin: "16px" }} size={"lg"}>
        Notifications
      </Heading>

      <FormControl display="flex" alignItems="center" margin={"16px"}>
        <FormLabel htmlFor="open-tab-ping" mb="0">
          Ping me when a <span style={{ fontWeight: 'bold' }}>tab opens</span>?
        </FormLabel>
        <Switch
          id="open-tab-ping"
          isChecked={openTabPing}
          onChange={(e) => handleTabPingChange(e.target.checked)}
        />
      </FormControl>
    </Flex>
  );
};

export default Notifications;
