import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import debug from "sabio-debug";
import { Card } from "react-bootstrap";


const _logger = debug.extend("lenderInfo");

function LenderInfo (props) {
    _logger(props, "should be props")
    const [newLender, setNewLender] = useState({
        id: 0,
        lenderType: {},
        loanType:{},
        statusType:{},
        location:[],
        dateCreated:"",
        dateModified:"",
        name:"",
        logo:"",
        website:"",
        statusId:0,
        createdBy:0,
        modifiedBy:0

    })
    const {state} = useLocation();
    

    useEffect(()=>{ 
        if (state === null) {
          
          
        }
        else {
          setNewLender({
            id: state.id,
        lenderType: state.lenderType,
        loanType:state.loanType,
        statusType:state.statusType,
        location:state.location[0],
        dateCreated:state.dateCreated,
        dateModified:state.dateModified,
        name:state.name,
        logo:state.logo,
        website:state.website,
        statusId:state.statusId,
        createdBy:state.createdBy,
        modifiedBy:state.modifiedBy
          })
          _logger(state, "hydrated object")
        }

      },[])


    return(
      <React.Fragment>
        <Card className="col-md-6 mx-auto border border-dark" >
          <Card.Body className="p-0 mx-auto">
            <img src= {newLender.logo} className="img-thumbnail img-fluid rounded-circle" alt="LenderLogo"/>
            <p></p>
            <h2>Lender Name: </h2>
            {newLender.name}
            <p></p>
            <h4>Status: </h4>
            {newLender.statusType.name}
            <p></p>
            <h4>Lender Id: </h4>
            {newLender.id} 
            <p></p>
            <h4>Lender Type: </h4>
            {newLender.lenderType.name}
            <p></p>
            <h4>Loan Type: </h4>
            {newLender.loanType.name}
            <p></p>
            <h4>LocationId: {newLender.location.id}</h4>
            <p></p>
            <h4>Address: </h4>
            {newLender.location.lineOne}
            <p></p>
            <h4>AddressCont: </h4>
            {newLender.location.lineTwo}
            <p></p>
            <h4>City: </h4>
            {newLender.location.city}
            <h4>StateId: {newLender.location.stateId}</h4>
            <h4>Zip: {newLender.location.zip}</h4>
            <h4> Lat / Long: </h4>
            {newLender.location.latitude} {newLender.location.longitude}
            <p></p>
            <h4>Created By Id: {newLender.createdBy}</h4>
            <h4>Modified By Id: {newLender.modifiedBy}</h4>

            
          </Card.Body>
        </Card>
        </React.Fragment>
    )
}

export default LenderInfo