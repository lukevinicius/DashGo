import NextLink from "next/link";

import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

export default function UserList() {
  return (
    <Box>
      <Header />

      <Flex
        w="100%"
        my="6"
        maxWidth={1480}
        mx="auto"
        px="6"
      >
        <Sidebar />

        <Box
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p="8"
        >
          <Flex
            mb="8"
            justify="space-between"
            align="center"
          >
            <Heading
              size="lg"
              fontWeight="normal"
            >
              Usuários
            </Heading>

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize={20} />}
              >
                Criar novo usuário
              </Button>
            </NextLink>
          </Flex>

          <Table
            colorScheme="whiteAlpha"
          >
            <Thead>
              <Tr>
                <Th
                  px="6"
                  color="gray.300"
                  width="8"
                >
                  <Checkbox colorScheme="pink" />
                </Th>
                <Th>Usuário</Th>
                <Th>Data de cadastro</Th>
                <Th width="8" />
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td
                  px="6"
                >
                  <Checkbox colorScheme="pink" />
                </Td>
                <Td>
                  <Box>
                    <Text
                      fontWeight="bold"
                    >
                      Lucas vinicius
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.300"
                    >
                      lucasviniciusaalves@gmail.com
                    </Text>
                  </Box>
                </Td>
                <Td>
                  04 de Abril, 2021
                </Td>
                <Td>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="purple"
                  leftIcon={<Icon as={RiPencilLine} fontSize={16} />}
                >
                  Editar
                </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
          <Pagination />
        </Box>
      </Flex>
    </Box>
  )
}