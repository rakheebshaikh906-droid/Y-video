
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export function getAccessToken() {
    return localStorage.getItem("accessToken");
}

export function setAccessToken(token) {
    if (token) {
        localStorage.setItem("accessToken", token);
    }
}

export function clearAccessToken() {
    localStorage.removeItem("accessToken");
}

export async function apiRequest(
    endpoint,
    { method = "GET", body, headers = {} } = {}
) {
    const token = getAccessToken();

    const requestHeaders = {
        ...headers,
    };

    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    // FormData ke liye Content-Type manually set mat karna.
    if (body && !(body instanceof FormData)) {
        requestHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body:
            body instanceof FormData
                ? body
                : body !== undefined
                    ? JSON.stringify(body)
                    : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || `Request failed with status ${response.status}`
        );
    }

    return data;
}
