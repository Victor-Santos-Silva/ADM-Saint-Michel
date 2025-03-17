// router.jsx
import { createBrowserRouter } from 'react-router-dom';

import Login from '../Pages/Login/LoginAdm'
import ErroPage from '../components/PaginaDeErro/ErrorPage.jsx';
import CadastroMedicos from '../Pages/Cadastro/CadastroMedicos.jsx';
import VisualizarMedicos from '../Pages/VerMédicos/visualizarMedicos.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErroPage />,
        children: [
            { path: "/", element: <Login /> },
            { path: "/login", element: <Login /> },
            { path: "/cadastro", element: <CadastroMedicos /> },
            { path: "/verMedicos", element: <VisualizarMedicos /> },
        ]
    }
]);

export default router;
