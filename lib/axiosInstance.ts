import axios, { AxiosRequestConfig } from "axios"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          return Promise.reject(error)
        }

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        )

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data

        localStorage.setItem("accessToken", newAccessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ✅ API method aliases
const apiGet = <T = any>(url: string, config?: AxiosRequestConfig) =>
  apiClient.get<T>(url, config)

const apiPost = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiClient.post<T>(url, data, config)

const apiPut = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiClient.put<T>(url, data, config)

const apiPatch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiClient.patch<T>(url, data, config)

const apiDelete = <T = any>(url: string, config?: AxiosRequestConfig) =>
  apiClient.delete<T>(url, config)

export {
  apiClient,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
}
