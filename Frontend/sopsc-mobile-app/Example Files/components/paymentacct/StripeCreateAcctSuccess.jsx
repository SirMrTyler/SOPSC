import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import NavbarDefault from "layouts/marketing/navbars/NavbarDefault";
import FooterLandings from "layouts/marketing/footers/FooterLandings";
import { Container, Row, Col } from "react-bootstrap";
import stripe from "assets/images/brand/stripe.svg";
import paymentAcctService from "services/paymentAcctService";
import debug from "sabio-debug";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function StripeCreateAccountSuccess() {
  const _logger = debug.extend("PaymentAcct");

  const navigate = useNavigate();

  const [acctData] = useState({
    vendorId: 1,
    accountId: sessionStorage.getItem("acctId"),
    paymentTypeId: 1,
  });

  _logger("acctData state: ", acctData);

  const [paymentAcct, setPaymentAcct] = useState({
    isCreated: false,
    id: 0,
  });

  useEffect(() => {
    createPaymentAccount();
  }, []);

  useEffect(() => {
    if (paymentAcct.isCreated === true) {
      _logger("Payment account created");
      const stateForDash = {
        type: "NEW_ACCT",
        payload: {
          paymentAcctId: paymentAcct.id,
          stripeAcctId: acctData.accountId,
        },
      };
      navigate("/stripe/dashboard", { state: stateForDash });
    }
  }, [paymentAcct]);

  function createPaymentAccount() {
    _logger("payload: ", acctData);
    paymentAcctService.addAcct(acctData).then(onSuccess).catch(onError);
  }

  function onSuccess(response) {
    let newId = response.item;
    _logger("Payment account created with id: ", newId);
    setPaymentAcct((prevState) => {
      let newState = { ...prevState };
      newState.id = newId;
      newState.isCreated = true;
      return newState;
    });
  }

  function onError(err) {
    _logger("Payment account creation failed");
    _logger(err);
    toastr.error("Unable to create payment account.", "Error!");
  }

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
                    Account Setup Complete
                  </span>
                </h1>
                <p>Account number: {acctData.accountId}</p>
                <p>Redirecting to account dashboard...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <FooterLandings />
    </Fragment>
  );
}
export default StripeCreateAccountSuccess;
