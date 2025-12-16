import React from "react";
import "./App.css";
import { FaVk, FaTelegramPlane, FaUserCircle, FaUser } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Tema from "./themes_py/Tema";
import ArrayPage from "./themes_py/Array";
import ListsPage from "./themes_py/Lists";
import LoopsPage from "./themes_py/Loops";
import Login from "./Register/Login";
import Register from "./Register/Register";
import TemaJs from "./theme_js/Tema_js";
import ArrayJsPage from "./theme_js/Array_js";
import ObjectsJsPage from "./theme_js/Objects_js";
import LoopsJsPage from "./theme_js/Loops_js";

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Проверяем, авторизован ли пользователь
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="container">
      {/* Верхняя панель */}
      <header className="header">
        <h1 className="logo">Решалка</h1>
        <div className="icons" style={{ display: "flex", gap: "20px" }}>
          {/* Ссылки на соцсети */}
          <a
            href="https://vk.ru/tyagunov.nikita"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaVk className="icon" />
          </a>

          <a
            href="https://t.me/nikitaRUSS1512"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane className="icon" />
          </a>

          {/* Условное отображение: иконка профиля или иконка входа */}
          {user ? (
            <FaUserCircle
              className="icon-profile"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            />
          ) : (
            <FaUser
              className="icon-login"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            />
          )}
        </div>
      </header>

      {/* Центральное меню */}
      <main className="main" style={{ display: "flex", gap: "30px", padding: "50px" }}>
        <button className="circle py" title="Python" onClick={() => navigate("/tema")}></button>
        <button className="circle js" title="JavaScript" onClick={() => navigate("/js/tema")}></button>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tema" element={<Tema />} /> 
        <Route path="/array" element={<ArrayPage />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/loops" element={<LoopsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/js/tema" element={<TemaJs />} />
        <Route path="/js/array" element={<ArrayJsPage />} />
        <Route path="/js/objects" element={<ObjectsJsPage />} />
        <Route path="/js/loops" element={<LoopsJsPage />} />
      </Routes>
    </Router>
  );
};

export default App;