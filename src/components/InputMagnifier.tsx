import React, { useState } from "react";
import { Form } from "react-bootstrap";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
}

const InputMagnifier: React.FC<Props> = ({ value, onChange, name }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <div style={{ position: "relative" }}>
      <Form.Control
        as="textarea"
        rows={2}
        name={name}
        value={value}
        onChange={onChange}
        onMouseMove={(e) => {
          setShowMagnifier(true);
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        onMouseLeave={() => setShowMagnifier(false)}
        style={{ border: "1px solid #333", borderRadius: "0" }}
        placeholder="Enter your query Example: SELECT * FROM c"
      />

      {showMagnifier && (
        <div
          style={{
            position: "fixed",
            left: mousePosition.x + 15,
            top: mousePosition.y + 15,
            background: "#fff",
            border: "1px solid #aaa",
            padding: "10px",
            fontSize: "20px",
            color: "#000",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            pointerEvents: "none",
            maxWidth: "300px",
            whiteSpace: "pre-wrap",
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default InputMagnifier;
