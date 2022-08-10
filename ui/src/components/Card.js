import React, {useState} from "react";
import { PropTypes } from "prop-types";
// import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./Card.css";

export default function Card({ image, title, description, goal }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
      {/* <NavLink to="/more/" className="more" style={{ margin: "10px" }}>
        Learn More
      </NavLink> */}
      <p style={{ margin: "10px" }}>{`Goal: ${goal} USN`}</p>
      <Button
        variant="outline-primary"
        style={{
          // backgroundColor: "white",
          margin: "10px",
          border: "1px solid #0ea0ff",
          padding: ".5rem 1.2rem",
          fontSize: "1.25rem",
          borderRadius: "2em",
        }}
        onClick={handleShow}
      >
        Donate
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
          {" "}
          <img
            src={image}
            alt={title}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              margin: "10px",
            }}
          />
          {description}
          <ProgressBar now={60} label={`${60}%`} style={{marginTop: '2rem'}} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Donate 10 USN
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  goal: PropTypes.string.isRequired,
};
