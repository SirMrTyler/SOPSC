import React, { Fragment } from "react";
import debug from "sabio-debug";
import { Row, Col } from "react-bootstrap";
import TeamGridRoundImages from "./TeamGridRoundImage";
import mission from "../../assets/images/missionandvisionimg/vision-mission-values.jpg";
import Footer from "../../layouts/marketing/footers/FooterWithLinks";

const _logger = debug.extend("FaqItem");

_logger("logger notice");

function AboutUs() {
  return (
    <main className="header" style={{ backgroundColor: "white" }}>
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <Row>
              <Col
                lg={{ span: 8, offset: 2 }}
                md={12}
                sm={12}
                className="mb-12"
              >
                {/* caption */}
                <h1 className="display-2 fw-bold mb-3">
                  Welcome to <strong>MoneFI</strong>
                </h1>
                {/* para  */}
                <h2 className="h2 mb-3 ">Who are we and what do we do?</h2>
                <p className="mb-0 h3 text-body lh-lg">
                  Empowering your financial future with Monefi, your trusted
                  finance solution. We believe in a world where everyone has an
                  opportunity to achieve their goals and live a financially
                  secure and fulfilling life. By equipping our clients with the
                  tools for wise financial decisions, we strive to shape a
                  better tomorrow for all.
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-6 p-5 d-block d-md-none"></div>
          <div className="col-12 col-md-6 p-5">
            <h2 className="display-4 mb-3 fw-bold">Mission Statement</h2>
            <h3>
              At Monefi, our mission is to empower our clients to make informed
              financial decisions that will help them achieve their goals, with
              peace of mind. We strive to provide high-quality financial
              services that are tailored to the unique needs of each individual
              or business. We believe that financial literacy is a fundamental
              right, and it is our mission to educate and empower people to make
              smart financial choices.
            </h3>
          </div>

          <div className="col-12 col-md-6 p-5 d-none d-md-block">
            <img
              className="img-responsive img-fluid rounded-3"
              src={mission}
              alt="mission and vision IMG "
              height={300}
              width={430}
            ></img>
          </div>
        </div>
        <div className="container">
          <h2 className="display-4 mb-3 fw-bold">Vision Statement</h2>
          <h3>
            At Monefi, our vision is to empower our clients to make informed
            financial decisions that will help them achieve their goals, with
            peace of mind. We strive to provide high-quality financial services
            that are tailored to the unique needs of each individual or
            business. We believe that financial literacy is a fundamental right,
            and it is our mission to educate and empower people to make smart
            financial choices.
          </h3>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col">
            <h1 className="display-4 mb-3 fw-bold">Our Core Values</h1>
            <p className="mb-0 h3 text-body lh-lg">
              Geeks provide clean and consistent page designs to help you to
              create beautiful looking contents. Geek is feature-rich components
              and beautifully designed pages that help you create the best
              possible website and web application projects.
            </p>
          </div>
        </div>
      </section>

      <Fragment>
        <TeamGridRoundImages />
      </Fragment>
      <Footer />
    </main>
  );
}

export default AboutUs;
