import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../../css/ManagePatients.css";
import axios from "axios";
const MyRequests = () => {
    const [myRequests, setMyRequests] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    })
    useEffect(() => {
        setMyRequests({ ...myRequests, loading: true })
        axios.get("http://localhost:4000/medicines/showMyRequest/" + JSON.parse(localStorage.getItem("user")).id)
            .then((resp) => {
                setMyRequests({ ...myRequests, results: resp.data, loading: false, err: null })
            })
            .catch(err => {
                setMyRequests({ ...myRequests, loading: false, err: "something went wrong,please try again later!" })
            })
       
    }, [myRequests.reload]);
    return (
        <div className="manage-medicines p-5">
            <div className="header d-flex justify-content-between mb-5">
                <h3 className="text-center">My Requested Medicines</h3>
            </div>
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th></th>
                        <th>Medicine Name</th>
                        <th>Request State</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        myRequests.results.map((request) => (
                            <tr key={request.id}>
                                <td><img src={request.image_url} alt={request.medicineName} className="image-avatar" /></td>
                                <td>{request.medicineName}</td>
                                <td>{request.requestState}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};
export default MyRequests;
