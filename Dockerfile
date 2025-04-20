# Step 1: Build the app
FROM node:23-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine

# Clean default html files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to NGINX
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
