import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Banks, validateEmail } from "../../App";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";
import {
  Admin,
  AdminResponse,
  CourseProgrammes,
  CourseProgrammesSelect,
  DefaultResponse,
  SingleStudentResponse,
  SingleSupervisorResponse,
  Student,
  Supervisor,
  SupervisorResponse,
  SupervisorTitle,
  ValidatePasswordResponse,
} from "../../lib/ResponseTypes";
import { Link } from "react-router-dom";

import Cookies from "js-cookie";
import MegaLoader from "../MegaLoader";
export default function Profile() {
  const navigate = useNavigate();
  const [supervisor, setSupervisor] = useState<Supervisor>();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [isPasswordUpdating, setPasswordUpdating] = useState<boolean>(false);

  const [isBasicProfileUpdating, setBasicProfileUpdating] =
    useState<boolean>(false);

  const getStudentProfile = async () => {
    const supervisorResponse: SingleSupervisorResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSupervisorProfile,
    });

    console.log("Profile response", supervisorResponse);
    if (supervisorResponse.data.auth) {
      setSupervisor(supervisorResponse.data.data);
    } else {
      // Cookies.remove("supervisor_token");
      // window.location.href = "/login";
    }
  };
  useEffect(() => {
    // Get Student Profile
    getStudentProfile();
  }, []);
  const addToast = useToast();

  const ValidateStudentPassword = async (passwordToValidate: string) => {
    const validatePassword: ValidatePasswordResponse = await FetchData({
      type: "POST",
      route: Endpoints.ValidateSupervisorPassword,
      data: { password: passwordToValidate },
    });
    return validatePassword.data.auth;
  };

  const UpdatePassword = async () => {
    if (
      currentPassword.length === 0 ||
      newPassword.length === 0 ||
      confirmNewPassword.length === 0
    ) {
      addToast({ status: "error", description: "Please fill out the form" });
    } else {
      if (newPassword !== confirmNewPassword) {
        addToast({ status: "warning", description: "Passwords do not match" });
      } else {
        setPasswordUpdating(true);
        const isCurrentPasswordValid = await ValidateStudentPassword(
          currentPassword
        );
        if (!isCurrentPasswordValid) {
          setPasswordUpdating(false);

          addToast({
            status: "error",
            description: "Password is incorrect",
          });
        } else {
          const UpdateRequest: DefaultResponse = await FetchData({
            route: Endpoints.UpdateSupervisorPassword,
            type: "POST",
            data: { password: newPassword },
          }).catch(() => {
            addToast({
              description: "An error occurred",
              status: "error",
            });
          });
          setPasswordUpdating(false);
          if (UpdateRequest.data.auth) {
            addToast({
              description: "Password updated successfully!",
              status: "success",
            });
          } else {
            addToast({
              description: "An error occurred",
              status: "error",
            });
          }
        }
      }
    }
  };
  const SubmitBasicProfile = async () => {
    if (supervisor) {
      setBasicProfileUpdating(true);
      const { firstName, lastName, email, phone, title } = supervisor;
      const updateProfile: DefaultResponse = await FetchData({
        route: Endpoints.UpdateSupervisorProfile,
        type: "POST",
        data: { firstName, lastName, email, phone, title },
      }).catch(() => {
        setBasicProfileUpdating(false);
        addToast({
          description: "An unexpected error occured!",
          status: "error",
        });
      });
      setBasicProfileUpdating(false);

      if (updateProfile.data.auth) {
        addToast({
          description: "Your profile was updated",
          status: "success",
        });
      } else {
        addToast({
          description: "Your profile could not be updated!",
          status: "warning",
        });
      }
    }
  };

  return (
    <>
      <br />
      <br />
      {supervisor?.id ? (
        <>
          <Stack direction="column" spacing={20}>
            <Stack direction="column" spacing={5}>
              <Text size={"25px"}>Basic Profile</Text>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  placeholder="First Name"
                  value={supervisor.firstName}
                  onChange={(e) =>
                    setSupervisor({ ...supervisor, firstName: e.target.value })
                  }
                />
                <Input
                  placeholder="Last Name"
                  value={supervisor.lastName}
                  onChange={(e) =>
                    setSupervisor({ ...supervisor, lastName: e.target.value })
                  }
                />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  placeholder="Email Address"
                  value={supervisor.email}
                  onChange={(e) => {
                    setSupervisor({ ...supervisor, email: e.target.value });
                  }}
                />
              </Stack>
              <InputGroup>
                <InputLeftAddon children="+234" />
                <Input
                  variant="outline"
                  placeholder="Phone"
                  value={supervisor.phone}
                  onChange={(e) => {
                    setSupervisor({ ...supervisor, phone: e.target.value });
                  }}
                  spellCheck={false}
                />
              </InputGroup>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Select
                  placeholder="Title"
                  value={supervisor.title}
                  onChange={(e) => {
                    setSupervisor({
                      ...supervisor,
                      title: e.target.value as SupervisorTitle,
                    });
                  }}
                >
                  <option value="Mr">Mr</option>
                  <option value="Dr">Dr</option>
                  <option value="Professor">Professor</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                </Select>
              </Stack>
              <Button colorScheme="linkedin" onClick={SubmitBasicProfile}>
                Submit&nbsp;{" "}
                {isBasicProfileUpdating && (
                  <i className="far fa-spinner-third fa-spin" />
                )}
              </Button>
            </Stack>

            <Stack direction="column" spacing={5}>
              <Text size={"25px"}>Update Password</Text>

              <Input
                placeholder="Current Password"
                value={currentPassword}
                type="password"
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                }}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  placeholder="New Password"
                  value={newPassword}
                  type="password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <Input
                  placeholder="Re-enter Password"
                  value={confirmNewPassword}
                  type="password"
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                  }}
                />
              </Stack>

              <Button colorScheme="linkedin" onClick={UpdatePassword}>
                Submit&nbsp;{" "}
                {isPasswordUpdating && (
                  <i className="far fa-spinner-third fa-spin" />
                )}
              </Button>
            </Stack>
          </Stack>
        </>
      ) : (
        <MegaLoader />
      )}
      <br />
      <br />
      <br />
    </>
  );
}
