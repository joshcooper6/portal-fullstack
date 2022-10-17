import './App.css';
import { Routes, Route } from "react-router-dom";
import { Account, Dashboard, NumCounter } from './comps';
import TestPage from './comps/TestPage';

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Account />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/numbers" element={<TestPage />} />

      </Routes>
    </>
  );
}

export default App;
