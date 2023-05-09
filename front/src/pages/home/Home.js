import React, { useEffect, useState } from 'react';
import Cards from '../../components/Cards';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Link, useParams } from 'react-router-dom';
import { getAuthUser } from '../../helper/Storage';
const Home = () => {
    const auth = getAuthUser();
    let { id } = useParams();
    const [medicines, setMedicines] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    })
    const [searchTerm, setsearchTerm] = useState("");
    useEffect(() => {
        setMedicines({ ...medicines, loading: true });
        axios.get("http://localhost:4000/Medicines/listOfMedicines'sCategory/" + id,
            {
                params: {
                    searchTerm: searchTerm,
                },
            },
        )
            .then((resp) => {
                console.log(resp);
                setMedicines({ ...medicines, results: resp.data, loading: false, err: null });
            })
            .catch((err) => {
                setMedicines({
                    ...medicines,
                    loading: false,
                    err: " something went wrong, please try again later ! ",
                });
            });
    },// eslint-disable-next-line 
        [medicines.reload]);
    const Search = (e) => {
        e.preventDefault();
        setMedicines({ ...medicines, reload: medicines.reload + 1 });
        axios.post("http://localhost:4000/Patient/search", {
            searchTerm: searchTerm,
            user_id: JSON.parse(localStorage.getItem("user")).id,
        })
            .then((resp) => { console.log(resp.data) })
            .catch((error) => {
                console.error(error);
            })
    };
    return (
        <div className="homa-container p-5">
            {
                medicines.loading === true && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )
            }
            {
                medicines.loading === false && medicines.err === null && (
                    <>
                        {auth && (
                            <Form onSubmit={Search}>
                                <Form.Group className="mb-3 d-flex">
                                    <Form.Control type="text"
                                        required
                                        placeholder="Search Medicines"
                                        className="rounded-0"
                                        value={searchTerm}
                                        onChange={(e) => setsearchTerm(e.target.value)} />
                                    <button className="btn btn-dark rounded-0">Search</button>
                                </Form.Group>
                            </Form>
                        )}
                        {auth && (
                            <Form
                            // onSubmit={SearchMedicines}
                            >
                                <Form.Group className="mb-3 d-flex">
                                    <Link to={"/ListSearch"}><button className="btn btn-dark rounded-0" >history</button></Link>
                                </Form.Group>
                            </Form>
                        )}
                        {!auth && (
                            <Alert variant="warning" className="p-2">
                                please login first to be able to make search for our categories and medicines
                            </Alert>
                        )}
                        <div className="row">
                            {medicines.results.map((medicine) =>
                            (
                                <div className="col-3 card-movie-container" key={medicine.medicineID}>
                                    <Cards
                                        medicineName={medicine.medicineName}
                                        medicineDesc={medicine.medicineDesc}
                                        price={medicine.price}
                                        expirationDate={medicine.expirationDate}
                                        categoryID={medicine.categoryID}
                                        image_url={medicine.image_url}
                                        medicineID={medicine.medicineID}
                                    />
                                </div>
                            ))}

                        </div>

                    </>
                )
            }
            {
                medicines.loading === false && medicines.err !== null && (
                    <Alert variant="danger" className='p-2'>
                        {medicines.err}
                    </Alert>
                )}
            {
                medicines.loading === false && medicines.err === null && medicines.results.length === 0 && (
                    <Alert variant="info" className='p-2'>
                        No Medicines Here
                    </Alert>

                )}
        </div>
    );
};
export default Home;