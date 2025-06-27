import { React, useState, useEffect, Fragment } from 'react';
import { Col, Row, Button, Card } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import debug from "sabio-debug";
import forumService from "../../services/forumService";
import lookUpService from "../../services/lookUpService";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import basicForumSchema from 'schemas/forumCreateSchema';

const CreateForumForm = () => {
    const _logger = debug.extend("Forums");

    const [categoryNames, setCategoryNames] = useState({ forumCategory: [] });
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        forumCategoryId: "",
        privacySettings: "",
        openOrClosed: ""
    });

    const mapCategory = (forumCategories) => {
        _logger("forumCategories", forumCategories)
        let obj = {
            value: forumCategories.id,
            label: forumCategories.name
        }
        return <option value={obj.value}>{obj.label}</option>
    }

    useEffect(() => {
        lookUpService.getTypes(["ForumCategories"])
            .then(onSuccessGetTypes)
            .catch(onErrorGetTypes)
    }, []);

    const onSuccessGetTypes = (response) => {
        _logger(response, "SuccessForumCategories");
        setCategoryNames((prevState) => {
            const newSt = { ...prevState };
            newSt.forumCategory = response.item.forumCategories.map(mapCategory)
            return newSt
        })
    };

    const onErrorGetTypes = (err) => {
        _logger(err, "onErrorForumCategories");
    };

    const clearFormData = () => {
        setFormData({
            name: "",
            description: "",
            forumCategoryId: "",
            privacySettings: "",
            openOrClosed: ""
        });
    };

    const handleSubmit = (values, { resetForm }) => {
        _logger("Values", values);
        forumService.createForum(values)
            .then(onSuccessSubmit)
            .catch(onErrorSubmit)
            .finally(() => {
                resetForm({
                    values: {
                        name: "",
                        description: "",
                        forumCategoryId: "",
                        privacySettings: "",
                        openOrClosed: ""
                    }
                });
            });
    };

    const onSuccessSubmit = (response) => {
        _logger("submit success", response);
        toastr.success("Successfully Submitted");
    };

    const onErrorSubmit = (err) => {
        _logger("submit not working", err);
        toastr.error("Submit Error");
    };
    return (
        <Fragment>
            <Row>
                <Col lg={12} md={12} sm={12}>
                    <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
                        <div className="mb-3 mb-md-0">
                            <h1 className="mb-1 h2 fw-bold">Forums</h1>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="py-6">
                <Row>
                    <Col xl={{ offset: 3, span: 6 }} md={12} xs={12}>
                        <Card>
                            <Card.Body className="p-lg-6">
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={formData}
                                    onSubmit={handleSubmit}
                                    validationSchema={basicForumSchema} >
                                    <Form>
                                        <Row>
                                            <Col md={6} xs={12} className="mb-3">
                                                <label className="form-label" htmlFor="formProjectTitle">
                                                    Name
                                                </label>
                                                <Field type="text"
                                                    placeholder="Enter forum name"
                                                    name="name"
                                                    className="form-control" />
                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="formik-has-error"
                                                />
                                            </Col>
                                            <Col md={6} xs={12} className="mb-3">
                                                <label className="form-label" htmlFor="formProjectTitle">
                                                    Description
                                                </label>
                                                <Field type="textarea"
                                                    placeholder="Enter brief description about the forum..."
                                                    name="description"
                                                    className="form-control" />
                                                <ErrorMessage
                                                    name="description"
                                                    component="div"
                                                    className="formik-has-error"
                                                />
                                            </Col>
                                            <Col md={6} xs={12} className="mb-3">
                                                <label className="form-label" htmlFor="formProjectTitle">
                                                    Forum Category
                                                </label>
                                                <Field as="select"
                                                    placeholder="Select a Category"
                                                    name="forumCategoryId"
                                                    className="form-select"
                                                >
                                                    <option value="">Select a Category</option>
                                                    {categoryNames.forumCategory}
                                                </Field>
                                                <ErrorMessage
                                                    name="forumCategoryId"
                                                    component="div"
                                                    className="formik-has-error"
                                                />
                                            </Col>
                                            <Col md={6} xs={12} className="mb-3">
                                                <label className="form-label" htmlFor="formProjectTitle">
                                                    Privacy Settings
                                                </label>
                                                <Field as="select"
                                                    placeholder="Select Privacy"
                                                    name="privacySettings"
                                                    className="form-select">
                                                    <option value="">Select Privacy</option>
                                                    <option value="False">Public</option>
                                                    <option value="True">Private</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="privacySettings"
                                                    component="div"
                                                    className="formik-has-error"
                                                />
                                            </Col>
                                            <Col md={6} xs={12} className="mb-3">
                                                <label className="form-label" htmlFor="formProjectTitle">
                                                    Open or Closed
                                                </label>
                                                <Field as="select"
                                                    placeholder="Open or Closed"
                                                    name="openOrClosed"
                                                    className="form-select">
                                                    <option value="">Open or Closed</option>
                                                    <option value="False">Open</option>
                                                    <option value="True">Closed</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="openOrClosed"
                                                    component="div"
                                                    className="formik-has-error"
                                                />
                                            </Col>
                                            <Col xs={12}>
                                                <Button variant="primary" type="submit" data-page="/forum">
                                                    Submit
                                                </Button>{"  "}
                                                <Button variant="primary" type="reset" onClick={clearFormData} data-page="/forum">
                                                    Clear
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Formik >
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment >
    );
};
export default CreateForumForm;
