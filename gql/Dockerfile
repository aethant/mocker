FROM node:10

ENV HOME=/home/application
ENV NODE_ENV=development
RUN mkdir -p $HOME/gql
WORKDIR $HOME/gql

RUN npm config set registry https://registry.npmjs.org
COPY package.json $HOME/gql/package.json
RUN npm install -g nodemon@latest
RUN npm install
COPY . $HOME/gql

ENV PORT 8002
EXPOSE 8002

CMD ["npm","start"]
