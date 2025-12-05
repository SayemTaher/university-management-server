# University Management Server – Backend API

## Overview

This repository contains the backend API I am building as part of the Programming Hero full stack course. The goal of this project is to strengthen my backend skills with Node.js, TypeScript, Express and MongoDB while working toward my long term role as a full stack developer.

At this stage the focus is on the server side. A separate frontend will be added later. The code in this repository lets me practice topics such as routing, data modelling, validation, error handling and environment based configuration.

## Learning goals

For this project I set the following concrete goals:

* Apply TypeScript in a real backend code base instead of only in small exercises  
* Use Express to design a small but realistic API with routes, controllers and middleware  
* Model data with MongoDB and Mongoose and understand relations and constraints  
* Improve error handling, logging and configuration for different environments  
* Follow a clean folder structure so the API can grow into a full stack application later  

These goals connect directly to the full stack course content and to my ambition to work with the Mongo Express React Node stack.

## Tech stack

* Node.js and npm  
* TypeScript  
* Express for HTTP server and routing  
* MongoDB with Mongoose as object modelling layer  
* ESLint and Prettier for code style and basic static checks  

## Project structure

The repository currently contains:

* `src` – TypeScript source files for the backend  
  * application setup and server entry  
  * route and controller files  
  * Mongoose models and related logic  
  * configuration and utility helpers  
* `dist` – compiled JavaScript output generated from `src`  
* `tsconfig.json` – TypeScript compiler options  
* `eslint.config.mjs` – linting rules  
* `package.json` and `package-lock.json` – dependencies and npm scripts  

This separation allows me to write modern TypeScript while keeping the runtime files in `dist` ready for deployment.

## Development approach

I am using this project to practice a professional backend workflow:

* Start from written requirements and a simple domain model  
* Translate requirements into routes, controllers and data models  
* Commit in small steps with clear messages so my learning process stays visible  
* Refactor structure when needed instead of only adding new code  
* Keep configuration and secrets outside the repository through environment variables  

Along the way I link course assignments and requirement analysis documents in the repository so that the connection between learning material and code remains clear.

## Getting started

### Prerequisites

* Node.js and npm installed  
* Access to a MongoDB instance (local or cloud)  

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/SayemTaher/university-management-server.git
cd src
npm install
ts-node-dev --respawn --transpile-only src/server.ts or start:dev
