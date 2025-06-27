import React from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("lender");

function Lender (props){
    _logger(props.theLender, "lenderObj")
    const alender = props.theLender

    const navigate = useNavigate();
    
    const onLenderClicked = (e)=>{
        _logger(e)
        navigate(`/lender/more?id=${alender.id}`, {state:alender} )
    }

    return(
        <React.Fragment>
        <div className="col pb-5 pt-2">
            <Card style={{ width: '16rem' }} className="border border-dark">
                <Card.Img variant="top" src={alender.logo}/>
                <Card.Body>
                    <Card.Title>{alender.name}</Card.Title>
                    <Card.Text>Lender Type:{alender.lenderType.name}</Card.Text>
                    <Card.Text>Loan Type:{alender.loanType.name}</Card.Text>
                    <Card.Text>City:{alender.location[0].city}</Card.Text>
                    <Card.Link href={alender.website}>Lenders Website</Card.Link>
                </Card.Body>
                <Button variant="primary" onClick={onLenderClicked}>More</Button>
            </Card>
        </div>
        </React.Fragment>
    )
}

Lender.propTypes = {
    theLender: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        logo: PropTypes.string,
        website: PropTypes.string.isRequired,
        lenderType: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        loanType: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        location: PropTypes.shape({
            city: PropTypes.string.isRequired,
        }),
    }).isRequired,
};

export default React.memo(Lender);
