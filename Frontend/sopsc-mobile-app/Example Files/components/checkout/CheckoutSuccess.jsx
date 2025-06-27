import React from "react";
import { Fragment } from "react";
import NavbarDefault from "layouts/marketing/navbars/NavbarDefault";
import FooterLandings from "layouts/marketing/footers/FooterLandings";
import { Container, Row, Col } from "react-bootstrap";
import stripe from "assets/images/brand/stripe.svg";

function CheckoutSuccess() {
  return (
    <Fragment>
      <NavbarDefault />
      <div className="py-lg-18 py-10 bg-auto">
        <Container>
          <Row className="justify-content-center">
            <Col xl={7} lg={7} md={12}>
              <div className="py-8 py-lg-0 text-center">
                <img src={stripe} alt="Stripe" />
                <h1 className="display-2 fw-bold mb-3 text-primary">
                  <span className="text-dark px-3 px-md-0">
                    Checkout Complete
                  </span>
                </h1>
                <p className="mb-6 h2 text-dark">
                  Thanks for shopping with us!
                </p>
              </div>     
            </Col>
          </Row>
        </Container>
      </div>
      <FooterLandings />
    </Fragment>
  );
}             
export default CheckoutSuccess;