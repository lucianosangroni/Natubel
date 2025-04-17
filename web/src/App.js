import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import CargarPedido from './components/CargarPedido/CargarPedido';
import Proveedores from './components/Proveedores/Proveedores';
import Clientes from './components/Clientes/Clientes';
import Articulos from './components/Articulos/Articulos';
import Pedidos from './components/Pedidos/Pedidos';
import Login from './components/Login/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Precios from './components/Precios/Precios';
import EditarPedido from './components/EditarPedido/EditarPedido';
import CuentaCorriente from './components/CuentaCorriente/CuentaCorriente';
import HistorialCuentaCorriente from './components/HistorialCuentaCorriente/HistorialCuentaCorriente';
import Imputacion from './components/Imputacion/Imputacion';

function App() {
    return (

    <div >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='' element={<Navigate to='/admin/login'/>}/>
            <Route path='admin' element={<Navigate to='/admin/login'/>}/>
            <Route path='admin/login' element={<Login/>}/>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/cargar-pedido" element={<CargarPedido/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/proveedores" element={<Proveedores/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/clientes" element={<Clientes/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/articulos" element={<Articulos/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/pedidos" element={<Pedidos/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/pedidos/:numero_pedido" element={<EditarPedido/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/precios" element={<Precios/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/cuenta-corriente/:email" element={<CuentaCorriente/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/cuenta-corriente/:email/historial" element={<HistorialCuentaCorriente/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/cobranzas/:numeroImputacion" element={<Imputacion/>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
