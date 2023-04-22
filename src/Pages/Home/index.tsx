import { useState, useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import { Endpoints } from "../../lib/Endpoints";
import { FetchData } from "../../lib/FetchData";
import {
  Student,
  StudentResponse,
  Supervisor,
  SupervisorResponse,
  ValidateStudentAuthResponse,
} from "../../lib/ResponseTypes";
import Container from "../Container";
import Navbar from "../Navbar";
import Profile from "../Profile";
import Students from "../Students";

import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import SingleSupervisor from "../SingleSupervisor";
import SingleStudent from "../SingleStudent";
import Documents from "../Documents";
export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const supervisorToken = Cookies.get("supervisor_token");
    if (!supervisorToken) {
      navigate("/login");
    } else {
      FetchData({
        type: "GET",
        route: Endpoints.ValidateStudentAuth,
      }).then((res: ValidateStudentAuthResponse) => {
        console.log("Auth response: ", res);
        const { auth } = res.data;
        if (!auth) {
          navigate("/login");
        }
      });
    }
  }, []);
  return (
    <>
      <Navbar />
      <Container>
        <Routes>
          <Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:studentID" element={<SingleStudent />} />
            {/* <Route path="/supervisors" element={<Supervisors />} />
            <Route
              path="/supervisors/:supervisorID"
              element={<SingleSupervisor />}
            />
            <Route path="/students" element={<Students />} />
            <Route path="/notification" element={<Notification />} /> */}
          </Route>
        </Routes>
      </Container>
    </>
  );
}
