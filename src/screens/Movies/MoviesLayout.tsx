import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

const MoviesLayout = () => {
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default MoviesLayout;
