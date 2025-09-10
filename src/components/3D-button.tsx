"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ButtonProps {
  label?: string;
  link?: string;
  height?: number;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  label = "Get started",
  link = "#",
  height = 80,
  width = 234,
  className = "",
  style = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const holeStyle = {
    background: "linear-gradient(180deg, rgb(123, 156, 166) 0%, rgb(61, 111, 125) 20.289625563063062%, rgb(61, 111, 125) 50%, rgba(145, 184, 191, 0) 62.762176238738746%)",
    borderRadius: "100px",
    boxShadow: isHovered 
      ? "inset 1px 1px 0.5px 0px rgb(173, 173, 173), -1px -1px 0.5px 0px rgb(237, 237, 237), 2px 0.5px 1px 0px rgb(255, 255, 255), 0px 0px 1px 2px rgb(209, 207, 207), -2px -2px 1px 0px rgb(194, 194, 194), 0px 10px 10px 0px rgba(0, 0, 0, 0.15)"
      : "inset 1px 1px 0.5px 0px rgb(173, 173, 173), -1px -1px 0.5px 0px rgb(237, 237, 237), 2px 0.5px 1px 0px rgb(255, 255, 255), 0px 0px 1px 2px rgb(209, 207, 207), -2px -2px 1px 0px rgb(194, 194, 194), 0px 0px 10px 0px rgba(0, 0, 0, 0)",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column" as const,
    flexWrap: "nowrap" as const,
    gap: "10px",
    height: "80px",
    justifyContent: "flex-end",
    overflow: "visible",
    padding: "0px",
    position: "relative" as const,
    width: "min-content",
    zIndex: 3
  };

  const holeMaskStyle = {
    borderRadius: "40px",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flex: "none",
    flexDirection: "column" as const,
    flexWrap: "nowrap" as const,
    gap: "10px",
    height: "108%",
    justifyContent: "center",
    overflow: "hidden",
    padding: isPressed ? "20px 0px 0px 0px" : isHovered ? "0px 0px 6px 0px" : "5px 0px 0px 0px",
    position: "relative" as const,
    width: "min-content",
    willChange: "transform"
  };

  const buttonContentStyle = {
    background: "linear-gradient(160deg, rgb(95, 230, 245) 19%, rgb(125, 212, 250) 79%)",
    borderRadius: "104px",
    boxShadow: "inset 0px 1px 0px 0px rgba(255, 255, 255, 0.7), 0px 6px 0px 0px rgb(111, 189, 222)",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flex: "none",
    flexDirection: "column" as const,
    flexWrap: "nowrap" as const,
    gap: "10px",
    height: "min-content",
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: "6px",
    position: "relative" as const,
    width: "min-content",
    willChange: "transform"
  };

  const textWrapStyle = {
    background: "linear-gradient(116deg, rgb(125, 227, 232) 0%, rgb(148, 219, 255) 100%)",
    borderRadius: "88px",
    boxShadow: "inset 0px -1px 0px 0px rgba(227, 248, 255, 0.7), inset 0px 3px 0px 0px rgb(76, 182, 212), inset 4px 8px 0px 0px rgba(0, 0, 0, 0.05)",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flex: "none",
    flexDirection: "column" as const,
    flexWrap: "nowrap" as const,
    gap: "10px",
    height: "68px",
    justifyContent: "center",
    overflow: "hidden",
    padding: "0px 60px 0px 60px",
    position: "relative" as const,
    width: "min-content",
    willChange: "transform"
  };

  const textStyle = {
    fontFamily: '"Inter Variable", "Inter", sans-serif',
    fontSize: "20px",
    fontWeight: 540,
    letterSpacing: "-0.01em",
    color: "rgb(30, 59, 69)",
    textShadow: "0px 1px 0.2px rgba(190, 228, 250, 0.6), 0px -0.5px 0px rgba(9, 13, 15, 0.2)",
    userSelect: "none" as const,
    flex: "none",
    height: "auto",
    position: "relative" as const,
    whiteSpace: "pre" as const,
    width: "auto",
    margin: 0
  };

  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15.5 16" overflow="visible">
      <g>
        <defs>
          <path d="M 0 2 C 0 0.895 0.895 0 2 0 L 10.97 0 C 11.496 0 12 0.207 12.374 0.576 L 14.892 3.058 C 15.273 3.434 15.488 3.946 15.488 4.481 L 15.498 13.998 C 15.499 15.103 14.603 16 13.498 16 L 12.5 16 C 12.5 16 10.373 10.651 7.887 8.166 C 5.401 5.68 0 3.171 0 3.171 Z" id="iconPath"></path>
          <linearGradient id="iconGradient" x1="1" x2="0" y1="0.010276222795295109" y2="0.989723777204705">
            <stop offset="0" stop-color="rgb(207, 207, 207)" stop-opacity="1"></stop>
            <stop offset="1" stop-color="rgb(235, 235, 235)" stop-opacity="1"></stop>
          </linearGradient>
        </defs>
        <use href="#iconPath" fill="url(#iconGradient)"></use>
      </g>
    </svg>
  `;

  const iconStyle = {
    height: "16px",
    width: "16px",
    position: "absolute" as const,
    overflow: "visible"
  };

  const containerStyle = {
    alignContent: "center",
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row" as const,
    flexWrap: "nowrap" as const,
    gap: "10px",
    height: "min-content",
    justifyContent: "center",
    overflow: "visible",
    padding: "0px",
    position: "relative" as const,
    textDecoration: "none",
    width: "min-content",
    ...style
  };

  const ButtonComponent = () => (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Main hole container */}
      <div style={holeStyle}>
        {/* Hole mask */}
        <div style={holeMaskStyle}>
          {/* Button content */}
          <div style={buttonContentStyle}>
            {/* Text wrap */}
            <div style={textWrapStyle}>
              <p style={textStyle}>{label}</p>
            </div>
          </div>
        </div>
        
        {/* Corner icons */}
        {/* Top-left icon (rotated -90deg) */}
        <div
          style={{
            ...iconStyle,
            left: "-2px",
            top: "-2px",
            transform: "rotate(-90deg)"
          }}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
        
        {/* Top-right icon */}
        <div
          style={{
            ...iconStyle,
            right: "-2px",
            top: "-2px"
          }}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
        
        {/* Bottom-right icon (rotated 90deg) */}
        <div
          style={{
            ...iconStyle,
            right: "-2px",
            bottom: "-2px",
            transform: "rotate(90deg)"
          }}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
        
        {/* Bottom-left icon (rotated 180deg) */}
        <div
          style={{
            ...iconStyle,
            left: "-2px",
            bottom: "-2px",
            transform: "rotate(180deg)"
          }}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
      </div>
    </div>
  );

  // If link is provided and it's not just a hash, wrap in Link component
  if (link && link !== "#") {
    return (
      <Link href={link} style={{ textDecoration: "none" }}>
        <ButtonComponent />
      </Link>
    );
  }

  return <ButtonComponent />;
};

export default Button;