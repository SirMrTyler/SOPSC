import React from "react";
import Accordion from "react-bootstrap/Accordion";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const _logger = debug.extend("FaqItem");

function FaqItem(props) {
  const aFaqProps = props.aFaqsProps;
  const navigate = useNavigate();
  const onEditClicked = (e) => {
    _logger("on edit clicked", e);
    navigate(`/faqs/${aFaqProps.id}`, {
      state: { payload: aFaqProps },
    });
  };
  _logger(aFaqProps, "props LOG");

  return (
    <React.Fragment>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey={aFaqProps.id} key={aFaqProps.category.id}>
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center  w-100">
              {aFaqProps.question}
              <button
                type="submit"
                className="btn btn-primary bg-primary edit float-right"
                onClick={onEditClicked}
              >
                Edit
              </button>
            </div>
          </Accordion.Header>
          <Accordion.Body>{aFaqProps.answer}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </React.Fragment>
  );
}

FaqItem.propTypes = {
  aFaqsProps: PropTypes.shape({
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }),
};
export default FaqItem;
