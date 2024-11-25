import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieService } from "../../service/api";
import { useLoader } from "../../helpers/hooks";
import LoaderModal from "../../components/Loader";
import moment from "moment";
import Button from "../../components/Button";

interface MovieProps {
  id: number;
  title: string;
  genre: string;
  release_date: string;
  poster_image: string;
  description: string;
  theatres: { name: string; location: string }[];
}

const MoviesList: React.FC = () => {
  const navigate = useNavigate();
  const [movieList, setMovieList] = useState<MovieProps[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<MovieProps[]>([]);
  const { loading, handleLoader } = useLoader();

  const [filters, setFilters] = useState({
    name: "",
    genre: "",
    release_date: "",
  });

  const [movieStatus, setMovieStatus] = useState<"all" | "upcoming" | "running">("all");

  useEffect(() => {
    (async () => {
      handleLoader(true);
      const data = await MovieService.getMovies();

      if (!data) return;

      setMovieList(data.data);
      setFilteredMovies(data.data);
      handleLoader(false);
    })();
  }, []);

  useEffect(() => {
    const { name, genre, release_date } = filters;
    const currentDate = moment();

    const filtered = movieList.filter((movie) => {
      const matchesName = name
        ? movie.title.toLowerCase().includes(name.toLowerCase())
        : true;
      const matchesGenre = genre
        ? movie.genre.toLowerCase().includes(genre.toLowerCase())
        : true;
      const matchesReleaseDate = release_date
        ? moment(movie.release_date).format("YYYY-MM-DD") === release_date
        : true;
      
      console.log(movie.release_date === release_date)

      const isUpcoming = moment(movie.release_date).isAfter(currentDate);
      const isRunning = moment(movie.release_date).isBefore(currentDate);

      const matchesStatus =
        movieStatus === "all" ||
        (movieStatus === "upcoming" && isUpcoming) ||
        (movieStatus === "running" && isRunning);

      return matchesName && matchesGenre && matchesReleaseDate && matchesStatus;
    });

    setFilteredMovies(filtered);
  }, [filters, movieList, movieStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusFilterChange = (status: "all" | "upcoming" | "running") => {
    setMovieStatus(status);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-outfit">
      <LoaderModal isOpen={loading} text="Fetching the movies for you..." />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-red-500">Movies</h2>
          <Button
            onClick={() => navigate("/bookings")}
            style="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-lg transition text-sm sm:text-base sm:px-6"
            isLoading={loading}
            type="button"
            text="Bookings History"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Search by Name"
            value={filters.name}
            onChange={handleInputChange}
            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="text"
            name="genre"
            placeholder="Search by Genre"
            value={filters.genre}
            onChange={handleInputChange}
            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="date"
            name="release_date"
            value={filters.release_date}
            onChange={handleInputChange}
            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div className="mb-6">
          <button
            className={`mr-4 px-4 py-2 rounded ${movieStatus === "all" ? "bg-red-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleStatusFilterChange("all")}
          >
            All Movies
          </button>
          <button
            className={`mr-4 px-4 py-2 rounded ${movieStatus === "upcoming" ? "bg-red-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleStatusFilterChange("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`mr-4 px-4 py-2 rounded ${movieStatus === "running" ? "bg-red-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleStatusFilterChange("running")}
          >
            Running
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <img
                src={movie.poster_image}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Genre: {movie.genre}
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Release Date: {moment(movie.release_date).format("LL")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No movies match your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default MoviesList;
