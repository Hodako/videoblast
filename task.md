# Project Tasks

This file contains a log of all the prompts provided during the development of this application.

---

### Prompt 1

Use the below link for the database. seed database for testing purpose. Build the builld in video player. Generate the full admin panels and all the backend logics. Here is postgresql url from render.com with ssl = "postgresql://evershoponline_user:7EsOjebnvX8xGo8UJHBinKmHj30xPul2@dpg-d2rvope3jp1c738ml1ig-a.oregon-postgres.render.com/evershoponline" and save it also in the env files. push db. and here is some test videos url for seed.  "videos" : [ 
		    { "description" : "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" ],
              "subtitle" : "By Blender Foundation",
              "thumb" : "images/BigBuckBunny.jpg",
              "title" : "Big Buck Bunny"
            },
            { "description" : "The first Blender Open Movie from 2006",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" ],
              "subtitle" : "By Blender Foundation",
              "thumb" : "images/ElephantsDream.jpg",
              "title" : "Elephant Dream"
            },
            { "description" : "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne to watch the latest episodes. For $35.\nLearn how to use Chromecast with HBO GO and more at google.com/chromecast.",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" ],
              "subtitle" : "By Google",
              "thumb" : "images/ForBiggerBlazes.jpg",
              "title" : "For Bigger Blazes"
            },
            { "description" : "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" ],
              "subtitle" : "By Google",
              "thumb" : "images/ForBiggerEscapes.jpg",
              "title" : "For Bigger Escape"
            },
            { "description" : "Introducing Chromecast. The easiest way to enjoy online video and music on your TV. For $35.  Find out more at google.com/chromecast.",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" ],
              "subtitle" : "By Google",
              "thumb" : "images/ForBiggerFun.jpg",
              "title" : "For Bigger Fun"
            },
            { "description" : "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for the times that call for bigger joyrides. For $35. Learn how to use Chromecast with YouTube and more at google.com/chromecast.",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" ],
              "subtitle" : "By Google",
              "thumb" : "images/ForBiggerJoyrides.jpg",
              "title" : "For Bigger Joyrides"
            },
            { "description" :"Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when you want to make Buster's big meltdowns even bigger. For $35. Learn how to use Chromecast with Netflix and more at google.com/chromecast.", 
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" ],
              "subtitle" : "By Google",
              "thumb" : "images/ForBiggerMeltdowns.jpg",
              "title" : "For Bigger Meltdowns"
            },
			{ "description" : "Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.\nThis 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.\nwww.sintel.org",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" ],
              "subtitle" : "By Blender Foundation",
              "thumb" : "images/Sintel.jpg",
              "title" : "Sintel"
            },
			{ "description" : "Smoking Tire takes the all-new Subaru Outback to the highest point we can find in hopes our customer-appreciation Balloon Launch will get some free T-shirts into the hands of our viewers.",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" ],
              "subtitle" : "By Garage419",
              "thumb" : "images/SubaruOutbackOnStreetAndDirt.jpg",
              "title" : "Subaru Outback On Street And Dirt"
            },
			{ "description" : "Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org", 
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" ],
              "subtitle" : "By Blender Foundation",
              "thumb" : "images/TearsOfSteel.jpg",
              "title" : "Tears of Steel"
            },
			{ "description" : "The Smoking Tire heads out to Adams Motorsports Park in Riverside, CA to test the most requested car of 2010, the Volkswagen GTI. Will it beat the Mazdaspeed3's standard-setting lap time? Watch and see...",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" ],
              "subtitle" : "By Garage419",
              "thumb" : "images/VolkswagenGTIReview.jpg",
              "title" : "Volkswagen GTI Review"
            },
			{ "description" : "The Smoking Tire is going on the 2010 Bullrun Live Rally in a 2011 Shelby GT500, and posting a video from the road every single day! The only place to watch them is by subscribing to The Smoking Tire or watching at BlackMagicShine.com",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" ],
              "subtitle" : "By Garage419",
              "thumb" : "images/WeAreGoingOnBullrun.jpg",
              "title" : "We Are Going On Bullrun"
            },
			{ "description" : "The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car.The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car.",
              "sources" : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4" ],
              "subtitle" : "By Garage419",
              "thumb" : "images/WhatCarCanYouGetForAGrand.jpg",
              "title" : "What care can you get for a grand?"
            }
    ]
}]};
Also build the shorts video player. add some shorts video also.

---

### Prompt 2

The video player is looks like basic html player. make the video player advance. And make the video like user can trace the video url or src. Build, login/signup page, search page.

---

### Prompt 3

Login and signup page is showing but not able to login and signup. Rename the filter by orienttation to filder by type, and add 3 checkbox like Straight, Gray , Trans and remove old all, landscape and potrait optons. also use icons for each. The video settings here the playback speed is not working. fix this also. and video can skip 10 seond left and right, add this gesture.

---

### Prompt 4

after clicking login or signup, nothing happening. Fix this. Establish connection to the postgreClient. Now, use below postgre address and seed data and fetch data from thre postgresql://databasefordata_user:OB1BXLyGrtcjKKuMvtCWybrLWSB81Xos@dpg-d2u5t6h5pdvs73a5rlo0-a.singapore-postgres.render.com/databasefordata

---

### Prompt 5

You don't have to connect just use it .env files and make fully useable after running the website locally.

---

### Prompt 6

ok, create a files task.md and plan.md where save all the pormpts and save the current directory status and add coments for each files and write how to funtions the website.
