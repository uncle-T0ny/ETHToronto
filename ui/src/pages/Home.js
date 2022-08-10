import React, {useRef} from "react";
import "./Home.css";
import Button from "react-bootstrap/Button";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Logo from "../assets/logo.png";
import Detroit from "../assets/detroit.png";
import EducationWorker from "../assets/education_worker.jpg";
import Womans from "../assets/womans.png";
import Maths from "../assets/math.png";
import Wonders from "../assets/wonders.png";
import Labs from "../assets/labs.png";

export default function Home() {
  const ref = useRef(null);
  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
      <div
        className="home-container"
        style={{
          display: "flex",
          marginTop: "100px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ height: "500px" }}>
          <h2 className="welcome" style={{ margin: "7rem 1rem 1rem 0" }}>
            Welcome to Mel's
            <br />
            Meta
          </h2>
          <p
            style={{
              width: "350px",
              textAlign: "justify",
              marginBottom: "1.5rem",
            }}
          >
            Our platform helps volunteers raise funds utilizing blockchain
            technology. Donors can pay using USN, and volunteering organizations
            are given reputability scores.
          </p>
          <Button variant="outline-primary" className="action-button" onClick={handleClick}>
            Scroll to view Organizations
          </Button>
        </div>
        <div>
          <img
            src={Logo}
            alt="Mel's Meta Logo"
            style={{ height: "354px", margin: "3rem" }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 className="everybody" ref={ref}>
          Everybody has a story
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "auto",
            alignItems: "center",
            columnGap: "50px",
            rowGap: "50px",
          }}
        >
          {" "}
          <Card
            image={Detroit}
            image1={EducationWorker}
            title="Detroit Blockchain Center"
            description="Promote the education, adoption, and growth of blockchain technology throughout Metro-Detroit."
            goal="1000"
            rateScore="30"
            isActive={true}
          />
          <Card
            image={Womans}
            image1={Womans}
            title="Women's Business Association"
            description="A non-profit organization devoted to helping women start, lead, and grow businesses. We provide up to 25 000 USN per team in grants."
            goal="125000"
            rateScore="16"
          />
          <Card
            image={Maths}
            image1={Maths}
            title="Math 4 Kids Toronto Team"
            description="Providing students grades K-12 with free Math educational content such as worksheets, tutoring, and videos."
            goal="4500"
            rateScore="-20"
          />
          <Card
            image={Wonders}
            image1={Wonders}
            title="Wonders Daycare"
            description="Providing low income families with daycare, child support, and youth education for as little as $100 a month in Toronto."
            goal="8500"
            rateScore="30"
          />
          <Card
            image={Labs}
            image1={Labs}
            title="Labs Science"
            description="Providing grades 9-12 with chemistry, physics, and biology lessons taught by professors from MIT, Stanford, UofT, and Cornell."
            goal="12500"
            rateScore="2"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
