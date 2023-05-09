import React from 'react';
//import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../css/Cards.css"
import { Link } from 'react-router-dom';
const CardCategory = (props) => {
  let id = props.categoryID
  return (
    <div>
      <Card >
        <Card.Img className="card-image" variant="top" src={props.image_url} />
        <Card.Body>
          <hr></hr>
          <Card.Title>{props.categoryName}</Card.Title><hr></hr>
          <Card.Text>{props.categoryDesc}</Card.Text><hr></hr>
          <Link className="btn btn-dark w-100" to={"/home/" + id} >show Medicines</Link>
        </Card.Body>
      </Card>
    </div>
  );
};
export default CardCategory;
