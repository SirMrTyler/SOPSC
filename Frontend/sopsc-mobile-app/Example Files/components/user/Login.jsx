import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { mdiFacebook, mdiTwitter, mdiEmail } from '@mdi/js';
import { Link } from 'react-router-dom';
import { Image, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import * as usersService from "../../services/userService";

import logger from "sabio-debug";
import swal from "sweetalert2";
import Icon from '@mdi/react';
import DotPattern from 'assets/images/pattern/dots-pattern.svg';
import "./users.css";

function Login() {

    const navigate = useNavigate();
    const _logger = logger.extend("App");

    const basicSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Please enter a valid email").max(100, "Email cannot have more than 255 characters"),
        password: Yup.string().required("Please enter a password").max(64, "Password cannot have more than 100 characters")
    })

    const [user, setUser] = useState({
        Id: 0,
        firstName: "",
        lastName: "",
        avatarUrl: "",
        email: "",
        password: "",
        isLoggedIn: false,
        roles: []
    });

    const handleSubmit = (values) => {

        _logger("handleSubmit", values);

        usersService
            .login(getLoginJson(values))
            .then(loginSuccess)
            .catch(loginError);
    }

    const loginError = (err) => {

        _logger("loginError:", err);
        let errMessage = err;
        if (err.message) {
            if (err.message === "Request failed with status code 404") {
                errMessage = "The requested user either has not been verified, or does not exists with the provided email and password combination."
            } else {
                errMessage = "A login error occurred. Please contact technical support at: \n- Email: support@geeksui.com\n- Phone: (000) 123 456 789";
            }
        }
        swal.fire("Login Failed!", errMessage);
    }

    const loginSuccess = (response) => {

        _logger(response);

        usersService
            .getCurrent()
            .then(getSuccess)
            .catch(getFail)
    }

    const getFail = (err) => {
        _logger("Get Current User Fail:" + err);
        let errMessage = err;
        if (err.message) {
            if (err.message === "Request failed with status code 404") {
                errMessage = "No user exists with the email and password combination."
            } else {
                errMessage = "A login error occurred. Please contact technical support at: \n- Email: support@geeksui.com\n- Phone: (000) 123 456 789";
            }
        }
        swal.fire("Login Failed!", errMessage);
    }

    const getFailOnLoad = (err) => {
        _logger("getFailOnLoad", err);
    }

    const getSuccess = (response) => {
        _logger("Get Current User Success:" + response);

        setUser(prevUser => {

            const newUserObject = {
                ...prevUser
            };

            newUserObject.Id = response.item.id;
            newUserObject.firstName = response.item.firstName;
            newUserObject.lastName = response.item.lastName;
            newUserObject.avatarUrl = response.item.avatarUrl;
            newUserObject.email = response.item.email;
            newUserObject.password = "";
            newUserObject.roles = response.item.roles;
            newUserObject.isLoggedIn = true;

            return newUserObject;
        });

    }

    const getLoginJson = (aUser) => {

        return (
            {
                email: aUser.email,
                password: aUser.password
            }
        )
    }

    const getSanitizedUser = (aUser) => {

        return (
            {
                id: aUser.id,
                firstName: aUser.firstName,
                lastName: aUser.lastName,
                email: aUser.email,
                isLoggedIn: aUser.isLoggedIn,
                roles: aUser.roles,
            }
        )
    }

    useEffect(() => {

        if (user.isLoggedIn) {
            swal.fire({
                title: "Login Successful!",
                text: "Welcome to MoneFi",
                icon: "success"
            })
            navigate("/", { user: getSanitizedUser(user) });
        } else {
            usersService
                .getCurrent()
                .then(getSuccess)
                .catch(getFailOnLoad)
        }

    }, [user.isLoggedIn]);

    return (
        <React.Fragment>

            <div className="py-md-5 py-12 login-div-absolute">
                <Formik
                    enableReinitialize={true}
                    initialValues={user}
                    validationSchema={basicSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Container>
                            <Row>
                                <Col xl={{ span: 5, offset: 1 }} lg={6} md={12}>
                                    <Form>
                                        <Card className="login-card-width">
                                            <Card.Body className="p-6">
                                                <div className="mb-4">
                                                    <h1 className="mb-4 lh-1 fw-bold h2">Log In With</h1>
                                                    <div className="mt-3 mb-5 d-grid d-md-block">
                                                        <div
                                                            className="btn-group mb-2 me-2 mb-md-0"
                                                            role="group"
                                                            aria-label="socialButton"
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-white shadow-sm"
                                                            >
                                                                <Icon
                                                                    path={mdiEmail}
                                                                    size={0.7}
                                                                    className="text-danger"
                                                                />{' '}
                                                                Google
                                                            </button>
                                                        </div>
                                                        <div
                                                            className="btn-group mb-2 me-2 mb-md-0"
                                                            role="group"
                                                            aria-label="socialButton"
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-white shadow-sm"
                                                            >
                                                                <Icon
                                                                    path={mdiTwitter}
                                                                    size={0.7}
                                                                    className="text-info"
                                                                />{' '}
                                                                Twitter
                                                            </button>
                                                        </div>
                                                        <div
                                                            className="btn-group mb-2 me-2 mb-md-0"
                                                            role="group"
                                                            aria-label="socialButton"
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-white shadow-sm"
                                                            >
                                                                <Icon
                                                                    path={mdiFacebook}
                                                                    size={0.7}
                                                                    className="text-primary"
                                                                />{' '}
                                                                Facebook
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="border-bottom"></div>
                                                    <div className="text-center mt-n2  lh-1">
                                                        <span className="bg-white px-2 fs-6">Or</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-3">
                                                        <Field value={values.email} type="email" className="form-control" id="email" name="email" placeholder="Enter email"></Field>
                                                        <ErrorMessage name="email" component="div" className="text-danger"></ErrorMessage>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Field value={values.password} type="password" className="form-control" name="password" id="password" placeholder="Enter password"></Field>
                                                        <ErrorMessage name="password" component="div" className="text-danger"></ErrorMessage>
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
                                                        Click <Link to="/register" className="text-inherit fw-semi-bold">
                                                            here
                                                        </Link> to create a new account.
                                                    </li>
                                                    <li>
                                                        Click <Link to="#" className="text-inherit fw-semi-bold">
                                                            here
                                                        </Link> to recover your password.
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
export default Login;