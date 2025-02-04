import Axios from "@/config/axiosInstance"

const airportService = {
    createAirport: async (data: Object) => {
        const request = await Axios.post("/flights/airport/", data)
        return request.data
    },

    getAirports: async () => {
        const request = await Axios.get("/flights/airport/")
        return request.data
    },

    getAirportById: async (id: string) => {
        const request = await Axios.get("/flights/airport/" + id + "/")
        return request.data
    },

    updateAirport: async (id: string, data: Object) => {
        const request = await Axios.put(`/flights/airport/${id}/`, data)
        return request.data
    },

    deleteAirport: async (id: string) => {
        const request = await Axios.delete(`/flights/airport/${id}/`)
        return request.data
    }
}


export default airportService