import { useEffect, useRef, useState } from "react";
import { Nav, Navbar, Form, Container, Button, Alert } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FiCamera, FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import "../css/mainRio.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function About() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { id } = useParams();
  const nameField = useRef("");
  const kotaField = useRef("");
  const alamatField = useRef("");
  const noHpField = useRef("");
  const [imageField, setimageField] = useState();

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  useEffect(() => {

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
        setIsLoggedIn(false);
      }
    };

    fetchData();
  }, []);

  const onUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const userToUpdatePayload = new FormData();
      userToUpdatePayload.append("name", nameField.current.value);
      userToUpdatePayload.append("kota", kotaField.current.value);
      userToUpdatePayload.append("alamat", alamatField.current.value);
      userToUpdatePayload.append("noHp", noHpField.current.value);
      userToUpdatePayload.append("image", imageField);
      setOpen(true);

      const updateRequest = await axios.put(
        `https://deployment-finalprojectbe.herokuapp.com/api/users/${id}`,
        userToUpdatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updateResponse = updateRequest.data;

      if (updateResponse.status) navigate("/InfoProduct");
    } catch (err) {
      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* navbar */}
      <div className="na1 py-4 shadow">
        <nav className="navbar navbar-expand-lg navbar-light bg-all">
          <Link to="/">
            <button className="na2 navbar-brand box"></button>
          </Link>
          <Navbar.Brand href="#" className="brand" />
          <div className="offcanvas-body" id="offcanvasRight">
            <div className="info1 navbar">
              <Nav className="text-dark"> Lengkapi Info Akun </Nav>
            </div>
          </div>
        </nav>
      </div>

      <Container className="my-5 w-50">
        <div>
          <Link className="arrow2" to="/" style={{ color: "black" }}>
            <FiArrowLeft />
          </Link>
        </div>
        <div>
          <Nav className="info2 text-dark">Lengkapi Info Akun</Nav>
        </div>
        <Form onSubmit={onUpdate}>
          <button className="mb-3 box1 buttonCamera" >
            <h2>
              <FiCamera
                className="camera"
              />
            </h2>
            <Form.Control type="file" className="formCamera" onChange={(e) => {
              setimageField(e.target.files[0])
            }} />
          </button>
          <Form className="border1 mb-3">
            <Form.Label>Nama*</Form.Label>
            <Form.Control type="text" ref={nameField} defaultValue={user.name} />
          </Form>
          <Form.Group className="mb-3">
            <Form.Label>Kota*</Form.Label>
            <Form.Select ref={kotaField} defaultValue={user.kota} className="form-select">
              <option hidden>Pilih Kota</option>
              <option value="Jakarta">Jakarta</option>
              <option value="JawaTengah">Jawa Tengah</option>
              <option value="JawaTimur">Jawa Timur</option>
              <option value="JawaBarat">Jawa Barat</option>
              <option value="KalimantanTengah">Kalimantan Tengah</option>
              <option value="KalimantanTimur">Kalimantan Timur</option>
              <option value="KalimantanSelatan">Kalimantan Selatan</option>
              <option value="KalimantanBarat">Kalimantan Barat</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alamat*</Form.Label>
            <Form.Control
              type="text"
              ref={alamatField}
              defaultValue={user.alamat}
              placeholder="Contoh: Jalan Ikan Hiu 33"
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>No Handphone*</Form.Label>
            <Form.Control
              type="text"
              ref={noHpField}
              defaultValue={user.noHp}
              placeholder="contoh: +628123456789"
            />
          </Form.Group>
          {errorResponse.isError && (
            <Alert variant="danger">{errorResponse.message}</Alert>
          )}
          <Button className="myButton6 w-100" type="submit">
            Simpan
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default About;
