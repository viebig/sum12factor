FROM mhart/alpine-node:6

WORKDIR /src
ADD . .

RUN npm install --production

EXPOSE 8080
CMD ["node", "index.js"]
