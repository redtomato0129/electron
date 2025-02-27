#!/bin/bash

# Clean previous builds
rm -rf dist
rm -rf release

# Install dependencies
npm install

# Build for different platforms
case "$(uname -s)" in
   Darwin)
     echo 'Building for macOS...'
     npm run electron:build:mac
     ;;
   MINGW*|MSYS*|CYGWIN*)
     echo 'Building for Windows...'
     npm run electron:build:win
     ;;
   *)
     echo 'Building for all platforms...'
     npm run electron:build
     ;;
esac 