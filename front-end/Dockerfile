# Two stage dev for front end

# FIRST STAGE build in node:alpine
#Using node:alpine build stage name 'build_stage_1'
FROM node:20-alpine AS build_stage_1

#build argument - commented out to use nginx proxy solution instead 
#- see homepage comments and vite.config
#ARG VITE_BACKEND_URL 
#ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
#set as env var for this stage

# working directory inside node:alpine root '/' of 'app'
WORKDIR /app
# copying package.json and package-lock.json
# ./ means current working dir. in this case 'app'
COPY package*.json ./

RUN npm install
# Copy rest of the frontend application into work dir - app
# first . is dir specified in docker build command (front-end folder)
# second . is dir inside container, in this case app
COPY . .
# Run build command
RUN npm run build


#SECOND STAGE
#Nginx as no need for node:alpine to build/run 
#static files created in first stage


FROM nginx:alpine

#copy Nginx config file to instigate proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from 'build' stage
# /app/dist is from my Vite npm run build
# /usr/share/nginx/html is Nginx default 
# the space " " separates source from destination for the COPY
COPY --from=build_stage_1 /app/dist/ /usr/share/nginx/html
EXPOSE 80

# Command to run
CMD ["nginx", "-g", "daemon off;"]