import React, { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import "tippy.js/themes/light.css";
import "tippy.js/animations/scale.css";
import ourTeamData from "./AboutusOurTeamData";
import GalleryImages from "./GalleryImages";

const TeamGridRoundImages = () => {
  const [stateGallery, setStateGallery] = useState({
    arrayOfGalleryImages: [],
    teamGridComponent: [],
  });

  useEffect(() => {
    setStateGallery((prevState) => {
      const sg = { ...prevState };
      sg.arrayOfGalleryImages = ourTeamData;
      sg.teamGridComponent = ourTeamData.map(mapGalleryImages);
      return sg;
    });
  }, []);

  const mapGalleryImages = (item, index) => (
    <GalleryImages item={item} key={index} />
  );

  return (
    <div className="py-lg-16 py-10 bg-white">
      <Container>
        <Row>
          <Col md={6} sm={12} className="offset-right-md-6 mb-10">
            {/* <!-- heading --> */}
            <h2 className="display-4 mb-3 fw-bold">Our Team</h2>
            {/* <!-- lead --> */}
            <p className="lead mb-5">
              Want to work with some of the best global talent and build a tool
              used by all the companies you know and love? Join the Monefi team
              and help shape the future.
            </p>
          </Col>
        </Row>

        <Row>{stateGallery.teamGridComponent}</Row>
      </Container>
    </div>
  );
};

export default TeamGridRoundImages;
