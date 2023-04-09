# Dockerfile
FROM node:18-alpine

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apk update && apk upgrade

# copy the app, user .dockerignore to exclude files
COPY . /usr/src/nuxt-app/
RUN npm install
# perform build at run time for now (see below)
#RUN npm run build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# build and start on docker run to be able to pass env vars
# FIXME: env vars in Nuxt apps effective only at build time (why??)
CMD ["sh", "-c", "npm run build; npm start"]
