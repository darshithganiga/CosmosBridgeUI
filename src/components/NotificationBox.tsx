import React from "react";
import { Card, Button } from "react-bootstrap";

interface NotificationBoxProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({
  type,
  message,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Card
        style={{ minWidth: "350px", maxWidth: "500px" }}
        className={`text-center shadow-sm border-${
          type === "success" ? "success" : "danger"
        }`}
      >
        <Card.Body>
          <Card.Title
            className={`text-${type === "success" ? "success" : "danger"}`}
          >
            {type === "success" ? "Success" : "Error"}
          </Card.Title>
          <Card.Text>{message}</Card.Text>
          <Button variant="outline-secondary" onClick={onClose}>
            Close
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotificationBox;
