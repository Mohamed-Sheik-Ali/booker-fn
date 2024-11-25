import axiosInstance from "./axiosClient";

export const AuthService = {
    login: async (email: string, password: string) => {
        const data = await axiosInstance.post('api/auth/login/', { email, password });
        return data;
    },

    register: async (username: string, email: string, password: string) => {
        const data = await axiosInstance.post('api/auth/register/', { username, email, password });
        return data;
    },

    logout: async () => {
        const data = await axiosInstance.post('api/auth/logout/');
        return data;
    }
}

export const MovieService = {
    getMovies: async () => {
        const data = await axiosInstance.get('api/movies/');
        return data;
    },

    getMovieById: async (id: string) => {
        const data = await axiosInstance.get(`api/movies/${id}/`);
        return data;
    }
}

export const SeatsService = {
    getScreenById: async (id: string) => {
        const data = await axiosInstance.get(`api/screen/${id}/`);
        return data;
    },

    bookSeats: async (user_id: string, screening_id: string, seats: {row: string | number, number: number}[]) => { 
        const data = await axiosInstance.post('api/book-seats/', { user_id, screening_id, seats });
        return data
    },

    getBookedSeats: async (screeningId: string | number) => {
        const data = await axiosInstance.get(`api/booked-seats/${screeningId}/`);
        return data;
    },  

    getBookingHistory: async () => {
        const data = await axiosInstance.get(`api/booking-history/${localStorage.getItem('userId')}/`);
        return data;
    }
}
