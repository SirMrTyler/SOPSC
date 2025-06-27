import React from "react";
import "./course.css";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { Card, Button } from "react-bootstrap";

const _logger = debug.extend("CourseCard");

function CourseCard(props) {
  _logger(props.oneCourse);
  const aCourse = props.oneCourse;
  const mapLectureType = (singleCourse) => {
    const lectureTypeForCard = singleCourse.name;
    _logger(lectureTypeForCard);
    return lectureTypeForCard;
  };
  const lectureTypeMapped = props.oneCourse.lectureType.map(mapLectureType);
  _logger(lectureTypeMapped);
  const onCourseClicked = (e) => {
    _logger(e);
  };
  return (
    <Card className="mb-2 card-hover mx-auto">
      <Card className="courseCard mx-center">
        <Card.Img
          className="img-fluid"
          variant="top"
          src={aCourse.coverImageUrl}
        />
        <Card.Body className="mx-auto">
          <Card.Title>Title: {aCourse.title}</Card.Title>
          <Card.Text>Subject: {aCourse.subject}</Card.Text>
          <Card.Text>Instructor: {aCourse.instructor.lastName}</Card.Text>
          <Card.Text>Lecture Type: {lectureTypeMapped}</Card.Text>
          <Button variant="primary" onClick={onCourseClicked}>
            Course Details
          </Button>
        </Card.Body>
      </Card>
    </Card>
  );
}

CourseCard.propTypes = {
  oneCourse: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    coverImageUrl: PropTypes.string.isRequired,
    instructor: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
    lectureType: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string]))
      .isRequired,
  }).isRequired,
};
export default CourseCard;
