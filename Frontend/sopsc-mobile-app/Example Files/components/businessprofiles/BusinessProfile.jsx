import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function BusinessProfile(props) {
  const aBusinessProfile = props.businessProfile;
  return (
    <React.Fragment>
      <Col xl={4} lg={4} md={6} sm={12} key={aBusinessProfile.id}>
        <Card className="mb-4">
          <Card.Body>
            <div className="text-center">
              <Image src={aBusinessProfile.logo} className="rounded-circle avatar-xl mb-3" alt="logo" />
              <h4 className="mb-1">{aBusinessProfile.name}</h4>
              <p className="mb-0 fs-6">
                <i className="fe fe-map-pin me-1"></i>
                {aBusinessProfile.zip}
              </p>
              <Link
                to={{
                  pathname: `/profiles/business/details`,
                  search: `?${aBusinessProfile.id}`,
                }}
                state={{ detail: aBusinessProfile }}
                className="btn btn-sm btn-outline-white mt-3"
              >
                View More
              </Link>
            </div>
            <div className="d-flex justify-content-between border-bottom py-2 mt-4 fs-6">
              <span>Type</span>
              <span className="text-dark">{aBusinessProfile.businessType.name}</span>
            </div>
            <div className="d-flex justify-content-between pt-2 fs-6">
              <span>Industry</span>
              <span className="text-dark">{aBusinessProfile.industryType.name}</span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
}

BusinessProfile.propTypes = {
  businessProfile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    EIN: PropTypes.string,
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    businessType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    industryType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    projectedAnnualBusinessIncome: PropTypes.number,
    annualBusinessIncome: PropTypes.number.isRequired,
    businessStage: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      value: PropTypes.number,
    }),
    logo: PropTypes.string,
    zip: PropTypes.string,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
  }),
};

export default React.memo(BusinessProfile);
