// router.jsx
import { createBrowserRouter } from 'react-router-dom';

import Login from '../Pages/Login/LoginAdm'
import ErroPage from '../components/PaginaDeErro/ErrorPage.jsx';
import CadastroMedicos from '../Pages/Cadastro/CadastroMedicos.jsx';
import VisualizarMedicos from '../Pages/VerMédicos/VisualizarMedicos.jsx';
import PerfilMedico from '../Pages/PerfilMedico/PerfilMedico.jsx';
import DuvidaPaciente from '../Pages/Duvidas/DuvidaPaciente.jsx';
import HomeAdm from '../Pages/Home/HomeAdm.jsx';


const router = createBrowserRouter([
    { path: "/",element: <Login />, errorElement: <ErroPage /> },
    { path: "/login", element: <Login /> },
    { path: "/cadastro", element: <CadastroMedicos /> },
    { path: "/verMedicos", element: <VisualizarMedicos /> },
    { path: "/perfilMedico/:id", element: <PerfilMedico /> },
    { path: "/duvidas", element: <DuvidaPaciente /> },
    { path: "/homeAdm", element: <HomeAdm /> },
]);

export default router;
