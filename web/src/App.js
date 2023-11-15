import CargarPedido from './components/CargarPedido';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ListadoProveedores from './components/ListadoProveedores';
import ListadoClientes from './components/ListadoClientes';
import ListadoProductos from './components/ListadoProductos';
import HistorialPedidos from './components/HistorialPedidos';
import Login from './components/Login';

function App() {
    return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path='admin' element={<Navigate to='/admin/login' />}/>
          <Route path='admin/login' element={<Login/>}/>
          <Route path="admin/cargarPedido" element={<CargarPedido />} />
          <Route path="admin/listadoproveedores" element={<ListadoProveedores />} />
          <Route path="admin/clientes" element={<ListadoClientes />} />
          <Route path="admin/listadodeproductos" element={<ListadoProductos />} />
          <Route path="admin/historialdepedidos" element={<HistorialPedidos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
