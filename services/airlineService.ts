import Axios from "@/config/axiosInstance"

const airlineService = {
    createAirline: async (data: Object) => {
        const request = await Axios.post("/flights/airlines/", data)
        return request.data
    },

    getAirlines: async () => {
        const request = await Axios.get("/flights/airlines/")
        return request.data
    },

    getAirlineById: async (id: string) => {
        const request = await Axios.get("/flights/airlines/" + id)
        return request.data
    },

    updateAirline: async (id: string, data: Object) => {
        const request = await Axios.put(`/flights/airlines/${id}/`, data)
        return request.data
    },

    deleteAirline: async (id: string) => {
        const request = await Axios.delete(`/flights/airlines/${id}/`)
        return request.data
    }
}


export default airlineService