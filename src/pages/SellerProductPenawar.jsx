import { useEffect, useRef, useState } from "react";
import {
    Nav,
    Navbar,
    Form,
    Container,
    Alert,
    Button,
    Row,
    Col,
    Card,
    Modal,
} from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import "../css/sellerProductPenawar.css";
import dateFormat from "dateformat";

function UpdateProduct() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [sellerProduct, setSellerProduct] = useState([]);
    const { id } = useParams();

    const [showAccepted, setShowAccepted] = useState(false);
    const handleCloseAccepted = () => setShowAccepted(false);
    const handleShowAccepted = () => setShowAccepted(true);
    const [showStatus, setShowStatus] = useState(false);
    const handleCloseStatus = () => setShowStatus(false);
    const handleShowStatus = (e) => {
        e.preventDefault();
        setShowStatus(true);
    }

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const getTransaksiById = async () => {
        try {
            const token = localStorage.getItem("token");
            const responseProduct = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/transactionById/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const dataProduct = await responseProduct.data.data.getTransactionById;
            console.log(dataProduct);

            setSellerProduct(dataProduct)
        } catch (err) {
            console.log(err);
        }
    }

    const updateTransaction = async (e, isAccepted, isRejected, isOpened) => {
        e.preventDefault();

        try {
            const updateTransaction = {
                isAccepted: isAccepted,
                isRejected: isRejected,
                isOpened: isOpened
            };

            const token = localStorage.getItem("token");
            const transactionRequest = await axios.put(
                `https://deployment-finalprojectbe.herokuapp.com/api/transaction/${id}`,
                updateTransaction,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const transactionResponse = transactionRequest.data;
            console.log(transactionResponse);

            const responseProduct = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/transactionById/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const dataProduct = await responseProduct.data.data.getTransactionById;
            console.log(dataProduct);

            setSellerProduct(dataProduct)

            if (transactionResponse.status) navigate(`/sellerproductpenawar/${sellerProduct.id}`);
        } catch (err) {
            console.log(err);
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    const [selectedSold, setSelectedSold] = useState();
    const selectedButton = (e) => {
        setSelectedSold(e.target.value);
		console.log(e.target.value);
	};

    const updateStatus = async (e) => {
        e.preventDefault();

        try {
            const payloadUpdateStatus = {
                isAccepted: selectedSold === true ? true : false,
                isRejected: selectedSold === true ? false : true,
                sold: selectedSold
            };

            const token = localStorage.getItem("token");
            const statusRequest = await axios.put(
                `https://deployment-finalprojectbe.herokuapp.com/api/transaction/${id}`,
                payloadUpdateStatus,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const statusResponse = statusRequest.data;
            console.log(statusResponse);

            const responseProduct = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/transactionById/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const dataProduct = await responseProduct.data.data.getTransactionById;
            console.log(dataProduct);

            setSellerProduct(dataProduct)

            if (statusResponse.status) navigate(`/sellerproductpenawar/${sellerProduct.id}`);
        } catch (err) {
            console.log(err);
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    useEffect(() => {
        getTransaksiById();
    }, [])

    return (
        <div>
            {/* navbar */}
            <div className="na1-seller-product-penawar py-2">
                <nav className="navbar navbar-expand-lg navbar-light bg-all">
                    <Link to="/">
                        <button className="na2-seller-product-penawar navbar-brand box-update-product"></button>
                    </Link>
                    <Navbar.Brand href="#" />
                    <div className="info-seller-product-penawar navbar">
                        <Nav className="text-dark penawar-text-nav">Info Penawar</Nav>
                    </div>
                </nav>
            </div>

            <Container className="card-main">
                <div>
                    <Link
                        className="arrow2-seller-product-penawar"
                        to="/"
                        style={{ color: "black" }}
                    >
                        <FiArrowLeft />
                    </Link>
                </div>
                <div>
                    <Nav className="info3-seller-product-penawar text-dark">
                        Info Penawar
                    </Nav>
                </div>
                <Form>
                    <Card className="card-seller-product-penawar">
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Img src={`${sellerProduct.user ? sellerProduct.user.image : ""}`} alt="" />
                                </Col>
                            </Row>
                            <Card.Title className="nama-seller-product-penawar">
                                {sellerProduct.user && sellerProduct.user.name}
                            </Card.Title>
                            <Card.Text className="card-kota-seller-product-penawar">
                                {sellerProduct.user && sellerProduct.user.kota}
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Form.Group
                        className="mb-3"
                        style={{ fontWeight: "bold", marginTop: "15px" }}
                    >
                        <Form.Label>Daftar Produkmu yang Ditawar</Form.Label>
                    </Form.Group>

                    <div className="shadow-seller-product-penawar">
                        <Card
                            className="card2-seller-product-penawar"
                            style={{ marginRight: "100px", width: "100%" }}
                        >
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Img src={`${sellerProduct.product ? sellerProduct.product.image[0] : ""}`} alt="" />
                                    </Col>
                                </Row>
                                <Card.Text className="card2-kota-seller-product-penawar">
                                    Penawaran produk<p>{dateFormat(sellerProduct.createdAt, "d mmm, h:MM")}</p>
                                </Card.Text>
                                <Card.Title
                                    className="nama2-seller-product-penawar"
                                    style={{ marginTop: "-12px" }}
                                >
                                    {sellerProduct.product && sellerProduct.product.name}
                                </Card.Title>
                                <Card.Text className="nama2-seller-product-penawar">
                                    Rp {sellerProduct.product && sellerProduct.product.price}
                                </Card.Text>
                                <Card.Text className="nama2-seller-product-penawar">
                                    Ditawar Rp {sellerProduct.product && sellerProduct.requestedPrice}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <div className=" d-flex" style={{ marginBottom: "20px" }}>
                            <button
                                className="myButton7-seller-product-penawar"
                                type="submit"
                                onClick={sellerProduct.isAccepted === true ? (e) => handleShowStatus(e) : (e) => updateTransaction(e, false, true, true)}
                                hidden={sellerProduct.isRejected === true || (sellerProduct.product && sellerProduct.product.sold) === true ? true : false}
                            >
                                {sellerProduct.isAccepted === true ? "status" : "tolak"}
                            </button>
                            <button
                                className="myButton6-seller-product-penawar"
                                type="submit"
                                onClick={(e) => { updateTransaction(e, true, false, true); handleShowAccepted() }}
                                hidden={sellerProduct.isRejected === true || (sellerProduct.product && sellerProduct.product.sold) === true ? true : false}
                            >
                                {sellerProduct.isAccepted === true ? "hubungi di " : "terima"}
                            </button>
                        </div>
                    </div>
                    {errorResponse.isError && (
                        <Alert variant="danger">{errorResponse.message}</Alert>
                    )}
                </Form>
            </Container>

            {/* modal accepted */}
            <Modal
                className="Modal-info-penawar-seller"
                show={showAccepted}
                onHide={handleCloseAccepted}
                aria-labelledby="contained-modal-title-vcenter"
                size="sm"
                centered
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body
                    style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "14px",
                    }}
                >
                    Yeay kamu berhasil mendapat harga yang sesuai
                </Modal.Body>
                <Modal.Body
                    style={{
                        color: "#8A8A8A",
                        marginTop: "-25px",
                        fontSize: "14px",
                    }}
                >
                    Segera hubungi pembeli melalui whatsapp untuk transaksi
                    selanjutnya
                </Modal.Body>
                <Container>
                    <Col className="gambar-modal">
                        <Modal.Body
                            style={{
                                color: "black",
                                fontWeight: "bold",
                                textAlign: "center",
                                fontSize: "14px",
                            }}
                        >
                            Product Match
                        </Modal.Body>
                        <Card.Img
                            src={`${sellerProduct.user ? sellerProduct.user.image : ""}`}
                            alt=""
                            style={{
                                color: "black",
                                width: "48px",
                                height: "48px",
                                marginLeft: "10px",
                                borderRadius: "12px",
                                flex: "none",
                            }}
                        />
                        <Card.Title
                            className="nama-seller-product-penawar"
                            style={{
                                color: "black",
                                marginTop: "-50px",
                            }}
                        >
                            {sellerProduct.user && sellerProduct.user.name}
                        </Card.Title>
                        <Card.Text className="card-kota-seller-product-penawar">
                            {sellerProduct.user && sellerProduct.user.kota}
                        </Card.Text>
                        <Card.Img
                            src={`${sellerProduct.product ? sellerProduct.product.image[0] : ""}`}
                            alt=""
                            style={{
                                color: "black",
                                width: "48px",
                                height: "48px",
                                marginLeft: "10px",
                                borderRadius: "12px",
                                flex: "none",
                            }}
                        />
                        <Card.Title
                            className="nama2-seller-product-penawar"
                            style={{
                                marginTop: "-50px",
                            }}
                        >
                            {sellerProduct.product && sellerProduct.product.name}
                        </Card.Title>
                        <Card.Text
                            className="nama2-seller-product-penawar"
                            style={{
                                marginTop: "-5px",
                            }}
                        >
                            <s>Rp {sellerProduct.product && sellerProduct.product.price}</s>
                        </Card.Text>
                        <Card.Text className="nama2-seller-product-penawar">
                            Ditawar Rp {sellerProduct.product && sellerProduct.requestedPrice}
                        </Card.Text>
                    </Col>
                </Container>
                <Modal.Body>
                    <button
                        className="myButton8-seller-product-penawar w-100"
                        onClick={handleCloseAccepted}
                    >
                        <Link
                            to="/sellerproductpenawar2"
                            className="text-decoration-none"
                            style={{
                                color: "white",
                            }}
                        >
                            Hubungi via Whatsapp
                            <FaWhatsapp
                                style={{
                                    fontSize: "15px",
                                    marginLeft: "6px",
                                    marginBotom: "15px",
                                }}
                            />
                        </Link>
                    </button>
                </Modal.Body>
            </Modal>

            {/* modal status */}
            <Modal show={showStatus} onHide={handleCloseStatus} centered size="sm" dialogClassName="modal-30w">
                <div className="p-3">
                    <Modal.Header closeButton className="border-0">
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="fw-bold">Perbarui status penjualan produkmu</p>
                        <Form>
                            <div key={`radio`} onChange={selectedButton} className="mb-3">
                                <Form.Check
                                    name="status"
                                    type="radio"
                                    id={`radio-1`}
                                    label={`Berhasil terjual`}
                                    value={true}
                                />
                                <p className=" text-black-50">Kamu telah sepakat menjual produk ini kepada pembeli</p>

                                <Form.Check
                                    name="status"
                                    type="radio"
                                    label={`Batalkan transaksi`}
                                    id={`radio-2`}
                                    value={false}
                                />
                                <p className=" text-black-50">Kamu membatalkan transaksi produk ini dengan pembeli</p>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button
                            className="bg-color-primary w-100 radius-primary border-0"
                            onClick={(e) => { updateStatus(e); handleCloseStatus() }}
                        >
                            Kirim
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}

export default UpdateProduct;