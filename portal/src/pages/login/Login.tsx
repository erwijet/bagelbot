import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement
} from "@chakra-ui/react";
import JWT from 'jsonwebtoken';

import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [idenTok, setIdenTok] = useState('');
  const [idenSec, setIdenSec] = useState('');
  const navigateTo = useNavigate();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleSignIn = (e: any) => {
    e.preventDefault();

    const jwt = JWT.sign({
        tok: idenTok,
        iss: 'my.bagelbot.net',
        sub: 'api',
        iat: Date.now()
    }, idenSec);

    localStorage.setItem('mybb-auth', jwt);
    navigateTo('/Dashboard');
  }

  useEffect(() => {
    if (!!localStorage.getItem('mybb-auth')) navigateTo('/');
  }, []);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">My Bagelbot</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="text" placeholder="Identity Token" value={idenTok} onChange={e => setIdenTok(e.target.value)} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Identity Secret"
                    value={idenSec}
                    onChange={e => setIdenSec(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={handleSignIn}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        What are these values?{" "} Run <span style={{ fontFamily: 'monospace' }}>/identity</span> in the{" "}
        <Link color="teal.500" href="https://api.bagelbot.net">
	  #bagels
        </Link>{" "}
	channel
      </Box>
    </Flex>
  );
};

export default LoginPage;
