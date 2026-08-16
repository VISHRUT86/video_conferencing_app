let IS_PROD = true;

const server = IS_PROD ?
    "https://video-conferencing-app-6o6a.onrender.com" :
    "http://localhost:8001";

export default server;
