import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";
const UpdateCategory = () => {
    let { id } = useParams();
    const auth = getAuthUser();
    const [category, setCategory] = useState({
        categoryName: "",
        categoryDesc: "",
        image: null,
        err: "",
        loading: false,
        reload: false,
        success: null,
        result: [],
    });
    const image = useRef(null);
    const updateCategory = (e) => {
        e.preventDefault();
        setCategory({ ...category, loading: true });
        const formData = new FormData();
        formData.append("categoryName", category.categoryName);
        formData.append("categoryDesc", category.categoryDesc)
        if (image.current.files && image.current.files[0]) {
            formData.append("image", image.current.files[0]);
        }
        axios
            .put("http://localhost:4000/Categories/updateCategory/" + id, formData, {
                headers: {
                    token: auth.token,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((resp) => {
                setCategory({
                    ...category,
                    loading: false,
                    success: "category updated successfully !",
                    reload: category.reload + 1,
                });
            })
            .catch((err) => {
                setCategory({
                    ...category,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    };
    useEffect(() => {
        axios.get("http://localhost:4000/Categories/showCategory/" + id)
            .then((result) => {
                setCategory({
                    ...category,
                    categoryName: result.data[0].categoryName,
                    categoryDesc: result.data[0].categoryDesc,
                    image_url: result.data[0].image_url
                });
            })
            .catch((err) => {
                setCategory({
                    ...category,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    },
     // eslint-disable-next-line
    [category.reload]);
    return (
        <div className="login-container">
            <h1>Update Category form</h1>
            {
                category.err && (
                    <Alert variant="danger" className='p-2'>
                        {category.err}
                    </Alert>
                )
            }
            {category.success && (
                <Alert variant="success" className="p-2">
                    {category.success}
                </Alert>
            )}
            <Form onSubmit={updateCategory} className="text-center py-2">
            <img
                    alt={category.categoryName}
                    style={{
                        width: "50%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        marginBottom: "10px",
                    }}
                    src={category.image_url} />
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="CategoryName"
                    value={category.categoryName}
                    onChange={(e) => setCategory
                        ({ ...category, categoryName: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                <textarea
                        className="form-control"
                        placeholder="Description"
                        value={category.categoryDesc}
                        onChange={(e) => setCategory
                            ({ ...category, categoryDesc: e.target.value })}
                        rows={3}></textarea>
                </Form.Group>
                <Form.Group className="mb-3">
                    <input type="file" className="form-control" ref={image}/>
                </Form.Group>
                <Button className="btn btn-dark w-100" variant="primary" type="submit">
                    Update Category
                </Button>
            </Form>
        </div>
    );
};
export default UpdateCategory;