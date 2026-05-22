FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy codebase
COPY . .

# Build the project (generates dist/ folder)
RUN npm run build

# Expose port 5179
EXPOSE 5179

# Serve production built files using Vite preview
CMD ["npm", "run", "preview"]
