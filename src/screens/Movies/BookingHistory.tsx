import React, { useEffect, useState } from "react";
import { SeatsService } from "../../service/api";
import { useLoader } from "../../helpers/hooks";
import moment from "moment";
import LoaderModal from "../../components/Loader";

interface Booking {
  movie: string;
  theatre: string;
  screen: string;
  seats: string[];
  date: string;
  time: string;
}

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { loading, handleLoader } = useLoader()


  useEffect(() => {
    const fetchBookings = async () => {
      handleLoader(true);
      const data = await SeatsService.getBookingHistory();
      handleLoader(false);
      if(data.status) {
        setBookings(data.data);
      } else {
        console.error(data);
      }
    };

    fetchBookings();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-6 font-outfit">
      <LoaderModal isOpen={loading} text="Fetching your booking history..." />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Booking History</h1>
        {bookings?.length > 0 ? (
          <div className="space-y-4">
            {bookings?.map((booking, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg p-4 border border-gray-300"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {booking.movie}
                </h2>
                <p className="text-gray-600 mt-2">
                  <strong>Theatre:</strong> {booking?.theatre}
                </p>
                <p className="text-gray-600">
                  <strong>Screen:</strong> {booking?.screen}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {moment(booking?.date).format('LL')}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {moment(booking?.time).format('LT')}
                </p>
                <p className="text-gray-600">
                  <strong>Seats:</strong> {booking?.seats?.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-lg text-gray-500">
              You haven't booked any tickets yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
