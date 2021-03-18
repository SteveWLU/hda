import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { nav } from '../data/nav'

const Navigation = () => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="light" >
            <Navbar.Brand href="/" >
                <h2 id="site-title">Huon d'Auvergne Digital Archive</h2>
                <p id="nav-subtitle">A digital edition and translation of Huon d'Auvergne, a pre-modern, Franco-Italian Epic</p>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                <Nav activeKey="/">
                    {nav.map((elem, index) => {
                        return (elem.dropdown ?
                            <NavDropdown key={index} title={elem.title} id="collasible-nav-dropdown">
                                {elem.dropdown.map((dropElem, ind) => <NavDropdown.Item key={ind} href={dropElem.url}>{dropElem.page}</NavDropdown.Item>)}
                            </NavDropdown>
                            : <Nav.Item key={index}>
                                <Nav.Link href={elem.url}>{elem.title}</Nav.Link>
                            </Nav.Item>)
                    })}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Navigation