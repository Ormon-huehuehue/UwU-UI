"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ButtonBlack({ title = "Get started", width = 144, height = 56 }) {
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = {
    width,
    height,
    borderRadius: "16px",
    backgroundColor: "#222426",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: isPressed
      ? "0px 0px 0px rgba(5,5,5,0)"
      : "0px 0.7px 0.3px rgba(5,5,5,0.06), 0px 2.7px 1.1px rgba(5,5,5,0.11), 0px 12px 4.8px rgba(5,5,5,0.36)",
    transition: "box-shadow 0.1s ease",
  };

  const textStyle = {
    color: "#E3E3E3",
    fontFamily: "'Clash Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "18px",
  };

  return (
    <motion.div
      style={buttonStyle as any}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      animate={{ y: isPressed ? 4 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <span style={textStyle}>{title}</span>
    </motion.div>
  );
}

