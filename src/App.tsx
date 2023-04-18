import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { Login } from "./Pages/Login";
import Home from "./Pages/Home";
import Supervisors from "./Pages/Supervisors";
import Students from "./Pages/Students";
import Profile from "./Pages/Profile";
import Cookies from "js-cookie";
import Notification from "./Pages/Notification";
import SingleSupervisor from "./Pages/SingleSupervisor";
import SingleStudent from "./Pages/SingleStudent";
import Reset from "./Pages/Reset";
import { Register } from "./Pages/Register";
import Payments from "./Pages/Payments";
import Documents from "./Pages/Documents";

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
type PaystackConfigProps = {
  email: string;
  amount: number;
};
const getPayStackConfig = ({ email, amount }: PaystackConfigProps) => {
  const PaystackConfig = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    publicKey: "pk_live_22766e7d447ea8ee065eb8dcc2a7c81767caec1a",
  };
  return PaystackConfig;
};

const getFullDate = (dateString: number) => {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const d = new Date(dateString);

  const date = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${month} ${date}, ${year}`;
};
const Banks = [
  { id: "1", name: "Access Bank", code: "044" },
  { id: "2", name: "Citibank", code: "023" },
  { id: "3", name: "Diamond Bank", code: "063" },
  { id: "4", name: "Dynamic Standard Bank", code: "" },
  { id: "5", name: "Ecobank Nigeria", code: "050" },
  { id: "6", name: "Fidelity Bank Nigeria", code: "070" },
  { id: "7", name: "First Bank of Nigeria", code: "011" },
  { id: "8", name: "First City Monument Bank", code: "214" },
  { id: "9", name: "Guaranty Trust Bank", code: "058" },
  { id: "10", name: "Heritage Bank Plc", code: "030" },
  { id: "11", name: "Jaiz Bank", code: "301" },
  { id: "12", name: "Keystone Bank Limited", code: "082" },
  { id: "13", name: "Providus Bank Plc", code: "101" },
  { id: "14", name: "Polaris Bank", code: "076" },
  { id: "15", name: "Stanbic IBTC Bank Nigeria Limited", code: "221" },
  { id: "16", name: "Standard Chartered Bank", code: "068" },
  { id: "17", name: "Sterling Bank", code: "232" },
  { id: "18", name: "Suntrust Bank Nigeria Limited", code: "100" },
  { id: "19", name: "Union Bank of Nigeria", code: "032" },
  { id: "20", name: "United Bank for Africa", code: "033" },
  { id: "21", name: "Unity Bank Plc", code: "215" },
  { id: "22", name: "Wema Bank", code: "035" },
  { id: "23", name: "Zenith Bank", code: "057" },
];
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/home" element={<Home />}>
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/payments" element={<Payments />} />
          <Route path="/home/documents" element={<Documents />} />
          {/* <Route path="/home/supervisors" element={<Supervisors />} />
          <Route
            path="/home/supervisors/:supervisorID"
            element={<SingleSupervisor />}
          />
          <Route path="/home/students" element={<Students />} />
          <Route path="/home/students/:studentID" element={<SingleStudent />} />
          <Route path="/home/notification" element={<Notification />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export { validateEmail, getPayStackConfig, getFullDate, Banks };
export default App;
