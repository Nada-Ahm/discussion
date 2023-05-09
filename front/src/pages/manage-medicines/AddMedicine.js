import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { getAuthUser } from "../../helper/Storage";
const AddMedicine = () => {
    const auth = getAuthUser();
    const [medicine, setMedicine] = useState({
        medicineName: '',
        medicineDesc: '',
        price: '',
        expirationDate: '',
        categoryID: '',
        loading: false,
        err: "",
        success: null
    })
    const image = useRef(null);
    const createMedicine = (e) => {
        e.preventDefault();
        setMedicine({ ...medicine, loading: true });
        const formData = new FormData();
        formData.append("medicineName", medicine.medicineName);
        formData.append("medicineDesc", medicine.medicineDesc)
        formData.append("price", medicine.price)
        formData.append("expirationDate", medicine.expirationDate)
        formData.append("categoryID", medicine.categoryID)
        if (image.current.files && image.current.files[0]) {
            formData.append("image", image.current.files[0])
        }
        console.log(formData)
        axios.post("http://localhost:4000/medicines/create", formData,
            {
                headers: {
                    token: auth.token,
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((resp) => {
                setMedicine({
                    medicineName: '',
                    medicineDesc: '',
                    price: '',
                    expirationDate: '',
                    categoryID: '',
                    loading: false,
                    err:null,
                    success: "Medicine created successfully!"
                });
                image.current.value = null
            })
            .catch(err => {
                setMedicine({
                    ...medicine,
                    loading: false,
                    success: null,
                    err: "Something went wrong"
                });
            })
    }
    return (
        <div className="login-container">
            <h1>Add Medicine Form</h1>
            {
                medicine.err && (
                    <Alert variant="danger" className='p-2'>
                        {medicine.err}
                    </Alert>
                )
            }
            {
                medicine.success && (
                    <Alert variant="success" className='p-2'>
                        {medicine.success}
                    </Alert>
                )
            }
            <Form onSubmit={createMedicine}>
                <Form.Group className="mb-3">
                    <Form.Control value={medicine.medicineName}
                        required onChange={(e) => setMedicine({ ...medicine, medicineName: e.target.value })} type="text" placeholder="MedicineName" />
                </Form.Group>

                <Form.Group className="mb-3"><textarea className="form-control" placeholder="Description" value={medicine.medicineDesc}
                    required
                    onChange={(e) => setMedicine({ ...medicine, medicineDesc: e.target.value })}
                    rows={3}></textarea>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Price"
                        value={medicine.price}
                        required
                        onChange={(e) => setMedicine({ ...medicine, price: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="ExpirationDate" value={medicine.expirationDate}
                        required
                        onChange={(e) => setMedicine({ ...medicine, expirationDate: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="CategoryID" value={medicine.categoryID}
                        required
                        onChange={(e) => setMedicine({ ...medicine, categoryID: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <input type="file" className="form-control" ref={image} required/>
                </Form.Group>
                <Button className="btn btn-dark w-100" variant="primary" type="submit">
                    Add Medicine
                </Button>
            </Form>
        </div>
    );
};
export default AddMedicine;