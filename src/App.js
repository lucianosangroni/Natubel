import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import CargarPedido from './components/CargarPedido/CargarPedido';
import Proveedores from './components/Proveedores/Proveedores';
import Clientes from './components/Clientes/Clientes';
import Articulos from './components/Articulos/Articulos';
import Pedidos from './components/Pedidos/Pedidos';
import Login from './components/Login/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (

    <div >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='' element={<Navigate to='/login'/>}/>
            <Route path='login' element={<Login/>}/>
            <Route element={<ProtectedRoute/>}>
              <Route path="cargar-pedido" element={<CargarPedido/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="proveedores" element={<Proveedores/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="clientes" element={<Clientes/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="articulos" element={<Articulos/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="pedidos" element={<Pedidos/>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
