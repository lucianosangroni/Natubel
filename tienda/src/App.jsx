import ItemListContainer from "./components/itemListContainer/itemListContainer";
import Navbar from "./components/nabvar/Navbar";
import ItemDetailContainer from "./components/itemDetailContainer/ItemDetailContainer";
import "./main.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
      
      <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<ItemListContainer />}/>
        <Route path="/item/:id" element={<ItemDetailContainer />}/>
        <Route path="/productos" element={<ItemListContainer/>} />
        <Route path="/productos/:categoria" element={<ItemListContainer/>} />
      </Routes>


      </BrowserRouter>
    </div>
  );
}

export default App;
