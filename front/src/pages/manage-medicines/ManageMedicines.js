import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../../css/ManageMedicines.css";
import { Link } from "react-router-dom"
import axios from 'axios';
import { getAuthUser } from "../../helper/Storage";
const ManageMedicines = () => {
  const auth = getAuthUser();
  const [medicines, setMedicines] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  })
  useEffect(() => {
    setMedicines({ ...medicines, loading: true })
    axios.get("http://localhost:4000/medicines/listOfAllMedicines")
      .then((resp) => {
        setMedicines({ ...medicines, results: resp.data, loading: false, err: null })
      })
      .catch(err => {
        setMedicines({ ...medicines, loading: false, err: "something went wrong,please try again later!" })
      })
    // eslint-disable-next-line
  }, [medicines.reload]);
  const deleteMedicine = (medicineID) => {
    axios.delete("http://localhost:4000/medicines/delete/" + medicineID, {
      headers: {
        token: auth.token
      }
    })
      .then((resp) => {
        setMedicines({ ...medicines, reload: medicines.reload + 1 })
      })
      .catch(err => {
      })
  }
  return (
    <div className="manage-medicines p-5">
      <div className="header d-flex justify-content-between mb-5">
        <h3 className="text-center">Manage Medicines</h3>
        <Link to={"add"} className="btn btn-success">+Add Medicine</Link>
      </div>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>MedicineID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>ExpirationDate</th>
            <th>CategoryID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {
            medicines.results.map((medicine) => (
              <tr key={medicine.medicineID}>
                <td>{medicine.medicineID}</td>
                <td><img src={medicine.image_url} alt={medicine.medicineName} className="image-avatar" /></td>
                <td>{medicine.medicineName}</td>
                <td>{medicine.medicineDesc}</td>
                <td>{medicine.price}</td>
                <td>{medicine.expirationDate}</td>
                <td>{medicine.categoryID}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={(e) => { deleteMedicine(medicine.medicineID) }}>Delete</button>
                  <Link to={"" + medicine.medicineID} className="btn btn-sm btn-primary mx-2">Update</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageMedicines;