import Axios from "@/config/axiosInstance"

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
    }
}


export default propertyService