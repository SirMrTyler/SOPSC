import React from "react";
import testStyles from "./TestStyles";
import PropTypes from "prop-types";

const RenderTestCards = (props) => {
  const mapQuestions = (questionsArr) => {
    return questionsArr.map((question, index) => {
      return (
        <div
          className="card-text"
          name="question"
          key={question.id}
          id={question.id}
          style={testStyles.cardTextStyle}
        >
          <h6>Question {index + 1} Information:</h6>- Hint: {question.helpText}
          <br />- Selection Required: {question.isRequired ? "Yes" : "No"}
          <br />- Multiple Selctions Allowed:{" "}
          {question.isMultipleAllowed ? "Yes" : "No"}
          <br />
          <br />
          {question.status.name.toUpperCase()}
          <br />
          <br />
          Q: {question.question}
          {mapAnswers(question.answerOptions)}
        </div>
      );
    });
  };

  const mapAnswers = (answersArr) => {
    return answersArr.map((answer, index) => {
      return (
        <p
          className="card-text"
          name="answerOption"
          key={index}
          id={answer.id}
          style={testStyles.cardTextStyle}
        >
          {answer.value}. {answer.text}
          <br />- Is Correct: {answer.isCorrect ? "Yes" : "No"}
          <br />- Additional Info: {answer.additionalInfo}
        </p>
      );
    });
  };

  const renderTestsToCards = (testsArr) => {
    let testPath = testsArr;

    return testPath.map((test) => {
      let createdByPath = test.createdBy;

      return (
        <div
          className="card"
          key={test.id}
          id={test.id}
          style={testStyles.cardStyle}
        >
          <div className="card-body">
            <h3 className="card-title" name="testName">
              Test Name: {test.name}
            </h3>
            <h6
              className="card-subtitle mb-2 text-body-secondary"
              name="testId"
            >
              Test Id: {test.id}
            </h6>
            <br />
            <h5>Test Description:</h5>
            <p className="card-text" name="testInfo">
              - Type: {test.testType.name}
              <br />- Validity Status: {test.status.name}
              <br />
              - Summary:
              <br />
              {test.description}
            </p>
            <div className="question-container" name="testQuestions">
              <h5>Test Questions:</h5>
              {mapQuestions(test.questions)}
            </div>
            <button
              type="button"
              className="btn btn-success"
              name="editBtn"
              style={testStyles.editBtnStyle}
              onClick={props.onClickButton}
            >
              Edit Test
            </button>
            <button
              type="button"
              className="btn btn-danger"
              name="deleteBtn"
              style={testStyles.deleteBtnStyle}
              onClick={props.onClickButton}
            >
              Delete Test
            </button>
            <button
              type="button"
              className="btn btn-primary"
              name="takeTestBtn"
              style={testStyles.takeTestBtnStyle}
              onClick={props.onClickButton}
            >
              Take Test
            </button>
            <br></br>
            <br></br>
            <h6
              className="card-subtitle mb-2 text-body-secondary"
              name="createdBy"
            >
              Creator: {createdByPath.firstName} {createdByPath.mi}.{" "}
              {createdByPath.lastName}, Creator Id: {createdByPath.id}
            </h6>
          </div>
        </div>
      );
    });
  };

  return renderTestsToCards(props.testsState);
};

RenderTestCards.propTypes = {
  testsState: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      questions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          type: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired,
          question: PropTypes.string.isRequired,
          helpText: PropTypes.string.isRequired,
          isRequired: PropTypes.bool.isRequired,
          isMultipleAllowed: PropTypes.bool.isRequired,
          testId: PropTypes.number.isRequired,
          status: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired,
          sortOrder: PropTypes.number.isRequired,
          answerOptions: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              questionId: PropTypes.number.isRequired,
              text: PropTypes.string.isRequired,
              additionalInfo: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired,
              isCorrect: PropTypes.bool.isRequired,
            }).isRequired
          ).isRequired,
          statusId: PropTypes.number.isRequired,
        })
      ).isRequired,
      dateCreated: PropTypes.string.isRequired,
      dateModified: PropTypes.string.isRequired,
      createdBy: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  onClickButton: PropTypes.func.isRequired,
};

export default RenderTestCards;
