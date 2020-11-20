This project is written by [Sandal Jain](https://www.linkedin.com/in/eightbitguy/) which is a slightly tweeked version of typical dehla-pakad game.

## Motivation
The sole motivation for writing this game was to learn how to deploy an app to Production and build a **CI-CD pipeline** for the same. <br><br>
After testing this game with some of my friends, it came out to be an interesting game which was played over the internet at the time of COVID Lockdown.<br><br>
While developing this game, I also paid a good amount of attention in designing its UI so that it does not feel like a hobby project.

## Tools used
I have achieved my target of building a CI-CD pipeline by using<br><br> 
**Docker**: to containerize my app<br> 
**Circle-ci** to build by app's Image<br> 
**Google container repository** to keep my build images<br> 
**Google Kubernetes engine** to deploy my app<br><br> 

The backend of this app is developed in **Laravel** and UI uses **React** and **Redux**.

## Build this app
This repo only contains UI, you'll also need its [API](https://github.com/eight-bitguy/cover-dehla-pakad-api) part.
Just fire `docker-compose up` to start the app, it will download and build everything by its own

## Future plans
I also plan to publish my app on play-store and app-store after writing a react native web-view wrapper for it.

## ScreenShots
Here are some screenshots. <br>
![Main](https://user-images.githubusercontent.com/32420694/99809716-b351ae80-2b68-11eb-9c14-75c8cd4e87e9.png)
![Login](https://user-images.githubusercontent.com/32420694/99809711-b2208180-2b68-11eb-94ed-1340dde9a142.png)
![home](https://user-images.githubusercontent.com/32420694/99809706-b0ef5480-2b68-11eb-95dc-599433c33c64.png)
![join](https://user-images.githubusercontent.com/32420694/99809702-af259100-2b68-11eb-94e2-ce93ebfb7006.png)
![my true](https://user-images.githubusercontent.com/32420694/99809701-adf46400-2b68-11eb-971c-6e716b753960.png)
![game](https://user-images.githubusercontent.com/32420694/99809698-ac2aa080-2b68-11eb-82bc-f433e4c79ba6.png)
