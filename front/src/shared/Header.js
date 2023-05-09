import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { removeAuthUser, getAuthUser } from "../helper/Storage"
import { useNavigate } from "react-router-dom"
import "../css/Header.css"
const Header = () => {
    const navigate = useNavigate()
    const auth = getAuthUser()
    const Logout = () => {
        removeAuthUser();
        navigate("/Category");
    }
    return <>
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand >
                    <Link className="nav-link" to={"/Category"}>Medicines App</Link>
                </Navbar.Brand>
                <Nav className="me-auto">
                    {!auth && (
                        <>
                            <Link className="nav-link" to={"/login"}>Login</Link>
                            <Link className="nav-link" to={"/register"}>Register</Link>
                        </>
                    )}
                    {auth && auth.role === 1 && (
                        <>
                            <Link className="nav-link" to={"/manage-categories"}>Manage Categories</Link>
                            <Link className="nav-link" to={"/manage-medicines"}>Manage Medicines</Link>
                            <Link className="nav-link" to={"/manage-patients"}>Manage Patients</Link>
                            <Link className="nav-link" to={"/ShowRequests"}>Requests</Link>
                        </>
                    )}
                    {auth && auth.role === 0 && (
                        <>
                            <Link className="nav-link" to={"/MyRequests"}>ShowMyRequests</Link>
                        </>
                    )}
                </Nav>
                <Nav className="ms-auto">
                    {auth && <Nav.Link onClick={Logout}>Logout</Nav.Link>}
                </Nav>
            </Container>
        </Navbar>
    </>;
};

export default Header;