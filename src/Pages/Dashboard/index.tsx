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
  SingleSupervisorResponse,
} from "../../lib/ResponseTypes";
import ProfileLinkIcon from "../../Assets/IMG/ProfileLinkIcon.png";
import StudentsLinkIcon from "../../Assets/IMG/StudentsLinkIcon.png";
import DocumentLinkIcon from "../../Assets/IMG/DocumentLinkIcon.png";

import { Text, Button, Stack, useToast } from "@chakra-ui/react";
import MegaLoader from "../MegaLoader";

export default function Dashboard() {
  const addToast = useToast();
  const navigate = useNavigate();
  const [supervisorProfile, setSupervisorProfile] = useState<Supervisor>();
  useEffect(() => {
    // Get Student Profile
    FetchData({
      type: "GET",
      route: Endpoints.GetSupervisorProfile,
    }).then((response: SingleSupervisorResponse) => {
      console.log(response);
      if (response.data.auth) {
        setSupervisorProfile(response.data.data);
      } else {
        Cookies.remove("supervisor_token");
        // window.location.href = "/login";
      }
    });
  }, []);
  return (
    <>
      <br />
      {supervisorProfile?.id ? (
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
              className={`dashboard-link`}
              onClick={() => navigate("/home/students")}
            >
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={StudentsLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    My Students
                  </Text>
                </Stack>
                <Button colorScheme="whatsapp" width={"100%"}>
                  View Students
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
