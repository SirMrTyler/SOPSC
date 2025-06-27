import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import debug from "sabio-debug";
import checkoutService from "services/checkoutService";

function CheckoutBtn() {
  //*********************************************************//
  //  CONSTANTS & STATE OBJECTS
  //*********************************************************//

  const _logger = debug.extend("Checkout");

  const [sessionData, setSessionData] = useState({
    id: "",
  });

  const apiKey = process.env.REACT_APP_STRIPE_API_KEY;

  //*********************************************************//
  //  USE EFFECT
  //*********************************************************//

  useEffect(() => {
    if (sessionData.id !== "") {
      loadStripe(apiKey).then(onLoadSuccess).catch(onLoadError);
    }
  }, [sessionData.id]);

  //*********************************************************//
  //  ON CLICK
  //*********************************************************//

  const goToCheckout = () => {
    checkoutService
      .addTestSession()
      .then(onCreateSessionSuccess)
      .catch(onCreateSessionError);
  };

  //*********************************************************//
  //  HANDLERS
  //*********************************************************//

  function onCreateSessionSuccess(response) {
    _logger(
      "Stripe checkout session created with session id: ",
      response.data.item
    );
    setSessionData({ id: response.data.item });
  }

  function onCreateSessionError(err) {
    _logger("Stripe checkout session failed");
    _logger(err);
  }

  function onLoadSuccess(stripeObj) {
    return stripeObj.redirectToCheckout({ sessionId: sessionData.id });
  }

  function onLoadError(err) {
    _logger("Stripe checkout load error");
    _logger(err);
  }

  //*********************************************************//
  //  RENDERING
  //*********************************************************//
  return (
    <Button variant="primary" className="me-1 mb-2" onClick={goToCheckout}>
      Checkout
    </Button>
  );
}

export default CheckoutBtn;
