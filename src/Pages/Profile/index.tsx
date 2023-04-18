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
  Student,
  ValidatePasswordResponse,
} from "../../lib/ResponseTypes";
import { Link } from "react-router-dom";

import Cookies from "js-cookie";
import MegaLoader from "../MegaLoader";
export default function Profile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [isPasswordUpdating, setPasswordUpdating] = useState<boolean>(false);

  const [isBasicProfileUpdating, setBasicProfileUpdating] =
    useState<boolean>(false);

  const getStudentProfile = async () => {
    const studentResponse: SingleStudentResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSingleStudent.concat("currentIsStudent"),
    });

    console.log("Profile response", studentResponse);
    if (studentResponse.data.auth) {
      setStudent(studentResponse.data.data);
    } else {
      Cookies.remove("student_token");
      window.location.href = "/login";
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
      route: Endpoints.ValidateStudentPassword,
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
            route: Endpoints.UpdateStudentPassword,
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
    if (student) {
      const { firstName, lastName, email, phone, courseOfStudy, level } =
        student;
      const isEmailValid = validateEmail(email);

      if (!firstName || !lastName || !phone || !courseOfStudy || !level) {
        addToast({
          description: "Please fill out the form!",
          status: "warning",
        });
      } else {
        if (!isEmailValid) {
          addToast({
            description: "Please provide a valid email!",
            status: "warning",
          });
        }
      }
      if (
        firstName &&
        lastName &&
        phone &&
        courseOfStudy &&
        level &&
        isEmailValid
      ) {
        // All is good, update profile
        setBasicProfileUpdating(true);
        const UpdateBasicProfile: DefaultResponse = await FetchData({
          route: Endpoints.UpdateBasicStudentProfile,
          type: "POST",
          data: {
            email,
            firstName,
            lastName,
            phone,
            courseOfStudy,
            level,
          },
        }).catch(() => {
          setBasicProfileUpdating(false);
          addToast({
            status: "error",
            description: "An error occured! Please try again",
          });
        });
        setBasicProfileUpdating(false);

        if (UpdateBasicProfile.data.auth) {
          addToast({
            status: "success",
            description: "Your profile has been updated",
          });
          getStudentProfile();
        } else {
          addToast({
            status: "error",
            description: "An error occured! Please try again",
          });
        }
      }
    }
  };

  const [isAdvancedProfileSubmitting, setAdvancedProfileSubmitting] =
    useState<boolean>(false);

  const SubmitAdvancedProfile = async () => {
    if (student) {
      const { bankAccount, company, attachmentPeriod } = student;
      const {
        name: BankName,
        number,
        sortCode,
        masterListNumber,
      } = bankAccount;
      const { name: CompanyName, address } = company;
      console.log("Advanced Profile: ", {
        BankName,
        number,
        sortCode,
        masterListNumber,
        CompanyName,
        address,
        attachmentPeriod,
      });
      const Profile = {
        bankAccountName: BankName,
        bankAccountNumber: number,
        sortCode,
        masterListNumber,
        attachmentPeriod,
        companyName: CompanyName,
        companyAddress: address,
      };

      setAdvancedProfileSubmitting(true);
      const AdvancedProfileUpdate: DefaultResponse = await FetchData({
        route: Endpoints.UpdateAdvancedStudentProfile,
        type: "POST",
        data: Profile,
      }).catch(() => {
        setAdvancedProfileSubmitting(false);
        addToast({
          description: "An error occured",
          status: "error",
        });
      });
      setAdvancedProfileSubmitting(false);
      if (AdvancedProfileUpdate.data.auth) {
        addToast({
          description: "Profile updated successfully!",
          status: "success",
        });
      } else {
        addToast({
          description: "An error occured",
          status: "error",
        });
      }
    }
  };
  return (
    <>
      <br />
      <br />
      {student?.id ? (
        <>
          {!student.isProfileComplete && (
            <>
              <Alert status="warning" width="fit-content">
                <AlertIcon />
                You must complete your basic profile to gain access to the
                platform
              </Alert>
              <br />
            </>
          )}
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
                  value={student.firstName}
                  onChange={(e) =>
                    setStudent({ ...student, firstName: e.target.value })
                  }
                />
                <Input
                  placeholder="Last Name"
                  value={student.lastName}
                  onChange={(e) =>
                    setStudent({ ...student, lastName: e.target.value })
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
                  value={student.email}
                  onChange={(e) => {
                    setStudent({ ...student, email: e.target.value });
                  }}
                />
                <Input
                  placeholder="Matric Number"
                  disabled
                  value={student.matricNumber}
                />
              </Stack>
              <InputGroup>
                <InputLeftAddon children="+234" />
                <Input
                  variant="outline"
                  placeholder="Phone"
                  value={student.phone}
                  onChange={(e) => {
                    setStudent({ ...student, phone: e.target.value });
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
                  placeholder="Current Level"
                  value={student.level}
                  onChange={(e) => {
                    setStudent({
                      ...student,
                      level: e.target.value,
                    });
                  }}
                >
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </Select>
                <Select
                  placeholder="Course of Study"
                  value={student.courseOfStudy}
                  onChange={(
                    e: React.ChangeEvent<HTMLSelectElement> & {
                      target: { value: CourseProgrammes };
                    }
                  ) => {
                    setStudent({
                      ...student,
                      courseOfStudy: e.target.value,
                    });
                  }}
                >
                  <option value="computer_science">Computer Science</option>
                  <option value="cyber_security">Cyber Security</option>
                  <option value="software_engineering">
                    Software Engineering
                  </option>
                  <option value="information_technology">
                    Information Technology
                  </option>
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
              <Alert status="warning" width="fit-content">
                <AlertIcon />
                Your advanced profile should only be completed at the beginning
                of your internship period
              </Alert>
              <Text size={"25px"}>Advanced Profile</Text>
              <Select
                placeholder="Bank Name"
                value={student.bankAccount.name}
                onChange={(e) => {
                  setStudent({
                    ...student,
                    bankAccount: {
                      ...student.bankAccount,
                      name: e.target.value,
                    },
                  });
                }}
              >
                {Banks.map((bank) => {
                  return <option value={bank.id}>{bank.name}</option>;
                })}
              </Select>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  placeholder="Account Number"
                  value={student.bankAccount.number}
                  maxLength={10}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      bankAccount: {
                        ...student.bankAccount,
                        number: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Sort Code"
                  value={student.bankAccount.sortCode}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      bankAccount: {
                        ...student.bankAccount,
                        sortCode: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Master List Number"
                  value={student.bankAccount.masterListNumber}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      bankAccount: {
                        ...student.bankAccount,
                        masterListNumber: e.target.value,
                      },
                    })
                  }
                />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  placeholder="Company Name"
                  value={student.company.name}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      company: {
                        ...student.company,
                        name: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Company Address"
                  value={student.company.address}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      company: {
                        ...student.company,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Select
                  placeholder="Attachment Period"
                  value={student.attachmentPeriod}
                  onChange={(e) => {
                    setStudent({
                      ...student,
                      attachmentPeriod: e.target.value,
                    });
                  }}
                >
                  <option value="3">3 Months</option>
                  <option value="4">4 Months</option>
                  <option value="5">5 Months</option>
                  <option value="6">6 Months</option>
                  <option value="7">7 Months</option>
                  <option value="8">8 Months</option>
                </Select>
              </Stack>
              <Button colorScheme="linkedin" onClick={SubmitAdvancedProfile}>
                Submit&nbsp;{" "}
                {isAdvancedProfileSubmitting && (
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
