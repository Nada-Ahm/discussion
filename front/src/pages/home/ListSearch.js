import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
const ListSearch = () => {
    const [history, setHistory] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    })
    useEffect(() => {
        setHistory({ ...history, loading: true })
        axios.get("http://localhost:4000/Patient/listHistory/"+JSON.parse(localStorage.getItem("user")).id)
            .then((resp) => {
                setHistory({ ...history, results: resp.data, loading: false, err: null })
            })
            .catch(err => {
                setHistory({ ...history, loading: false, err: "something went wrong,please try again later!" })
            })
        // eslint-disable-next-line
    }, [history.reload]);
    return (
        <div className="manage-medicines p-5">
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>HistoryOfSearch</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.results.map((histories) => (
                            <tr key={histories.id}>
                                <td>{histories.searchTerm}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ListSearch;