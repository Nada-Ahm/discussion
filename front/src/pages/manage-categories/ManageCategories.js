import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../../css/ManageCategories.css";
import { Link } from "react-router-dom"
import axios from 'axios';
import { getAuthUser } from "../../helper/Storage";
const ManageCategories = () => {
  const auth = getAuthUser();
  const [categories, setCategories] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  })
  useEffect(() => {
    setCategories({ ...categories, loading: true })
    axios.get("http://localhost:4000/Categories/listCategories")
      .then((resp) => {
        setCategories({ ...categories, results: resp.data, loading: false, err: null })
      })
      .catch(err => {
        setCategories({ ...categories, loading: false, err: "something went wrong,please try again later!" })
      })
    // eslint-disable-next-line
  }, [categories.reload]);
  const deleteCategory = (categoryID) => {
    axios.delete("http://localhost:4000/Categories/deleteCategory/" + categoryID, {
      headers: {
        token: auth.token
      }
    })
      .then((resp) => {
        setCategories({ ...categories, reload: categories.reload + 1 })
      })
      .catch(err => {
      })
  }
  return (
    <div className="manage-medicines p-5">
      <div className="header d-flex justify-content-between mb-5">
        <h3 className="text-center">Manage Categories</h3>
        <Link to={"add"} className="btn btn-success">+Add Category</Link>
      </div>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>CategoryID</th>
            <th>Image</th>
            <th>CategoryName</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            categories.results.map((category) => (
              <tr key={category.categoryID}>
                <td>{category.categoryID}</td>
                <td><img src={category.image_url} alt={category.categoryName} className="image-avatar" /></td>
                <td>{category.categoryName}</td>
                <td >{category.categoryDesc}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={(e) => { deleteCategory(category.categoryID) }}>Delete</button>
                  <Link to={"" + category.categoryID} className="btn btn-sm btn-primary mx-2">Update</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageCategories;