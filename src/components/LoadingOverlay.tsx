import React from "react";
import { GridLoader } from "react-spinners";

const overlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(255, 255, 255, 0.89)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  zIndex: 1050,
};

interface LoadingOverlayProps {
  color?: string;

  size?: number;
  speedMultiplier?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  color = "#58cf3d",
  size = 20,
  speedMultiplier = 1,
}) => (
  <div style={overlayStyles}>
    <div className="text-center">
      <GridLoader color={color} size={size} speedMultiplier={speedMultiplier} />
      <div className="mt-3 text-dark fw-bold fs-4" style={{ lineHeight: 1.4 }}>
        Establishing the connection...
      </div>
    </div>
  </div>
);

export default LoadingOverlay;
