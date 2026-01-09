const PORT = 8000;
const HOST_DOMAIN = '10.25.40.22';
const PROTOCOL = "http:";
// WITH PORT
export const API_BASE_URL = PROTOCOL+'//'+HOST_DOMAIN+':'+PORT+'/api';
export const API_BASE = PROTOCOL+'//'+HOST_DOMAIN+':'+PORT;
export const FILE_BASE_URL = API_BASE+'/storage/app';

// WITHOUT PORT
// const API = "https://fbuis.snsu.edu.ph";
// export const API_BASE_URL = API+'/api';
// export const API_BASE = API
// export const FILE_BASE_URL = API+'/storage';

export const ENABLE_DEBUG = true;
export const GOOGLE_CLIENT_ID = "75170860680-iugg9obg1c32e3btmqo800h1med0oqvq.apps.googleusercontent.com";
export const PROJECT_ID = "project-75170860680";
export const SCHOOL_NAME = "SURIGAO DEL NORTE STATE UNIVERSITY";
export const SEMAPHORE_API_KEY="2db497e7dca562167ae58275bc4bf2c0"
export const SEMAPHORE_API_SENDER_NAME="DJEMC"
export const APP_NAME = "BuildMart";
export const TAGLINE = "Everything you need to Build";
export const PAGE_ID = "100498592411671";
export const APP_ID = "RTS";
export const CACHE_REFRESH = 1000