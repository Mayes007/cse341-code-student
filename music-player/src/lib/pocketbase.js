import PocketBase from 'pocketbase';

// Replace with your Render URL if you aren't running it locally anymore
const pb = new PocketBase('http://127.0.0.1:8090');

export default pb;