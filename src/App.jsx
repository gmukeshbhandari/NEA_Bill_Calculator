import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Tarrif from "./components/Tarrif";
import OfficialLinks from "./components/OfficialLinks";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nea-consumer-rariff-rates" element={<Tarrif />} />
          <Route path="/officiallinks" element={<OfficialLinks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
