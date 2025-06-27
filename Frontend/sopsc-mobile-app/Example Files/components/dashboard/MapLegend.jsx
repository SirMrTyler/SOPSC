import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Legend = () => {
  const getTextColorClass = (color) => {
    switch (color) {
      case 'green':
        return 'text-success';
      case 'yellow':
        return 'text-warning';
      case 'red':
        return 'text-danger';
      default:
        return '';
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="mr-3">
        <span className={`badge badge-success ${getTextColorClass('green')}`}>High Sessions</span>
      </div>
      <div className="mr-3">
        <span className={`badge badge-warning ${getTextColorClass('yellow')}`}>Medium Sessions</span>
      </div>
      <div>
        <span className={`badge badge-danger ${getTextColorClass('red')}`}>Low Sessions</span>
      </div>
    </div>
  );
};

export default Legend;