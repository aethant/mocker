FROM alpine:3.8

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

RUN apk add --update nodejs nodejs-npm

ARG username
ARG password

RUN git clone https://${username}:${password}@github.com/pantharshit00/jwtAuth
RUN cd jwtAuth && npm install

CMD ["node", "./jwtAuth/app.js"]