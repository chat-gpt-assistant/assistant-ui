import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Conversation from "./components/conversation/Conversation";
import React from "react";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<Conversation/>}/>
          <Route path="chat/:id" element={<Conversation/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
