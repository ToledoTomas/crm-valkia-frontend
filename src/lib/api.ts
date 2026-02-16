const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json();
    
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    throw new Error(
      Array.isArray(error.message) ? error.message.join(', ') : error.message
    );
  }
  
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
}

export async function get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(endpoint, API_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken() || ''}`,
    },
  });
  
  return handleResponse<T>(response);
}

export async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken() || ''}`,
    },
    body: JSON.stringify(body),
  });
  
  return handleResponse<T>(response);
}

export async function patch<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken() || ''}`,
    },
    body: JSON.stringify(body),
  });
  
  return handleResponse<T>(response);
}

export async function del<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken() || ''}`,
    },
  });
  
  return handleResponse<T>(response);
}

export { API_URL };
