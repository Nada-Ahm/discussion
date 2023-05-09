import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { getAuthUser } from "../../helper/Storage";
const AddCategory = () => {
    const auth = getAuthUser();
    const [category, setCategory] = useState({
        categoryName: '',
        categoryDesc: '',
        loading: false,
        err: "",
        success: null
    })
    const image = useRef(null);
    const createCategory = (e) => {
        e.preventDefault();
        setCategory({ ...category, loading: true });
        const formData = new FormData();
        formData.append("categoryName", category.categoryName);
        formData.append("categoryDesc", category.categoryDesc)
        if (image.current.files && image.current.files[0]) {
            formData.append("image", image.current.files[0])
        }
        console.log(formData)
        axios.post("http://localhost:4000/Categories/createCategory", formData,
            {
                headers: {
                    token: auth.token,
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((resp) => {
                setCategory({
                    categoryName: '',
                    categoryDesc: '',
                    loading: false,
                    err: null,
                    success: "Category created successfully!"
                });
                image.current.value = null
            })
            .catch(err => {
                setCategory({
                    ...category,
                    loading: false,
                    success: null,
                    err: "Something went wrong"
                });
            })
    }
    return (
        <div className="login-container">
            <h1>Add Category Form</h1>
            {
                category.err && (
                    <Alert variant="danger" className='p-2'>
                        {category.err}
                    </Alert>
                )
            }
            {
                category.success && (
                    <Alert variant="success" className='p-2'>
                        {category.success}
                    </Alert>
                )
            }
            <Form onSubmit={createCategory}>
                <Form.Group className="mb-3">
                    <Form.Control value={category.categoryName}
                        required onChange={(e) => setCategory
                            ({ ...category, categoryName: e.target.value })}
                        type="text" placeholder="categoryName" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Description"
                        value={category.categoryDesc}
                        required
                        onChange={(e) => setCategory
                            ({ ...category, categoryDesc: e.target.value })}
                        rows={3}></textarea>
                </Form.Group>
                <Form.Group className="mb-3">
                    <input type="file" className="form-control" ref={image} required/>
                </Form.Group>
                <Button className="btn btn-dark w-100" variant="primary" type="submit">
                    Add Category
                </Button>
            </Form>
        </div>
    );
};

export default AddCategory;