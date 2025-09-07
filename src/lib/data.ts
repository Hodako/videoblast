// src/lib/data.ts

// MOCK DATA - This will be replaced by API calls in a real application
const allVideos = [
  {
    id: 1,
    title: 'Big Buck Bunny',
    description: 'A giant rabbit with a heart bigger than himself.',
    duration: '10:34',
    views: '1.2M',
    uploaded: '2 weeks ago',
    thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    subtitle: 'Blender Foundation',
    type: 'straight',
    meta_data: { seo_title: "Big Buck Bunny - Animated Short", seo_description: "Watch the adventures of Big Buck Bunny in this classic animated short by the Blender Foundation." }
  },
  {
    id: 2,
    title: 'Elephant Dream',
    description: 'The first Blender Open Movie from 2006',
    duration: '12:41',
    views: '800K',
    uploaded: '1 month ago',
    thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    subtitle: 'Blender Foundation',
    type: 'gay',
    meta_data: { seo_title: "Elephant Dream - Blender Open Movie", seo_description: "Explore the surreal world of Elephant Dream, the first open movie by the Blender Foundation." }
  },
  {
    id: 3,
    title: 'For Bigger Blazes',
    description: 'HBO GO now works with Chromecast.',
    duration: '0:15',
    views: '500K',
    uploaded: '3 months ago',
    thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    subtitle: 'Google',
    type: 'trans',
    meta_data: { seo_title: "For Bigger Blazes - Google Chromecast", seo_description: "See how HBO GO and Chromecast work together to bring you your favorite shows." }
  },
  {
    id: 4,
    title: 'For Bigger Escapes',
    description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV.',
    duration: '0:15',
    views: '1M',
    uploaded: '1 year ago',
    thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    subtitle: 'Google',
    type: 'straight',
    meta_data: { seo_title: "For Bigger Escapes - Google Chromecast", seo_description: "Learn about Google Chromecast and how it brings online video to your TV." }
  }
];

const allShorts = [
  {
    id: 1,
    title: 'For Bigger Fun',
    views: '2.5M',
    thumbnail: 'shorts-fun',
    video_url:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    image_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
  },
  {
    id: 2,
    title: 'For Bigger Joyrides',
    views: '3M',
    thumbnail: 'shorts-joy',
    video_url:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    image_url:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
  },
  {
    id: 3,
    title: 'For Bigger Meltdowns',
    views: '1.2M',
    thumbnail: 'shorts-meltdown',
    video_url:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    image_url:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
  },
];


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getVideos() {
  // const response = await fetch(`${API_URL}/videos`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch videos');
  // }
  // return response.json();
  return allVideos;
}

export async function getShorts() {
  // const response = await fetch(`${API_URL}/shorts`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch shorts');
  // }
  // return response.json();
  return allShorts;
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
    const response = await fetch(`${API_URL}/admin/videos`, {
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
    const response = await fetch(`${API_URL}/admin/settings`, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
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
    await fetch(`${API_URL}/admin/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
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
    return response.json();
};
  
export const deleteShort = async (id: number) => {
    await fetch(`${API_URL}/admin/shorts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
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
    return response.json();
};
  
export const deleteImage = async (id: number) => {
    await fetch(`${API_URL}/admin/images/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
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
    return response.json();
};
  
export const updatePlaylist = async (playlist: any) => {
    await fetch(`${API_URL}/admin/playlists/${playlist.id}` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(playlist)
    });
    return;
};
  
export const deletePlaylist = async (id: number) => {
    await fetch(`${API_URL}/admin/playlists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
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
