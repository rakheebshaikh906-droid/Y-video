
import { apiRequest, setAccessToken, clearAccessToken } from "./api";

export async function registerUser(userData) {
    return apiRequest("/users/register", {
        method: "POST",
        body: userData,
    });
}

export async function loginUser(credentials) {
    const response = await apiRequest("/users/login", {
        method: "POST",
        body: credentials,
    });

    const accessToken = response?.data?.accessToken;

    if (accessToken) {
        setAccessToken(accessToken);
    }

    return response;
}

export function logoutUser() {
    clearAccessToken();
}
