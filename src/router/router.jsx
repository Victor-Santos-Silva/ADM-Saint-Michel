// router.jsx
import { createBrowserRouter } from 'react-router-dom';

import Login from '../Pages/Login/LoginAdm'
import ErroPage from '../components/PaginaDeErro/ErrorPage.jsx';
import CadastroMedicos from '../Pages/Cadastro/CadastroMedicos.jsx';
import VisualizarMedicos from '../Pages/VerMédicos/VisualizarMedicos.jsx';
import PerfilMedico from '../Pages/PerfilMedico/PerfilMedico.jsx';


const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErroPage />,
        children: [
            { path: "/", element: <Login /> },
            { path: "/login", element: <Login /> },
            { path: "/cadastro", element: <CadastroMedicos /> },
            { path: "/verMedicos", element: <VisualizarMedicos /> },
            { path: "/perfilMedico", element: <PerfilMedico /> },
        ]
    }
]);

export default router;
