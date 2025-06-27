import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import { CardGroup } from "react-bootstrap";
import businessProfileService from "../../services/businessProfileService";
import BusinessProfile from "./BusinessProfile";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const _logger = debug.extend("BusinessProfiles");

function BusinessProfiles() {
  const [pageData, setPageData] = useState({
    arrayOfBusinessProfiles: [],
    businessProfilesComponents: [],
    pageIndex: 0,
    totalCount: 0,
    pageSize: 9,
  });

  useEffect(() => {
    businessProfileService
    .getAllBusinessProfiles(pageData.pageIndex, pageData.pageSize)
    .then(onGetAllBusinessProfilesSuccess)
    .catch(onGetAllBusinessProfilesError);
  }, [pageData.pageIndex]);

  const mapBusinessProfile = (aBusinessProfile) => {
    return <BusinessProfile key={"ListA-" + aBusinessProfile.id} businessProfile={aBusinessProfile} />;
  };

  const onGetAllBusinessProfilesSuccess = (data) => {
    const arrayOfBP = data?.item?.pagedItems;

    if (arrayOfBP) {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.totalCount = data.item.totalCount;
        pd.arrayOfBusinessProfiles = arrayOfBP;
        pd.businessProfilesComponents = arrayOfBP.map(mapBusinessProfile);
        return pd;
      });
    }
  };

  const onGetAllBusinessProfilesError = (error) => {
    _logger("onGetAllBusinessProfilesError error", error);
    toastr.error("Error. Failed to load business profiles.", error);
  };

  const onPageChange = (page) => {
    setPageData((prevState) => {
      const p = { ...prevState };
      p.pageIndex = page - 1;
      return p;
    });
  };

  return (
    <React.Fragment>
      <h1>Business Profiles</h1>
      <CardGroup>
        <div className="container">
          <p></p>
          <div className="row col-md-12">{pageData.businessProfilesComponents}</div>
          <p></p>
          <Pagination onChange={onPageChange} current={pageData.pageIndex + 1} total={pageData.totalCount} pageSize={pageData.pageSize} />
        </div>
      </CardGroup>
    </React.Fragment>
  );
}

export default BusinessProfiles;
