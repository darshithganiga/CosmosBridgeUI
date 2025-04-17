import React from "react";
import { Spinner } from "react-bootstrap";
import { GridLoader } from "react-spinners";

const overlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1050,
};

const LoadingOverlay: React.FC = () => {
  return (
    <div style={overlayStyles}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2 fw-bold text-dark">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
