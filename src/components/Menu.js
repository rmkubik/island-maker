import React from "react";

const Menu = ({
  children,
  maxWidth = "1200px",
  minWidth = "700px",
  maxHeight = "80%",
  display = "block",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        zIndex: 100000,
        cursor: "auto",
        backgroundColor: "rgba(69, 69, 69, 0.75)",
      }}
    >
      <div
        className="menu slideInUp"
        style={{
          textAlign: "center",
          borderRadius: "12px",
          backgroundColor: "rgb(69, 69, 69)",
          padding: "64px",
          border: "6px solid white",
          maxWidth,
          minWidth,
          maxHeight,
          display,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Menu;
