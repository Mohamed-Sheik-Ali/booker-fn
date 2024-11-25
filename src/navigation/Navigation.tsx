import { Route, Routes } from "react-router-dom";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import DetailedMovie from "../screens/Movies/DetailedMovie";
import MoviesLayout from "../screens/Movies/MoviesLayout";
import MoviesList from "../screens/Movies/MoviesList";
import Seats from "../screens/Movies/Seat";
import BookingHistory from "../screens/Movies/BookingHistory";
import { AuthProvider } from "../helpers/AuthContext";

const Navigation = () => {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/movies" element={<MoviesLayout />}>
        <Route index element={<MoviesList />} />
        <Route path=":movieId" element={<DetailedMovie />} />
        <Route path=":movieId/seats" element={<Seats />} />
      </Route>
      <Route path="/bookings" element={<BookingHistory />} />
      
      </Routes>
    </AuthProvider>
  );
};

export default Navigation;
