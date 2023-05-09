import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { setAuthUser } from "../../helper/Storage"
//import { useNavigate } from "react-router-dom"
const Register = () => {
   // const navigate = useNavigate()
    const [register, setRegister] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        loading: false,
        err: [],
        success: null,
    })
    const RegisterFun = (e) => {
        e.preventDefault();
        setRegister({ ...register, loading: true, err: [] });
        axios.post("http://localhost:4000/auth/register",
            {
                name: register.name,
                email: register.email,
                phone: register.phone,
                password: register.password,
            })
            .then((resp) => {
                setRegister({ ...register, loading: false, err: [], success: "registered successfully.please open login form to login to system" })
                setAuthUser(resp.data);
            })
            .catch((errors) => {
                setRegister({ ...register, loading: false, err: errors.response.data.errors })
            })
    }
    return (
        <div>
            <div className="login-container">
                <h1>Registeration Form</h1>
                {
                    register.err.map((error, index) => (
                        <Alert key={index} variant="danger" className='p-2'>
                            {error.msg}
                        </Alert>
                    ))
                }
                {
                    register.success && (
                        <Alert variant="success" className='p-2'>
                            {register.success}
                        </Alert>
                    )
                }
                <Form onSubmit={RegisterFun}>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" placeholder="Full Name"
                            value={register.name}
                            onChange={(e) => setRegister({ ...register, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="email" placeholder="Email"
                            value={register.email}
                            onChange={(e) => setRegister({ ...register, email: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="phone" placeholder="Phone"
                            value={register.phone}
                            onChange={(e) => setRegister({ ...register, phone: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="password" placeholder="Password"
                            value={register.password}
                            onChange={(e) => setRegister({ ...register, password: e.target.value })} />
                    </Form.Group>
                    <Button className="btn btn-dark w-100" variant="primary" type="submit"
                        disabled={register.loading === true}>
                        Register
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Register;