import React from "react";
import { Col, Image } from "react-bootstrap";
import Tippy from "@tippyjs/react";
import "tippy.js/themes/light.css";
import "tippy.js/animations/scale.css";
import PropTypes from "prop-types";

function GalleryImages(props) {
  return (
    <Col md={2} sm={3} className="col-3">
      <div className="p-xl-5 p-lg-3 mb-3 mb-lg-0">
        <Tippy
          content={
            <div>
              <h4 className="mb-0 fw-bold">{props.item.name}</h4>
              <span>{props.item.designation}</span>
            </div>
          }
          theme={"light"}
          animation={"scale"}
        >
          <Image
            src={props.item.image}
            alt=""
            className="imgtooltip img-fluid rounded-circle"
          />
        </Tippy>
      </div>
    </Col>
  );
}

GalleryImages.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    designation: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default GalleryImages;
