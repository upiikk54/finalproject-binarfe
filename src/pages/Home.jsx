import "../css/main.css";
import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { FiSearch } from "react-icons/fi";
import { BsPlus } from "react-icons/bs";
import Navbar from "../components/NavBar";
import CardProduct from "../components/Card";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState("")
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const searching = useSelector(state => state.search.search)

    const handleJual = () => {
        isLoggedIn ? user.kota ? navigate('/InfoProduct') : navigate(`/about/${user.id}`) : navigate('/login')
    }

    useEffect(() => {
        // Function validasi user
        const validateLogin = async () => {
            try {
                const token = localStorage.getItem("token");

                const currentUserRequest = await axios.get(
                    "https://deployment-finalprojectbe.herokuapp.com/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const currentUserResponse = currentUserRequest.data;

                if (currentUserResponse.status) {
                    setUser(currentUserResponse.data.user);
                }
            } catch (err) {
                setIsLoggedIn(false);
            }
        };
        validateLogin();
    }, []);

    const options = {
        items: 2,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        center: true,
        loop: true,
        margin: 10,
        nav: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 1,
            },
            600: {
                items: 2,
            },
            700: {
                items: 2,
            },
            1000: {
                items: 2,
            }
        },
    };

    const categories = category ? `&category=${category}` : ""
    const searched = searching ? `&name=${searching}` : ""
    const getProductPublish = async () => {
        try {
            const dataProduct = await axios.get(
                `https://deployment-finalprojectbe.herokuapp.com/api/filter?sold=false&isPublish=true${categories}${searched}`
            )

            const payloadData = await dataProduct.data.data.filteredProduct;
            setProduct(payloadData)
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getProductPublish()
    }, [categories, searching])

    return (
        <>
            <div className="bg-nav">
                <Navbar />
            </div>

            <div className="slider">
                <OwlCarousel
                    className="owl-theme slider-items"
                    {...options}
                >
                    <div className="slider-card">
                        <Card className="card-content home-carousel-1">
                            <Row>
                                <Col xs={8} md={6} className="carousel-text">
                                    <p className="text-1">Bulan Ramadhan Banyak diskon!</p>
                                    <p className="text-2">Diskon Hingga</p>
                                    <p className="text-3">60%</p>
                                </Col>
                                <Col xs={4} md={2} className="carousel-1">
                                    <img src="/images/carousel-1.png" alt="" />
                                </Col>
                                <Col xs={6} md={4} className="carousel-2">
                                    <img src="/images/carousel-2.png" alt="" />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div className="slider-card second-slide slider-2">
                        <Card className="card-content home-carousel-2">
                            <Row>
                                <Col xs={8} md={6} className="carousel-text">
                                    <p className="text-1">Bulan Ramadhan Banyak diskon!</p>
                                    <p className="text-2">Diskon Hingga</p>
                                    <p className="text-3">60%</p>
                                </Col>
                                <Col xs={4} md={2} className="carousel-1">
                                    <img src="/images/carousel-1.png" alt="" />
                                </Col>
                                <Col xs={6} md={4} className="carousel-2">
                                    <img src="/images/carousel-3.png" alt="" />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div className="slider-card third-slide slider-2">
                        <Card className="card-content home-carousel-3">
                            <Row>
                                <Col xs={8} md={6} className="carousel-text">
                                    <p className="text-1">Bulan Ramadhan Banyak diskon!</p>
                                    <p className="text-2">Diskon Hingga</p>
                                    <p className="text-3">60%</p>
                                </Col>
                                <Col xs={4} md={2} className="carousel-1">
                                    <img src="/images/carousel-1.png" alt="" />
                                </Col>
                                <Col xs={6} md={4} className="carousel-2">
                                    <img src="/images/carousel-4.png" alt="" />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </OwlCarousel>
            </div>

            <Container className="category">
                <h6 className="fw-bold">Telusuri Kategori</h6>
                <div>
                    <div className="d-flex gap-3 button-category">
                        <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory(null)}>
                            <FiSearch className="align-self-center" /> Semua
                        </Button>
                        <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory("hobi")}>
                            <FiSearch className="align-self-center" /> Hobi
                        </Button>
                        <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory("kendaraan")}>
                            <FiSearch className="align-self-center" /> Kendaraan
                        </Button>
                        <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory("Baju")}>
                            <FiSearch className="align-self-center" /> Baju
                        </Button>
                        <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory("Elektronik")}>
                            <FiSearch className="align-self-center" /> Elektronik
                        </Button>
                        <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory("kesehatan")}>
                            <FiSearch className="align-self-center" /> Kesehatan
                        </Button>
                    </div>
                    <Button className="d-flex gap-2 px-3 py-2 fixed-bottom button-sell mb-4" onClick={handleJual}>
                        <BsPlus
                            className="align-self-center "
                            style={{ fontSize: "24px" }}
                        />{" "}
                        Jual
                    </Button>
                </div>

            </Container>

            <div>
                <CardProduct product={product} />
            </div>
        </>
    );
}
