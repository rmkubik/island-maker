import React from "react";

const Menu = ({
  children,
  maxWidth = "1200px",
  minWidth = "700px",
  maxHeight = "80%",
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
        zIndex: 9999999999,
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
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Menu;
