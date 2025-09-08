// src/lib/data.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- Public Data Fetching Functions ---

export async function getVideos() {
  try {
    const response = await fetch(`${API_URL}/videos`);
    if (!response.ok) {
        throw new Error('Failed to fetch videos');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export async function getShorts() {
   try {
    const response = await fetch(`${API_URL}/shorts`);
    if (!response.ok) {
        throw new Error('Failed to fetch shorts');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching shorts:', error);
    throw error;
  }
}

export const getComments = async (videoId: number) => {
  try {
    const response = await fetch(`${API_URL}/videos/${videoId}/comments`);
    if (!response.ok) {
        return [];
    }
    return response.json();
  } catch (error) {
      console.error('Error fetching comments', error);
      return [];
  }
};

export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
  } catch (error) {
     console.error('Error fetching categories:', error);
     throw error;
  }
}

export async function getCreators() {
  try {
    const response = await fetch(`${API_URL}/creators`);
    if (!response.ok) {
      throw new Error('Failed to fetch creators');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching creators:', error);
    throw error;
  }
}
  
// --- Admin Data Fetching Functions ---

const getToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem('token');
};

export const getAdminDashboardData = async () => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
};
  
export const getAdminVideos = async () => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/videos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin videos');
    return response.json();
};
  
export const getAdminShorts = async () => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/shorts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin shorts');
    return response.json();
};
  
export const getAdminImages = async () => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/images`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin images');
    return response.json();
};
  
export const getAdminPlaylists = async () => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/playlists`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin playlists');
    return response.json();
};
  
export const getSiteSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/settings`);
      if (!response.ok) return { siteName: 'StreamVerse', siteLogoUrl: '' }; // Fallback
      return response.json();
    } catch (e) {
       return { siteName: 'StreamVerse', siteLogoUrl: '' }; // Fallback
    }
};
  
export const updateSiteSettings = async (settings: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if(!response.ok) throw new Error("Failed to update settings");
    return;
  };
  
export const reorderVideos = async (orderedVideos: any[]) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/videos/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderedVideos)
    });
    if(!response.ok) throw new Error("Failed to reorder videos");
    return;
};
  
export const addVideo = async (video: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(video)
    });
    if (!response.ok) throw new Error('Failed to add video');
    return response.json();
};
  
export const updateVideo = async (video: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/videos/${video.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(video)
    });
    if (!response.ok) throw new Error('Failed to update video');
    return response.json();
};
  
export const deleteVideo = async (id: number) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/videos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete video');
    return;
};
  
export const addShort = async (short: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/shorts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(short)
    });
    if (!response.ok) throw new Error('Failed to add short');
    return response.json();
};
  
export const deleteShort = async (id: number) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/shorts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete short');
    return;
};
  
export const addImage = async (image: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(image)
    });
    if (!response.ok) throw new Error('Failed to add image');
    return response.json();
};
  
export const deleteImage = async (id: number) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/images/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete image');
    return;
};
  
export const addPlaylist = async (playlist: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(playlist)
    });
    if (!response.ok) throw new Error('Failed to add playlist');
    return response.json();
};
  
export const updatePlaylist = async (playlist: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/playlists/${playlist.id}` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(playlist)
    });
    if (!response.ok) throw new Error('Failed to update playlist');
    return;
};
  
export const deletePlaylist = async (id: number) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/playlists/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete playlist');
    return;
};


export const getAdminCategories = async () => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/categories`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export const addCategory = async (category: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Failed to add category');
    return response.json();
};

export const updateCategory = async (category: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
};

export const deleteCategory = async (id: number) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return;
};


export const getAdminCreators = async () => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/creators`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!response.ok) throw new Error('Failed to fetch creators');
    return response.json();
};

export const addCreator = async (creator: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/creators`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(creator)
    });
    if (!response.ok) throw new Error('Failed to add creator');
    return response.json();
};

export const updateCreator = async (creator: any) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/creators/${creator.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(creator)
    });
    if (!response.ok) throw new Error('Failed to update creator');
    return response.json();
};

export const deleteCreator = async (id: number) => {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found');
    const response = await fetch(`${API_URL}/admin/creators/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!response.ok) throw new Error('Failed to delete creator');
    return;
};
