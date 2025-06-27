import React, { useState, useEffect } from "react"
import "../blogs/blogs.css"
import blogsService from "services/blogsService"
import lookUpService from "services/lookUpService"
import logger from "sabio-debug"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import * as DOMPurify from "dompurify"
import { Formik, Form, Field, ErrorMessage } from "formik"
import PropTypes from "prop-types"
import { Card } from "react-bootstrap"
import validBlogSchema from "schemas/validBlogSchema"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogsForm = (props) => {
  const _logger = logger.extend("BlogsForm")

  const [blogTypes, setBlogTypes] = useState({ mappedTypes: [] })

  const blogInit = {
    blogTypeId: "",
    authorId: props.currentUser.id,
    title: "",
    subject: "",
    content: "",
    isPublished: false,
    imageUrl: ""
  }

  useEffect(() => {
    lookUpService.getTypes(["BlogTypes"])
      .then(getTypesSuccess)
      .catch(getTypesError)
  }, [])

  const getTypesSuccess = (response) => {
    setBlogTypes((prevState) => {
      const ps = { ...prevState }
      ps.mappedTypes = response.item.blogTypes.map(mapOptions)
      return ps
    })
    _logger("GETTYPES SUCCESS", response)
  }

  const getTypesError = (error) => {
    _logger("GETTYPES ERROR", error)
  }

  const mapOptions = (element, index) => (
    <option key={index} value={element.id}>{element.name}</option>
  )

  const onSubmit = (values) => {
    values.content = DOMPurify.sanitize(values.content, { USE_PROFILES: { html: false } })
    _logger("VALUES ONSUBMIT", values)
    blogsService.add(values)
      .then(blogServiceAddSuccess)
      .catch(blogServiceAddError)
  }

  const blogServiceAddSuccess = (response) => {
    toast.success("Blog created.");
    _logger("ADD RESPONSE", response)
  }

  const blogServiceAddError = (err) => {
    toast.error("Something went wrong. Your blog was not added.");
    _logger("ADD ERROR", err)
  }




  return (
    <>
      <div className="mt-3">
        <div className="container-fluid">
          <Formik
            enableReinitialize={true}
            initialValues={blogInit}
            validationSchema={validBlogSchema}
            onSubmit={onSubmit}

          >
            {({ values, setFieldValue }) => (

              <div className="row">

                <Form className="d-inline-flex ms-13">
                  <div className="col-4 mx-13 px-3 ms-3">

                    <div className="form-group formik-text py-1">
                      <label className="formik-text" htmlFor="blogTypeId">Blog Type</label>
                      <Field className="form-control blogs-formik-focus" type="number" as="select" name="blogTypeId" >
                        <option value={0}>Please select a blog type...</option>
                        {blogTypes.mappedTypes}</Field>
                      <ErrorMessage className=" text-warning" name="blogTypeId" component="div" />
                    </div>

                    <div className="form-group formik-text py-1">
                      <label htmlFor="title">Blog Title</label>
                      <Field className="form-control blogs-formik-focus" type="title" name="title" />
                      <ErrorMessage className=" text-warning" name="title" component="div" />
                    </div>

                    <div className="form-group formik-text py-1">
                      <label htmlFor="subject">Blog Subject</label>
                      <Field className="form-control blogs-formik-focus" type="subject" name="subject" />
                      <ErrorMessage className=" text-warning" name="subject" component="div" />
                    </div>

                    <div className="form-group formik-text py-1">
                      <label htmlFor="content">Blog Content</label>
                      <Field className="form-control blogs-formik-focus text-warning " type="content" name="content" >
                        {({ field }) => (
                          <CKEditor
                            name="content"
                            editor={ClassicEditor}
                            data={field.value}
                            onChange={(e, editor) => {
                              const data = editor.getData()
                              setFieldValue("content", data)
                              _logger("Change.", { e, editor, data })
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="content" component="div" className="text-warning" />
                    </div>

                    <div className="form-group py-1">
                      <label htmlFor="imageUrl">Image Url</label>
                      <Field className="form-control blogs-formik-focus" type="imageUrl" name="imageUrl" c />
                      <ErrorMessage className="text-warning" name="imageUrl" component="div" />
                    </div>

                    <div className="form-group py-1">
                      <label htmlFor="isPublished">Publish</label>
                      <Field type="checkbox" name="isPublished" />
                      <ErrorMessage className="text-warning" name="isPublished" component="div" />
                    </div>

                    <button className="btn btn-dark" type="submit" >
                      Submit
                    </button>

                  </div>

                  <div className="col-4 py-4 ">
                    <Card className="blogs-box-gradient">
                      <Card.Img
                        className="mx-auto pt-4 blogs-card-img"
                        variant="top"
                        src={values.imageUrl}
                        alt="..." />
                      <Card.Header>
                        <h1 className="display-4 blogs-card-header">{values.title}</h1>
                      </Card.Header>
                      <Card.Body>
                        <h2 className="display-5">{values.subject}</h2>
                        <Card.Text >{DOMPurify.sanitize(values.content, { USE_PROFILES: { html: false } })}</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>

                </Form>
              </div>
            )}
          </Formik>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

BlogsForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default BlogsForm