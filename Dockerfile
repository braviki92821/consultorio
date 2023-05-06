FROM node:16.17.1

ADD . /consultorio
WORKDIR /consultorio

COPY ["package.json","package-lock.json*", "./"]

RUN npm install
COPY . .

CMD [ "npm","start" ]