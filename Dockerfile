# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:12.18.3 as build-stage
WORKDIR /app
# COPY . .
# RUN npm ci && npm run build
COPY . /app/
#RUN ls 

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.23.2
#Copy ci-dashboard-dist
COPY --from=build-stage /app/dist/siplus/ /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
# COPY ./certificado/AllInOne.crt /etc/nginx/certificado/AllInOne.crt
# COPY ./certificado/AllInOne.txt /etc/nginx/certificado/AllInOne.txt
# COPY ./certificado/private.key /etc/nginx/certificado/private.key


# FROM nginx:1.15
# #WORKDIR /ng-app
# COPY . .
# COPY  /PROFILE /usr/share/nginx/html
# # COPY  /dist /usr/share/nginx/html
# #Copy default nginx configuration
# COPY nginx-custom.conf /etc/nginx/conf.d/default.conf