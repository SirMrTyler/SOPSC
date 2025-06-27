import * as Yup from "yup";

const borrowerDebtSchema = Yup.object().shape({
  homeMortgage: Yup.number()
    .min(0.1)
    .max(9999999.99)
    .required("Value must be provided."),
  carPayments: Yup.number()
    .min(0.1)
    .max(9999999.99)
    .required("Value must be provided."),
  creditCard: Yup.number()
    .min(0.1)
    .max(9999999.99)
    .required("Value must be provided."),
  otherLoans: Yup.number()
    .min(0.1)
    .max(9999999.99)
    .required("Value must be provided."),
});

export default borrowerDebtSchema;
