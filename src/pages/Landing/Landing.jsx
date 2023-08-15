import { Container, Row, Col, Image } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = ({ showLandingBtn, setShowLandingBtn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (showLandingBtn) {
        navigate("/home");
        setShowLandingBtn(false);
      }
    }, 1200);
  }, [showLandingBtn, navigate, setShowLandingBtn]);
  // research why esLint complains when navigate and setShowLandingBtn aren't included in the dependency array.

  return (
    <>
      <div id="overlay"></div>
      <Container fluid id="landingPage">
        <Row style={{ height: "100vh" }} className="align-items-center">
          <Col
            md={{ span: 8, offset: 2 }}
            xl={{ span: 4, offset: 4 }}
            className="text-center"
          >
            <div
              onClick={() => setShowLandingBtn(true)}
              id={`${showLandingBtn ? "activeBtn" : ""}`}
              className="imgContainer"
            >
              <Image
                className="landingImg"
                fluid
                src="images/brand/brand_play.png"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Landing;
