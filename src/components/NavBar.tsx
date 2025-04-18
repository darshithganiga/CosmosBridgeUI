import React from "react";
import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";
import logo from "../assets/newsafesendlogo.png";

const Navbar: React.FC = () => {
  return (
    <BootstrapNavbar
      style={{ backgroundColor: "#0F274B", height: "60px" }}
      className="fixed-top d-flex justify-content-between align-items-center"
    >
      <Container fluid className="d-flex align-items-center">
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="SafeSend Logo"
            style={{ height: "42px", marginRight: "12px" }}
          />
        </div>
        <span style={{ fontSize: "2.0rem", fontWeight: "bold" }}>
          <span style={{ color: "#ffffffcc" }}>Safe</span>
          <span style={{ color: "#8DC63F" }}>Send</span>
        </span>

        <div
          className="mx-auto text-white fw-bold"
          style={{ fontSize: "1.5rem" }}
        >
          Cosmos
          <span style={{ color: "#8DC63F" }}>Bridge</span>
        </div>

        <div style={{ width: "100px" }}></div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
