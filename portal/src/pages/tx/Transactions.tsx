import React, { useEffect, useState, useReducer } from "react";

import {
  Spinner,
  Flex,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  FormControl,
  Modal,
  Select,
  Avatar,
  Tag,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  NumberInputField,
  NumberInput,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Block } from "../../../types/Blockchain";
import useBagelbotCtx from "../../hooks/useBagelbotCtx";

const BANK_ADDRESS = "90c65daf3faa89179ccbcb677ca3e4a65f33b9ba8521494b0e75a3a6f46cb897";

const Transactions = () => {
  const { profile, hosts, coins } = useBagelbotCtx();
  const toast = useToast();

  const [host, setHost] = useState(hosts!.length == 0 ? "tx01.bryxcoin.org" : hosts!.at(0)!.host);
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([] as Block[]);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txModalPayee, setTxModalPayee] = useState("");
  const [txModalAmount, setTxModalAmount] = useState(0);
  const [txModalSendButtonLoading, setTxModalSendButtonLoading] = useState(false);

  const [users, setUsers] = useState(
    [] as {
      first_name: string;
      last_name: string;
      bryxcoin_address: string;
      slack_profile_photo: string;
    }[]
  );

  useEffect(() => {
    setLoading(true);
    fetch(`https://${host}/blockchain/blocks`).then(async (res) => {
      setBlocks(await res.json());
      setLoading(false);
    });
  }, [host]);

  useEffect(() => {
    fetch(`https://api.bagelbot.net/v1/users`).then(async (res) => {
      setUsers(await res.json());
    });
  }, []);

  async function submitTx() {
    setTxModalSendButtonLoading(true);

    const res = await fetch(`https://api.bagelbot.net/v1/me/tx`, {
      method: "POST",
      headers: {
        authorization: "Bearer " + localStorage.getItem("mybb-auth"),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        address: txModalPayee,
        amount: txModalAmount,
      }),
    });

    setTxModalOpen(false);
    setTxModalSendButtonLoading(false);

    const resBody = await res.text();

    toast({
      title: res.ok ? "Success" : "Error",
      description: res.ok ? "Your transaction has been created!" : resBody,
      status: res.ok ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
  }

  if (loading)
    return (
      <Flex
        top={0}
        position={"fixed"}
        zIndex={-1}
        height={"100vh"}
        width={"100vw"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Spinner />
      </Flex>
    );

  return (
    <Flex direction={"column"} style={{ margin: "16px" }} gap={"8px"}>
      <Flex alignItems={"center"}>
        <Heading style={{ margin: "16px" }} size={"lg"} flex={1}>
          Bryxcoin Transactions&nbsp;
          <Button size={"sm"} leftIcon={<AddIcon />} onClick={() => setTxModalOpen(true)}>
            New Tx
          </Button>
        </Heading>
        <FormControl flex={1}>
          <Select value={host} onChange={(e) => setHost(e.target.value)}>
            {(hosts.length == 0 ? [{ host: "tx01.bryxcoin.org" }] : hosts).map((host) => (
              <option>{host.host}</option>
            ))}
          </Select>
        </FormControl>
      </Flex>
      <TableContainer>
        <Table size={"sm"}>
          <Thead>
            <Tr>
              <Th>Block #</Th>
              <Th>Timestamp</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {blocks
              .flatMap((block) =>
                block.transactions.map((tx) => ({
                  ...tx,
                  payer: users?.find(({ bryxcoin_address }) => bryxcoin_address == tx.data.inputs.at(0)?.address),
                  payee: tx.data.outputs
                    .filter((txo) => !tx.data.inputs.some((txi) => txi.address == txo.address))
                    .map((txo) => users?.find(({ bryxcoin_address }) => bryxcoin_address == txo.address))
                    .at(0),
                  amount:
                    tx.data.outputs.filter((txo) => !tx.data.inputs.some((txi) => txi.address == txo.address)).at(0)
                      ?.amount ?? 0,
                  blockNum: block.index,
                  timestamp: block.timestamp,
                }))
              )
              .reverse()
              .filter((tx) => tx.type == "regular")
              .filter((tx) => !!tx.payer || tx.data.inputs.some((txi) => txi.address == BANK_ADDRESS))
              .filter((tx) => !!tx.payee || tx.data.outputs.some((txo) => txo.address == BANK_ADDRESS))
              .map((tx) => (
                <Tr>
                  <Td>{tx.blockNum}</Td>
                  <Td>{new Date(tx.timestamp * 1000).toLocaleDateString()}</Td>
                  <Td>
                    {!!tx.payer ? (
                      <Flex alignItems={"center"} gap="4px">
                        <Avatar src={tx.payer.slack_profile_photo} size="sm" />
                        {`${tx.payer.first_name} ${tx.payer.last_name}`}
                      </Flex>
                    ) : (
                      <Flex alignItems={"center"} gap="4px">
                        <Avatar
                          size="sm"
                          padding={"8px"}
                          src={
                            "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/account_balance/default/48px.svg"
                          }
                        />
                        {"Bryxcoin Reserve"}
                      </Flex>
                    )}
                  </Td>
                  <Td>
                    {!!tx.payee ? (
                      <Flex alignItems={"center"} gap="4px">
                        <Avatar src={tx.payee.slack_profile_photo} size="sm" />
                        {`${tx.payee.first_name} ${tx.payee.last_name}`}
                      </Flex>
                    ) : (
                      <Flex alignItems={"center"} gap="4px">
                        <Avatar
                          size={"sm"}
                          padding={"8px"}
                          src={
                            "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/account_balance/default/48px.svg"
                          }
                        />
                        {"Bryxcoin Reserve"}
                      </Flex>
                    )}
                  </Td>
                  <Td>
                    {tx.amount}{" "}
                    <Tag style={{ maxHeight: "4px", alignSelf: "center" }} size={"sm"}>
                      BXCN
                    </Tag>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* modal section  */}

      <Modal isOpen={txModalOpen} onClose={() => setTxModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transfer Bryxcoin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Transfer To</FormLabel>
              <Select
                placeholder="Select a User"
                value={txModalPayee}
                onChange={(e) => setTxModalPayee(e.target.value)}
              >
                {users
                  .filter(
                    (user) => `${user.first_name} ${user.last_name}` != `${profile.first_name} ${profile.last_name}`
                  )
                  .map((user) => (
                    <option value={user.bryxcoin_address}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                max={coins.at(coins.length - 1) ?? 21}
                min={0}
                defaultValue={0}
                value={txModalAmount}
                onChange={(_, v) => setTxModalAmount(v)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => setTxModalOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={txModalSendButtonLoading} disabled={txModalSendButtonLoading || !(txModalAmount > 0 && txModalPayee != "")} colorScheme={"green"} onClick={submitTx}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Transactions;
