import ClientesTableAdm from './components/ClientesTableAdm';
import NavbarAdm from './components/NavbarAdm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PedidoProveedoresAdm from './components/PedidoProveedoresAdm';
import ListadoClientes from './components/ListadoClientes';
import ListadoProductos from './components/ListadoProductos';
import HistorialPedidos from './components/HistorialPedidos';



function App() {
  return (
    <div >
      <BrowserRouter>

          <NavbarAdm />

        <Routes>
                  <Route path="/clientestableadm" element={<ClientesTableAdm/>}/>
                  <Route path="/pedidosproveedoresadm" element={<PedidoProveedoresAdm />}/>
                  <Route path="/listadoclientes" element={<ListadoClientes />}/>
                  <Route path="/listaproductos" element={<ListadoProductos />}/>
                  <Route path="/historialpedidos" element={<HistorialPedidos />}/>

        </Routes>

          

      </BrowserRouter>
    </div>
  );
}

export default App;
