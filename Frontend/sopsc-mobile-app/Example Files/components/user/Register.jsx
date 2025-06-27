import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from 'react-router-dom';
import { Image, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import * as usersService from "../../services/userService";

import logger from "sabio-debug";
import swal from "sweetalert2";
import DotPattern from 'assets/images/pattern/dots-pattern.svg';
import "./users.css";

function Register() {

    const navigate = useNavigate();
    const _logger = logger.extend("App");

    const basicSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Please enter a valid email")
            .max(255, "Email cannot have more than 255 characters"),
        password: Yup.string().required("Please enter a password")
            .max(100, "Password cannot have more than 100 characters")
            .matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
        passwordConfirm: Yup.string()
            .required("Please confirm your password")
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        firstName: Yup.string().required("Please enter a first name")
            .max(100, "First name cannot have more than 100 characters"),
        lastName: Yup.string().required("Please enter a last name")
            .max(100, "Last name cannot have more than 100 characters"),
        avatarUrl: Yup.string().max(255, "Middle initial cannot have more than 255 characters"),
        mi: Yup.string().max(2, "Middle initial cannot have more than 2 characters")
    })

    const [registrant] = useState({
        firstName: "",
        lastName: "",
        mi: "",
        avatarUrl: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleSubmit = (values) => {
        _logger("handleSubmit", values);
        usersService
            .add(values)
            .then(registerSuccess)
            .catch(registerError);
    }

    const registerError = (err) => {
        _logger("registerError:", err);
        let errMessage = err;
        if (err.response.data.errors) {
            if (err.response.data.errors[0].includes("Cannot insert duplicate key")) {
                errMessage = `The email ${registrant.email} already exists. Please use another email or go to the login page.`;
            } else {
                errMessage = "A registration error occurred. Please contact technical support at: \n- Email: support@geeksui.com\n- Phone: (000) 123 456 789";
            }
        }
        swal.fire("Registration Failed!", errMessage);
    }

    const registerSuccess = (response) => {
        _logger("registerSuccess", response);
        swal.fire("Registration Successful!", "Please check your email to complete user verification.");
        navigate("/login");
    }

    useEffect(() => {
        _logger("registration page loaded");
    }, []);

    return (
        <React.Fragment>
            <div className="py-md-5 py-12">
                <Formik
                    enableReinitialize={true}
                    initialValues={registrant}
                    validationSchema={basicSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Container>
                            <Row>
                                <Col xl={{ span: 5, offset: 1 }} lg={6} md={12}>
                                    <Form className="mt-3 position-absolute top-5 start-50 translate-middle-x">
                                        <Card className="register-card-width">
                                            <Card.Body className="p-6">
                                                <div className="mb-4">
                                                    <h1 className="mb-4 lh-1 fw-bold h2">Registration Form</h1>
                                                </div>
                                                <div>
                                                    <div className="mb-3">
                                                        <Field value={values.firstName} type="text" className="form-control" id="firstName" name="firstName" placeholder="Enter first name"></Field>
                                                        <ErrorMessage name="firstName" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Field value={values.lastName} type="text" className="form-control" name="lastName" id="lastName" placeholder="Enter last name"></Field>
                                                        <ErrorMessage name="lastName" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Field value={values.mi} type="text" className="form-control" id="mi" name="mi" placeholder="Enter middle initial"></Field>
                                                        <ErrorMessage name="mi" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Field value={values.email} type="email" className="form-control" id="email" name="email" placeholder="Enter email"></Field>
                                                        <ErrorMessage name="email" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Field value={values.avatarUrl} type="text" className="form-control" id="avatarUrl" name="avatarUrl" placeholder="Enter avatar URL"></Field>
                                                        <ErrorMessage name="avatarUrl" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Field value={values.password} type="password" className="form-control" name="password" id="password" placeholder="Enter password"></Field>
                                                        <ErrorMessage name="password" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Field value={values.passwordConfirm} type="password" className="form-control" name="passwordConfirm" id="passwordConfirm" placeholder="Enter same password again"></Field>
                                                        <ErrorMessage name="passwordConfirm" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="d-grid">
                                                        <button type="submit" className="btn btn-primary">Continue
                                                        </button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer className="bg-white px-6 py-4">
                                                <ul>
                                                    <li>
                                                        Click <Link to="/login" className="text-inherit fw-semi-bold">
                                                            here
                                                        </Link> if you already have an account.
                                                    </li>
                                                    <li>
                                                        MoneFi will never share your email.
                                                    </li>
                                                    <li>By continuing you accept the{' '}
                                                        <Link to="#" className="text-inherit fw-semi-bold">
                                                            Terms of Use
                                                        </Link>
                                                        ,
                                                        <Link to="#" className="text-inherit fw-semi-bold">
                                                            {' '}
                                                            Privacy Policy
                                                        </Link>
                                                        , and{' '}
                                                        <Link to="#" className="text-inherit fw-semi-bold">
                                                            Data Policy
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </Card.Footer>
                                            <div className="position-relative div-dotted-background">
                                                <div className="position-absolute bottom-0 end-0 me-md-n3 mb-md-n6 me-lg-n4 mb-lg-n4 me-xl-n6 mb-xl-n8 d-none d-md-block ">
                                                    <Image src={DotPattern} alt="" />
                                                </div>
                                            </div>
                                        </Card>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    )}
                </Formik>
            </div>
        </React.Fragment >
    );
};
export default Register;