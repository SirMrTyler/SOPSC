import React, { useState, useEffect } from "react";
import * as testAnswerService from "../../services/testAnswerService";
import TestTable from "./TestTable";
import Table from "react-bootstrap/Table";
import Pagination from "rc-pagination";
import 'rc-pagination/assets/index.css'; 
import debug from "sabio-debug";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const _logger = debug.extend("TestAnswer");
function TestAnswers() {
  const [testData, setTestData] = useState({
    dataArray: [],
    dataComponents: [],
    pageIndex: 0,
    pageSize: 5,
    totalCount: 0
  });

  useEffect(() => {
    testAnswerService
      .getPaginated(testData.pageIndex, testData.pageSize)
      .then(onGetPaginatedSuccess)
      .catch(onGetPaginatedError);
  }, [testData.pageIndex]);

  const onGetPaginatedSuccess = (data) => {
    let testItem = data.item.pagedItems;
    _logger("success", testItem);
    setTestData((prevState) => {
      const pagedItem = { ...prevState };
      pagedItem.dataArray = testItem;
      pagedItem.dataComponents = testItem.map(singleTestMap);
      pagedItem.totalCount = data.item.totalCount;
      return pagedItem;
    });
  };
  _logger("new count", testData.totalCount);
  const onGetPaginatedError = (err) => {
    toastr.error("Page failed to load");
    _logger("failed response", err);
  };
  const singleTestMap = (testItem) => {
    _logger("mapping", testItem);
    return <TestTable testItem={testItem} key={"testsList-" + testItem.id} />;
  };
 const handlePageChange = (page) =>{
    setTestData((prevState) => {
      let pd = {...prevState};
      pd.pageIndex  = page - 1;
      return pd;
    })
  }
  return (
    <React.Fragment>
      <h1>Test Instances</h1>
      <div className="container">
        <div className="row col-md-10 mx-auto">
          <div className="row">
            <div>
              <Table striped="columns">
                <thead>
                  <tr>
                    <th>user</th>
                    <th>Survey Name</th>
                    <th>Survey Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                {testData.dataComponents}
              </Table>
            </div>
          </div>
        </div>
        <div className="row col-md-6 mx-auto">
          <Pagination 
            onChange={handlePageChange}    
            current={testData.pageIndex + 1}
            total={testData.totalCount} 
            pageSize={testData.pageSize} 
            className="pb-3 pt-3" 
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default TestAnswers;
