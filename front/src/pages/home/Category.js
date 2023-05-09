import React, { useEffect, useState } from 'react';
import CardCategory from '../../components/CardCategory';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { getAuthUser } from '../../helper/Storage'; const Category = () => {
    const auth = getAuthUser();
    const [categories, setCategories] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    })
    const [searchTerm, setsearchTerm] = useState("");
    useEffect(() => {
        setCategories({ ...categories, loading: true });
        axios.get("http://localhost:4000/Categories/listCategories",
            {
                params: {
                    searchTerm: searchTerm,
                },
            },
        )
            .then((resp) => {
                console.log(resp);
                setCategories({ ...categories, results: resp.data, loading: false, err: null });
            })
            .catch((err) => {
                setCategories({
                    ...categories,
                    loading: false,
                    err: " something went wrong, please try again later ! ",
                });
            });
    },// eslint-disable-next-line 
        [categories.reload]);
    const Search = (e) => {
        e.preventDefault();
        setCategories({ ...categories, reload: categories.reload + 1 });
    };
    return (
        <div className="homa-container p-5">
            {
                categories.loading === true && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )
            }
            {
                categories.loading === false && categories.err === null && (
                    <>
                        {auth && (
                            <Form onSubmit={Search}>
                                <Form.Group className="mb-3 d-flex">
                                    <Form.Control type="text"
                                        required
                                        placeholder="Search categories"
                                        className="rounded-0"
                                        value={searchTerm}
                                        onChange={(e) => setsearchTerm(e.target.value)} />
                                    <button className="btn btn-dark rounded-0">Search</button>
                                </Form.Group>
                            </Form>
                        )}
                        {!auth && (
                            <Alert variant="warning" className="p-2">
                                please login first to be able to make search for our categories and medicines
                            </Alert>
                        )}
                        <div className="row">
                            {categories.results.map((category) =>
                            (
                                <div className="col-3 card-movie-container" key={category.categoryID}>
                                    < CardCategory
                                        categoryName={category.categoryName}
                                        categoryDesc={category.categoryDesc}
                                        image_url={category.image_url}
                                        categoryID={category.categoryID}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )
            }
            {
                categories.loading === false && categories.err !== null && (
                    <Alert variant="danger" className='p-2'>
                        {categories.err}
                    </Alert>
                )}
            {
                categories.loading === false && categories.err === null && categories.results.length === 0 && (
                    <Alert variant="info" className='p-2'>
                        No Categories Here
                    </Alert>
                )}
        </div>
    );
};
export default Category;