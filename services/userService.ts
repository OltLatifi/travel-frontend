import Axios from "@/config/axiosInstance"

const userService = {
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