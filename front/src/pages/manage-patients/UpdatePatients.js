import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";
const UpdatePatients = () => {
    let { id } = useParams();
    const auth = getAuthUser();
    const [patient, setPatient] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        loading: false,
        err: "",
        success: null
    })
    const handleSubmit = (event) => {
        event.preventDefault();
        setPatient({ ...patient, loading: true });
        axios.put("http://localhost:4000/Patient/updatePatient/" +id, { name: patient.name, email: patient.email, password: patient.password, phone: patient.phone }, {
            headers:
            {
                token: auth.token,
            }
        },
        )
            .then(res => {
                setPatient({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    loading: false,
                    err: null,
                    success: "Patient updated successfully!"
                });
            })
            .catch(err => {
                setPatient({
                    ...patient,
                    loading: false,
                    success: null,
                    err: "Something went wrong"
                });
            });
    }
    useEffect(() => {
        axios.get("http://localhost:4000/Patient/showPatient/" + id,
            {
                headers: {
                    token: auth.token,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((result) => {
                setPatient({
                    ...patient,
                    name: result.data[0].name,
                    email: result.data[0].email,
                    phone: result.data[0].phone,
                    password: result.data[0].password,
                });
            })
            .catch((err) => {
                setPatient({
                    ...patient,
                    loading: false,
                    success: null,
                    err: "Something went wrong",
                });
            });
    },
        // eslint-disable-next-line
        [patient.reload]);
    return (
        <div className="login-container">
            <h1>Update Patient form</h1>
            {
                patient.err && (
                    <Alert variant="danger" className='p-2'>
                        {patient.err}
                    </Alert>
                )
            }
            {patient.success && (
                <Alert variant="success" className="p-2">
                    {patient.success}
                </Alert>
            )}
            <Form onSubmit={handleSubmit} className="text-center py-2">
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Name"
                        value={patient.name}
                        onChange={(e) => setPatient
                            ({ ...patient, name: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Email"
                        value={patient.email}
                        onChange={(e) => setPatient
                            ({ ...patient, email: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Phone"
                        value={patient.phone}
                        onChange={(e) => setPatient
                            ({ ...patient, phone: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Password"
                        value={patient.password}
                        onChange={(e) => setPatient
                            ({ ...patient, password: e.target.value })} />
                </Form.Group>
                <Button className="btn btn-dark w-100" variant="primary" type="submit">
                    UpdatePatients
                </Button>
            </Form>
        </div>
    );
};

export default UpdatePatients;