import React, { useEffect, useState } from "react";
import "../css/daftarJual.css";
import { Card, Button, Container } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { FiBox, FiChevronRight, FiHeart, FiDollarSign } from "react-icons/fi";
import axios from "axios";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Navbar3 from "../components/NavBar3";
import CardSeller1 from "../components/CardSeller1";
import CardSeller2 from "../components/CardSeller2";
import CardSeller3 from "../components/CardSeller3";
import { useSelector } from "react-redux";
import { Alert, Stack } from "@mui/material";

export default function DaftarJual() {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [sellerProduct, setSellerProduct] = useState([]);
    const alert = useSelector(state => state.product.alert);
    const [show, setShow] = useState(true);

    const handleClose = () => { setShow(false) }

    const [products, setProducts] = useState(true);
    const [wishlist, setWishlist] = useState(false);
    const [sold, setSold] = useState(false);
    const productsHandler = (event, index) => {
        setProducts(true);
        setWishlist(false);
        setSold(false);
        setSelectedIndex(index);
    };
    const wishlistHandler = (event, index) => {
        setProducts(false);
        setWishlist(true);
        setSold(false);
        setSelectedIndex(index);
    };
    const soldHandler = (event, index) => {
        setProducts(false);
        setWishlist(false);
        setSold(true);
        setSelectedIndex(index);
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
                    const dataProducts = await axios.get(
                        `https://deployment-finalprojectbe.herokuapp.com/users/${currentUserResponse.data.user.id}/product`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    const payloadData = dataProducts.data.data.product;
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
            <div className="bg-nav">
                <Navbar3 />
            </div>
            <Stack sx={{ width: "50%", left: '27%', right: 0, top: 0, transition: '0.5s', marginTop: show ? { xs: "120px", md: '100px' } : "-350px", position: 'absolute', display: alert ? 'block' : 'none' }} spacing={2}>
                <Alert onClose={handleClose}>{alert}</Alert>
            </Stack>

            <Container className="daftar-jual">
                <h4 className="seller-text-1">Daftar Jual Saya</h4>
                <Card className="card-seller-daftar-jual">
                    <div class="d-flex mb-3">
                        <div class="p-2 ">
                            <Card.Img
                                src={`${user.image}`}
                                style={{ objectFit: "cover" }}
                                alt=""
                            />
                        </div>
                        <div class="p-2 mx-4">
                            <p className="seller-name">{user.name}</p>
                            <p className="seller-city">{user.kota}</p>
                        </div>
                        <div class="ms-auto px-4 align-self-center">
                            <Button variant="outline-primary" className="seller-button-edit" href={`/EditProfil/${user.id}`}>Edit</Button>
                        </div>
                    </div>
                </Card>

                <div class="d-flex">
                    <div class="flex-shrink-0">
                        <Card className="category-daftar-jual">
                            <div className="category-daftar-jual-item">
                                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <List>
                                        <p className="category-seller-text1">Kategori</p>
                                        <ListItemButton
                                            className="mb-2 category-seller-button"
                                            selected={selectedIndex === 1}
                                            onClick={(event) => productsHandler(event, 1)}
                                        >
                                            <ListItemIcon>
                                                <FiBox className="seller-icon" />
                                            </ListItemIcon>
                                            <ListItemText primary="Semua Produk" />
                                            <FiChevronRight className="seller-icon" />
                                        </ListItemButton>
                                        <Divider variant="middle" />
                                        <ListItemButton
                                            className="my-1"
                                            selected={selectedIndex === 2}
                                            onClick={(event) => wishlistHandler(event, 2)}
                                        >
                                            <ListItemIcon>
                                                <FiHeart className="seller-icon" />
                                            </ListItemIcon>
                                            <ListItemText primary="Diminati" />
                                            <FiChevronRight className="seller-icon" />
                                        </ListItemButton>
                                        <Divider variant="middle" />
                                        <ListItemButton
                                            className="my-1"
                                            selected={selectedIndex === 3}
                                            onClick={(event) => soldHandler(event, 3)}
                                        >
                                            <ListItemIcon>
                                                <FiDollarSign className="seller-icon" />
                                            </ListItemIcon>
                                            <ListItemText primary="Terjual" />
                                            <FiChevronRight className="seller-icon" />
                                        </ListItemButton>
                                    </List>
                                </Box>
                            </div>
                        </Card>
                    </div>

                    <div class="flex-grow-1 ">
                        <Container className="category2-daftar-jual">
                            <div className="d-flex gap-3 button-category">
                                <Button
                                    className="d-flex gap-1 px-3"
                                    variant="primary"
                                    onClick={productsHandler}
                                >
                                    <FiBox className="align-self-center" /> Semua Produk
                                </Button>
                                <Button
                                    className="d-flex gap-1 px-3"
                                    variant="primary"
                                    onClick={wishlistHandler}
                                >
                                    <FiHeart className="align-self-center" /> Diminati
                                </Button>
                                <Button
                                    className="d-flex gap-1 px-3"
                                    variant="primary"
                                    onClick={soldHandler}
                                >
                                    <FiDollarSign className="align-self-center" /> Terjual
                                </Button>
                            </div>
                        </Container>

                        {products && (
                            <CardSeller1 sellerProduct={sellerProduct} />
                        )}
                        {wishlist && (
                            <CardSeller2 />
                        )}
                        {sold && (
                            <CardSeller3 />
                        )}

                    </div>
                </div>
            </Container >
        </>
    ) : (
        <Navigate to="/login" replace />
    );
}