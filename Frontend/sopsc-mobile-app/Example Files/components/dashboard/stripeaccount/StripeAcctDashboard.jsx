import React, { useEffect, useState, Fragment } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import debug from "sabio-debug";
import stripeAcctService from "services/stripeAcctService";
import { useLocation } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function StripeDashboard() {
  const _logger = debug.extend("StripeDash");

  const { state } = useLocation();

  const [acctData, setAcctData] = useState({
    paymentAcctId: 0,
    stripeAcctId: "",
    memberSince: "",
    acctBalance: 0,
    acctCurrency: "usd",
  });

  useEffect(() => {
    _logger("displaying dashboard page");
    if (state.type === "NEW_ACCT") {
      let date = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      setAcctData((prevState) => {
        let newState = { ...prevState };
        newState.paymentAcctId = state.payload.paymentAcctId;
        newState.stripeAcctId = state.payload.stripeAcctId;
        newState.memberSince = date;
        return newState;
      });
    }
  }, []);

  useEffect(() => {
    if (acctData.stripeAcctId !== "") {
      _logger("retrieving acct data");
      getAcctBalance(acctData.stripeAcctId);
    }
  }, [acctData.stripeAcctId]);

  function getAcctBalance(id) {
    stripeAcctService
      .getBalance(id)
      .then(onGetBalanceSuccess)
      .catch(onGetBalanceError);
  }

  function onGetBalanceSuccess(response) {
    _logger("Successfully retrieved account balance");
    let balObj = response.item;
    _logger(balObj);
    setAcctData((prevState) => {
      let newState = { ...prevState };
      newState.acctBalance = balObj.available[0].amount;
      newState.acctCurrency = balObj.available[0].currency;
      return newState;
    });
  }

  function onGetBalanceError(err) {
    _logger("Error retrieving account balance");
    _logger(err);
    toastr.error("Unable to retrieve account balance.", "Error!");
  }

  const amt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: acctData.acctCurrency,
    currencyDisplay: "narrowSymbol",
  }).format(acctData.acctBalance);

  return (
    <Fragment>
      <div className="pt-5 pb-5">
        <Container>
          <Row>
            <Col lg={4} md={12} sm={12}>
              <h3>Member since: {acctData.memberSince}</h3>
            </Col>
            <Col lg={4} md={12} sm={12}>
              <Card border="light">
                <Card.Body className="p-0">
                  <div className="p-4">
                    <span className="fs-6 text-uppercase fw-semi-bold">
                      Your Balance
                    </span>
                    <h2 className="mt-4 fw-bold mb-1 d-flex align-items-center h1 lh-1">
                      {amt}
                    </h2>
                    <span className="d-flex justify-content-between align-items-center">
                      <span>Available Funds ({acctData.acctCurrency})</span>
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
}

export default StripeDashboard;
