import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import UdharChallan from "./pages/udharChallan/UdharChallan";
import JamaChallan from "./pages/jamaChallan/JamaChallan";
import KhataWahi from "./pages/khataWahi/KhataWahi";
import Rojmel from "./pages/rojmel/Rojmel";
import Bills from "./pages/bills/Bills";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/udharchallan" element={<UdharChallan />} />
        <Route path="/jamachallan" element={<JamaChallan />} />
        <Route path="/khatawahi" element={<KhataWahi />} />
        <Route path="/rojmel" element={<Rojmel />} />
        <Route path="/bills" element={<Bills />} />
      </Routes>
    </Router>
  );
}

export default App;
