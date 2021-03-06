import React from "react";

const Menu = ({ children, maxWidth = "900px" }) => {
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
        zIndex: 9999999999,
        cursor: "auto",
        backgroundColor: "rgba(69, 69, 69, 0.75)",
      }}
    >
      <div
        className="menu"
        style={{
          textAlign: "center",
          borderRadius: "12px",
          backgroundColor: "rgb(69, 69, 69)",
          padding: "64px",
          border: "6px solid white",
          maxWidth,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Menu;
