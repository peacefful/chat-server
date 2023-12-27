# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install TypeScript globally and project dependencies
RUN npm install -g typescript && npm install

# Copy the rest of the application code to the container
COPY . .

# make wait-for-postgres.sh executable
RUN chmod +x wait-for-postgres.sh

# Build TypeScript files
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Run the application
CMD ["npm", "start"]
