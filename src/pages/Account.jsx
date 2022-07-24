import "../css/account.css";
import * as React from 'react';
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import { FiEdit3, FiLogOut, FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function SelectedListItem() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState({});
    const [imageField, setimageField] = useState();


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



    const logout = () => {
        localStorage.removeItem("token");

        setIsLoggedIn(false);
        setUser({});

        navigate("/");
    };

    const alertLogout = async () => {
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Anda akan keluar dari akun ini",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Log out",
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    'LOGOUT!',
                    'Anda telah keluar dari akun ini.',
                    'success'
                )
                logout();
            } else if (result.dismiss == 'cancel') {
                console.log('cancel');
            }
        });
    };

    return isLoggedIn ? (
        <>
            <Navbar expand="lg" className="navbar-account" >
            <Link className="arrow-account" to="/" style={{ color: "black" }}>
                <FiArrowLeft />
            </Link>
                <Container className="navbar-account-items">
                    <Navbar.Brand className="logo" href="/"></Navbar.Brand>
                    <h3 className="navbar-account-text">Akun Saya</h3>
                </Container>
            </Navbar>
            

            <Container className="my-5 w-50">
                <Box className="profil-account">
                    <Box component={'img'}
                        className="profil-camera-form"
                        src={`${user.image}`}
                    />
                </Box>
            </Container>
            <div className="account-items">
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <List component="nav" aria-label="main mailbox folders">
                        <Link to={`/EditProfil/${user.id}`} style={{ textDecoration: "none", color: "black" }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <FiEdit3 className="edit-account-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Ubah Akun" />
                            </ListItemButton>
                        </Link>

                        <Divider />
                        <ListItemButton>
                            <ListItemIcon>
                                <SettingsOutlinedIcon className="setting-account-icon" />
                            </ListItemIcon>
                            <ListItemText primary="Pengaturan Akun" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={alertLogout}>
                            <ListItemIcon>
                                <FiLogOut className="logout-icon" />
                            </ListItemIcon>
                            <ListItemText primary="Keluar" />
                        </ListItemButton>
                    </List>
                    <Divider />
                    <p className="account-text1">Version 1.0.0</p>
                </Box>
            </div>
        </>
    ) : (
        <Navigate to="/login" replace />
    );
}
