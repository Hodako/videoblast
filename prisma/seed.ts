import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('password123', salt);

  const user = await prisma.user.create({
    data: {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password_hash,
      role: 'admin',
    },
  });

  const videos = [
    {
      description:
        'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit aint no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org',
      video_url: 
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      subtitle: 'By Blender Foundation',
      thumbnail_url: 'images/BigBuckBunny.jpg',
      title: 'Big Buck Bunny',
      duration: '10:34',
      views: '1.2M',
      uploaded: '2 weeks ago',
      uploader_id: user.id,
    },
    {
      description: 'The first Blender Open Movie from 2006',
      video_url: 
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      subtitle: 'By Blender Foundation',
      thumbnail_url: 'images/ElephantsDream.jpg',
      title: 'Elephant Dream',
      duration: '12:41',
      views: '8M',
      uploaded: '1 month ago',
      uploader_id: user.id,
    },
  ];

  for (const video of videos) {
    await prisma.video.create({
      data: video,
    });
  }

  const shorts = [
    {
      title: 'For Bigger Fun',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      views: '2.5M',
      thumbnail_url: 'images/ForBiggerFun.jpg',
    },
    {
      title: 'For Bigger Joyrides',
      video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      views: '3M',
      thumbnail_url: 'images/ForBiggerJoyrides.jpg',
    },
  ];

  for (const short of shorts) {
    await prisma.short.create({
      data: short,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });