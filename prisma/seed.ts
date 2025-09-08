import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('password123', salt);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password_hash,
      role: 'admin',
    },
  });

  console.log({ user });

  const videos = [
    {
      description:
        'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit aint no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org',
      video_url:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      subtitle: 'By Blender Foundation',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      title: 'Big Buck Bunny',
      duration: '10:34',
      views: 1200000,
      uploaded: new Date('2023-10-15T08:00:00Z'),
      uploader_id: user.id,
      tags: ['cartoon', 'bunny', 'comedy'],
      type: 'straight'
    },
    {
      description: 'The first Blender Open Movie from 2006',
      video_url:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      subtitle: 'By Blender Foundation',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      title: 'Elephant Dream',
      duration: '12:41',
      views: 800000,
      uploaded: new Date('2023-09-20T12:00:00Z'),
      uploader_id: user.id,
      tags: ['blender', 'open movie', 'animation'],
      type: 'gay',
    },
    { 
      description : "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne to watch the latest episodes. For $35.\nLearn how to use Chromecast with HBO GO and more at google.com/chromecast.",
      video_url : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      subtitle : "By Google",
      thumbnail_url : "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
      title : "For Bigger Blazes",
      duration: '0:15',
      views: 500000,
      uploaded: new Date('2023-08-01T10:00:00Z'),
      uploader_id: user.id,
      tags: ['google', 'chromecast', 'hbo'],
      type: 'straight'
    },
  ];

  for (const video of videos) {
    await prisma.video.upsert({
      where: { title: video.title },
      update: {},
      create: video,
    });
  }
   console.log('Seeded videos');


  const shorts = [
    {
      title: 'For Bigger Fun',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      views: '2500000',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    },
    {
      title: 'For Bigger Joyrides',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      views: '3000000',
      thumbnail_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    },
  ];

  for (const short of shorts) {
    await prisma.short.upsert({
      where: { title: short.title },
      update: {},
      create: short,
    });
  }
  console.log('Seeded shorts');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

    