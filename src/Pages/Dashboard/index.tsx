import { useState, useEffect } from "react";

import { Routes, Route, useNavigate, Link } from "react-router-dom";

import Cookies from "js-cookie";
import { Endpoints } from "../../lib/Endpoints";
import { FetchData } from "../../lib/FetchData";
import {
  Student,
  StudentResponse,
  Supervisor,
  SupervisorResponse,
  SingleStudentResponse,
} from "../../lib/ResponseTypes";
import ProfileLinkIcon from "../../Assets/IMG/ProfileLinkIcon.png";
import MyPaymentsLinkIcon from "../../Assets/IMG/MyPaymentsLinkIcon.png";
import DocumentLinkIcon from "../../Assets/IMG/DocumentLinkIcon.png";

import { Text, Button, Stack, useToast } from "@chakra-ui/react";
import MegaLoader from "../MegaLoader";

export default function Dashboard() {
  const addToast = useToast();
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<Student>();
  useEffect(() => {
    // Get Student Profile
    FetchData({
      type: "GET",
      route: Endpoints.GetSingleStudent.concat("currentIsStudent"),
    }).then((response: SingleStudentResponse) => {
      console.log(response);
      if (response.data.auth) {
        setStudentProfile(response.data.data);
      } else {
        Cookies.remove("student_token");
        window.location.href = "/login";
      }
    });
  }, []);
  return (
    <>
      <br />
      {studentProfile?.id ? (
        <Stack direction="column" spacing={20}>
          <div className=" flex-row dashboard-row">
            <div
              className="dashboard-link"
              onClick={() => {
                navigate("/home/profile");
              }}
            >
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={ProfileLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    Profile
                  </Text>
                </Stack>
                <Button colorScheme="whatsapp" width={"100%"}>
                  View Profile
                </Button>
              </Stack>
            </div>
            <div
              className={`dashboard-link ${
                studentProfile.isProfileComplete
                  ? ""
                  : "dashboard-link-disabled"
              }`}
              onClick={() => {
                if (studentProfile.isProfileComplete) {
                  navigate("/home/payments");
                }
              }}
            >
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={MyPaymentsLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    My Payments
                  </Text>
                </Stack>
                <Button
                  colorScheme="whatsapp"
                  disabled={!studentProfile.isProfileComplete}
                  cursor={
                    studentProfile.isProfileComplete ? "pointer" : "not-allowed"
                  }
                  width={"100%"}
                >
                  Payments
                </Button>
              </Stack>
            </div>
          </div>
          <div className=" flex-row dashboard-row">
            <div
              className={`dashboard-link ${
                studentProfile.isProfileComplete
                  ? ""
                  : "dashboard-link-disabled"
              }`}
              onClick={() => {
                if (studentProfile.isProfileComplete) {
                  if (studentProfile.hasPaid) {
                    navigate("/home/documents");
                  } else {
                    navigate("/home/payments");
                    addToast({
                      description: "You must make SIWES payment first",
                      status: "warning",
                    });
                  }
                } else {
                  addToast({
                    description: "You must complete your profile first",
                    status: "warning",
                  });
                  navigate("/home/profile");
                }
              }}
            >
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={DocumentLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    Documents
                  </Text>
                </Stack>

                <Button
                  colorScheme="whatsapp"
                  disabled={!studentProfile.isProfileComplete}
                  cursor={
                    studentProfile.isProfileComplete ? "pointer" : "not-allowed"
                  }
                  width={"100%"}
                >
                  View Documents
                </Button>
              </Stack>
            </div>
          </div>
        </Stack>
      ) : (
        <MegaLoader />
      )}
      <br />
    </>
  );
}
