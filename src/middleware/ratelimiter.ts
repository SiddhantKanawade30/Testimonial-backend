import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

// Extend Express Request type to include rateLimit property
declare global {
  namespace Express {
    interface Request {
      rateLimit?: {
        limit: number;
        current: number;
        remaining: number;
        resetTime?: number;
      };
    }
  }
}

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
      retryAfter: req.rateLimit?.resetTime
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for specific routes if needed
    return false;
  }
});

// Stricter limiter for public endpoints (testimonial submission)
export const publicLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many submissions. Please try again later.",
      retryAfter: req.rateLimit?.resetTime
    });
  }
});
