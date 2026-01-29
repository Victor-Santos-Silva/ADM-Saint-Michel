import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./visualizarMedicos.css";

export default function VisualizarMedicos() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div>
      <Header />

      <Footer />
    </div>
  );
}
