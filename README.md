# Freact
React from scratch following the philosophy of the quote, "What I cannot create, I do not understand" — Richard Feynman.

# Description 
Freact is a front-end library similier to react. Purpose of this library is to understand internal of React library.

This project was created following the blog linked below with few improvements of my own.

[Build your own React](https://pomb.us/build-your-own-react/) 

# Improvements

1. Rendering multiple elements in seperate containers. The blog post version was not able to render elements in multiple containers.So I added some imporvments. Instead of assigning wipRoot in the render function, we maintain a queue of wipRoot.In workLoop we check if there is no nextUnitOfwork and wipQueue is not empty then we pop the first element assign it to wipRoot and set the nextUnitOfWork.
