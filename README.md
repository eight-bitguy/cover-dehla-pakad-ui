This project is written by [Sandal Jain](https://www.linkedin.com/in/eightbitguy/) which is a slightly tweeked version of typical dehla-pakad game.

## Motivation
The sole motivation for writing this game was to learn how to deploy an app to Production and build a CI-CD pipeline for the same. <br><br> 
After testing this game with some of my friends, it came out to be an interesting game which was played over the internet at the time of COVID Lockdown.<br><br>
While developing this game, I also paid a good amount of attention in designing its UI so that it does not feel like a hobby project.

##Tools used
I have achieved my target of building a CI-CD pipeline by using<br><br> 
**Docker**: to containerize my app
**Circle-ci** to build by app's Image
**Google container repository** to keep my build images
**GKE** to deploy my app

The backend of this app is developed in **Laravel** and UI uses **React** and **Redux**.

##Build this app
To repo contains UI, you'll also need its [API](https://github.com/eight-bitguy/cover-dehla-pakad-api) part.
Just fire `docker-compose up` to start the app, it will download and build everything by its own

##Future plans
I also plan to publish my app on play-store and app-store after writing a react native web-view wrapper for it.

##ScreenShots
Here are some screenshots.
![image](https://user-images.githubusercontent.com/32420694/99808305-a9c74700-2b66-11eb-8126-b37a20538bd8.png)
![image](https://user-images.githubusercontent.com/32420694/99808302-a92eb080-2b66-11eb-8fd7-1c630f5d1b56.png)
![image](https://user-images.githubusercontent.com/32420694/99808292-a6cc5680-2b66-11eb-8f24-6acee4dd6fe5.png)
![image](https://user-images.githubusercontent.com/32420694/99808288-a469fc80-2b66-11eb-9b3c-e27790754e49.png)
![image](https://user-images.githubusercontent.com/32420694/99808270-9fa54880-2b66-11eb-86f7-4df93fa40945.png)
![image](https://user-images.githubusercontent.com/32420694/99808282-a2a03900-2b66-11eb-93bb-d832330b09db.png)
