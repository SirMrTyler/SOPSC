import React, { Fragment } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import FooterWithLinks from "./FooterWithLinks";
import Call2ActionBackground from "assets/images/background/course-graphics.svg";

const FooterLandings = () => {
  return (
    <Fragment>
      <div
        className="py-lg-16 py-10 bg-dark"
        style={{
          background: `url(${Call2ActionBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={9} sm={12}>
              <h2 className="display-4 text-white">
                Join more than 1 million learners worldwide
              </h2>
              <p className="lead text-white px-lg-12 mb-6">
                Effective learning starts with assessment. Learning a new skill
                is hard work—Signal makes it easier.
              </p>
              <div className="d-grid d-md-block">
                <Link
                  to="/dashboard/analytics"
                  className="btn btn-primary mb-2 mb-md-0"
                >
                  Dashboard
                </Link>{" "}
                <Link to="/authentication/sign-up" className="btn btn-info">
                  Test 404
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <FooterWithLinks />
    </Fragment>
  );
};

export default FooterLandings;
