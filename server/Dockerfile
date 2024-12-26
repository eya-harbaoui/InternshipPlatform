#Step1 : Use an official nodejs image as parent image because React relies on Node.js for building the app don't use latest use particular version
FROM node:18.20.5 

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json file into the container
COPY package.json ./


# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 9: Expose the port that backend server will listen on

EXPOSE 8000
# Step 9: Start the backend server

CMD [ "node","server.js" ]