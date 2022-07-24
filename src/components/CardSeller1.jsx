import React from "react";
import "../css/daftarJual.css";
import { Card, Container, FormLabel } from "react-bootstrap";
import { Link, } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

export default function CardProduct({ sellerProduct }) {

    const title = {
        fontSize: "16px",
    };

    const image = {
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

    const productCard = {
        width: "100%",
        height: "100%",
    };

    const styleLink = {
        textDecoration: "none",
    }


    return (
        <>
            <Container className="card-content-seller">
                <Link style={styleLink} to="/InfoProduct">
                    <Card style={productCard} className="add-product d-flex align-items-center justify-content-center">
                        <div className="d-flex align-items-center justify-content-center">
                            <FiPlus className="add-product-icon" />
                        </div>
                        <p className="add-product-text">
                            Tambah Produk
                        </p>
                    </Card>
                </Link>
                {sellerProduct ? sellerProduct.map((product) => (
                    <Link to={`/detailProduct/${product.id}`} style={{ textDecoration: "none", color: "black" }}>
                        <div key={product.id}>
                            <Card style={productCard}>
                                
                                <Card.Img
                                    className="w-80 align-self-center"
                                    variant="top"
                                    multiple
                                    src={`${product.image[0]}`}
                                    style={image}
                                />
                                <Card.Body className="p-2">
                                    <Card.Title className="mb-0" style={title}>
                                        {product.name}
                                    </Card.Title>
                                    <p className="mb-0" style={accesoris}>
                                        {product.category}
                                    </p>
                                    <Card.Text className="mb-1">Rp {product.price}</Card.Text>
                                    <span class="label other">{product.isPublish ? 'Publish' : 'Unpublish'}</span>
                                </Card.Body>
                            </Card>
                        </div>
                    </Link>
                )) : ""}
            </Container>
        </>
    );
}