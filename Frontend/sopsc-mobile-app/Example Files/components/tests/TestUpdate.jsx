import React from "react";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import testsSchema from "schemas/testsSchemas";
import toastr from "toastr";
import testStyles from "./TestStyles";
import debug from "sabio-debug";
import testService from "services/testService";
import lookUpService from "services/lookUpService";

const _logger = debug.extend("Tests:TestUpdate");
const validationSchema = testsSchema.testUpdateSchema();
const initialFormValues = {
  name: "",
  description: "",
  statusId: 0,
  testTypeId: 0,
};
const TestUpdate = () => {
  const idToUpdate = parseInt(
    new URLSearchParams(window.location.search).get("id")
  );
  const [testTypeOptions, setTestTypeOptions] = useState([]);
  const [statusTypeOptions, setStatusTypeOptions] = useState([]);

  useEffect(() => {
    fetchTestTypeOptions();
    fetchStatusTypeOptions();
    _logger(
      "TestType Options: ",
      testTypeOptions,
      "StatusType Options: ",
      statusTypeOptions
    );
  }, []);

  const fetchTestTypeOptions = () => {
    let tableType = ["TestTypes"];
    lookUpService
      .getTypes(tableType)
      .then(fetchTestTypeSuccess)
      .catch(fetchLookUpTypeError);
  };
  const fetchStatusTypeOptions = () => {
    let tableType = ["StatusTypes"];
    lookUpService
      .getTypes(tableType)
      .then(fetchStatusTypeSuccess)
      .catch(fetchLookUpTypeError);
  };

  const fetchTestTypeSuccess = (response) => {
    _logger("TestTypes: ", response);
    setTestTypeOptions(response.item.testTypes);
  };
  const fetchStatusTypeSuccess = (response) => {
    _logger("StatusTypes: ", response);
    setStatusTypeOptions(response.item.statusTypes);
  };
  const fetchLookUpTypeError = (error) => {
    _logger("fetchType Failed: ", error);
  };

  const onUpdateSuccess = () => {
    toastr.success(`Test Updated`, "Success!");
  };

  const onUpdateError = (error) => {
    toastr.error(`Failed to update test ${error}`, "Failure...");
  };

  const handleSubmit = (values) => {
    const newValues = { ...values };
    newValues.statusId = parseInt(values.statusId);
    newValues.testTypeId = parseInt(values.testTypeId);

    testService
      .updateTest(idToUpdate, newValues)
      .then(onUpdateSuccess)
      .catch(onUpdateError);
  };

  const mapLookUps = (lookUps) => {
    return lookUps.map((lookUp) => {
      return (
        <option key={lookUp.id} value={lookUp.id}>
          {lookUp.name}
        </option>
      );
    });
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
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <label htmlFor="update" style={testStyles.searchBoxLabelStyle}>
              Update Test
            </label>
            <div className="form-group">
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Test Name"
                style={testStyles.searchBoxStyle}
              />
              <Field
                type="text"
                id="description"
                name="description"
                placeholder="Test Description"
                style={testStyles.searchBoxStyle}
              />
              <Field
                as="select"
                id="statusId"
                title="statusIds"
                style={testStyles.searchBoxStyle}
              >
                <option value={0}>Select Status Option</option>
                {mapLookUps(statusTypeOptions)}
              </Field>
              <Field
                as="select"
                id="testTypeId"
                title="testTypes"
                style={testStyles.searchBoxStyle}
              >
                <option value={0}>Select TestType Option</option>
                {mapLookUps(testTypeOptions)}
              </Field>
              <ErrorMessage
                name="search"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <button
              type="submit"
              className="btn btn-success"
              id="submitBtn"
              style={testStyles.searchBtnStyle}
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default TestUpdate;
