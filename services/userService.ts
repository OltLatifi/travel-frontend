import Axios from "@/config/axiosInstance"

const userService = {
    signUp: async (data: Object) => {
        const request = await Axios.post("/users/create/", data)
        return request.data
    },
    logIn: async (data: Object) => {
        const request = await Axios.post("/token/", data)
        return request.data
    },
    fetchUser: async () => {
        const response = await Axios.get("/users/me/");
        return response.data;
    }
}


export default userService