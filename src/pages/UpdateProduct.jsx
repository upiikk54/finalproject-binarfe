import { useEffect, useRef, useState } from "react";
import { Nav, Navbar, Form, Container, Alert, Button } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import axios from "axios";
import "../css/updateProduct.css";
import { useDropzone } from "react-dropzone";
import { Box } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function UpdateProduct() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const { id } = useParams();
    const nameField = useRef("");
    const priceField = useRef("");
    const categoryField = useRef("");
    const descriptionField = useRef("");

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };

    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 4,
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const rejected = fileRejections.map(() => {
        return <div></div>
    });

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    alt=''
                    // Revoke data uri after image is loaded
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    const onUpdate = async (e, isPublish) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const postPayload = new FormData();
            postPayload.append("name", nameField.current.value);
            postPayload.append("price", priceField.current.value);
            postPayload.append("category", categoryField.current.value);
            postPayload.append("description", descriptionField.current.value);
            postPayload.append("isPublish", isPublish);
            files.forEach(element => {
                postPayload.append("image", element);
            });
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
            console.log(id);

            const createResponse = createRequest.data;

            if (createResponse.status) navigate(`/detailProduct/${data.id}`);
        } catch (err) {
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    const getProduct = async () => {
        try {
            const token = localStorage.getItem("token");
            const responseProduct = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            const dataProduct = await responseProduct.data.data.getProductById;

            setData(dataProduct)
            console.log(dataProduct);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getProduct();
    }, [])
    console.log(data.image);

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-all na1-update-product py-4">
                <Link to="/">
                    <button className="na2-update-product navbar-brand box-update-product"></button>
                </Link>
                <Navbar.Brand href="/" />
                <Nav className="text-dark info-update-product-nav"> Update Produk </Nav>
            </nav>

            <Container className="my-5 w-50">
                <div>
                    <Link
                        className="arrow2-update-product"
                        to={`/detailProduct/${data.id}`}
                        style={{ color: "black" }}
                    >
                        <FiArrowLeft />
                    </Link>
                </div>
                <div>
                    <Nav className="info3-update-product text-dark">Update Produk</Nav>
                </div>

                <Form
                    className="border1-update-product mb-3"
                    style={{ fontWeight: "bold" }}
                >
                    <Form.Label>Nama Produk</Form.Label>
                    <Form.Control type="text" ref={nameField} defaultValue={data.name} placeholder="Nama" />
                </Form>
                <Form
                    className="border1-update-product mb-3"
                    style={{ fontWeight: "bold" }}
                >
                    <Form.Label>Harga Produk</Form.Label>
                    <Form.Control type="text" ref={priceField} defaultValue={data.price} placeholder="Rp 0,00" />
                </Form>
                <Form.Group className="mb-3" style={{ fontWeight: "bold" }}>
                    <Form.Label>Kategori</Form.Label>
                    <select ref={categoryField} selected={data.category === "Hobi" ? "selected" : ""} className="form-select">
                        <option hidden>Pilih Kategori</option>
                        <option value="hobi">Hobi</option>
                        <option value="kendaraan">Kendaraan</option>
                        <option value="Baju">Baju</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="kesehatan">Kesehatan</option>
                    </select>
                </Form.Group>
                <Form.Group className="mb-3" style={{ fontWeight: "bold" }}>
                    <Form.Label>Deskripsi</Form.Label>
                    <Form.Control
                        type="text"
                        ref={descriptionField}
                        defaultValue={data.description}
                        placeholder="Contoh: Jalan Ikan Hiu 33"
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
                <Form.Group className="mb-3" style={{ fontWeight: "bold" }}>
                    Foto Produk
                </Form.Group>
                <section className="container">
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        {files.length === 0 ? <button className="mb-3 box2-update-product">
                            <Box className="profil-account1 d-flex">
                                {data.image ? data.image.map((img) => (
                                    <Box component={'img'}
                                        className="profil-camera-form1"
                                        src={`${img}`}
                                    />
                                )) : <h2>
                                    <BiPlus className="plus-update-product" />
                                </h2>}
                            </Box>

                        </button> :
                            <div>
                                {thumbs}
                            </div>}
                        {rejected[0] && <Alert variant="danger">gambar maksimal 4</Alert>}
                    </div>
                </section>
                <div className="d-flex justify-content-between">
                    <Button
                        className="myButton6-update-product"
                        type="submit"
                        onClick={(e) => onUpdate(e, false)}
                    >
                        Simpan
                    </Button>
                    <Link to={`/detailProduct/${data.id}`} className="myButton7-update-product">
                        <Button
                            className="w-100"
                            variant="light"
                        >
                            Batal
                        </Button>
                    </Link>
                </div>
                {errorResponse.isError && (
                    <Alert variant="danger" className="mt-2">{errorResponse.message}</Alert>
                )}
            </Container>
        </div>
    );
}

export default UpdateProduct;