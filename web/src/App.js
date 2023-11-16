import CargarPedido from './components/CargarPedido';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ListadoProveedores from './components/ListadoProveedores';
import ListadoClientes from './components/ListadoClientes';
import ListadoProductos from './components/ListadoProductos';
import HistorialPedidos from './components/HistorialPedidos';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
    <div >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='admin' element={<Navigate to='/admin/login'/>}/>
            <Route path='admin/login' element={<Login/>}/>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/cargar-pedido" element={<CargarPedido/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/proveedores" element={<ListadoProveedores/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/clientes" element={<ListadoClientes/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/productos" element={<ListadoProductos/>} />
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path="admin/pedidos" element={<HistorialPedidos/>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
