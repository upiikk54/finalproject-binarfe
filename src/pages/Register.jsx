import "../css/main.css";
import React, { useRef, useState } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const navigate = useNavigate();

    const nameField = useRef("");
    const emailField = useRef("");
    const passwordField = useRef("");

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const onRegister = async (e) => {
        e.preventDefault();

        try {
            const userToRegisterPayload = {
                name: nameField.current.value,
                email: emailField.current.value,
                password: passwordField.current.value,
            };

            const registerRequest = await axios.post(
                "https://deployment-finalprojectbe.herokuapp.com/auth/register",
                userToRegisterPayload
            );

            const registerResponse = registerRequest.data;

            if (registerResponse.status) navigate("/login");
        } catch (err) {
            console.log(err);
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    const styleLabel = {
        borderRadius: '10px',
    };

    const styleLink = {
        textDecoration: 'none',
        color: '#7126B5',
        fontWeight: 'bold',
    }

    return (
        <>
            <Row>
                <Col className="register-left">
                    <img src="/images/img-register.png" alt="" />
                </Col>
                <Col className="register-right">
                    <h3 className="mb-3">Daftar</h3>
                    <Form onSubmit={onRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                ref={nameField}
                                placeholder="Nama Lengkap"
                                style={styleLabel}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                ref={emailField}
                                placeholder="Contoh: johndee@gmail.com"
                                style={styleLabel}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordField}
                                placeholder="Masukkan Password"
                                style={styleLabel}
                            />
                        </Form.Group>
                        {errorResponse.isError && (
                            <Alert variant="danger">{errorResponse.message}</Alert>
                        )}
                        <Button className="w-100" type="submit" style={styleLabel}>
                            Daftar
                        </Button>
                        <p className="m-4 text-center">
                            Sudah punya akun? <Link style={styleLink} to="/login">Masuk di sini</Link>
                        </p>
                    </Form>
                </Col>
            </Row>
        </>
    );
}
