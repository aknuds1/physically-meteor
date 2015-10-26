FROM node:0.10
MAINTAINER Arve Knudsen

RUN apt-get update -y && apt-get install -y curl

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV PORT 80
EXPOSE 80
ENTRYPOINT ["node", "main.js"]

RUN curl https://install.meteor.com | /bin/sh

# Build bundle
COPY ./ /app
WORKDIR /app
RUN meteor build --directory /tmp/the-app
WORKDIR /tmp/the-app/bundle/programs/server/
RUN npm install
RUN mv /tmp/the-app/bundle /built_app
WORKDIR /built_app

# cleanup
RUN rm -rf /tmp/the-app ~/.meteor /usr/local/bin/meteor
