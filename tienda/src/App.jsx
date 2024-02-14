import ItemListContainer from "./components/itemListContainer/itemListContainer";
import Navbar from "./components/nabvar/Navbar";
import ItemDetailContainer from "./components/itemDetailContainer/ItemDetailContainer";
import "./main.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormularioCompra from "./components/formularioCompra/FormularioCompra";
import { CartProvider } from "./context/CartContext";
import Carrito from "./components/carrito/Carrito";
import Footer from "./components/footer/Footer";
import Inicio from "./components/inicio/Inicio";
import Mayorista from "./components/mayorista/mayorista";

function App() {

  return (
    <div>
      <CartProvider>
      <BrowserRouter>
      <Navbar />
            
      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/articulo/:id" element={<ItemDetailContainer />}/>
        <Route path="/catalogo/:categoria?" element={<ItemListContainer flagCatalogo={true}/>} />
        <Route path="/carrito" element={<Carrito/>} />
        <Route path="/formulario" element={<FormularioCompra/>} />
        <Route path="/mayorista" element={<Mayorista/>}></Route>
      </Routes>

      <Footer />

      </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
