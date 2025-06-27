import React from "react";
import { Fragment } from "react";
import Features4Columns from "./Features4Columns";
import HeroTyped from "./HeroTyped";
import NavbarDefault from "layouts/marketing/navbars/NavbarDefault";
import FooterLandings from "layouts/marketing/footers/FooterLandings";

const Landing = () => {
  return (
    <Fragment>
      <NavbarDefault />

      <HeroTyped />

      <Features4Columns />

      <FooterLandings />
    </Fragment>
  );
};
export default Landing;