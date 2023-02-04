FROM node:17

# Working Dir
WORKDIR /usr/src/app

# Copy Package Json Files
COPY package*.json ./

# Install Files
RUN npm install

# Copy Source Files
COPY . .

# Expose the API Port
EXPOSE 5000

CMD [ "npm", "start"]
