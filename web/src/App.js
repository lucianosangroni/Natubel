import ClientesTableAdm from './components/ClientesTableAdm';
import NavbarAdm from './components/NavbarAdm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ListadoProveedores from './components/ListadoProveedores';
import ListadoClientes from './components/ListadoClientes';
import ListadoProductos from './components/ListadoProductos';
import HistorialPedidos from './components/HistorialPedidos';




function App() {
  return (
    <div >
      <BrowserRouter>

          <NavbarAdm />
         

        <Routes>
                  <Route path="adm/pedidoclientes" element={<ClientesTableAdm/>}/>
                  <Route path="adm/listadoproveedores" element={<ListadoProveedores />}/>
                  <Route path="adm/clientes" element={<ListadoClientes />}/>
                  <Route path="adm/listadodeproductos" element={<ListadoProductos />}/>
                  <Route path="adm/historialdepedidos" element={<HistorialPedidos />}/>

        </Routes>

          

      </BrowserRouter>
    </div>
  );
}

export default App;
