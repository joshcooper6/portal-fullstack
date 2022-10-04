import './App.css';
import { Routes, Route } from "react-router-dom";
import { Account, Dashboard } from './comps';

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Account />} />
          <Route path="/auth" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
