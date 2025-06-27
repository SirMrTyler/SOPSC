import React from "react";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import toastr from "toastr";
import testsSchema from "schemas/testsSchemas";
import RenderTestCards from "./RenderTestCards";
import testService from "services/testService";
import testStyles from "./TestStyles";

const _logger = debug.extend("Tests");

const validationSchema = testsSchema.testSearchSchema();

const Tests = () => {
  const navigate = useNavigate();

  const [tests, setTests] = useState({ allTests: [] });
  const [paginate] = useState({ pageIndex: 0, pageSize: 10 });
  const [cardClicked, setCardClicked] = useState({ id: 0, name: "" });

  useEffect(() => {
    testService
      .getAllTests(paginate.pageIndex, paginate.pageSize)
      .then(onGetAllTestSuccess)
      .catch(onGetAllTestsError);

    _logger("Card Clicked Identifier State: ", cardClicked);
  }, [cardClicked]);

  const onGetAllTestSuccess = (response) => {
    setTests((prevTests) => {
      let setNewTests = { ...prevTests };
      setNewTests.allTests = response.item.pagedItems;
      return setNewTests;
    });
    toastr.success("Retrieved all tests!", "Success!");
  };
  const onGetAllTestsError = (error) => {
    toastr.error(error, "getTests Failed: ");
  };

  const onSearchSuccess = (response) => {
    setTests((prevTests) => {
      let setNewTests = { ...prevTests };
      setNewTests.allTests = response.item.pagedItems;
      return setNewTests;
    });
    toastr.success("Searched Tests!", "Success!");
  };
  const onSearchError = (error) => {
    toastr.error(error, "getSearchTests Failed: ");
  };

  const handleSubmit = (values) => {
    testService
      .getTestsByQuery(values.search, 0, 10)
      .then(onSearchSuccess)
      .catch(onSearchError);
  };
  const handleCardBtn = (event) => {
    const recordId = event.target.closest("[id]").getAttribute("id");
    const btnType = event.target.name;

    _logger("Type of Button: ", btnType);
    _logger("Id of Record: ", recordId);
    setCardClicked((prevState) => {
      let newState = { ...prevState };
      newState.id = recordId;
      newState.name = btnType;
      return newState;
    });
    if (btnType === "editBtn") {
      navigate(`/tests/update?id=${recordId}`);
    }
    if (btnType === "deleteBtn") {
      navigate(`/tests/delete?id=${recordId}`);
    }
  };

  return (
    <div className="body" style={testStyles.bodyStyle}>
      <div className="navBar" style={testStyles.navBarStyle}>
        <nav style={testStyles.navBarGradient}>
          <p style={testStyles.navBarContent}>Navbar Will Go Here</p>
        </nav>
      </div>
      <div className="searchContainer" style={testStyles.searchContainerStyle}>
        <Formik
          enableReinitialize={true}
          initialValues={{ search: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="search" style={testStyles.searchBoxLabelStyle}>
                Find Keyword
              </label>
              <Field
                type="text"
                id="search"
                name="search"
                placeholder="Search"
                style={testStyles.searchBoxStyle}
              />
              <ErrorMessage
                name="search"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <button
              type="submit"
              className="btn btn-success"
              style={testStyles.searchBtnStyle}
              id="search-btn"
            >
              Search
            </button>
          </Form>
        </Formik>
      </div>
      <div className="testCards" style={testStyles.testContainerStyle}>
        <RenderTestCards
          testsState={tests.allTests}
          onClickButton={handleCardBtn}
        ></RenderTestCards>
      </div>
    </div>
  );
};

export default Tests;
