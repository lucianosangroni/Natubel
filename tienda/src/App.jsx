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


function App() {

  return (
    <div>
      <CartProvider>
      <BrowserRouter>
      <Navbar />
            
      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/item/:id" element={<ItemDetailContainer />}/>
        <Route path="/catalogo" element={<ItemListContainer/>} />
        <Route path="/catalogo/:categoria" element={<ItemListContainer/>} />
        <Route path="/carrito" element={<Carrito/>} />
        <Route path="/formulario" element={<FormularioCompra/>} />
      </Routes>

      <Footer />

      </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
