import React from 'react';
import PropTypes from 'prop-types';
import debug from "sabio-debug";
const _logger = debug.extend("RegData");

const AnalyticsView = ({ chartView, onChartViewChange }) => {

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedChartView = { ...chartView, [name]: checked };
    onChartViewChange(updatedChartView);
    _logger("event", event)
  };
  
  return (
    <div>
      <h3>Select your views</h3>
      <table className='form-check'>
        <tr>
          <td>
            <label>
              <input
                type="checkbox"
                name="lineChart"
                checked={chartView.lineChart}
                onChange={handleCheckboxChange}
              />
              Line Chart
            </label>
          </td>
          <td>
            <label>
              <input
                type="checkbox"
                name="barChart"
                checked={chartView.barChart}
                onChange={handleCheckboxChange}
              />
              Bar Chart
            </label>
          </td>
        </tr>
        <tr>
          <td>  
            <label>
              <input
                type="checkbox"
                name="usersByCountry"
                checked={chartView.usersByCountry}
                onChange={handleCheckboxChange}
              />
              Users by country
            </label>
          </td>
          <td>
            <label>
              <input
                type="checkbox"
                name="browsers"
                checked={chartView.browsers}
                onChange={handleCheckboxChange}
              />
              Browsers
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <input
                type="checkbox"
                name="mostViewPages"
                checked={chartView.mostViewPages}
                onChange={handleCheckboxChange}
              />
              Most Viewed Pages
            </label>
          </td>
          <td>
            <label>
              <input
                type="checkbox"
                name="trafficChart"
                checked={chartView.trafficChart}
                onChange={handleCheckboxChange}
              />
              Traffic Chart
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <input
                type="checkbox"
                name="operatingChart"
                checked={chartView.operatingChart}
                onChange={handleCheckboxChange}
              />
              Operating Machines
            </label>
            </td>
            <td>
            <label>
              <input
                type="checkbox"
                name="worldMap"
                checked={chartView.worldMap}
                onChange={handleCheckboxChange}
              />
              Map
            </label>
          </td>
        </tr>
      </table>
    </div>
  );
};

AnalyticsView.propTypes = {
  chartView: PropTypes.shape({
    lineChart: PropTypes.bool.isRequired,
    barChart: PropTypes.bool.isRequired,
    usersByCountry: PropTypes.bool.isRequired,
    browsers: PropTypes.bool.isRequired,
    mostViewPages: PropTypes.bool.isRequired,
    trafficChart: PropTypes.bool.isRequired,
    operatingChart: PropTypes.bool.isRequired,
    worldMap: PropTypes.bool.isRequired,
  }).isRequired,
  onChartViewChange: PropTypes.func.isRequired
};

export default AnalyticsView;