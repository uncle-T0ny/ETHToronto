import React from "react";
import { PropTypes } from "prop-types";
import { NavLink } from "react-router-dom";
import "./Card.css";

export default function Card({ image, title, description, goal }) {
  return (
    <div
      key={title}
      style={{
        maxWidth: "295px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          maxHeight: "150px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          margin: "10px",
        }}
      />
      <h3 style={{ margin: "10px" }}>{title}</h3>
      <p style={{ color: "#8e8e8e", margin: "10px" }}>{description}</p>
      <NavLink to="/more/" className="more" style={{ margin: "10px" }}>
        Learn More
      </NavLink>
      <p style={{ margin: "10px" }}>{`Goal: ${goal} USN`}</p>
      <button
        style={{
          backgroundColor: 'white',
          margin: "10px",
          color: "#0ea0ff",
          border: "1px solid #0ea0ff",
          padding: ".5rem 1.2rem",
          fontSize: '1.25rem',
          borderRadius: '2em'
        }}
      >
        Donate
      </button>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  goal: PropTypes.string.isRequired,
};
