import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/ThemeContext";
import "./cadastroMedicos.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { IMaskInput } from "react-imask";

export default function CadastroMedicos() {
  return (
    <div>
      <Header />

      <Footer />
    </div>
  );
}
