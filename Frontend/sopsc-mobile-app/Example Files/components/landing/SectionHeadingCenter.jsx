import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const SectionHeadingCenter = ({ title, subtitle, description }) => {
  return (
    <Row className="mb-10 justify-content-center">
      <Col lg={8} md={12} sm={12} className="text-center">
        <span className="text-primary mb-3 d-block text-uppercase fw-semi-bold ls-xl">
          {subtitle}
        </span>
        <h2 className="mb-2 display-4 fw-bold ">{title}</h2>
        <p className="lead">{description}</p>
      </Col>
    </Row>
  );
};

SectionHeadingCenter.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
};

export default SectionHeadingCenter;
