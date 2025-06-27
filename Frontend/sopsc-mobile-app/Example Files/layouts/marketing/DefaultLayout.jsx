import React, { Fragment, useEffect } from "react";
import NavbarDefault from "layouts/marketing/navbars/NavbarDefault";
import Footer from "layouts/marketing/footers/Footer";
import PropTypes from "prop-types";

const DefaultLayout = (props) => {
  useEffect(() => {
    document.body.style.backgroundColor = "#f5f4f8";
  });
  return (
    <Fragment>
      <NavbarDefault login />
      {props.children}
      <Footer />
    </Fragment>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.string,
};

export default DefaultLayout;
