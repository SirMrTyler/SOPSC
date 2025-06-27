import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toastr from "toastr";
import testService from "../services/testService";
import debug from "sabio-debug";
import testsSchema from "schemas/testsSchemas";

const _logger = debug.extend("TestQuery");
const validationSchema = testsSchema.testQuerySchema();

const TestQuery = (props) => {
  const [query] = useState({ queryString: "" });
  const [paginate] = useState({ pageIndex: 0, pageSize: 10 });
  useEffect(() => {
    _logger("Imported Props: ", props);
  }, []);

  const onSubmit = () => {
    testService
      .getTestsByQuery(query, paginate.pageIndex, paginate.pageSize)
      .then(onSearchSuccess)
      .catch(onSearchError);
  };

  const onSearchSuccess = () => {
    toastr.success("Search Tests Complete!", "Success!");
  };

  const onSearchError = (error) => {
    toastr.error(`Search failure: ${error}`, "Failure");
  };

  return (
    <Formik
      initialValues={query}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="form-group">
          <label htmlFor="search">Search</label>
          <Field type="text" id="search" name="search" placeholder="Search" />
          <ErrorMessage
            name="search"
            component="div"
            className="invalid-feedback"
          />
        </div>
      </Form>
    </Formik>
  );
};

export default TestQuery;
