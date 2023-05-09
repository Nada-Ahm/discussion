import React from 'react';
//import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../css/Cards.css"
import { Link } from 'react-router-dom';
const Cards = (props) => {
  return (
    <div>
      <Card >
        <Card.Img className="card-image" variant="top" src={props.image_url} />
        <Card.Body>
          <hr></hr>
          <Card.Title>{props.medicineName}</Card.Title><hr></hr>
          <Card.Text>{props.medicineDesc}</Card.Text><hr></hr>
          <Link className="btn btn-dark w-100" to={"/details/"+props.medicineID} >show Details</Link>
        </Card.Body>
      </Card>
    </div>
  );
};
export default Cards;