import Link from "next/link";
import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { parseCookies } from "nookies";

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { Input } from "../../../components/Form/Input";

import { api } from "../../../services/api";
import { queryClient } from "../../../services/queryClient";
import { withSSRAuth } from "../../../services/hof/withSSRAuth";
import prisma from "../../../lib/prisma";

interface UpdateUserFormProps {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface UpdateUserProps {
  name: string;
  email: string;
}

const updateUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  email: yup
    .string()
    .required("E-mail obrigatório")
    .email("O campo precisa ser um email válido"),
  password: yup
    .string()
    .required("Senha obrigatória")
    .min(6, "Mínimo de 6 caracteres"),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais")
});

export default function UpdateUser({ email, name }: UpdateUserProps) {
  const router = useRouter();
  const id = Number(router.query.id);

  const updateUser = useMutation(
    async (user: UpdateUserFormProps) => {
      const cookies = parseCookies();

      const response = await api.put(`/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${cookies["@dashgo.token"]}`
        }
      });

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      }
    }
  );

  const { register, handleSubmit, formState } = useForm<UpdateUserFormProps>({
    resolver: yupResolver(updateUserFormSchema),
    defaultValues: {
      email,
      name
    }
  });

  const handleUpdateUser: SubmitHandler<UpdateUserFormProps> = async data => {
    await updateUser.mutateAsync(data);

    router.push("/users");
  };

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          onSubmit={handleSubmit(handleUpdateUser)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Atualizar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                error={formState.errors.name}
                name="name"
                label="Nome completo"
                {...register("name")}
              />
              <Input
                error={formState.errors.email}
                name="email"
                type="email"
                label="E-mail"
                {...register("email")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                error={formState.errors.password}
                {...register("password")}
              />
              <Input
                name="password_confirmation"
                type="password"
                label="Confirmação da senha"
                error={formState.errors.password_confirmation}
                {...register("password_confirmation")}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                isLoading={formState.isSubmitting}
                colorScheme="pink"
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth<UpdateUserProps>(async ctx => {
  const id = Number(ctx.query.id);

  const user = await prisma.user.findFirst({
    where: {
      id
    }
  });

  return {
    props: {
      email: user.email,
      name: user.name
    }
  };
});