FROM node:alpine

# Enables customized options using environment variables
ENV OSRM_BACKEND='http://localhost:5000'
ENV OSRM_CENTER='38.8995,-77.0269'
ENV OSRM_ZOOM='13'
ENV OSRM_LANGUAGE='it'
ENV OSRM_LABEL='Truck'
ENV OSRM_MAPBOX_TOKEN='pk.eyJ1IjoibHZ4IiwiYSI6ImNsbHFiNGF0bzBlbm8zb256cDRmMW11eGMifQ.FHZFXaWvfgCAo08gitmxyQ'

# Copy package.json
RUN mkdir -p /src
COPY package.json /src

# Install app dependencies
RUN apk add --no-cache sed git && \
    cd /src && \
    npm install

# Create app directory
COPY . /src
WORKDIR /src

# Run App
EXPOSE 9966
CMD ["npm", "start"]
