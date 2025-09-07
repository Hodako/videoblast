
const API_URL = 'http://localhost:3001/api';

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
    return response.json();
  };
  
  export const getAdminVideos = async () => {
    const response = await fetch(`${API_URL}/videos`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  };
  
  export const getAdminShorts = async () => {
    const response = await fetch(`${API_URL}/shorts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  };
  
  export const getAdminImages = async () => {
    const response = await fetch(`${API_URL}/admin/images`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  };
  
  export const getAdminPlaylists = async () => {
    const response = await fetch(`${API_URL}/admin/playlists`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  };
  
  export const getSiteSettings = async () => {
    const response = await fetch(`${API_URL}/settings`);
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
    return response.json();
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
    return response.json();
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
    return response.json();
  };
  
  export const deleteVideo = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
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
    return response.json();
  };
  
  export const deleteShort = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/shorts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
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
    return response.json();
  };
  
  export const deleteImage = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/images/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
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
    return response.json();
  };
  
  export const deletePlaylist = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/playlists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  };
