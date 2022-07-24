import "../css/detailproduct.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Navbar, Container, Button, Dropdown, Offcanvas } from "react-bootstrap";
import { FiLogIn, FiList, FiUser, FiBell } from "react-icons/fi";
import { addUser } from "../slices/userSlice";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import { addSearch } from "../slices/searchingSlice";
import dateFormat from "dateformat";


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    background: '#EEEEEE',
    borderRadius: '16px',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    display: 'block',
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '35ch',
        },
    },
}));


export default function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [searching, setSearching] = useState("");
    const [notif, setNotif] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //change nav color when scrolling
    const [color, setColor] = useState(false);
    const changeColor = () => {
        if (window.scrollY >= 10) {
            setColor(true)
        } else {
            setColor(false)
        }
    }

    const handleSearch = () => {
        dispatch(
            addSearch(searching)
        )
    }

    window.addEventListener('scroll', changeColor)


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
                    dispatch(
                        addUser({
                            user: currentUserResponse.data.user,
                            token: token,
                        })
                    );
                    localStorage.setItem("user", JSON.stringify(currentUserResponse.data.user))
                    setUser(currentUserResponse.data.user);
                }
            } catch (err) {
                setIsLoggedIn(false);
            }
        };
        handleSearch();
        fetchData();
    }, [searching]);

    useEffect(() => {
        const notifikasi = async () => {
            try {
                const token = localStorage.getItem("token");
                const user_local = localStorage.getItem("user");
                const user = JSON.parse(user_local);

                const notifRequest = await axios.get(`https://deployment-finalprojectbe.herokuapp.com/api/transactionNotif/${user.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                console.log(notifRequest);
                const notifResponse = notifRequest.data.data.getTransactionNotif;
                console.log(notifResponse);
                setNotif(notifResponse);
            } catch (err) {
                console.log(err);
            }
        }

        notifikasi();
    }, [])




    return (
        <>
            <Navbar expand="lg" className={color ? 'navbar-scroll' : 'navbarDetail'}>
                <Container className="home-navbar" >
                    <Navbar.Brand className="logo" href="/"></Navbar.Brand>
                    <div className="me-auto">
                        <Search>
                            <SearchIcon className="search-icon" />
                            <StyledInputBase
                                onChange={(e) => {
                                    setSearching(e.target.value)
                                }}
                                placeholder="Cari di sini …"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </div>
                    <div>
                        <Navbar.Toggle onClick={handleShow} aria-controls="off-canvas" />
                        <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                            {!isLoggedIn ? (
                                <Navbar.Offcanvas show={show} onHide={handleClose} id="off-canvas">
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title className="title-navbar-mobile">Second Hand</Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body>
                                        <Button variant="success" className="button-register" href="/login">
                                            <FiLogIn className="icon-register" />
                                            Masuk
                                        </Button>
                                    </Offcanvas.Body>
                                </Navbar.Offcanvas>

                            ) : (
                                <>
                                    <Button className="home-navbar-user" href="/seller/daftar-jual"><FiList className="icon-list-header" /></Button>
                                    <Dropdown >
                                        <Dropdown.Toggle variant="white" id="dropdown-basic">
                                            <FiBell className="icon-bell-header" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            {notif.map((notif) => (
                                                    <Dropdown.Item>
                                                        <Link to={`/sellerproductpenawar/${notif.id}`} style={{ textDecoration: "none", color: "black" }}>
                                                            <div class="d-flex my-1">
                                                                <img
                                                                    src={`${notif.product.image[0]}`}
                                                                    style={{ width: '60px', height: '60px', marginTop: '5px' }}
                                                                    alt=""
                                                                />
                                                                <div class="mx-3">
                                                                    <p className="mb-0 notif-accesoris">Penawaran Produk</p>
                                                                    <p className="mb-0">{notif.product.name}</p>
                                                                    <p className="mb-0">Rp.{notif.product.price}</p>
                                                                    <p className="mb-0">{user.id === notif.owner_id ? "ditawar" : user.id === notif.user_id && "menawar"} Rp.{notif.requestedPrice}</p>
                                                                </div>
                                                                <div class="ms-auto">
                                                                    <p className="mb-0 notif-accesoris">
                                                                        {dateFormat(notif.createdAt, "d mmm, h:MM")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <Divider variant="middle" className="mt-3" />
                                                    </Dropdown.Item>
                                                )).reverse()}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Button className="home-navbar-user" href="/account"><FiUser className="icon-user-header" /></Button>
                                    <Offcanvas show={show} onHide={handleClose} id="off-canvas">
                                        <Offcanvas.Header closeButton>
                                            <Offcanvas.Title className="title-navbar-mobile">Second Hand</Offcanvas.Title>
                                        </Offcanvas.Header>
                                        <Offcanvas.Body>
                                            <Dropdown.Item href="#/action-1">Notifikasi</Dropdown.Item>
                                            <Dropdown.Item className="mt-2" href="/seller/daftar-jual">Daftar Jual</Dropdown.Item>
                                            <Dropdown.Item className="mt-2" href="/account">Akun Saya</Dropdown.Item>
                                        </Offcanvas.Body>
                                    </Offcanvas>
                                </>
                            )
                            }
                        </Navbar.Collapse>
                    </div>
                </Container>
            </Navbar>
        </>
    );
}


