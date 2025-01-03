FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g typescript && npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production