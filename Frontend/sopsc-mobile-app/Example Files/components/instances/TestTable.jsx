import React from "react";
import { Image } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import * as DateFormat from "../../utils/dateFormater";

const _logger = debug.extend("TestTable");

function TestTable(props) {
  _logger(props.testItem, "in the map data");
  const aTestItem = { ...props.testItem };
  const theDate = DateFormat.formatDate(aTestItem.dateCreated);
  return (
    <React.Fragment>
      <tbody>
        <tr>
          <td>
            <div>
              <Image
                src={aTestItem.avatarUrl}
                alt="user image"
                className="avatar-sm rounded-circle"
              />{" "}
              {aTestItem.firstName} {aTestItem.lastName}
            </div>
          </td>
          <td>{aTestItem.testName}</td>
          <td>{aTestItem.testTypeName}</td>
          <td>{theDate}</td>
        </tr>
      </tbody>
    </React.Fragment>
  );
}

TestTable.propTypes = {
  testItem: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    testName: PropTypes.string.isRequired,
    testTypeName: PropTypes.string.isRequired,
  }).isRequired
};

export default React.memo(TestTable);
