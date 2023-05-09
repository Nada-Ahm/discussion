import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../../css/ManagePatients.css";
import axios from 'axios'
const Requests = () => {
    const [requests, setRequests] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    })
    useEffect(() => {
        setRequests({ ...requests, loading: true })
        axios.get("http://localhost:4000/medicines/showRequest")
            .then((resp) => {
                setRequests({ ...requests, results: resp.data, loading: false, err: null })
            })
            .catch(err => {
                setRequests({ ...requests, loading: false, err: "something went wrong,please try again later!" })
            })
        // eslint-disable-next-line
    }, [requests.reload]);
    const accept = (id) => {
        axios.put("http://localhost:4000/medicines/accept/" + id)
            .then((resp) => {
                setRequests({ ...requests, reload: requests.reload + 1 })
            })
            .catch(err => {
            })
    }
    const decline = (id) => {
        axios.put("http://localhost:4000/medicines/decline/" + id)
            .then((resp) => {
                setRequests({ ...requests, reload: requests.reload + 1 })
            })
            .catch(err => {
            })
    }
    return (
        <div className="manage-medicines p-5">
            <div className="header d-flex justify-content-between mb-5">
                <h3 className="text-center">Requested Medicines</h3>
            </div>
            <Table striped bordered hover >
                <thead>
                    <tr>
                    <th>#</th>
                        <th>patient</th>
                        <th>medicineName</th>
                        <th></th>
                        <th>Request State</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        requests.results.map((request) => (
                            <tr key={request.id}>
                                <td>{request.medicineID}</td>
                                <td>{request.emailOfUser}</td>
                                <td>{request.medicineName}</td>
                                <td><img src={request.image_url} alt={request.medicineName} className="image-avatar" /></td>
                                <td>{request.requestState}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary mx-2"
                                        onClick={(e) => { accept(request.id) }}
                                    >Accept</button>
                                    <button className="btn btn-sm btn-danger"
                                       onClick={(e) => { decline(request.id) }}
                                    >decline</button>                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};
export default Requests;