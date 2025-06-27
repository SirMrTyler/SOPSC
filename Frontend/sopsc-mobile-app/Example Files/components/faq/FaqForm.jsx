import React from "react";
import lookUpService from "../../services/lookUpService";
import faqsService from "services/faqsService";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import debug from "sabio-debug";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation } from "react-router-dom";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import * as Yup from "yup";

const basicSchema = Yup.object().shape({
  question: Yup.string().min(1).max(255).required("Is Required"),
  answer: Yup.string().min(1).max(2000).required("Is Required"),
  category: Yup.number().required("Is Required"),
  sortOrder: Yup.number().required("Is Required"),
});

const _logger = debug.extend("NewFaqs");

function FaqForm() {
  const [options, setOptions] = useState({
    listOptions: [],
  });

  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: 1,
    sortOrder: "",
  });

  const location = useLocation();
  let payload = 1;
  if (location.state) {
    payload = location.state.payload;
  }
  _logger("payloadtest", payload);

  const updateOptions = (options) => {
    const select = document.getElementById("category");
    _logger(options);
    // Remove existing options
    while (select.options.length > 0) {
      select.remove(0);
    }
    _logger("testing", options);
    // Add new optins
    for (const option of options) {
      const el = document.createElement("option");
      el.textContent = option.name;
      el.value = option.id;
      _logger(option.id);
      select.appendChild(el);
    }
  };

  const onGetTypesSuccess = (response) => {
    var array = response.item.faqCategories;
    _logger("GetTypes Success", response.item.faqCategories);
    _logger("GetTypes Success", options.id);
    _logger("GetTypes Success", array);

    const mapObject = (aObject) => {
      _logger(aObject);
      _logger("mapping", aObject);
      return { id: aObject.id, name: aObject.name };
    };

    let mapListOption = array.map(mapObject);
    _logger(mapListOption);
    setOptions((prevState) => {
      const newOptions = {
        ...prevState,
      };

      newOptions.listOptions = mapListOption;
      _logger("testing", newOptions.listOptions);
      return newOptions;
    });
    _logger("testing", options);
    updateOptions(mapListOption);
  };

  const onGetTypesError = (response) => {
    _logger("GetTypes Error", response);
  };

  const onAddFaqsSuccess = (response) => {
    _logger("onAddFaqsSuccess", response);
    toastr.success("Successfully added Faq.");
  };

  const onAddFaqsError = (response) => {
    _logger("onAddFaqsError", response);
    toastr.error("Failed to add Faq.");
  };

  const onUpdateFaqSuccess = (response) => {
    _logger("onUpdateFaqSuccess", response);
    toastr.success("Successfully updated Faq.");
  };

  const onUpdateFaqError = (response) => {
    _logger("onUpdateFaqError", response);
    toastr.error("Failed to update Faq.");
  };

  const handleSubmit = (values) => {
    _logger("form values", values);
    _logger("form values", payload);
    const payload2 = {};
    payload2.Question = values.question;
    payload2.Answer = values.answer;
    payload2.CategoryId = values.category;
    payload2.SortOrder = values.sortOrder;

    if (payload === 1) {
      faqsService.add(payload2).then(onAddFaqsSuccess).catch(onAddFaqsError);
    } else if (payload.id) {
      _logger("payload number ", payload);
      var id = payload.id;
      var data = {};
      data.Question = values.question;
      data.Answer = values.answer;
      data.CategoryId = values.category;
      data.SortOrder = values.sortOrder;
      faqsService
        .updateFaq(id, data)
        .then(onUpdateFaqSuccess)
        .catch(onUpdateFaqError);
    }
  };

  useEffect(() => {
    _logger("useEffect firing");
    var tabletype = ["FAQCategories"];
    lookUpService
      .getTypes(tabletype)
      .then(onGetTypesSuccess)
      .catch(onGetTypesError);
    _logger("testing", options.listOptions);
    if (payload !== 1) {
      setForm((prevState) => {
        const f = { ...prevState };
        f.question = payload.question;
        f.answer = payload.answer;
        f.category = payload.category.id;
        f.sortOrder = payload.sortOrder;
        return f;
      });
    }
  }, []);

  return (
    <Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={form}
        onSubmit={handleSubmit}
        validationSchema={basicSchema}
      >
        <div>
          <Form>
            <div className="container">
              <div className="mx-auto">
                {payload === 1 && <h1 className="text-center">Add FAQ</h1>}
                {payload !== 1 && <h1 className="text-center">Update FAQ</h1>}
                <div className="form-group col-md-8">
                  <label htmlFor="question">Question</label>
                  <Field
                    type="text"
                    name="question"
                    className="form-control "
                  />
                  <ErrorMessage name="question" component="div" />
                </div>
                <div className="form-group col-md-8">
                  <label htmlFor="answer">Answer</label>
                  <Field type="text" name="answer" className="form-control" />
                  <ErrorMessage name="answer" component="div" />
                </div>
                <div className="form-group col-md-8">
                  <label htmlFor="answer">Sort Order</label>
                  <Field
                    type="text"
                    name="sortOrder"
                    className="form-control"
                  />
                  <ErrorMessage name="sortOrder" component="div" />
                </div>
                <div className="form-group col-md-8">
                  <label htmlFor="category">Category Select</label>
                  <Field
                    as="select"
                    className="form-control"
                    name="category"
                    id="category"
                  ></Field>
                </div>

                <button
                  type="submit"
                  className={`${
                    payload === 1 ? "btn btn-primary" : "btn btn-warning"
                  }`}
                >
                  {payload === 1 ? "Submit" : "Update"}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Formik>
    </Fragment>
  );
}

export default FaqForm;
