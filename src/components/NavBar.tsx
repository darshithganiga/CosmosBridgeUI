import React from "react";
import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";

const Navbar: React.FC = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" className="fixed-top">
      <Container>
        <BootstrapNavbar.Brand>
          <div
            className="mx-auto text-white"
            style={{ fontWeight: "bold", fontSize: "1.5rem" }}
          >
            Cosmos Bridge
          </div>
        </BootstrapNavbar.Brand>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
