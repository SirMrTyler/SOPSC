import React from "react";
import { Fragment, useState, useEffect } from "react";
import { Col, Row, Card, Table, ListGroup, Button, Container } from "react-bootstrap";
import { RefreshCw } from "react-feather";
import ApexCharts from "./ApexCharts";
import MostViewPages from "./MostViewPages";
import Browsers from "./Browsers";
import Icon from "@mdi/react";
import { mdiSquareRounded } from "@mdi/js";
import AnalyticsView from "./AnalyticsViewComponent";
import {
  SessionChartOptions,
  ActiveUserChartOptions,
  TrafficChannelChartSeries,
  TrafficChannelChartOptions,
  OperatingSystemChartSeries,
  OperatingSystemChartOptions,
} from "components/dashboard/analytics/ChartData";
import debug from "sabio-debug";
import * as GoogleAnalytics from "../../../services/analyticsService";
import "react-datepicker/dist/react-datepicker.css";
import {Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import analyticsDatePickSchema from "services/analyticsDatePickSchema";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
  ZoomableGroup
} from 'react-simple-maps';
import Legend from "../MapLegend";
import toastr from "toastr";
const _logger = debug.extend("GData");

const Analytics = () => {
	const today = new Date(Date.now());
	const oneWeekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
  const[ dates, setDates] = useState({
    startDate: oneWeekAgo.toISOString().substring(0, 10),
    endDate: today.toISOString().substring(0, 10),
  });

  const viewsPayload = {
    startDate: dates.startDate,
    endDate: dates.endDate,
    metrics:[
      {expression:"ga:avgSessionDuration"}, 
      {expression:"ga:users"}]
      ,dimensions:[{name:"ga:date"}
    ]
  };

  const locationsPayload ={
    startDate: dates.startDate,
    endDate: dates.endDate,
    metrics: [{expression: "ga:sessions"}],
    dimensions: [
      { name: "ga:city" },
      { name: "ga:latitude" },
      { name: "ga:longitude" },
      { name: "ga:country"},]
  };

  const browserPayload = {
    startDate: dates.startDate,
    endDate: dates.endDate,
    metrics:[
        {expression:"ga:users"}
    ],
    dimensions:[
        {name:"ga:browser"}
    ]};

  const uniqueUsersPayload = {
    startDate: dates.startDate,
    endDate: dates.endDate,
    metrics:[
      {expression:"ga:sessions"},
      {expression:"ga:users"}
    ],
    dimensions:[
      {name:"ga:date"}
    ]};

  const [userCount, setUserCount] = useState({
    totalSessions:0,
    uniqueUsers:0,
  });
  

  const [dateLabel, setDateLabel] = useState([])
  const [usersByCountry, setUsersByCountry] = useState([])
  const [browsersStatistics, setBrowsersStatistics] = useState([]);

  const [barData, setBarData] = useState({
    names: ["Total Sessions", "Unique Users"],
    data: [
      {
        name: "Total Sessions",
        data: []
      },
      {
        name: "Unique Users",
        data: []
      }],
    dateLabel: []
  });

  const [lineData, setLineData] = useState([
    {
      name:"Avg Duration",
      data:[],
      colors:["#754ffe"]
    },
    {
      name:"Users",
      data:[],
    }
  ]);

  const [updatedSessionOptions, setUpdatedSessionOptions] = useState ({
    ...SessionChartOptions,
    xaxis: {
        ...SessionChartOptions.xaxis,
        categories: dateLabel,
    },
  });

  const [updatedActiveUserOptions, setUpdatedActiveUserOptions]= useState({
    ...ActiveUserChartOptions,
    xaxis: {
        ...ActiveUserChartOptions.xaxis,
        x: dateLabel,
    },
  });

  const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
  const [markers, setMarkers ] = useState([]);

  const runAnalyticServices = () => {
    setHasDataMapped({
      line: false,
      bar: false,
      location: false,
    })
    setDateLabel([]);
    setLineData([
      {
        name: "Avg Duration",
        data: [],
        colors: ["#754ffe"]
      },
      {
        name: "Users",
        data: [],
      }
    ]);
    setBarData({
      names: ["Total Sessions", "Unique Users"],
        data: [
          {
            name: "Total Sessions",
            data: []
          },
          {
            name: "Unique Users",
            data: []
          }],
          dateLabel: []
    });
    setUserCount({
      totalSessions:0,
      uniqueUsers:0,
    })
    setBrowsersStatistics([]);
    setUsersByCountry([]);
		GoogleAnalytics
		.getAnalytics(viewsPayload)
		.then(onGetViewsSuccess)
		.catch(onGetViewsError);
    GoogleAnalytics
    .getAnalytics(locationsPayload)
    .then(onGetLocationsSuccess)
    .catch(onGetLocationsError);  
    GoogleAnalytics
    .getAnalytics(browserPayload)
    .then(onGetBrowsersSuccess)
    .catch(onGetBrowsersError)
    GoogleAnalytics
    .getAnalytics(uniqueUsersPayload)
    .then(onGetUniqueUsersSuccess)
    .catch(onGetUniqueUsersError)
  };

  const calculateTotalSessions = () => {
    let total = 0;
    Object.values(usersByCountry).forEach(countryData => {
        total += countryData.sessions;
    });
    return total;
  };

  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [settingDisplay, setSettingDisplay ] = useState(false)
  const [calendarView, setcalendarView ] = useState(false)

  const [chartView, setChartView ] = useState({
    lineChart: true,
    barChart: true,
    usersByCountry:false,
    browsers:false,
    mostViewPages: false,
    trafficChart: false,
    operatingChart: false,
    worldMap: true,
  });

  const [hasDateChanged, setHasDateChanged] = useState(false)
  const [zoom, setZoom] = useState(1);
  const baseRadius = 10;

  const getCircleRadius = (baseRadius, zoom) => {
    return baseRadius / zoom;
  };

  const handleMoveEnd = (event) => {
    const newZoom = event.zoom;
    setZoom(newZoom);
  };

  const [hasDataMapped, setHasDataMapped ] = useState(
    {
    line: false,
    location: false,
    bar: false,
  });

  useEffect(() => {
    runAnalyticServices();
  }, []);

  useEffect(() => {
    if (hasDateChanged) {
      setDateLabel([]);
      setLineData({
        datasets: [
          {
            name:"Avg Duration",
            data:[],
            colors:["#754ffe"]
          },
        ],
      });
      setBrowsersStatistics([]);
      setUsersByCountry([]);
      setBarData({
        names: ["Total Sessions", "Unique Users"],
        data: [
          {
            name: "Total Sessions",
            data: []
          },
          {
            name: "Unique Users",
            data: []
          }
        ],
        dateLabel: []
      });
      setUserCount({
        totalSessions:0,
        uniqueUsers:0,
      });
      
      setUpdatedSessionOptions((prevOptions) => {
        const newOptions = {
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: dateLabel,
          },
        };
        return newOptions;
      });
      setUpdatedActiveUserOptions((prevOptions) => {
        const newOptions = {
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: dateLabel,
          },
        };
        return newOptions;
      });

      runAnalyticServices();
    };
  }, [dates, hasDateChanged]);

  const mapLineData = (data) => {
    const date = data.dimensions[0];
    const avgSessionDurationSeconds = parseFloat(data.metrics[0].values[0]);
    const avgSessionDurationMinutes = parseFloat((avgSessionDurationSeconds / 60).toFixed(2));
    const userValues = parseInt(data.metrics[0].values[1]);
    
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const dateLabel = `${year}-${month}-${day}`;

    return {
      dateLabel,
      avgSessionDurationMinutes,
      userValues
    };
  };

  const onGetViewsSuccess = (response) => {
    _logger("response",response)
    const responseData = response.item.reports[0].data.rows;
    const newData = responseData.map(mapLineData);
  
    setDateLabel((prevState) => {
      const newDates = newData.map((data) => data.dateLabel);
      return [...prevState, ...newDates];
    });
  
    setLineData((prevState) => {
      const newLineData = JSON.parse(JSON.stringify(prevState));
      newData.forEach((data) => {
        newLineData[0].data.push(data.avgSessionDurationMinutes);
        newLineData[1].data.push(data.userValues);
      });
      return newLineData;
    });

    setHasDateChanged(false);
    setUpdatedSessionOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: newData.map((data) => data.dateLabel),
      },
    }));
  };
  
	const onGetViewsError = (response) => {
		_logger("error",response);
    toastr.error("Views Data Retrieval", "Failed")
	};

  const mapLocationData = (location) => {
    const city = location.dimensions[0];
    const lat = parseFloat(location.dimensions[1]);
    const long = parseFloat(location.dimensions[2]);
    const country = location.dimensions[3];
    const sessions = parseInt(location.metrics[0].values[0]);

    if(city !== "(not set)"){
     return{
      name:city,
      country: country,
      coordinates:[long,lat],
      markerOffset: 30,
      sessions:sessions,}      
    }else{
      return null;
    }
  };

  const getFillColor = (sessions) => {
    if (sessions > 10) {
      return 'green';
    } else if (sessions > 5) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  const onGetLocationsSuccess = (response) => {
    const responseData = response.item.reports[0].data.rows;
    const newMarkers = responseData.map(mapLocationData);
    setMarkers((prevState) => [...prevState, ...newMarkers]);

    let newUsersByCountry = { ...usersByCountry };
    newMarkers.forEach(marker => {
        if (marker) {
            const country = marker.country;
            const sessions = marker.sessions;
            if (newUsersByCountry[country]) {
                newUsersByCountry[country].sessions += sessions;
            } else {
                newUsersByCountry[country] = { sessions: sessions };
            }
        }
    });
    setUsersByCountry(newUsersByCountry);
    setHasDataMapped((prevState)=>{
      const mappedData = {...prevState};
      mappedData.location = true;
      return mappedData;
    });
  };

  const onGetLocationsError = (response) =>{
    _logger("maps error",response)
    toastr.error("Location Data Retrieval", "Failed")
  };

  const onGetBrowsersSuccess = (response) => {
    const responseData = response.item.reports[0].data.rows;

    let totalUsers = 0;
    responseData.forEach(row => {
        totalUsers += parseInt(row.metrics[0].values[0]);
    });

    const browsersStats = responseData.map(row => {
        const browser = row.dimensions[0];
        const users = parseInt(row.metrics[0].values[0]);
        const percent = (users / totalUsers) * 100;

        return {
            browser: browser,
            percent: parseFloat(percent.toFixed(2))
        };
    });
    setBrowsersStatistics(browsersStats);
  };

  const onGetBrowsersError = (response) =>{
    _logger("browser error", response);
    toastr.error("Browser Data Retrieval", "Failed")
  };

  const mapUniqueUsers = (data) => {
    const date = data.dimensions[0];
    const sessions = parseInt(data.metrics[0].values[0]);
    const uniqueUsers = parseInt(data.metrics[0].values[1]);
  
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const dateLabel = `${year}-${month}-${day}`;

    return {
      dateLabel,
      sessions,
      uniqueUsers
    };
  };

  const onGetUniqueUsersSuccess = (response) => {
    const responseData = response.item.reports[0].data.rows;
    const newUsers = responseData.map(mapUniqueUsers);
  
    setBarData((prevState) => {
      const newBarData = { ...prevState };
      newUsers.forEach((user) => {
        newBarData.dateLabel.push(user.dateLabel);
        newBarData.data[0].data.push(user.sessions);
        newBarData.data[1].data.push(user.uniqueUsers);
      });
      return newBarData;
    });
  
    setUserCount((prevState) => {
      const newUserData = { ...prevState };
      newUsers.forEach((user) => {
        newUserData.totalSessions += user.sessions;
        newUserData.uniqueUsers += user.uniqueUsers;
      });
      return newUserData;
    });

    setHasDateChanged(false);
    setUpdatedActiveUserOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: newUsers.map((user) => user.dateLabel),
      },
    }));
  };
  
  const onGetUniqueUsersError = (response) =>{
    _logger("uniquer users", response)
    toastr.error("Unique Users Data Retrieval", "Failed")
  };

  const toggleView = () => {
    setSettingDisplay(prevState => !prevState)
  };
  
  const toggleCalendar = () => {
    setcalendarView(prevState => !prevState)
  };

  const handleChartViewChange = (updatedChartView) => {
    setChartView(updatedChartView);
    _logger("from handle", updatedChartView)
  };

  const onDatePick = (values) => {
    setDates((prevState) => ({
      ...prevState,
      startDate: new Date(values.startDate).toISOString().substring(0, 10),
      endDate: new Date(values.endDate).toISOString().substring(0, 10),
    }));
    setHasDateChanged(true);
  };

  return (
    <Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Analytics</h1>
            </div>
            <div className="d-flex">
              <div className="input-group me-3">
                <button 
                  onClick={toggleCalendar} 
                  className="input-group-text " 
                  id="basic-addon2">
                  <i className="fe fe-calendar"></i>
                </button>
                  {calendarView 
                  && 
                  <Formik
                    enableReinitialize={true}
                    initialValues={dates}
                    onSubmit={onDatePick}
                    validationSchema={analyticsDatePickSchema}>
                    <FormikForm>
                      <Container>
                        <Row>
                          <Col className="px-1">
                            <Field
                              name="startDate"
                              className="form-control"
                              type="date"
                            ></Field>
                            <ErrorMessage
                              className="analytics-date-error"
                              name="startDate"
                              component="div"
                            />
                          </Col>
                          <Col className="px-1">
                            <Field
                              name="endDate"
                              className="form-control"
                              type="date"
                            ></Field>
                            <ErrorMessage
                              className="analytics-date-error"
                              name="endDate"
                              component="div"
                            />
                          </Col>
                          <Col className="px-1">
                            <Button
                              type="submit"
                              variant="primary"
                              className="shadow-sm"
                            >
                              <RefreshCw className="feather" />
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </FormikForm>
                  </Formik>}
              </div>
                <button 
                onClick={toggleView}
                className="btn btn-primary">
                  Setting
                </button>
            </div>
          </div>
        </Col>
        <Col>
        <div className="ml-auto">
        {settingDisplay
         && 
          <AnalyticsView
            onChartViewChange={handleChartViewChange}
            chartView={chartView}
          />}
          </div>
        </Col>
      </Row>

      <Row>
        <Col xl={8} lg={12} md={12} className="mb-4">
          {chartView.lineChart && !hasDataMapped.line && <Card className="h-100">
            <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Average Duration per Session</h4>
            </Card.Header>
            <Card.Body>
              <ApexCharts
                options={updatedSessionOptions}
                series={lineData}
                type="line"
              />
            </Card.Body>
          </Card>}
        </Col>
        { chartView.barChart && <Col xl={4} lg={12} md={12} className="mb-4">
          <Card className="h-100">
            <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Active Users</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <span className="fw-semi-bold">Total Sessions</span>
                  <h1 className="fw-bold mt-2 mb-0 h2">{userCount.totalSessions}</h1>
                  <p className="text-danger fw-semi-bold mb-0">
                  </p>
                </Col>
                <Col>
                  <span className="fw-semi-bold">Unique Users</span>
                  <h1 className="fw-bold mt-2 mb-0 h2">{userCount.uniqueUsers}</h1>
                  <p className="text-danger fw-semi-bold mb-0">
                  </p>
                </Col>
              </Row>
              <ApexCharts
                options={updatedActiveUserOptions}
                series={barData.data}
                type="bar"
              />
            </Card.Body>
          </Card>
        </Col>}
      </Row>

      <Row>
       {chartView.usersByCountry &&<Col xl={4} lg={12} md={12} className="mb-4">
          <Card className="h-100">
            <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Users by Country</h4>
            </Card.Header>
            <Card.Body className="py-0">
              <Table borderless size="sm">
              <tbody>
                  {Object.keys(usersByCountry).map(country => {
                      const sessions = usersByCountry[country].sessions;
                      const percentage = (sessions / calculateTotalSessions() * 100).toFixed(2);
                      return (
                          <tr key={country}>
                              <td>{country}</td>
                              <td className="text-end">{sessions.toLocaleString()}</td>
                              <td className="text-end ">{percentage}%</td>
                          </tr>
                      );
                  })}
              </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>}

        {chartView.trafficChart && <Col xl={4} lg={12} md={12} className="mb-4">
          <Card className="h-100">
            <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Traffic Channel</h4>
            </Card.Header>
            <Card.Body className="p-1">
              <ApexCharts
                options={TrafficChannelChartOptions}
                series={TrafficChannelChartSeries}
                type="donut"
                height={260}
              />
              <div className="table-responsive">
                <Table className="w-100 mt-5 text-nowrap" borderless>
                  <tbody>
                    <tr>
                      <td className="text-dark fw-medium py-1">
                        <Icon
                          path={mdiSquareRounded}
                          className="text-primary fs-5 me-2"
                          size={0.6}
                        />
                        Organic Search
                      </td>
                      <td className="text-end fw-semi-bold py-1 text-dark">
                        2,120
                      </td>
                      <td className="text-end  py-1">4.54%</td>
                    </tr>
                    <tr>
                      <td className="text-dark fw-medium py-1">
                        <Icon
                          path={mdiSquareRounded}
                          className="text-success fs-5 me-2"
                          size={0.6}
                        />
                        Direct
                      </td>
                      <td className="text-end fw-semi-bold py-1 text-dark">
                        639
                      </td>
                      <td className="text-end  py-1">4.37%</td>
                    </tr>
                    <tr>
                      <td className="text-dark fw-medium py-1">
                        <Icon
                          path={mdiSquareRounded}
                          className="text-danger fs-5 me-2"
                          size={0.6}
                        />
                        Refferrals
                      </td>
                      <td className="text-end fw-semi-bold py-1 text-dark">
                        520
                      </td>
                      <td className="text-end py-1">45.14%</td>
                    </tr>
                    <tr>
                      <td className="text-dark fw-medium pt-1">
                        <Icon
                          path={mdiSquareRounded}
                          className="text-info fs-5 me-2"
                          size={0.6}
                        />
                        Social Media
                      </td>
                      <td className="text-end fw-semi-bold  pt-1 text-dark">
                        116
                      </td>
                      <td className="text-end pt-1">12.24%</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>}

        {chartView.operatingChart && <Col xl={4} lg={12} md={12} className="mb-4">
          <Card className="h-100">
            <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Operating System</h4>
            </Card.Header>
            <Card.Body>
              <ApexCharts
                options={OperatingSystemChartOptions}
                series={OperatingSystemChartSeries}
                type="polarArea"
                height={350}
              />
              <div className="mt-4 d-flex justify-content-center">
                <ListGroup as="ul" bsPrefix="list-inline" className="mb-0">
                  <ListGroup.Item as="li" bsPrefix="list-inline-item mx-3">
                    <h5 className="mb-0 d-flex align-items-center fs-5 lh-1">
                      <Icon
                        path={mdiSquareRounded}
                        className="text-danger fs-5 me-2"
                        size={0.6}
                      />
                      Window
                    </h5>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix="list-inline-item mx-3">
                    <h5 className="mb-0 d-flex align-items-center  fs-5 lh-1">
                      <Icon
                        path={mdiSquareRounded}
                        className="text-success fs-5 me-2"
                        size={0.6}
                      />
                      macOS
                    </h5>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix="list-inline-item mx-3">
                    <h5 className="mb-0 d-flex align-items-center  fs-5 lh-1">
                      <Icon
                        path={mdiSquareRounded}
                        className="text-primary fs-5 me-2"
                        size={0.6}
                      />
                      Linux
                    </h5>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix="list-inline-item mx-3">
                    <h5 className="mb-0 d-flex align-items-center  fs-5 lh-1">
                      <Icon
                        path={mdiSquareRounded}
                        className="text-info fs-5 me-2"
                        size={0.6}
                      />
                      Android
                    </h5>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>}
      </Row>

      <Row>
        {chartView.browsers && <Col xl={4} lg={12} md={12} className="mb-4">
          <Browsers title="Browsers" data={browsersStatistics}/>
        </Col>}

        {chartView.mostViewPages && <Col xl={4} lg={12} md={12} className="mb-4">
          <MostViewPages title="Most View Pages" />
        </Col>}
      </Row>

      {chartView.worldMap && <Row>
        <Legend/>
          <ComposableMap width={900}>
            <ZoomableGroup onMoveEnd={handleMoveEnd}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#EAEAEC"
                      stroke="#D6D6DA"/>
                  ))
                }
              </Geographies>
                {markers.filter((marker) =>
                      marker &&
                      marker.name &&
                      marker.coordinates &&
                      marker.markerOffset &&
                      marker.sessions)
                  .map(({ name, coordinates, markerOffset, sessions }, index) => (
                    <Marker
                      key={`${name}-${index}`}
                      coordinates={coordinates}
                      onMouseEnter={() => setHoveredMarker(name)}
                      onMouseLeave={() => setHoveredMarker(null)}>
                    <circle
                      r={getCircleRadius(baseRadius,zoom)}
                      fill={getFillColor(sessions)}
                      stroke="#c5b7fc"
                      strokeWidth={3}
                      title={sessions.toString()}/>
                    {hoveredMarker === name && (
                      <text
                        textAnchor="middle"
                        y={markerOffset}
                        style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}>
                        {name}
                      </text>
                      )}
                    </Marker>
                  ))}
            </ZoomableGroup>
          </ComposableMap>
      </Row>}
    </Fragment>
  );
};

export default Analytics;
