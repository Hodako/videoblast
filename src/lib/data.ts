// src/lib/data.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getVideos() {
  const response = await fetch(`${API_URL}/videos`);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
}

export async function getShorts() {
  const response = await fetch(`${API_URL}/shorts`);
  if (!response.ok) {
    throw new Error('Failed to fetch shorts');
  }
  return response.json();
}

export const getComments = async (videoId: number) => {
  const response = await fetch(`${API_URL}/videos/${videoId}/comments`);
  if (!response.ok) {
    // Return empty array on error for now
    return [];
  }
  return response.json();
};
  
export const getAdminDashboardData = async () => {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
};
  
export const getAdminVideos = async () => {
    const response = await fetch(`${API_URL}/admin/videos`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch admin videos');
    return response.json();
};
  
export const getAdminShorts = async () => {
    const response = await fetch(`${API_URL}/shorts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch admin shorts');
    return response.json();
};
  
export const getAdminImages = async () => {
    const response = await fetch(`${API_URL}/admin/images`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch admin images');
    return response.json();
};
  
export const getAdminPlaylists = async () => {
    const response = await fetch(`${API_URL}/admin/playlists`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch admin playlists');
    return response.json();
};
  
export const getSiteSettings = async () => {
    const response = await fetch(`${API_URL}/admin/settings`, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) return {}; // Return empty object if no settings yet
    return response.json();
};
  
export const updateSiteSettings = async (settings: any) => {
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(settings)
    });
    if(!response.ok) throw new Error("Failed to update settings");
    return;
  };
  
export const reorderVideos = async (orderedVideos: any[]) => {
    const response = await fetch(`${API_URL}/admin/videos/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(orderedVideos)
    });
    if(!response.ok) throw new Error("Failed to reorder videos");
    return;
};
  
export const addVideo = async (video: any) => {
    const response = await fetch(`${API_URL}/admin/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(video)
    });
    if (!response.ok) throw new Error('Failed to add video');
    return response.json();
};
  
export const updateVideo = async (video: any) => {
    const response = await fetch(`${API_URL}/admin/videos/${video.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(video)
    });
    if (!response.ok) throw new Error('Failed to update video');
    return response.json();
};
  
export const deleteVideo = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete video');
    return;
};
  
export const addShort = async (short: any) => {
    const response = await fetch(`${API_URL}/admin/shorts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(short)
    });
    if (!response.ok) throw new Error('Failed to add short');
    return response.json();
};
  
export const deleteShort = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/shorts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete short');
    return;
};
  
export const addImage = async (image: any) => {
    const response = await fetch(`${API_URL}/admin/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(image)
    });
    if (!response.ok) throw new Error('Failed to add image');
    return response.json();
};
  
export const deleteImage = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/images/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete image');
    return;
};
  
export const addPlaylist = async (playlist: any) => {
    const response = await fetch(`${API_URL}/admin/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(playlist)
    });
    if (!response.ok) throw new Error('Failed to add playlist');
    return response.json();
};
  
export const updatePlaylist = async (playlist: any) => {
    const response = await fetch(`${API_URL}/admin/playlists/${playlist.id}` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(playlist)
    });
    if (!response.ok) throw new Error('Failed to update playlist');
    return;
};
  
export const deletePlaylist = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/playlists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete playlist');
    return;
};

// Categories
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export const getAdminCategories = async () => {
    const response = await fetch(`${API_URL}/admin/categories`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export const addCategory = async (category: any) => {
    const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Failed to add category');
    return response.json();
};

export const updateCategory = async (category: any) => {
    const response = await fetch(`${API_URL}/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
};

export const deleteCategory = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return;
};

// Creators
export async function getCreators() {
  const response = await fetch(`${API_URL}/creators`);
  if (!response.ok) {
    throw new Error('Failed to fetch creators');
  }
  return response.json();
}

export const getAdminCreators = async () => {
    const response = await fetch(`${API_URL}/admin/creators`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    });
    if (!response.ok) throw new Error('Failed to fetch creators');
    return response.json();
};

export const addCreator = async (creator: any) => {
    const response = await fetch(`${API_URL}/admin/creators`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(creator)
    });
    if (!response.ok) throw new Error('Failed to add creator');
    return response.json();
};

export const updateCreator = async (creator: any) => {
    const response = await fetch(`${API_URL}/admin/creators/${creator.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(creator)
    });
    if (!response.ok) throw new Error('Failed to update creator');
    return response.json();
};

export const deleteCreator = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/creators/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    });
    if (!response.ok) throw new Error('Failed to delete creator');
    return;
};
