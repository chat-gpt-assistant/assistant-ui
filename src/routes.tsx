import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                {/* Add more routes here as needed */}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
