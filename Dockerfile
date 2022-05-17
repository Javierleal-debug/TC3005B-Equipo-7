# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /peripheral-loans
COPY . .
RUN yarn install --production
CMD yarn start
EXPOSE 3000

# docker build -t peripheral-loans .
# docker run -dp 3000:3000 peripheral-loans
