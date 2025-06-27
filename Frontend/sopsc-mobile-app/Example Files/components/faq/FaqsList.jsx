import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import Accordion from "react-bootstrap/Accordion";
import FaqsItem from "./FaqsItem";
import faqsService from "services/faqsService";
import Nav from "react-bootstrap/Nav";

function FaqsList() {
  const [listData, setListData] = useState({
    faqsList: [],
    filteredFaqs: [],
  });

  const _logger = debug.extend("Fobj");

  const mapObject = (aObject) => {
    return <FaqsItem aFaqsProps={aObject} key={aObject.id} />;
  };

  const onGetFaqsSuccess = (response) => {
    _logger("onGetFaqsSuccess", response, listData);
    let arrayOfFaqs = response.items;
    setListData((prevState) => {
      const ld = { ...prevState };
      ld.faqsList = arrayOfFaqs.map(mapObject);
      return ld;
    });
  };

  const onGetFaqsError = (response) => {
    _logger("onGetFaqsError", response);
  };

  useEffect(() => {
    faqsService.getFaqs().then(onGetFaqsSuccess).catch(onGetFaqsError);
  }, []);

  const filterQuestion1 = (event) => {
    const id = event.target.id;
    if (id === "0") {
      setListData((prevState) => {
        let copyOfListData = { ...prevState };
        copyOfListData.filteredFaqs = [];
        return copyOfListData;
      });
    } else {
      const MyQuestions = listData.faqsList;

      function questionsfilter(qna) {
        _logger(qna.props.aFaqsProps.category.id);
        _logger(id);
        if (qna.props.aFaqsProps.category.id === Number(id)) {
          return qna;
        }
      }
      const filterQns = MyQuestions.filter(questionsfilter);
      const mapObject2 = (object) => {
        return object;
      };

      setListData((prevState) => {
        const copyOfListData = { ...prevState };
        copyOfListData.filteredFaqs = filterQns.map(mapObject2);
        return copyOfListData;
      });
    }
  };
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col">
            <Nav justify variant="tabs" defaultActiveKey="/home">
              <Nav.Item>
                <Nav.Link
                  className="btn btn-primary"
                  onClick={filterQuestion1}
                  id="1"
                >
                  General
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className="btn btn-primary"
                  onClick={filterQuestion1}
                  id="2"
                >
                  Account
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className="btn btn-primary"
                  onClick={filterQuestion1}
                  id="3"
                >
                  Lenders
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className="btn btn-primary"
                  onClick={filterQuestion1}
                  id="4"
                >
                  Loans
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className="btn btn-primary"
                  onClick={filterQuestion1}
                  id="5"
                >
                  Test
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className="btn btn-primary"
                  onClick={filterQuestion1}
                  id="0"
                >
                  All FAQs
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <h1>
              <strong>Most frequently asked questions</strong>
            </h1>
            <br></br>
            <h4>
              Here are the most frequently asked questions, you may check before
              getting started
            </h4>
            <br></br>
            <Accordion defaultActiveKey="0" alwaysOpen>
              {listData.filteredFaqs.length === 0 && listData.faqsList}
              {listData.filteredFaqs.length !== 0 && listData.filteredFaqs}
            </Accordion>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default FaqsList;
