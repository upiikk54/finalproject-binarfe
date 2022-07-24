import React from "react";
import ReactDOM from 'react-dom/client';
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import InfoProduct from "./pages/InfoProduct";
import Account from "./pages/Account";
import EditProfil from "./pages/EditProfil";
import UpdateProduct from "./pages/UpdateProduct";
import DaftarJual from "./pages/DaftarJual";
import DetailProduct from "./pages/DetailProduct";
import SellerProductPenawar from "./pages/SellerProductPenawar";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about/:id" element={<About />} />
      <Route path="/EditProfil/:id" element={<EditProfil />} />
      <Route path="/updateproduct/:id" element={<UpdateProduct />} />
      <Route path="/InfoProduct" element={<InfoProduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account" element={<Account />} />
      <Route path="/seller/daftar-jual" element={<DaftarJual />} />
      <Route path="/detailProduct/:id" element={<DetailProduct />} />
      <Route path="/sellerproductpenawar/:id" element={<SellerProductPenawar />} />
    </Routes>
  </Router>
  </Provider>
);