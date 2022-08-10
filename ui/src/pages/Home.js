import React from "react";
import "./Home.css";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Logo from "../assets/logo.png";
import Detroit from "../assets/detroit.png";
import Womans from "../assets/womans.png";
import Maths from "../assets/math.png";
import Wonders from "../assets/wonders.png";
import Labs from "../assets/labs.png";

export default function Home() {
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
          <button variant="outline-primary" className="action-button">
            Scroll to view Organizations
          </button>
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
        <h2 className="everybody">Everybody has a story</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "auto",
            alignItems: "center",
            columnGap: '50px',
            rowGap: '50px'
          }}
        >
          {" "}
          <Card
            image={Detroit}
            title="Detroit Blockchain Center"
            description="Promote the education, adoption, and growth of blockchain technology throughout Metro-Detroit."
            goal="10000"
          />
          <Card
            image={Womans}
            title="Women's Business Association"
            description="A non-profit organization devoted to helping women start, lead, and grow businesses. We provide up to 25 000 USN per team in grants."
            goal="125000"
          />
          <Card
            image={Maths}
            title="Math 4 Kids"
            description="Providing students grades K-12 with free Math educational content such as worksheets, tutoring, and videos."
            goal="45000"
          />
          <Card
            image={Wonders}
            title="Wonders Daycare"
            description="Providing low income families with daycare, child support, and youth education for as little as $100 a month in Toronto."
            goal="85000"
          />
          <Card
            image={Labs}
            title="Labs Science"
            description="Providing grades 9-12 with chemistry, physics, and biology lessons taught by professors from MIT, Stanford, UofT, and Cornell."
            goal="125000"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
