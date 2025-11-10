import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: process.env.GOKARTS_API_URL
});
