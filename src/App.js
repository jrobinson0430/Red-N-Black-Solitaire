import { Route, Routes } from "react-router-dom";
import * as Pages from "./pages";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/Home";

const App = () => {
  return (
  <>
  <Routes>
    <Route path="/" element={<Pages.Home />} />
  </Routes>
  
  
  </>
)
};

export default App;
