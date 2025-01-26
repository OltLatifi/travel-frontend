import Axios from "@/config/axiosInstance"
import { stripePromise } from "@/config/stripe"

const flightsService = {
    createFlight: async (data: Object) => {
        const request = await Axios.post("/flights/create/", data)
        return request.data
    },

    getFlights: async () => {
        const request = await Axios.get("/flights/")
        return request.data
    },

    getAllFlights: async () => {
        const request = await Axios.get("/flights/all/")
        return request.data
    },

    getFlightById: async (id: string) => {
        const request = await Axios.get("/flights/" + id + "/")
        return request.data
    },

    updateFlight: async (id: string, data: Object) => {
        const request = await Axios.put(`/flights/${id}/`, data)
        return request.data
    },

    deleteFlight: async (id: string) => {
        const request = await Axios.delete(`/flights/${id}/`)
        return request.data
    },

    createBooking: async (flight_id: number, seats: number, cardElement: any, customerName: string, paymentMethod?: string) => {
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe failed to initialize');
            }

            const response = await Axios.post('/payments/create-flight-reservation/', {
                flight: flight_id,
                seats,
                customer_name: customerName,
                payment_method_id: paymentMethod,
            });

            const { client_secret: clientSecret } = response.data;
            if (!clientSecret) {
                throw new Error('Failed to obtain client secret from server');
            }

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod || {
                    card: cardElement,
                    billing_details: {
                        name: customerName,
                    },
                },
            });

            if (error) {
                throw error;
            }

            return { error: null, paymentIntent };
        } catch (error) {
            return {
                error: error instanceof Error ? error : new Error('An unknown error occurred'),
                paymentIntent: null
            };
        }
    },

    getTickets: async () => {
        const request = await Axios.get("/payments/flights/")
        return request.data
    }
}


export default flightsService