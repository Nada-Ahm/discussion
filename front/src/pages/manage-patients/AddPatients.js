import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { getAuthUser } from "../../helper/Storage";
const AddPatients = () => {
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
        axios.post("http://localhost:4000/Patient/addPatient", { name: patient.name, email: patient.email, password: patient.password, phone: patient.phone }, {
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
                    err:null,
                    success: "Patient created successfully!"
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
    return (
        <div className="login-container">
            <h1>Add Patient Form</h1>
            {
                patient.err && (
                    <Alert variant="danger" className='p-2'>
                        {patient.err}
                    </Alert>
                )
            }
            {
                patient.success && (
                    <Alert variant="success" className='p-2'>
                        {patient.success}
                    </Alert>
                )
            }
            <Form
                onSubmit={handleSubmit}
            >
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Full Name"
                        value={patient.name}
                        onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Email"
                        value={patient.email}
                        onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type="phone" placeholder="Phone"
                        value={patient.phone}
                        onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type="password" placeholder="Password"
                        value={patient.password}
                        onChange={(e) => setPatient({ ...patient, password: e.target.value })}
                    />
                </Form.Group>
                <Button className="btn btn-dark w-100" variant="primary" type="submit">
                    Add Patient
                </Button>
            </Form>
        </div>
    );
};
export default AddPatients;