// src/lib/data.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- Mock Data ---
// This data is used as a fallback if the backend is not available.

const mockVideos = [
    {
      id: 1,
      description:
        'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit aint no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      subtitle: 'By Blender Foundation',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      title: 'Big Buck Bunny',
      duration: '10:34',
      views: '1.2M',
      uploaded: '2 weeks ago',
      type: 'straight'
    },
    {
      id: 2,
      description: 'The first Blender Open Movie from 2006',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      subtitle: 'By Blender Foundation',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      title: 'Elephant Dream',
      duration: '12:41',
      views: '8M',
      uploaded: '1 month ago',
      type: 'gay'
    },
     {
      id: 3,
      description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV. For $35. Find out more at google.com/chromecast.',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      subtitle: 'By Google',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
      title: 'For Bigger Fun',
      duration: '1:00',
      views: '2.5M',
      uploaded: '1 year ago',
      type: 'trans'
    },
    {
      id: 4,
      description: 'Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender.',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      subtitle: 'By Blender Foundation',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
      title: 'Sintel',
      duration: '14:48',
      views: '10M',
      uploaded: '4 years ago',
      type: 'straight'
    },
];

const mockShorts = [
    {
      id: 1,
      title: 'For Bigger Fun',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      views: '2.5M',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    },
    {
      id: 2,
      title: 'For Bigger Joyrides',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      views: '3M',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    },
     {
      id: 3,
      title: 'For Bigger Blazes',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      views: '4.1M',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    },
    {
      id: 4,
      title: 'For Bigger Meltdowns',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      views: '5.2M',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
    },
];

const mockCategories = [
    { id: 1, name: "Comedy" },
    { id: 2, name: "Technology" },
    { id: 3, name: "Sports" },
    { id: 4, name: "Music" },
];

const mockCreators = [
    { id: 1, name: "Admin", image_url: "https://i.pravatar.cc/150?u=admin", description: "The site owner." }
];

// --- Public Data Fetching Functions ---

export async function getVideos() {
  try {
    const response = await fetch(`${API_URL}/videos`);
    if (!response.ok) {
      console.warn('Failed to fetch videos from backend, falling back to mock data.');
      return mockVideos;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    console.warn('Falling back to mock videos.');
    return mockVideos;
  }
}

export async function getShorts() {
   try {
    const response = await fetch(`${API_URL}/shorts`);
    if (!response.ok) {
      console.warn('Failed to fetch shorts from backend, falling back to mock data.');
      return mockShorts;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching shorts:', error);
    console.warn('Falling back to mock shorts.');
    return mockShorts;
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
      return [];
  }
};

export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      console.warn('Failed to fetch categories from backend, falling back to mock data.');
      return mockCategories;
    }
    return response.json();
  } catch (error) {
     console.error('Error fetching categories:', error);
     console.warn('Falling back to mock categories.');
     return mockCategories;
  }
}

export async function getCreators() {
  try {
    const response = await fetch(`${API_URL}/creators`);
    if (!response.ok) {
      console.warn('Failed to fetch creators from backend, falling back to mock data.');
      return mockCreators;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching creators:', error);
    console.warn('Falling back to mock creators.');
    return mockCreators;
  }
}
  
// --- Admin Data Fetching Functions ---

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
    const response = await fetch(`${API_URL}/admin/shorts`, {
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
    if (!response.ok) return { siteName: 'StreamVerse', siteLogoUrl: '' }; // Fallback
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
