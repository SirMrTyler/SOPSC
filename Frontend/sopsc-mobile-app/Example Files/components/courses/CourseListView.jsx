import React, { useState, useEffect, useCallback } from "react";
import "./course.css";
import debug from "sabio-debug";
import CourseCard from "../courses/CourseCard";
import courseService from "../../services/courseService";
import { Button, Col, FormControl } from "react-bootstrap";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function CourseListView() {
  const _logger = debug.extend("CourseListView");
  const [pageData, setPageData] = useState({
    courses: [],
    coursesMapped: [],
  });
  const [pageValue, setPageValue] = useState({
    inputValue: "",
    pageIndex: 1,
    pageSize: 6,
    totalCount: 0,
    query: "",
  });

  const onCardEditClicked = useCallback((id) => {
    _logger.log(id);
  });
  const mapCourse = (singleCourse) => {
    _logger(singleCourse);
    return (
      <CourseCard
        oneCourse={singleCourse}
        onCardEditClicked={onCardEditClicked}
        key={"ListA-" + singleCourse.id}
      />
    );
  };
  useEffect(() => {
    courseService
      .getCourses(pageValue.pageIndex, pageValue.pageSize, pageValue.query)
      .then(onGetCoursesSuccess)
      .catch(onGetCoursesError);
  }, [pageValue.pageIndex, pageValue.query]);
  const onGetCoursesSuccess = (response) => {
    _logger(response);
    let newCourses = response.item.pagedItems;
    _logger(newCourses);
    setPageValue((prevState) => {
      return {
        ...prevState,
        totalCount: response.item.totalCount,
      };
    });
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.courses = newCourses;
      pd.coursesMapped = newCourses.map(mapCourse);
      return pd;
    });
  };
  const onGetCoursesError = (err) => {
    _logger(err);
    toastr.error("Courses not found. Please try again.");
  };
  const handlePageChange = (page) => {
    setPageValue((prevState) => {
      return {
        ...prevState,
        pageIndex: page,
      };
    });
  };
  const handleSearch = () => {
    _logger(pageValue);
    setPageValue((prevState) => {
      _logger(prevState);
      pageValue.pageIndex = 1;
      return {
        ...prevState,
        query: pageValue.inputValue,
        pageValue: pageValue,
      };
    });
  };
  return (
    <React.Fragment>
      <h1>Courses</h1>
      <div className="container">
        <div className="col searchFieldButton">
          <FormControl
            type="text"
            placeholder="Search By Title or Subject"
            value={pageValue.inputValue}
            onChange={(e) =>
              setPageValue((prevState) => {
                return {
                  ...prevState,
                  inputValue: e.target.value,
                };
              })
            }
          />
          <Button
            className="col my-2 searchCourseButton"
            variant="success"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
      <Col className="col mx-center">{pageData.coursesMapped}</Col>
      <Pagination
        className="pb-3 pt-3"
        showTotal={(total, range) =>
          `Showing ${range[0]}-${range[1]} of ${total}`
        }
        onChange={handlePageChange}
        current={pageValue.pageIndex}
        total={pageValue.totalCount}
        pageSize={pageValue.pageSize}
      />
    </React.Fragment>
  );
}
export default CourseListView;
