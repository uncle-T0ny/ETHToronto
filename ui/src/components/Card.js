import React, {useState} from "react";
import {PropTypes} from "prop-types";
// import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./Card.css";

export default function Card({image, image1, title, description, goal, rateScore, isActive = false}) {
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
            score:
            <ProgressBar now={rateScore} label={`${rateScore} points`} style={{width: '100%', backgroundColor: rateScore > 0? 'green': 'orange'}}/>

            <h3 style={{margin: "10px"}}>{title}</h3>
            <p style={{color: "#8e8e8e", margin: "10px"}}>{description}</p>
            {/* <NavLink to="/more/" className="more" style={{ margin: "10px" }}>
        Learn More
      </NavLink> */}
            <p style={{margin: "10px"}}>{`Goal: ${goal} USN`}</p>
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
                disabled={!isActive}
                onClick={handleShow}
            >
                Donate
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display: "flex", flexDirection: "column"}}>
                    {" "}
                    <img
                        src={image1}
                        alt={title}
                        className="figure-img img-fluid rounded"
                    />
                    {description}
                    <ProgressBar now={60} label={`${60}%`} style={{marginTop: '2rem'}}/>
                    <hr className="mt-3"/>
                    <div className="card mt-4 text-center">
                        <div className="card-header">
                            Update 1
                        </div>
                        <div className="card-body">
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                        <div className="card-footer text-muted">
                            3 days ago
                        </div>
                    </div>
                    <div className="card mt-4 text-center">
                        <div className="card-header">
                            Proof 1
                        </div>
                        <img src={image} className="card-img-bottom"/>
                    </div>
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
