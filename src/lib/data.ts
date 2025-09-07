
const API_URL = 'http://localhost:3001/api';

const videos = [
    {
      id: 1,
      title: 'Big Buck Bunny',
      description: 'A giant rabbit with a heart bigger than himself.',
      duration: '10:34',
      views: '1.2M',
      uploaded: '2 weeks ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      subtitle: 'By Blender Foundation',
      uploader: {
        name: 'Blender',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 2,
      title: 'Elephants Dream',
      description: 'The first Blender Open Movie from 2006',
      duration: '12:41',
      views: '8M',
      uploaded: '1 month ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      subtitle: 'By Blender Foundation',
      uploader: {
        name: 'Blender',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 3,
      title: 'For Bigger Blazes',
      description: 'HBO GO now works with Chromecast.',
      duration: '0:15',
      views: '500K',
      uploaded: '3 days ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      subtitle: 'By Google',
      uploader: {
        name: 'Google',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 4,
      title: 'For Bigger Escapes',
      description: 'Introducing Chromecast.',
      duration: '0:15',
      views: '1M',
      uploaded: '1 week ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      subtitle: 'By Google',
      uploader: {
        name: 'Google',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 5,
      title: 'For Bigger Fun',
      description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV.',
      duration: '1:00',
      views: '2.5M',
      uploaded: '4 weeks ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      subtitle: 'By Google',
      uploader: {
        name: 'Google',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 6,
      title: 'For Bigger Joyrides',
      description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV.',
      duration: '0:15',
      views: '3M',
      uploaded: '2 months ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      subtitle: 'By Google',
      uploader: {
        name: 'Google',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 7,
      title: 'For Bigger Meltdowns',
      description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV.',
      duration: '0:15',
      views: '800K',
      uploaded: '1 day ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      subtitle: 'By Google',
      uploader: {
        name: 'Google',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 8,
      title: 'Sintel',
      description: 'Sintel is an independently produced short film, initiated by the Blender Foundation.',
      duration: '14:48',
      views: '10M',
      uploaded: '1 year ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      subtitle: 'By Blender Foundation',
      uploader: {
        name: 'Blender',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 9,
      title: 'Subaru Outback On Street And Dirt',
      description: 'Smoking Tire takes the all-new Subaru Outback to the highest point we can find.',
      duration: '2:33',
      views: '400K',
      uploaded: '5 days ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      subtitle: 'By Garage419',
      uploader: {
        name: 'Garage419',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 10,
      title: 'Tears of Steel',
      description: 'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender.',
      duration: '12:14',
      views: '5M',
      uploaded: '6 months ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      subtitle: 'By Blender Foundation',
      uploader: {
        name: 'Blender',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 11,
      title: 'Volkswagen GTI Review',
      description: 'The Smoking Tire heads out to Adams Motorsports Park in Riverside, CA to test the most requested car of 2010, the Volkswagen GTI.',
      duration: '8:34',
      views: '2M',
      uploaded: '3 years ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      subtitle: 'By Garage419',
      uploader: {
        name: 'Garage419',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 12,
      title: 'We Are Going On Bullrun',
      description: 'The Smoking Tire is going on the 2010 Bullrun Live Rally in a 2011 Shelby GT500',
      duration: '1:00',
      views: '1.5M',
      uploaded: '4 years ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      subtitle: 'By Garage419',
      uploader: {
        name: 'Garage419',
        avatarUrl: '/placeholder.svg',
      },
    },
    {
      id: 13,
      title: 'What Car Can You Get For A Grand?',
      description: 'The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car.',
      duration: '5:31',
      views: '3.8M',
      uploaded: '2 years ago',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/WhatCarCanYouGetForAGrand.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      subtitle: 'By Garage419',
      uploader: {
        name: 'Garage419',
        avatarUrl: '/placeholder.svg',
      },
    },
  ];
  
  const shorts = [
    {
      id: 0,
      title: 'For Bigger Fun',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
      views: '2.5M',
    },
    {
      id: 1,
      title: 'For Bigger Joyrides',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
      views: '3M',
    },
    {
      id: 2,
      title: 'For Bigger Meltdowns',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
      views: '800K',
    },
    {
      id: 3,
      title: 'For Bigger Blazes',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      views: '500K',
    },
    {
      id: 4,
      title: 'For Bigger Escapes',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
      views: '1M',
    },
  ];

  export async function getVideos() {
    return videos;
  }
  
  export async function getShorts() {
    return shorts;
  }
  
  export const getComments = async (videoId: number) => {
    // This is just mock data
    return [
        { id: 1, author: 'Alice', text: 'Great video!', avatar: 'https://i.pravatar.cc/150?u=alice' },
        { id: 2, author: 'Bob', text: 'Very informative, thanks!', avatar: 'https://i.pravatar.cc/150?u=bob' },
    ];
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

    