import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";
const UpdateMedicine = () => {
    let { id } = useParams();
    const auth = getAuthUser();
    const [medicine, setMedicine] = useState({
        medicineName: "",
        medicineDesc: "",
        price: "",
        expirationDate: "",
        categoryID: "",
        image: null,
        err: "",
        loading: false,
        reload: false,
        success: null,
        result: [],
    });
    const image = useRef(null);
    const updateMedicine = (e) => {
        e.preventDefault();
        setMedicine({ ...medicine, loading: true });
        const formData = new FormData();
        formData.append("medicineName", medicine.medicineName);
        formData.append("medicineDesc", medicine.medicineDesc)
        formData.append("price", medicine.price)
        formData.append("expirationDate", medicine.expirationDate)
        formData.append("categoryID", medicine.categoryID)
        if (image.current.files && image.current.files[0]) {
            formData.append("image", image.current.files[0]);
        }
        axios
            .put("http://localhost:4000/medicines/update/" + id, formData, {
                headers: {
                    token: auth.token,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((resp) => {
                setMedicine({
                    ...medicine,
                    loading: false,
                    success: "medicine updated successfully !",
                    reload: medicine.reload + 1,
                });
            })
            .catch((err) => {
                setMedicine({
                    ...medicine,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    };

    useEffect(() => {
        axios.get("http://localhost:4000/medicines/show/" + id)
            .then((result) => {
                setMedicine({
                    ...medicine,
                    medicineName: result.data[0].medicineName,
                    medicineDesc: result.data[0].medicineDesc,
                    price: result.data[0].price,
                    expirationDate: result.data[0].expirationDate,
                    categoryID: result.data[0].categoryID,
                    image_url: result.data[0].image_url
                });
            })
            .catch((err) => {
                setMedicine({
                    ...medicine,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    },
     // eslint-disable-next-line
    [medicine.reload]);
    return (
        <div className="login-container">
            <h1>Update Medicine form</h1>
            {
                medicine.err && (
                    <Alert variant="danger" className='p-2'>
                        {medicine.err}
                    </Alert>
                )
            }
            {medicine.success && (
                <Alert variant="success" className="p-2">
                    {medicine.success}
                </Alert>
            )}
            <Form onSubmit={updateMedicine} className="text-center py-2">
                <img
                    alt={medicine.medicineName}
                    style={{
                        width: "50%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        marginBottom: "10px",
                    }}
                    src={medicine.image_url} />
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="MedicineName"
                        value={medicine.medicineName}
                        onChange={(e) => setMedicine
                            ({ ...medicine, medicineName: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <textarea className="form-control"
                        placeholder="Description"
                        value={medicine.medicineDesc}
                        onChange={(e) => setMedicine
                            ({ ...medicine, medicineDesc: e.target.value })}
                        rows={5}></textarea>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Price"
                        value={medicine.price}
                        onChange={(e) => setMedicine
                            ({ ...medicine, price: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="ExpirationDate"
                        value={medicine.expirationDate}
                        onChange={(e) => setMedicine
                            ({ ...medicine, expirationDate: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="CategoryID"
                        value={medicine.categoryID}
                        onChange={(e) => setMedicine
                            ({ ...medicine, categoryID: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <input type="file" className="form-control" ref={image} />
                </Form.Group>
                <Button className="btn btn-dark w-100" variant="primary" type="submit">
                    Update Medicine
                </Button>
            </Form>
        </div>
    );
}
export default UpdateMedicine;
