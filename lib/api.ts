// lib/api.ts

// Backend-in işlədiyi URL. Canlıya çıxaranda bunu .env faylından da oxumaq olar.
const API_URL = 'http://localhost:3001';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Tokeni localStorage-dan götürürük (yalnız brauzerdə işlədiyinə əmin olmaq üçün yoxlayırıq)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Default (standart) header-lər
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  // Əgər istifadəçi giriş edibsə (token varsa), onu sorğuya avtomatik yapışdırırıq
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Əgər şəkil (FormData) göndəririksə, Content-Type-ı silirik ki, brauzer özü tənzimləsin
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Backend-ə sorğunu göndəririk
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Əgər backend 401 (İcazəsiz) qaytararsa, deməli tokenin vaxtı bitib və ya səhvdir
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); // Tokeni silirik
      // İstəsəniz avtomatik olaraq login səhifəsinə yönləndirə bilərsiniz:
      // window.location.href = '/'; 
    }
  }

  // Əgər xəta (400, 404, 500) baş verərsə, xətanı tutub frontend-ə qaytarırıq
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API sorğusunda xəta baş verdi');
  }

  // Cavabın içi boşdursa (məsələn DELETE uğurlu olanda)
  if (response.status === 204) return null;

  // Uğurlu olduqda məlumatı (JSON) qaytarırıq
  return await response.json();
}

// Bütün proyekt boyu istifadə edəcəyimiz vahid obyekt
export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data?: any) => 
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
    
  patch: (endpoint: string, data?: any) => 
    fetchWithAuth(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};