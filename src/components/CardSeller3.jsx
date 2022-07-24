import React, { useEffect, useState } from "react";
import "../css/daftarJual.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";


export default function CardProduct() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState({});
    const [sellerProduct, setSellerProduct] = useState([]);

    const text = {
        fontSize: "16px",
        textAlign: "center",
    };

    const image = {
        width: "276px",
        height: "194px",
    };

    const productCard = {
        width: "300px",
    };

    const title = {
        fontSize: "16px",
    };

    const imageCard = {
        width: "91%",
        height: "100px",
        objectFit: "cover",
        margin: "8px",
        borderRadius: "5px",
    };

    const accesoris = {
        fontSize: "12px",
        opacity: "0.5",
    };

    const CardProduct = {
        width: "100%",
        height: "100%",
    };

    useEffect(() => {
        const fetchData = async () => {
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

                if (currentUserResponse.data.user.id) {
                    const dataTransaction = await axios.get(
                        `https://deployment-finalprojectbe.herokuapp.com/api/transactionOwner/${currentUserResponse.data.user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    console.log(dataTransaction);
                    const payloadData = dataTransaction.data.data.getTransactionByOwnerId;
                    console.log(payloadData);
                    setSellerProduct(payloadData);
                }
            } catch (err) {
                setIsLoggedIn(false);
            }
        };
        fetchData();
    }, []);


    return isLoggedIn ? (
        <>
            {sellerProduct ? (
                <Container className="card-content-seller">
                    {sellerProduct.map((sellerProduct) => 
                        sellerProduct.product.sold === true ? (
                            <div key={sellerProduct.id}>
                                <Link to={`/sellerproductpenawar/${sellerProduct.id}`} style={{ textDecoration: "none", color: "black" }}>
                                    <Card style={CardProduct}>
                                        <Card.Img
                                            className="w-80 align-self-center"
                                            variant="top"
                                            multiple
                                            src={`${sellerProduct.product.image[0]}`}
                                            style={imageCard}
                                        />
                                        <Card.Body className="p-2">
                                            <Card.Title className="mb-0" style={title}>
                                                {sellerProduct.product.name}
                                            </Card.Title>
                                            <p className="mb-0" style={accesoris}>
                                                {sellerProduct.product.category}
                                            </p>
                                            <Card.Text className="mb-1">Rp {sellerProduct.requestedPrice}</Card.Text>
                                            <span class="label other">{sellerProduct.product.sold ? 'berhasil terjual' : ''}</span>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>
                        ) : (""))}
                </Container>
            ) : (
                <Container className="d-flex align-items-center justify-content-center">
                    <div style={productCard} className="my-4">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <img style={image} src="/images/wishlist.png" alt="" />
                        </div>
                        <p style={text}>
                            Belum ada produkmu yang diminati nih, sabar ya rejeki nggak kemana kok
                        </p>
                    </div>
                </Container>
            )}
        </>
    ) : (
        <Navigate to="/login" replace />
    );
}