import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MovieService } from "../../service/api";
import { useLoader } from "../../helpers/hooks";
import Button from "../../components/Button";
import LoaderModal from "../../components/Loader";

interface Screening {
  id: number;
  start_time: string;
  screen: {
    id: number;
    name: string;
  };
}

interface Theatre {
  id: number;
  name: string;
  location: string;
  screenings: Screening[];
}

interface Movie {
  id: number;
  title: string;
  poster_image: string;
  description: string;
  theatres: Theatre[];
}

const DetailedMovie: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { loading, handleLoader } = useLoader();

  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!movieId) return;

    (async () => {
      handleLoader(true);
      const { data } = await MovieService.getMovieById(movieId);
      handleLoader(false);
      if (!data) return;
      setMovie(data);
      
    })();

  }, [movieId]);

  return (
    <div className="min-h-screen bg-gray-100 font-outfit">
      <LoaderModal isOpen={loading} text="Fetching the movie for you..." />
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
          <img
            src={movie?.poster_image}
            alt={movie?.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">{movie?.title}</h2>
            <p className="text-gray-600 mt-4">{movie?.description}</p>

            <h3 className="mt-6 font-semibold text-gray-800">Theatres:</h3>
            {movie?.theatres?.map((theatre) => (
              <div
                key={theatre.id}
                className="mt-4 border border-red-300 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{theatre.name}</p>
                  <p className="text-gray-600">{theatre.location}</p>
                </div>
                <h4 className="mt-4 text-gray-700 font-medium">
                  Screenings:
                </h4>
                <div className="mt-3 flex flex-wrap gap-4">
                  {theatre.screenings.map((screening) => (
                    <div
                      key={screening.id}
                      className="flex flex-col items-start border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        Screen: {screening.screen.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Start Time:{" "}
                        {new Date(screening.start_time).toLocaleString()}
                      </p>
                      <Button
                        text="Book Seats"
                        type="button"
                        onClick={() =>
                          navigate(`/movies/${movieId}/seats`, {
                            state: { screenId: screening.screen.id, screeningId: screening.id },
                          })
                        }
                        style="border border-red-500 bg-white text-red-500 py-2 px-4 rounded mt-2 hover:bg-red-500 hover:text-white transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedMovie;
