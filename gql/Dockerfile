FROM node:10

ENV HOME=/home/application
ENV NODE_ENV=development
WORKDIR $HOME/gql

RUN pwd

COPY package.json yarn.lock $HOME/gql/
RUN npm i -g nodemon@latest yarn@latest
RUN yarn install --production=false
RUN ls -laC
COPY . $HOME/gql

EXPOSE 8002

CMD ["yarn","start"]
