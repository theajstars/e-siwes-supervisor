import { useState, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";

import { motion } from "framer-motion";
import Cookies from "js-cookie";

import Logo from "../../Assets/IMG/Logo.png";
import Container from "../Container";
import { Tag, TagLabel } from "@chakra-ui/react";

type NavItems = "Home" | "Students" | "Supervisors" | "Profile" | string;
export default function Navbar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<NavItems>("Home");

  useEffect(() => {
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf("/");
    let path = pathname.substring(lastIndex, pathname.length).replace("/", "");
    const remainingString = path.substring(1, path.length);
    path = path[0].toUpperCase().concat(remainingString);
    console.log(path);
    setActiveItem(path);
  }, [location]);

  const logout = () => {
    Cookies.remove("supervisor_token");
    window.location.href = "/login";
  };

  const [isNavMenuOpen, setNavMenuOpen] = useState<boolean>(true);
  return (
    <div className="nav-container flex-row">
      <span className="nav-btn" onClick={() => setNavMenuOpen(!isNavMenuOpen)}>
        {isNavMenuOpen ? (
          <i className="far fa-angle-up" />
        ) : (
          <i className="far fa-angle-down" />
        )}
      </span>
      <Container>
        <nav className="nav flex-row">
          <Link to="/home">
            <img src={Logo} className="nav-logo" alt="" />
          </Link>
          <motion.div
            className="nav-items flex-row"
            initial={false}
            animate={{
              height: isNavMenuOpen ? "fit-content" : 0,
              paddingTop: isNavMenuOpen ? "30px" : "0px",
              paddingLeft: isNavMenuOpen ? "30px" : "0px",
              paddingRight: isNavMenuOpen ? "30px" : "0px",
              paddingBottom: isNavMenuOpen ? "30px" : "0px",
            }}
          >
            <Link
              to="/home"
              className={`nav-item ${
                activeItem === "Home" ? "nav-item-active" : ""
              }`}
            >
              Home
            </Link>
            {/* <Link
              to="/home/students"
              className={`nav-item ${
                activeItem === "Students" ? "nav-item-active" : ""
              }`}
            >
              Students
            </Link>
            <Link
              to="/home/supervisors"
              className={`nav-item ${
                activeItem === "Supervisors" ? "nav-item-active" : ""
              }`}
            >
              Supervisors
            </Link> */}
            <Link
              to="/home/profile"
              className={`nav-item ${
                activeItem === "Profile" ? "nav-item-active" : ""
              }`}
            >
              Profile
            </Link>
            <Link
              to="/home/students"
              className={`nav-item ${
                activeItem === "Students" ? "nav-item-active" : ""
              }`}
            >
              Students
            </Link>
            <Tag
              size="lg"
              variant={"subtle"}
              colorScheme="twitter"
              onClick={logout}
              marginLeft={10}
              cursor="pointer"
            >
              <TagLabel>Logout</TagLabel>
            </Tag>
          </motion.div>
        </nav>
      </Container>
    </div>
  );
}
