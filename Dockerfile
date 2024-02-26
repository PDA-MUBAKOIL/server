FROM node:21
WORKDIR /app
COPY package*.json /app/
COPY .env /app/

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]