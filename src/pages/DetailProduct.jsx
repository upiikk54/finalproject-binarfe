import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import "../css/detailproduct.css";
import Navbar2 from "../components/NavBar2";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, Link, useParams, Navigate } from "react-router-dom";
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Alert, Form, Stack } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


function DetailProduct() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const requestedPrice = useRef();
    const [data, setData] = useState([]);
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [transaksi, setTransaksi] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const [successResponse, setSuccessResponse] = useState({
        isSuccess: false,
        message: "",
    });
    const fetchData = async () => {
        try {
            // Check status user login
            // 1. Get token from localStorage
            const token = localStorage.getItem("token");

            // 2. Check token validity from API
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
            console.log(err);
        }
    };

    const getProduct = async () => {
        try {
            const token = localStorage.getItem("token");
            const responseProduct = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/product/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const dataProduct = await responseProduct.data.data.getProductById;

            setData(dataProduct)
        } catch (err) {
            console.log(err);
        }
    }

    const onUpdate = async (e, isPublish) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const postPayload = new FormData();
            postPayload.append("isPublish", isPublish);
            setOpen(true);
            const createRequest = await axios.put(
                `https://deployment-finalprojectbe.herokuapp.com/api/product/${id}`,
                postPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const createResponse = createRequest.data;

            if (createResponse.status) navigate(`/seller/daftar-jual`);
        } catch (err) {
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    useEffect(() => {
        getProduct();
        fetchData();
        getTransactionByUserId();
    }, [])

    const onCreateTransaction = async (e, isOpened, isRejected, isAccepted) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const postPayload = {
                owner_id: data.user.id,
                product_id: data.id,
                requestedPrice: requestedPrice.current.value,
                isOpened: isOpened,
                isRejected: isRejected,
                isAccepted: isAccepted
            };
            setShow(false)
            const createRequest = await axios.post(
                "https://deployment-finalprojectbe.herokuapp.com/api/transaction",
                postPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(createRequest);

            const successResponse = createRequest.data.message;
            setSuccessResponse({
                isSuccess: true,
                message: successResponse,
            })
            
            const user_id = localStorage.getItem("user");
            const userId = JSON.parse(user_id);
            // console.log(JSON.parse(user_id));
            const responseTransactionByUserId = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/transaction/${userId.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const dataTransactionByUserId = await responseTransactionByUserId.data.data.getTransactionByUserId;

            setTransaksi(dataTransactionByUserId)

        } catch (err) {
            console.log(err);
            const response = err.response.data;
            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    const getTransactionByUserId = async () => {
        try {

            const token = localStorage.getItem("token");
            const user_id = localStorage.getItem("user");
            const userId = JSON.parse(user_id);
            // console.log(JSON.parse(user_id));
            const responseTransactionByUserId = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/transaction/${userId.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const dataTransactionByUserId = await responseTransactionByUserId.data.data.getTransactionByUserId;

            setTransaksi(dataTransactionByUserId)
        } catch (err) {
            console.log(err);
        }
    }

    const filteredTransaction = Object.keys(transaksi).length !== 0 ? transaksi.filter((data) => data.product_id === Number(id) && data.isRejected === false) : ""

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="bg-nav">
                <Navbar2 />
            </div>
            <Container >
                {successResponse.isSuccess && (
                    <Alert variant="success" className='mt-5' onClose={() => setSuccessResponse(true)} dismissible>{successResponse.message}</Alert>
                )}
                <div className="flex-container">
                    <div style={{ width: "100%" }}>
                        <div className="carousel">
                            <Carousel>
                                {data.image ? data.image.map((image) => (
                                    <Carousel.Item>
                                        <div>
                                            <Link className="arrow2" to="/" style={{ color: "black" }}>
                                                <FiArrowLeft />
                                            </Link>
                                            <img
                                                className="d-block w-100"
                                                src={`${image}`}
                                                alt=''
                                            />
                                        </div>
                                    </Carousel.Item>
                                )) : ""}
                            </Carousel>
                        </div>
                    </div>

                    <div style={{ width: "45%", justifyContent: "space-around", marginLeft: "30px" }} className="top-20">
                        <div class="textShadowBox2  w-100  mt-4">
                            <h4>{data.name}</h4>
                            <h6>{data.category}</h6>
                            <h5>Rp {data.price}</h5>
                            <Button className="btnPurple w-100 mt-2 mb-2" disabled={Object.keys(filteredTransaction).length !== 0} type='submit' onClick={data.user_id === user.id ? (e) => onUpdate(e, true) : handleShow}>{data.user_id === user.id ? 'terbitkan' : Object.keys(filteredTransaction).length !== 0 ? 'Menunggu Respon Penjual' : 'saya tertarik dan ingin nego'}</Button>
                            <Link to={`/updateproduct/${data.id}`}>
                                <Button
                                    className="btnPurple2 w-100 mt-2 "
                                    style={{ background: "#FFFFFF", color: "black" }}
                                    hidden={data.user_id === user.id ? false : true}
                                >
                                    Edit
                                </Button>
                            </Link>
                        </div>

                        <div class="textShadowBox2  mt-4 " >
                            <div className="justify-content-start">
                                <div className="flex-container2">
                                    <div>
                                        <img src={`${data.user ? data.user.image : ""}`} style={{ height: '48px', width: '48px', objectFit: 'cover', borderRadius: '12px' }} alt='' />
                                    </div>
                                    <div style={{ marginLeft: '1rem' }}>
                                        <h5>{data.user && data.user.name}</h5>
                                        <h5>{data.user && data.user.kota}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="desc">
                    <div className="textShadowBox p-4 mt-4 mb-4">
                        <h4>Deskripsi</h4>
                        <div >
                            {data.description}
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={handleClose} centered size="sm" dialogClassName="modal-30w">
                    <div className="p-3">
                        <Modal.Header closeButton className="border-0">
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="fw-bold">Masukan Harga Tawarmu</p>
                            <p className="text-black-50">Harga tawaranmu akan diketahui penual, jika penjual cocok kamu akan segera dihubungi penjual.</p>
                            <Stack direction="horizontal" gap={3} className="bg-color-grey radius-secondary p-2">
                                <img src={`${data.image ? data.image[0] : ""}`} alt=""
                                    style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "12px" }} />
                                <Stack>
                                    <p className="m-0 fw-bold">{data.name}</p>
                                    <p className="m-0 text-black-50">Rp. {data.price}</p>
                                </Stack>
                            </Stack>
                            <Form className="">
                                <Form.Group className="mt-3">
                                    <Form.Label className="fs-7">Harga Tawar</Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={requestedPrice}
                                        placeholder="Rp. 0,00"
                                        className="radius-primary box-shadow"
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                            <Button className="btnPurple w-100 radius-primary border-0" onClick={(e) => onCreateTransaction(e, false, false, null)}>
                                Kirim
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>

                {errorResponse.isError && (
                    <Alert variant="danger" className="mt-2">{errorResponse.message}</Alert>
                )}
            </Container>
        </>
    );
}

export default DetailProduct;
