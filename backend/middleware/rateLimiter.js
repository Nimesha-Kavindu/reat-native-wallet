import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit("my-rate-limit");
        
        if (!success) {
            return res.status(429).json({ error: "Too many requests" });
        }

        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        // If rate limiting fails due to Redis issues, allow the request to proceed
        next();
    }
}

export default rateLimiter;