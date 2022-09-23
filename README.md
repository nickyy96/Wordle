# Wordle
This app was the first project designed for my future portfolio. It is **mobile and desktop compatible** and 
contains all the standard Wordle functions - hard mode, light/dark mode, and local storage capabilities.

To run this app locally clone the github repo's `working` branch and run npm start in `/frontend` and `/backend`.
The actual site is deployed and is publically available at https://wordle.nickyyarnall.dev/.

## Stack
This is a ReactJS app with a NodeJS backend. The backend randomly selects a new 5 letter word and exposes an endpoint
`/api` to retrieve the word. In this sense, all users will experience the same words if they log on within the same hour.
The frontend is styled using SCSS.

## Algorithmic Complexities
A challenge in designing this app is the logical structure of hard mode. For clarity, the rules are designed as follows:  
  - Any green tiles revealed in a previous guess must be present in the new guess
  - Any orange tiles revealed in a previous guess must in the new guess - they **can** be in the same spot though
  - Any absent tiles revealed in a previous guess cannot be present in the new guess

Another challenge presented in designing this app is handling duplicate letters. For example, if the word is `socks` and
the user guesses `sassy`, the first s should be marked correct, the second present, and the third absent.

## Compatibilities
Another challenge driving this creation was mobile and browser compatibility. Using vendor prefixes and a lot of testing,  
this app is compatible with **all** mobile devices and Internet Explorer, Mozilla Firefox, Chrome, and Safari (and likely any
others).

## Contact
Should you find yourself with any questions or comments regarding this app (or potentially any discovered bugs), please  
reach out to `nicholas_yarnall@brown.edu`. Enjoy :)
