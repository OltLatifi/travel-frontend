import Axios from "@/config/axiosInstance"

const flightsService = {
    createFlight: async (data: Object) => {
        const request = await Axios.post("/flights/", data)
        return request.data
    },

    getFlights: async () => {
        const request = await Axios.get("/flights/")
        return request.data
    },

    getFlightById: async (id: string) => {
        const request = await Axios.get("/flights/" + id)
        return request.data
    },

    updateFlight: async (id: string, data: Object) => {
        const request = await Axios.put(`/flights/${id}/`, data)
        return request.data
    },

    deleteFlight: async (id: string) => {
        const request = await Axios.delete(`/flights/${id}/`)
        return request.data
    }
}


export default flightsService