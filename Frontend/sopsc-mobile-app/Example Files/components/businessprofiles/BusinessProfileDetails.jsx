import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import businessProfileService from "../../services/businessProfileService";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const _logger = debug.extend("BusinessProfileDetails");

function BusinessProfileDetails() {
  const [aBusinessProfile, setBusinessProfile] = useState({
    id: null,
    userId: null,
    name: "",
    ein: "",
    statusType: {
      id: null,
      name: "",
    },
    businessType: {
      id: null,
      name: "",
    },
    industryType: {
      id: null,
      name: "",
    },
    projectedAnnualBusinessIncome: null,
    annualBusinessIncome: null,
    businessStage: {
      id: null,
      name: "",
      value: null,
    },
    logo: "",
    zip: "",
    dateCreated: "",
    dateModified: "",
  });

  const location = useLocation();
  _logger("useLocation: ", location);

  useEffect(() => {
    let stateFromBusinessProfile = null;
    if (location.state && location.state.detail) {
      stateFromBusinessProfile = location.state.detail;
      setBusinessProfile((prevState) => {
        var busProfile = {
          ...prevState,
        };
        busProfile = stateFromBusinessProfile;
        return busProfile;
      });
    } else {
      let businessProfileId = new URLSearchParams(window.location.search).toString().replace("=", "");
      businessProfileService.getBusinessProfileById(businessProfileId).then(getBusinessProfileByIdSuccess).catch(getBusinessProfileByIdError);
    }
  }, []);

  const getBusinessProfileByIdSuccess = (data) => {
    let aBusinessProfile = data?.item;
    if (aBusinessProfile) {
      setBusinessProfile((prevState) => {
        var busProfile = {
          ...prevState,
        };
        busProfile = aBusinessProfile;
        return busProfile;
      });
    }
  };

  const getBusinessProfileByIdError = (error) => {
    _logger("getBusinessProfileByIdError error", error);
    toastr.error("Error. Failed to load business profile.", error);
  };

  return (
    <React.Fragment>
      <Card className="col-5 mx-auto p-2">
        <Card.Header className="d-flex justify-content-center">
          <img src={aBusinessProfile?.logo} className="col-5 mx-auto p-2 img-thumbnail img-fluid rounded-circle" alt="businessProfileLogo" />
        </Card.Header>
        <Card.Header>
          <h4>Business Name: </h4>
          <div>{aBusinessProfile.name}</div>
        </Card.Header>
        <Card.Header>
          <h4>EIN: </h4>
          <div>{aBusinessProfile?.ein}</div>
        </Card.Header>
        <Card.Header>
          <h4>Status: </h4>
          <div>{aBusinessProfile.statusType.name}</div>
        </Card.Header>
        <Card.Header>
          <h4>Business Type: </h4>
          <div>{aBusinessProfile.businessType.name}</div>
        </Card.Header>
        <Card.Header>
          <h4>Industry Type: </h4>
          <div>{aBusinessProfile.industryType.name}</div>
        </Card.Header>
        <Card.Header>
          <h4>Projected Annual Business Income: </h4>
          <div>{aBusinessProfile?.projectedAnnualBusinessIncome}</div>
        </Card.Header>
        <Card.Header>
          <h4>Annual Business Income: </h4>
          <div>{aBusinessProfile.annualBusinessIncome}</div>
        </Card.Header>
        <Card.Header>
          <h4>Business Stage: </h4>
          <div>{aBusinessProfile?.businessStage?.name}</div>
        </Card.Header>
        <Card.Header>
          <h4>Location: </h4>
          <div>{aBusinessProfile?.zip}</div>
        </Card.Header>
      </Card>
    </React.Fragment>
  );
}

BusinessProfileDetails.propTypes = {
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

export default BusinessProfileDetails;
