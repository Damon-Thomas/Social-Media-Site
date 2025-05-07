import NodeCache from "node-cache";

// Create a NodeCache instance with a default TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

export default cache;
