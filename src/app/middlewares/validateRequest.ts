/**
 * Request Validation Middleware
 * 
 * This middleware validates incoming request data against Zod schemas before
 * the request reaches the route handler. It ensures data integrity and type safety
 * by validating request bodies according to predefined Zod validation schemas.
 * 
 * How it works:
 * 1. Takes a Zod schema as input (closure pattern)
 * 2. Returns a middleware function that validates req.body against the schema
 * 3. If validation passes, calls next() to proceed to the route handler
 * 4. If validation fails, passes the ZodError to the error handler via next(err)
 * 
 * Benefits:
 * - Centralized validation logic
 * - Type-safe request data
 * - Automatic error handling for invalid data
 * - Prevents invalid data from reaching business logic
 * 
 * Usage Example:
 * router.post('/create-user', 
 *   validationSchemas.validateRequest(UserValidationSchema), 
 *   UserController.createUser
 * )
 */

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

/**
 * Creates a validation middleware function for a specific Zod schema
 * 
 * This is a higher-order function that uses the closure pattern:
 * - Takes a Zod schema as input
 * - Returns a middleware function that validates requests against that schema
 * 
 * @param schema - Zod schema object that defines the validation rules for the request body
 * @returns Express middleware function that validates req.body against the provided schema
 * 
 * @example
 * const userSchema = z.object({ name: z.string(), email: z.string().email() });
 * const validateUser = validateRequest(userSchema);
 * router.post('/users', validateUser, createUser);
 */
const validateRequest = (schema: AnyZodObject) => {
  /**
   * The actual middleware function that performs validation
   * 
   * This function is returned by validateRequest and will be executed
   * for each request that uses this validation middleware.
   * 
   * @param req - Express request object (validates req.body)
   * @param res - Express response object (not used, but required by signature)
   * @param next - Express next function (called to proceed or pass errors)
   */
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the provided Zod schema
      // parseAsync validates the data and throws a ZodError if validation fails
      // The schema expects an object with a 'body' property containing the request body
      await schema.parseAsync({ body: req.body });
      
      // If validation succeeds, proceed to the next middleware or route handler
      next();
    } catch (err) {
      // If validation fails, Zod throws a ZodError
      // Pass the error to the global error handler via next()
      // The global error handler will format and return the validation errors
      next(err);
    }
  };
};

/**
 * Exported validation utilities object
 * 
 * This object contains all validation-related middleware functions.
 * It provides a clean, organized way to access validation middleware
 * throughout the application.
 */
export  const validationSchemas = {validateRequest}