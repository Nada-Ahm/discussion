import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../../css/ManagePatients.css";
import { Link } from "react-router-dom"
//import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { getAuthUser } from "../../helper/Storage";
const ManagePatients = () => {
  const auth = getAuthUser();
  const [patients, setPatients] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  })
  useEffect(() => {
    setPatients({ ...patients, loading: true })
    axios.get("http://localhost:4000/Patient/listPatients", {
      headers: {
        token: auth.token
      }
    })
      .then((resp) => {
        console.log(resp)
        setPatients({ ...patients, results: resp.data, loading: false, err: null })
      })
      .catch(err => {
        setPatients({ ...patients, loading: false, err: "something went wrong,please try again later!" })
      })
    // eslint-disable-next-line
  }, [patients.reload]);
  const deletePatients = (id) => {
    axios.delete("http://localhost:4000/Patient/deletePatient/" + id, {
      headers: {
        token: auth.token
      }
    })
      .then((resp) => {
        setPatients({ ...patients, reload: patients.reload + 1 })
      })
      .catch(err => {
      })
  }
  return (
    <div className="manage-medicines p-5">
      <div className="header d-flex justify-content-between mb-5">
        <h3 className="text-center">Manage Patients</h3>
        <Link to={"add"} className="btn btn-success">+Add Patient</Link>
      </div>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>PatientID</th>
            <th>PatientName</th>
            <th>PatientEmail</th>
            <th>PatientPhone</th>
            <th>PatientPassword</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {
            patients.results.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.password}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={(e) => { deletePatients(patient.id) }}>Delete</button>
                  <Link to={"" + patient.id} className="btn btn-sm btn-primary mx-2">Update</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};
export default ManagePatients;