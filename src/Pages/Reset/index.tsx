import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { validateEmail } from "../../App";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";
import { DefaultResponse } from "../../lib/ResponseTypes";
import { AxiosError } from "axios";

type ResetPasswordType = {
  code: string;
  email: string;
  password: string;
  passwordConfirm: string;
};
const Reset = () => {
  const addToast = useToast();
  const navigate = useNavigate();
  const [isFormSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [isCodeResending, setCodeResending] = useState<boolean>(false);
  const [Form, SetForm] = useState<ResetPasswordType>({
    code: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const resetPassword = async (e: any) => {
    e.preventDefault();
    const isEmailValid = validateEmail(Form.email);
    if (Form.code.length !== 7) {
      addToast({
        description: "Please enter 7 Digit Code",
        status: "warning",
      });
    } else {
      if (!isEmailValid) {
        // Email is not valid
        addToast({
          description: "Please enter a valid email",
          status: "warning",
        });
      } else {
        if (Form.password.length < 7) {
          addToast({
            description: "Password must be at least 7 digits",
            status: "warning",
          });
        } else {
          if (Form.password !== Form.passwordConfirm) {
            addToast({
              description: "Your passwords do not match",
              status: "error",
            });
          }
        }
      }
    }

    if (
      Form.code.length === 7 &&
      isEmailValid &&
      Form.password.length >= 7 &&
      Form.password === Form.passwordConfirm
    ) {
      setFormSubmitting(true);
      const VerifyCode: DefaultResponse = await FetchData({
        type: "POST",
        route: Endpoints.VerifyResetToken,
        data: { email: Form.email, type: "student", code: Form.code },
      }).catch(() => setFormSubmitting(false));
      console.log(VerifyCode);
      if (VerifyCode.data.auth) {
        // We are a go, Update Password
        const UpdatePassword: DefaultResponse = await FetchData({
          type: "POST",
          route: Endpoints.ForceUpdateSupervisorPassword,
          data: { password: Form.password, email: Form.email },
        });
        console.log(UpdatePassword);
        if (UpdatePassword.data.auth) {
          addToast({
            description: "Your password has been changed!",
            status: "success",
          });
          navigate("/login");
        } else {
          addToast({
            description: "An error occured. Please try again",
            status: "error",
          });
        }
        setFormSubmitting(false);
      } else {
        addToast({ description: "Invalid code or email", status: "error" });
        setFormSubmitting(false);
      }
    }
  };
  const resendCode = async () => {
    const isEmailValid = validateEmail(Form.email);
    if (!isEmailValid) {
      addToast({
        description: "Please enter a valid email",
        status: "error",
      });
    } else {
      // Send new code
      setCodeResending(true);
      const sendNewToken: DefaultResponse = await FetchData({
        route: Endpoints.SendResetToken,
        type: "POST",
        data: { type: "student", email: Form.email },
      }).catch((e: AxiosError) => {
        setCodeResending(false);
        if (e.response?.status === 401) {
          addToast({
            status: "error",
            description: "No user found",
          });
        }
      });
      setCodeResending(false);
      console.log(sendNewToken);
      if (sendNewToken.data.auth) {
        addToast({
          description: "Token sent to your email!",
          status: "success",
        });
      }
    }
  };

  return (
    <div className="auth-container login-container flex-column">
      <form action="#" onSubmit={(e) => resetPassword(e)}>
        <div className="login-form flex-column">
          <Text fontSize="2xl">Reset Password</Text>
          <Input
            variant="outline"
            value={Form.email}
            onChange={(e) => {
              SetForm({ ...Form, email: e.target.value });
            }}
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            spellCheck={false}
          />
          <Input
            variant="outline"
            value={Form.code}
            onChange={(e) => {
              SetForm({ ...Form, code: e.target.value });
            }}
            type="text"
            name="sefen-digit-code-ffs"
            placeholder="7 Digit Code"
            spellCheck={false}
            maxLength={7}
            textTransform="uppercase"
          />
          <Stack
            direction="row"
            alignItems="center"
            spacing={5}
            justifyContent="space-between"
            width="100%"
          >
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
              value={Form.passwordConfirm}
              onChange={(e) => {
                SetForm({ ...Form, passwordConfirm: e.target.value });
              }}
              placeholder="Confirm Password"
              type={"password"}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={5}
            justifyContent="space-between"
            width="100%"
          >
            <Button
              type="button"
              colorScheme="whatsapp"
              width={"100%"}
              onClick={resendCode}
              disabled={isCodeResending}
              opacity={isCodeResending ? 0.5 : 1}
            >
              Resend Code &nbsp;
              {isCodeResending && (
                <i className="far fa-spinner-third fa-spin" />
              )}
            </Button>
            <Button
              type="submit"
              colorScheme="linkedin"
              width={"100%"}
              disabled={isFormSubmitting}
              opacity={isFormSubmitting ? 0.5 : 1}
            >
              Continue &nbsp;
              {isFormSubmitting && (
                <i className="far fa-spinner-third fa-spin" />
              )}
            </Button>
          </Stack>
        </div>
      </form>
    </div>
  );
};

export default Reset;
