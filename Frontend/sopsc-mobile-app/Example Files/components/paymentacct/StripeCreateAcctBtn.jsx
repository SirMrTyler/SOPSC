import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import debug from "sabio-debug";
import stripeAcctService from "services/stripeAcctService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function StripeCreateAcctBtn() {
  const _logger = debug.extend("StripeAcct");

  _logger(
    "Stripe account grabbed from session: ",
    sessionStorage.getItem("acctId")
  );

  const [linkData, setLinkData] = useState({
    accountId: "",
    type: "account_onboarding",
    refreshRoute: "/stripecreateacctbtn",
    returnRoute: "/stripecreateacctsuccess",
  });

  useEffect(() => {
    if (linkData.accountId !== "") {
      getNewLink(linkData);
    }
  }, [linkData.accountId]);

  const goToCreateAcct = () => {
    let id = sessionStorage.getItem("acctId");
    if (id !== null) {
      _logger("Stripe account id grabbed from session: ", id);
      setLinkData((prevState) => {
        let newState = { ...prevState };
        newState.accountId = id;
        return newState;
      });
    } else {
      stripeAcctService
        .newTestAcct()
        .then(onCreateAcctSuccess)
        .catch(onCreateAcctError);
    }
  };

  const getNewLink = (payload) => {
    stripeAcctService
      .newAcctLink(payload)
      .then(onCreateLinkSuccess)
      .catch(onCreateLinkError);
  };

  function onCreateAcctSuccess(response) {
    let id = response.item;
    _logger("Stripe account created with id: ", id);
    sessionStorage.setItem("acctId", id);
    setLinkData((prevState) => {
      let newState = { ...prevState };
      newState.accountId = id;
      return newState;
    });
  }

  function onCreateAcctError(err) {
    _logger("Stripe account creation failed");
    _logger(err);
    toastr.error("Unable to generate Stripe Account Id.", "Error!");
  }

  function onCreateLinkSuccess(response) {
    let url = response.item;
    _logger("Account link created with url: ", url);
    window.location.href = url;
  }

  function onCreateLinkError(err) {
    _logger("Account link creation failed");
    _logger(err);
    toastr.error(
      "Unable to connect to account onboarding. Please try again.",
      "Error!"
    );
  }

  return (
    <div>
      <Button variant="primary" className="me-1 mb-2" onClick={goToCreateAcct}>
        Create Account
      </Button>
    </div>
  );
}

export default StripeCreateAcctBtn;
