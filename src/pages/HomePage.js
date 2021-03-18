import React from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

const HomePage = () => {
    return (
        <Container>
            <Row id="home">
                <Col sm={4} className="d-flex justify-content-end" id="big-l">
                    <Image id="initial" src="/images/initial-home-page.png" />
                </Col>
                <Col lg={6}>
                    <p className="intro">and disciplines,
                    the Huon d'Auvergne Digital Archive is a collaborative scholarly project
                    that presents for the first time to a modern reading audience the
                    Franco-Italian Huon d'Auvergne romance epic. The first phase of the
                    project (January 1, 2014 - August 31, 2017), funded by the generosity
                    of the National Endowment for the Humanities, develops the first version
                    of the Huon digital archive, which includes diplomatic editions of all
                    four extant manuscripts, an accompanying English translation, and a
                    reading interface that demonstrates protocols for textual analysis and
                    comparison of variants. From the initial foundation of phase one, the
                    Huon editorial team will build additional functionality involving
                    high-resolution scans of the four Franco-Italian manuscripts, creating
                    an interactive and linked reading environment. It is our hope that the
                    results of phase one will already be useful to researchers, teachers,
                    and students of medieval epic. A technical report of the project can be
                found on our <a href="https://github.com/wludh/huon_rails/blob/master/tech-report.md">
                            GitHub repository</a>.</p>
                </Col>
            </Row>
        </Container>
    )
}

export default HomePage;