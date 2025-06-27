import React from "react";
import * as borrowerDebtService from "services/borrowerDebtService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import sabioDebug from "sabio-debug";
import toastr from "toastr";
import borrowerDebtSchema from "schemas/borrowerDebtSchema";
import "toastr/build/toastr.min.css";

const _logger = sabioDebug.extend("BorrowerDebt");

function BorrowerDebtForm() {
  const formData = {
    homeMortgage: "",
    carPayments: "",
    creditCard: "",
    otherLoans: "",
  };

  const handleSubmit = (values) => {
    _logger("Submit Clicked Now", values);
    borrowerDebtService
      .addBorrowerDebt(values)
      .then(onSuccessBorrowerDebt)
      .catch(onErrorBorrowerDebt);
  };

  const onSuccessBorrowerDebt = (response) => {
    _logger(response, "onSuccessBorrowerDebt");
    toastr.success("Debt Successfully Calculated");
  };

  const onErrorBorrowerDebt = (err) => {
    _logger(err, "onErrorBorrowerDebt");
    toastr.error("Debt Unsuccessfully Calculated");
  };

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h4>Borrower Debt</h4>
            <Formik
              enableReinitialize={true}
              initialValues={formData}
              validationSchema={borrowerDebtSchema}
              onSubmit={handleSubmit}
            >
              <Form className="formik-form">
                {" "}
                <div className="mb-3">
                  <label htmlFor="inputHomeMortgage" className="form-label">
                    Home Mortgage
                  </label>
                  <Field
                    type="number"
                    className="form-control"
                    id="inputHomeMortgage"
                    aria-describedby="homeMortgageHelp"
                    name="homeMortgage"
                    placeholder="Enter Your Home Mortgage Payment"
                  />
                  <ErrorMessage
                    name="homeMortgage"
                    component="div"
                    className="formik-has-error"
                  />
                </div>{" "}
                <div className="mb-3">
                  <label htmlFor="inputCarPayments" className="form-label">
                    Car Payments
                  </label>
                  <Field
                    type="number"
                    className="form-control"
                    id="inputCarPayments"
                    aria-describedby="carPaymentsHelp"
                    name="carPayments"
                    placeholder="Enter Your Car Payments"
                  />
                  <ErrorMessage
                    name="carPayments"
                    component="div"
                    className="formik-has-error"
                  />
                </div>{" "}
                <div className="mb-3">
                  <label htmlFor="inputCreditCard" className="form-label">
                    Credit Card
                  </label>
                  <Field
                    type="number"
                    className="form-control"
                    id="inputCreditCard"
                    aria-describedby="creditCardHelp"
                    name="creditCard"
                    placeholder="Enter Your Credit Card Payments"
                  />
                  <ErrorMessage
                    name="creditCard"
                    component="div"
                    className="formik-has-error"
                  />
                </div>{" "}
                <div className="mb-3">
                  <label htmlFor="inputOtherLoans" className="form-label">
                    Other Loans
                  </label>
                  <Field
                    type="number"
                    className="form-control"
                    id="inputOtherLoans"
                    aria-describedby="otherLoansHelp"
                    name="otherLoans"
                    placeholder="Enter Your Other Loans"
                  />
                  <ErrorMessage
                    name="otherLoans"
                    component="div"
                    className="formik-has-error"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <div className="form-text">
                  We will never share your information with anyone else.
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BorrowerDebtForm;
