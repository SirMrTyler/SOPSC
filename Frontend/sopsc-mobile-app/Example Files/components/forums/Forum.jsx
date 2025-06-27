import { React, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Breadcrumb, Card } from 'react-bootstrap';


const CreateForum = () => {
    return (
        <Fragment>
            <Row>
                <Col lg={12} md={12} sm={12}>
                    <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
                        <div className="mb-3 mb-md-0">
                            <h1 className="mb-1 h2 fw-bold">Forums</h1>
                            <Breadcrumb>
                                <Breadcrumb.Item href="#">Forum Dashboard</Breadcrumb.Item>
                                <Breadcrumb.Item href="#">CMS</Breadcrumb.Item>
                                <Breadcrumb.Item active>Overview</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div>
                            <Link to="/create-new-forum" className="btn btn-primary">
                                New Forum
                            </Link>
                        </div>
                        <div>

                        </div>
                    </div>
                </Col>
            </Row>
            <div className="py-6">
                <Row>
                    <Col xl={{ offset: 3, span: 6 }} md={12} xs={12}>
                        <Card>
                            <Card.Body className="p-lg-6">
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
};

export default CreateForum;
