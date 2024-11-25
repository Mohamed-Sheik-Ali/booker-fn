import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SeatsService } from "../../service/api";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { useLoader } from "../../helpers/hooks";

interface Seat {
    row: string;
    number: number;
    isBooked: boolean;
    isMine?: boolean;
};

interface Row {
    name: string;
    seat_count: number;
};

interface SeatToBookProps {
    row: string | number;
    number: number;
}

const Seats: React.FC = () => {
    const location = useLocation();
    const { screenId, screeningId } = location.state;
    const {loading, handleLoader} = useLoader();
    const [rows, setRows] = useState<Row[]>([]);
    const [bookedSeats, setBookedSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        if (!screenId || !screeningId) return;

        (async () => {
            try {
                const { data } = await SeatsService.getScreenById(screenId);
                setRows(data.rows || []);

                const bookedSeatsData = await SeatsService.getBookedSeats(screeningId);
                console.log(bookedSeatsData);
                const allBookedSeats = bookedSeatsData.data
                    .map((record: { booked_seats: string; user: number }) =>
                        JSON.parse(record.booked_seats).map((seat: Seat) => ({
                            ...seat,
                            isBooked: true,
                            isMine: record.user === Number(userId),
                            
                        }))
                    )
                    .flat();
                console.log(bookedSeatsData.data
                    .map((record: { booked_seats: string; user: string }) =>
                        JSON.parse(record.booked_seats).map((seat: Seat) => ({
                            ...seat,
                            isBooked: true,
                            isMine: record.user === userId,
                            id: record.user,
                            newId: userId
                        }))
                    )
                    .flat(), "allBookedSeats");
                setBookedSeats(allBookedSeats);
            } catch (error) {
                console.error("Failed to fetch seat data:", error);
            }
        })();
    }, [screenId, screeningId, userId]);

    const onBook = async () => {
        try {
            handleLoader(true)
            const seatsToBook: SeatToBookProps[] = selectedSeats
                .filter((seat) => !seat.isBooked)
                .map((seat) => ({ row: seat.row, number: seat.number }));

            const data = await SeatsService.bookSeats(userId || "", screeningId, seatsToBook);
            handleLoader(false)
            if (data.status){
                const bookedSeatsData = await SeatsService.getBookedSeats(screeningId);
                const allBookedSeats = bookedSeatsData.data
                    .map((record: { booked_seats: string; user: number }) =>
                        JSON.parse(record.booked_seats).map((seat: Seat) => ({
                            ...seat,
                            isBooked: true,
                            isMine: record.user === Number(userId),
                        }))
                    )
                    .flat();

                setBookedSeats(allBookedSeats);
                setSelectedSeats([]);
                toast.success("Seats Booked Successfully!");
            }
        } catch (error) {
            console.error("Failed to book seats:", error);
        }
    };

    const isSeatBooked = (row: string, number: number): Seat | undefined => {
        return bookedSeats.find((seat) => seat.row === row && seat.number === number);
    };

    const toggleSeatSelection = (seat: Seat) => {
        const seatStatus = isSeatBooked(seat.row, seat.number);

        if (seatStatus?.isBooked && !seatStatus?.isMine) return;

        setSelectedSeats((prevSelected) => {
            const isSelected = prevSelected.some(
                (s) => s.row === seat.row && s.number === seat.number
            );
            if (isSelected) {
                return prevSelected.filter(
                    (s) => !(s.row === seat.row && s.number === seat.number)
                );
            } else {
                return [...prevSelected, seat];
            }
        });
    };

    const legends = [
        { color: "bg-green-500", label: "Available" },
        { color: "bg-green-600", label: "Selected" },
        { color: "bg-yellow-500", label: "Your Bookings" },
        { color: "bg-red-500", label: "Booked" },
    ]

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4 font-outfit">Select Your Seats</h1>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
                {legends.map((legend: { color: string; label: string }, index: number) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 font-outfit"
                    >
                        <div className={`w-6 h-6 ${legend.color} rounded-md shrink-0`}></div>
                        <span className="truncate">{legend.label}</span>
                    </div>
                ))}
            </div>


            <div className="space-y-6">
                {rows.map((row) => (
                    <div key={row.name} className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-medium">{row.name}</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>
                        <div
                            className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2"
                            style={{ maxWidth: "100%" }}
                        >
                            {Array.from({ length: row.seat_count }, (_, index) => {
                                const seatNumber = index + 1;
                                const seatStatus = isSeatBooked(row.name, seatNumber);
                                
                                return (
                                    <div
                                        key={seatNumber}
                                        className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md
                                        ${seatStatus?.isMine && seatStatus?.isBooked
                                                ? "bg-yellow-500 text-white"
                                                : seatStatus?.isBooked && !seatStatus?.isMine
                                                    ? "bg-red-500 text-white cursor-not-allowed"
                                                    : selectedSeats.some(
                                                        (s) =>
                                                            s.row === row.name &&
                                                            s.number === seatNumber
                                                    )
                                                        ? "bg-green-600 text-white cursor-pointer"
                                                        : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                                            }`}
                                        onClick={() =>
                                            toggleSeatSelection({
                                                row: row.name,
                                                number: seatNumber,
                                                isBooked: seatStatus?.isBooked || false,
                                                isMine: seatStatus?.isMine || false,
                                            })
                                        }
                                    >
                                        {seatNumber}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h2 className="text-lg font-medium mb-2 font-outfit">Selected Seats:</h2>
                {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat, index) => (
                            <div
                                key={index}
                                className={`px-3 py-1 text-sm font-medium rounded-md ${seat.isMine ? "bg-yellow-500 text-white" : seat.isBooked ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                                    }`}
                            >
                                {`${seat.row}${seat.number}`}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 font-outfit">No seats selected.</p>
                )}
            </div>
            <div className="mt-4 flex justify-end">
                <Button text="Book Seats"
                    style="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-outfit transition"
                    onClick={onBook}
                    type="button"
                    isLoading={loading}
                />
                    
            </div>
        </div>
    );
};

export default Seats;
