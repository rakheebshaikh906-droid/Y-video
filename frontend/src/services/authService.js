
import {
    apiRequest,
    setAccessToken,
    clearAccessToken,
} from "./api";

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

    const accessToken =
        response?.data?.accessToken ??
        response?.data?.user?.accessToken;

    if (!accessToken) {
        throw new Error(
            "Login response mein access token nahi mila. Backend response check karo."
        );
    }

    setAccessToken(accessToken);
    return response;
}

export async function logoutUser() {
    try {
        await apiRequest("/users/logout", {
            method: "POST",
        });
    } finally {
        clearAccessToken();
    }
}

export async function getCurrentUser() {
    return apiRequest("/users/current-user");
}
