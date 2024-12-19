# Multi-Stage Builds
#Stage 1 : build the app

#Step1 : Use an official nodejs image as parent image because React relies on Node.js for building the app don't use latest use particular version
FROM node:18.20.5 AS build
# Step 2: Set the working directory inside the container
WORKDIR /app
# Step 3: Copy the package.json file into the container
COPY package.json ./
# Step 4: Install dependencies
RUN npm install 
# Step 5: Copy the rest of the application code into the container
COPY . .
# Step 6: Build the React app for production
RUN npm run build

# Stage 2: Serve the built app with Nginx

# Step 7: Use a lighter image to serve the React app (nginx in this case)
FROM nginx:alpine

# Step 8: Copy the build output from the previous build stage to the nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the port that nginx will listen on
EXPOSE 80

# Step 10: Start nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]