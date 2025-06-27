import React from "react";
import debug from "sabio-debug";
import testService from "services/testService";

const _logger = debug.extend("Tests:Delete");

const TestDelete = () => {
  const idToDelete = parseInt(
    new URLSearchParams(window.location.search).get("id")
  );

  _logger(idToDelete);

  const handleDelete = () => {
    testService
      .deleteTest(idToDelete)
      .then(onDeleteSuccess)
      .catch(onDeleteError);
  };

  const onDeleteSuccess = (response) => {
    _logger(response);
  };

  const onDeleteError = (error) => {
    _logger(error);
  };
  return (
    <div className="body">
      Deleted Test
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TestDelete;
