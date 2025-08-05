export const production = import.meta.env.MODE == 'production'
export const backendURL =  production ? `http://classwork.engr.oregonstate.edu:${import.meta.env.VITE_BACKEND_PORT}`
                                      : "http://localhost:3000"