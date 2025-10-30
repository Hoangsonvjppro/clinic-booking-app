FROM node:21.4.0
WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install
RUN npm install

ENV PORT=8080
EXPOSE 8080

CMD ["npm","run","start"]
