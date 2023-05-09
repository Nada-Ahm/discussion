import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../../css/MedicineDetails.css"
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { getAuthUser } from '../../helper/Storage';
//import RequestMedicine from "../../components/RequestMedicine"
const DetailsMedicine = () => {
    let { id } = useParams();
    const auth = getAuthUser();
    const [medicine, setMedicine] = useState({
        loading: true,
        result: [],
        err: null,
        success: null
    })
    useEffect(() => {
        setMedicine({ ...medicine, loading: true })
        axios.get("http://localhost:4000/medicines/show/" + id)
            .then(resp => {
                console.log(resp)
                setMedicine({
                    ...medicine,
                    result: resp.data, loading: false,
                    err: null
                })
            })
            .catch((err) => {
                setMedicine({
                    ...medicine, loading: false,
                    err: "something went wrong,please try again later!"
                })
            })
        // eslint-disable-next-line
    }, [medicine.reload]);
    const [request, setRequest] = useState({
        loading: true,
        result: [],
        err: null,
        success: null
    })
    const sendRequest = (e) => {
        e.preventDefault();
        setRequest({ ...request, loading: true });
        axios.post("http://localhost:4000/medicines/sendrequest/"+id,
            { userID: JSON.parse(localStorage.getItem("user")).id }
        )
            .then(resp => {
                console.log(resp)
                setRequest({
                    ...request,
                    loading: false,
                    result: resp.data,
                    err: null,
                    success: "success"
                })
            })
            .catch((err) => {
                setRequest({
                    ...request, loading: false,
                    err: "soryy this medicine is booked"
                })
            })
    }
    return (
        <div className="medicine-details-container p-5">
            {
                medicine.loading === true && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )
            }
            {
                request.err && (
                    <Alert variant="danger" className='p-2'>
                        {request.err}
                    </Alert>
                )
            }
            {
                request.success && (
                    <Alert variant="success" className='p-2'>
                        {request.success}
                    </Alert>
                )
            }
            {
                medicine.loading === false && medicine.err === null && (
                    <>
                        <div className="row">
                            <div className="col-3">
                                <img className="medicine-image" src={medicine.result[0].image_url} alt={medicine.result[0].medicineName} />
                            </div>
                            <div className="col-9">
                                <h3>"{medicine.result[0].medicineName}"</h3>
                                <h4>{medicine.result[0].price} LE</h4>
                                <h4>"EXP"  {medicine.result[0].expirationDate}</h4>
                                <p>
                                    {medicine.result[0].medicineDesc}
                                </p>
                            </div>
                        </div>
                        <hr />
                    </>
                )}
            {auth && (
                <Form onSubmit={sendRequest}>
                    <Form.Group className="mb-3">
                        <button className="btn btn-dark p-2"><h5>Request Medicine</h5></button>
                    </Form.Group>
                </Form>
            )}
            {!auth && (
                <Alert variant="warning" className="p-2">
                    please login first to be able to make request
                </Alert>
            )}
        </div>
    );
};
export default DetailsMedicine; 