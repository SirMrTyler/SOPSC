import React from "react";
import { Card, Table, Image } from "react-bootstrap";
import PropTypes from "prop-types";

const Browsers = ({ title, data }) => {
  return (
    <Card className="h-100 ">
      <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table className="mb-0 text-nowrap">
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="border-top-0 ">
                      <Image src={item.logo} alt="" className="me-2" />{" "}
                      <span className="align-middle ">{item.browser}</span>
                    </td>
                    <td className="text-end border-top-0  ">{item.percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

Browsers.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    browser: PropTypes.string,
    percent: PropTypes.number
  })).isRequired
};
export default Browsers;
