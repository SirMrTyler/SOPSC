import React, {useState} from "react";
import toastr from "toastr";
import debug from "sabio-debug";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as lectureService from "../../services/lectureService";
import LectureSchema from "./lectureSchema"

function LectureForm() {
    const [formData] = useState({
        courseId: "",
        title: "",
        description: "",
        duration: "",
        imageUrl: "",
        fileUrl: "",
        sortOrder: ""
        });

        const _logger = debug.extend("Login");
_logger("Something important somewhere in a function within your component")

          const handleSubmit = (values) => {
            lectureService.Add(values)
            .then(onLectureAddSuccess).catch(onLectureAddError)
          };
          const onLectureAddSuccess = (response) => {
            _logger(response)
            toastr.success("Lecture Added")
          };
          const onLectureAddError = (err) => {
            _logger(err)
            toastr.error("Lecture Not Added")
          };
        
  return (
    <Formik
    enableReinitialize={true}
    initialValues={formData}
    onSubmit={handleSubmit}
    validationSchema={LectureSchema}
    >
    <div className="row">
      <div className="col-5 p-5">
        <Form>
          <div className="mb-3">
            <label className="form-label">CourseId</label>
            <Field type="number" name="courseId" className="form-control"
            />
            <ErrorMessage
            name="courseId"
            component="div"
            className="has-error"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <Field type="text" name="title" className="form-control" 
            />
            <ErrorMessage
            name="title"
            component="div"
            className="has-error"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <Field type="text" name="description" className="form-control" 
            />
            <ErrorMessage
            name="description"
            component="div"
            className="has-error"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Duration</label>
            <Field type="text" name="duration" className="form-control" 
            />
            <ErrorMessage
            name="duration"
            component="div"
            className="has-error"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ImageUrl</label>
            <Field type="text" name="imageUrl" className="form-control" 
            />
            <ErrorMessage
            name="imageUrl"
            component="div"
            className="has-error"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">FileUrl</label>
            <Field type="text" name="fileUrl" className="form-control" 
            />
            <ErrorMessage
            name="fileUrl"
            component="div"
            className="has-error"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">SortOrder</label>
            <Field type="number" name="sortOrder" className="form-control" 
            />
            <ErrorMessage
            name="sortOrder"
            component="div"
            className="has-error"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Add Lecture
          </button>
        </Form>
      </div>
    </div>
    </Formik>
  );
};

export default LectureForm;