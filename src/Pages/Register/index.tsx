import { useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  Text,
  Input,
  Button,
  useToast,
  Stack,
  InputGroup,
  InputLeftAddon,
  Select,
} from "@chakra-ui/react";
import Logo from "../../Assets/IMG/Logo.png";
import { AxiosResponse } from "axios";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";
import {
  DefaultResponse,
  LoginResponse,
  SupervisorTitle,
} from "../../lib/ResponseTypes";
import Cookies from "js-cookie";
import { validateEmail } from "../../App";

type RegisterFormType = {
  key: string;
  email: string;
  firstName: string;
  lastName: string;
  title: SupervisorTitle;
  phone: string;
  password: string;
};
export const Register = () => {
  const navigate = useNavigate();
  const addToast = useToast();
  const [isFormSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [Form, SetForm] = useState<RegisterFormType>({
    key: "",
    email: "",
    password: "",
    title: "Mr",
    phone: "",
    firstName: "",
    lastName: "",
  });

  const registerSupervisor = async (e: any) => {
    e.preventDefault();
    const { firstName, lastName, email, password, phone, title, key } = Form;
    const isEmailValid = validateEmail(email);
    console.log({
      firstName,
      lastName,
      email,
      password,
      phone,
      title,
      key,
    });
    if (
      isEmailValid &&
      lastName.length > 0 &&
      firstName.length > 0 &&
      password.length >= 7 &&
      phone.length === 10 &&
      key.length === 16 &&
      title.length !== 0
    ) {
      setFormSubmitting(true);
      const response: DefaultResponse = await FetchData({
        route: Endpoints.RegisterSupervisor,
        type: "POST",
        data: Form,
      }).catch(() => {
        addToast({
          status: "error",
          description: "An error occured! Please try again",
        });
      });
      setFormSubmitting(false);
      console.log(response);
      if (response.data.auth) {
        Cookies.set("supervisor_token", response.data.data);
        window.location.href = "/login";
      } else {
        const SUPERVISOR_KEY_NOT_VALID =
          "SUPERVISOR KEY is not valid".toLowerCase();
        const SUPERVISOR_KEY_IS_EXPIRED = "KEY is expired".toLowerCase();
        const SUPERVISOR_ALREADY_EXISTS =
          "Supervisor already exists".toLowerCase();

        if (response.data.message.toLowerCase() === SUPERVISOR_KEY_NOT_VALID) {
          addToast({
            title: "Your KEY is invalid! Please try again",
            status: "error",
          });
        } else if (
          response.data.message.toLowerCase() === SUPERVISOR_KEY_IS_EXPIRED
        ) {
          addToast({
            title: "Your KEY is expired!",
            status: "error",
          });
        } else if (
          response.data.message.toLowerCase() === SUPERVISOR_ALREADY_EXISTS
        ) {
          addToast({
            title: "Supervisor already exists!",
            status: "error",
          });
        } else {
          addToast({
            title: "An error occurred while logging in",
            status: "error",
          });
        }
      }
    } else {
      if (!isEmailValid) {
        addToast({
          title: "Please enter a valid email",
          status: "error",
        });
      } else {
        if (firstName.length === 0 || lastName.length === 0) {
          addToast({
            title: "Please input your name",
            status: "error",
          });
        } else {
          if (password.length < 7) {
            addToast({
              title: "Your password must be at least 7 characters",
              status: "warning",
            });
          } else {
            if (key.length !== 16) {
              addToast({
                description: "Please enter a valid key",
                status: "error",
              });
            } else {
              if (phone.length !== 10) {
                addToast({
                  description: "Please enter a valid phone number",
                  status: "error",
                });
              } else {
                if (title.length !== 10) {
                  addToast({
                    description: "Please provide your title",
                    status: "error",
                  });
                }
              }
            }
          }
        }
      }
    }
  };
  return (
    <div className="auth-container flex-column">
      <img src={Logo} alt="" className="login-image" />
      <br />
      <form action="#" onSubmit={(e) => registerSupervisor(e)}>
        <div className="register-form flex-column">
          <Text fontSize="2xl">Register</Text>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={5}
            width="100%"
          >
            <Input
              variant="outline"
              value={Form.firstName}
              name="firstname"
              onChange={(e) => {
                SetForm({ ...Form, firstName: e.target.value });
              }}
              placeholder="First Name"
              spellCheck={false}
            />
            <Input
              variant="outline"
              value={Form.lastName}
              onChange={(e) => {
                SetForm({ ...Form, lastName: e.target.value });
              }}
              placeholder="Last Name"
              spellCheck={false}
            />
          </Stack>
          <Input
            variant="outline"
            value={Form.email}
            name="Email address"
            onChange={(e) => {
              SetForm({ ...Form, email: e.target.value });
            }}
            placeholder="Email"
            spellCheck={false}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={5}
            width="100%"
          >
            <Select
              placeholder="Select title"
              value={Form.title}
              onChange={(e) => {
                SetForm({ ...Form, title: e.target.value as SupervisorTitle });
              }}
            >
              <option value="Mr">Mr</option>
              <option value="Dr">Dr</option>
              <option value="Professor">Professor</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
            </Select>
            <InputGroup>
              <InputLeftAddon children="+234" />
              <Input
                variant="outline"
                value={Form.phone}
                maxLength={10}
                onChange={(e) => {
                  SetForm({ ...Form, phone: e.target.value });
                }}
                placeholder="Phone"
                spellCheck={false}
              />
            </InputGroup>
          </Stack>
          <Input
            variant="outline"
            value={Form.password}
            onChange={(e) => {
              SetForm({ ...Form, password: e.target.value });
            }}
            placeholder="Password"
            type={"password"}
          />
          <Input
            variant="outline"
            value={Form.key}
            textTransform="uppercase"
            onChange={(e) => {
              SetForm({ ...Form, key: e.target.value });
            }}
            placeholder=" Supervisor Key"
            spellCheck={false}
            maxLength={16}
          />
          <Button
            type="submit"
            colorScheme="linkedin"
            width={"100%"}
            disabled={isFormSubmitting}
            opacity={isFormSubmitting ? 0.5 : 1}
          >
            Continue &nbsp;
            {isFormSubmitting && <i className="far fa-spinner-third fa-spin" />}
          </Button>
        </div>
      </form>
      <Stack direction="row" marginTop={4}>
        <Text>Already have an account?</Text>
        <Text color="linkedin.400">
          <Link to="/login">Login</Link>
        </Text>
      </Stack>
      <Stack direction="row" marginTop={4}>
        <Text>Forgot Password?</Text>
        <Text color="linkedin.400">
          <Link to="/reset">Reset</Link>
        </Text>
      </Stack>
    </div>
  );
};
