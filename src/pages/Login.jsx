import { useRef, useState } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";


export default function Login() {

    const navigate = useNavigate();

    const emailField = useRef("");
    const passwordField = useRef("");

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const onLogin = async (e) => {
        e.preventDefault();

        try {
            const userToLoginPayload = {
                email: emailField.current.value,
                password: passwordField.current.value,
            };

            const loginRequest = await axios.post(
                "https://deployment-finalprojectbe.herokuapp.com/auth/login",
                userToLoginPayload
            );

            const loginResponse = loginRequest.data;
            console.log(loginResponse);

            if (loginResponse.status) {
                localStorage.setItem("token", loginResponse.data.token);

                navigate("/");
            }
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
        <Row>
            <Col className="register-left">
                <img src="/images/img-register.png" alt=""/>
            </Col>
            <Col className="register-right">
                <h3 className="mb-3">Masuk</h3>
                <Form onSubmit={onLogin}>
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
                        Masuk
                    </Button>
                    <p className="m-4 text-center">
                        Belum punya akun? <Link style={styleLink} to="/register">Daftar di sini</Link>
                    </p>
                </Form>
            </Col>
        </Row>
    );
}
