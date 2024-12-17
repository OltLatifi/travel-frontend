import Axios from "@/config/axiosInstance"
import { stripePromise } from "@/config/stripe"

const propertyService = {
    createProperty: async (data: Object) => {
        const request = await Axios.post("/properties/", data)
        return request.data
    },

    getProperty: async () => {
        const request = await Axios.get("/properties/")
        return request.data
    },

    getAllProperty: async (page: number) => {
        const request = await Axios.get("/properties/all?page=" + page)
        return request.data
    },

    getPropertyById: async (id: string) => {
        const request = await Axios.get("/properties/" + id)
        return request.data
    },

    updateProperty: async (id: string, data: Object) => {
        const request = await Axios.put(`/properties/${id}/`, data)
        return request.data
    },

    deleteProperty: async (id: string) => {
        const request = await Axios.delete(`/properties/${id}/`)
        return request.data
    },

    createBooking: async (property_id: number, nights: number, cardElement: any, customerName: string, paymentMethod?: string) => {
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe failed to initialize');
            }

            const response = await Axios.post('/payments/create-payment-intent/', {
                property: property_id,
                nights,
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

    getPayments: async () => {
        const response = await Axios.get('/payments/properties');
        return response.data;
    }
}


export default propertyService