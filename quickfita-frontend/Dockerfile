FROM node:18.7.0-buster-slim

RUN apt-get update && apt-get install yarn -y

WORKDIR /audo-web/
COPY package.json yarn.lock /audo-web/
RUN yarn
COPY . /audo-web/
