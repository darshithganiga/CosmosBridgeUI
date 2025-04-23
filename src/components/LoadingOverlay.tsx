import React from "react";
import { ScaleLoader } from "react-spinners";
import { motion } from "framer-motion";
import "../Customstyles/LoadingoverlayStyles.css";

interface LoadingOverlayProps {
  color?: string;
  height?: number | string;
  width?: number | string;
  radius?: number | string;
  margin?: number | string;
  barCount?: number;
  speedMultiplier?: number;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  color = "#58cf3d",
  barCount = 6,
  height = 50,
  width = 11,
  radius = 50,
  margin = 1,
  speedMultiplier = 1,
  message = "",
}) => {
  const dotVariants = {
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [1, 1.5, 1],
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
        delay: i * 0.3,
      },
    }),
  };

  return (
    <div className="loading-overlay">
      <div className="text-center">
        <ScaleLoader
          color={color}
          margin={margin}
          height={height}
          speedMultiplier={speedMultiplier}
          barCount={barCount}
          width={width}
          radius={radius}
        />
        <div className="loading-text">
          {message}
          <span className="dot-container">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                custom={i}
                variants={dotVariants}
                animate="animate"
                className="dot"
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
