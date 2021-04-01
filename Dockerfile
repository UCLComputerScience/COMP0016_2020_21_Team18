FROM node:latest
WORKDIR /grace

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3001

RUN npm install -g pm2

CMD ["pm2", "start", "./src/index.js", "--name", "\"grace-chatbot\"", "--time"]