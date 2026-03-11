FROM node:22-alpine

# Use an unprivileged user for security
# But we need to create the database file in a writable directory
WORKDIR /app

# Install dependencies (only production)
COPY package*.json ./
RUN npm install --omit=dev

# Copy application files
COPY . .

# Ensure the app has permissions over the current directory to create sqlite.db
# We can also create a folder specifically for database and images
RUN mkdir -p /app/public/images/uploads /app/data && \
    chmod -R 777 /app/public /app/data

# Environment configuration
ENV NODE_ENV=production
ENV PORT=3001

# The backend listens on 3001 by default
EXPOSE 3001

CMD ["node", "server.js"]
