import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        error: 'Too many requests, please try again later.'
    }
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 attempts per hour is reasonable for human use while preventing brute force
    message: {
        error: 'Too many login attempts, please try again later.'
    }
});
