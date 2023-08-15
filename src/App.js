import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import * as Pages from "./pages";
// import { Navigation } from "./components";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";

const App = () => {
  const [showLandingBtn, setShowLandingBtn] = useState();

  return (
    <>
      {/* <Navigation/> */}
      <Routes>
        <Route
          path="/"
          element={
            <Pages.Landing
              showLandingBtn={showLandingBtn}
              setShowLandingBtn={setShowLandingBtn}
            />
          }
        />

        <Route path="/home" element={<Pages.Home />} />
      </Routes>
    </>
  );
};

export default App;
