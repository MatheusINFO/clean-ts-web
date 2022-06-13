declare var API_URL: string

export const makeApiUrl = (path: string): string => `${API_URL}/${path}`
