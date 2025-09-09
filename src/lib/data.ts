// src/lib/data.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error: ${response.statusText}`, errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'An unknown error occurred');
    } catch {
      throw new Error(errorText || 'An unknown error occurred');
    }
  }
  if (response.status === 204) {
    return null; // No content
  }
  return response.json();
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    return handleResponse(response);
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
};


// --- Public Data Fetching Functions ---

export async function getVideos(filters: { types?: string[] } = {}) {
  const params = new URLSearchParams();
  if (filters.types && filters.types.length > 0) {
    filters.types.forEach(type => params.append('type', type));
  }
  return apiRequest(`/videos?${params.toString()}`);
}

export async function getShorts() {
  return apiRequest('/shorts');
}

export const getComments = async (videoId: number) => {
  return apiRequest(`/videos/${videoId}/comments`);
};

export async function getCategories() {
  return apiRequest('/categories');
}

export async function getCreators() {
  return apiRequest('/creators');
}

export const getVideoBySlug = async (slug: string) => {
    if (!slug) return null;
    return apiRequest(`/videos/by-slug/${slug}`);
};

export const getSiteSettings = async () => {
    try {
        // This is a public route on the main API, but we'll use the admin one for consistency in this file
        return await apiRequest('/admin/settings');
    } catch (e) {
        return { siteName: 'StreamVerse', siteLogoUrl: '' }; // Fallback
    }
};

// --- Engagement Functions ---
export const postComment = async (videoId: number, text: string) => {
    return apiRequest(`/videos/${videoId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text })
    });
}

export const likeVideo = async (videoId: number) => {
    return apiRequest(`/videos/${videoId}/like`, { method: 'POST' });
}

export const unlikeVideo = async (videoId: number) => {
    return apiRequest(`/videos/${videoId}/like`, { method: 'DELETE' });
}

export const getLikes = async (videoId: number) => {
    return apiRequest(`/videos/${videoId}/likes`);
}


// --- Admin Data Functions ---

export const getAdminDashboardData = async () => apiRequest('/admin/stats');
export const getAdminVideos = async () => apiRequest('/admin/videos');
export const getAdminShorts = async () => apiRequest('/admin/shorts');
export const getAdminImages = async () => apiRequest('/admin/images');
export const getAdminPlaylists = async () => apiRequest('/admin/playlists');
export const getAdminCategories = async () => apiRequest('/admin/categories');
export const getAdminCreators = async () => apiRequest('/admin/creators');

export const updateSiteSettings = async (settings: any) => apiRequest('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
});

export const reorderVideos = async (orderedVideos: any[]) => apiRequest('/admin/videos/reorder', {
    method: 'PUT',
    body: JSON.stringify(orderedVideos),
});

export const addVideo = async (video: any) => apiRequest('/admin/videos', {
    method: 'POST',
    body: JSON.stringify(video),
});

export const updateVideo = async (video: any) => apiRequest(`/admin/videos/${video.id}`, {
    method: 'PUT',
    body: JSON.stringify(video),
});

export const deleteVideo = async (id: number) => apiRequest(`/admin/videos/${id}`, { method: 'DELETE' });
export const addShort = async (short: any) => apiRequest('/admin/shorts', { method: 'POST', body: JSON.stringify(short) });
export const deleteShort = async (id: number) => apiRequest(`/admin/shorts/${id}`, { method: 'DELETE' });
export const addImage = async (image: any) => apiRequest('/admin/images', { method: 'POST', body: JSON.stringify(image) });
export const deleteImage = async (id: number) => apiRequest(`/admin/images/${id}`, { method: 'DELETE' });
export const addPlaylist = async (playlist: any) => apiRequest('/admin/playlists', { method: 'POST', body: JSON.stringify(playlist) });
export const updatePlaylist = async (playlist: any) => apiRequest(`/admin/playlists/${playlist.id}`, { method: 'PUT', body: JSON.stringify(playlist) });
export const deletePlaylist = async (id: number) => apiRequest(`/admin/playlists/${id}`, { method: 'DELETE' });
export const addCategory = async (category: any) => apiRequest('/admin/categories', { method: 'POST', body: JSON.stringify(category) });
export const updateCategory = async (category: any) => apiRequest(`/admin/categories/${category.id}`, { method: 'PUT', body: JSON.stringify(category) });
export const deleteCategory = async (id: number) => apiRequest(`/admin/categories/${id}`, { method: 'DELETE' });
export const addCreator = async (creator: any) => apiRequest('/admin/creators', { method: 'POST', body: JSON.stringify(creator) });
export const updateCreator = async (creator: any) => apiRequest(`/admin/creators/${creator.id}`, { method: 'PUT', body: JSON.stringify(creator) });
export const deleteCreator = async (id: number) => apiRequest(`/admin/creators/${id}`, { method: 'DELETE' });
