import Axios from "@/config/axiosInstance"

const flightService = {
    createAirport: async (data: Object) => {
        const request = await Axios.post("/flights/airport/", data)
        return request.data
    },
}


export default flightService