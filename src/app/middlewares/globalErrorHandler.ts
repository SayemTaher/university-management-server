/**
 * Global Error Handler Middleware
 *
 * This middleware serves as the central error handling mechanism for the entire application.
 * It catches all errors thrown during request processing and formats them into a consistent
 * response structure. The handler processes different types of errors (Zod validation errors,
 * Mongoose cast errors, duplicate key errors, custom AppErrors, and generic errors) and
 * transforms them into user-friendly error responses.
 *
 * Error Response Structure:
 * - success: Always false for error responses
 * - message: Human-readable error message
 * - errorSources: Array of error objects with path and message for field-level errors
 * - gotError: The original error object (for debugging)
 * - stack: Error stack trace (only in development environment)
 */

import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import config from '../config';
import AppError from '../CustomError/app-error';
import { TErrorSource } from '../CustomError/error-interface';
import { handleCastError } from '../CustomError/handle-cast-error';
import { handleDuplicateError } from '../CustomError/handle-duplicate-error';
import { zodErrorHandler } from '../CustomError/ZodError';


const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Initialize default error response values
  // Default to 500 (Internal Server Error) if no status code is provided
  let statusCode = err.statusCode || 500;
  // Default to generic error message if no specific message exists
  let message = err.message || 'Something went wrong';

  // Initialize default error sources array with a generic error structure
  // This will be replaced by specific error handlers with more detailed information
  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  /**
   * Error Type Detection and Processing
   *
   * The handler uses a cascading if-else structure to identify and process different error types.
   * Each error type has a specific handler that transforms the raw error into a standardized format.
   */

  // Handle Zod validation errors - occurs when request data fails Zod schema validation
  if (err instanceof ZodError) {
    const simplifiedError = zodErrorHandler(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle Mongoose validation errors - occurs when Mongoose schema validation fails
  // Note: There's a typo in the error name ('ValidationEror' instead of 'ValidationError')
  // This handles Mongoose validation errors that may have been incorrectly named
  else if (err?.name === 'ValidationEror') {
    const simplifiedError = zodErrorHandler(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle Mongoose Cast errors - occurs when invalid ObjectId or data type conversion fails
  // Example: Trying to use a string like "create-academic-semester" as an ObjectId
  else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle MongoDB duplicate key errors - occurs when trying to insert a document with
  // a unique field value that already exists (error code 11000 is MongoDB's duplicate key error)
  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle custom application errors - these are errors thrown using the AppError class
  // These are intentional errors with predefined status codes and messages
  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }
  // Handle generic JavaScript Error objects - catch-all for any other error types
  // This ensures that even unexpected errors are handled gracefully
  else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  /**
   * Send formatted error response to client
   *
   * The response includes:
   * - success: false to indicate the request failed
   * - message: User-friendly error message
   * - errorSources: Array of detailed error information (useful for validation errors)
   * - gotError: Original error object (for debugging purposes)
   * - stack: Error stack trace (only included in development environment for security)
   */
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    gotError: err,
    // Only expose stack trace in development to avoid leaking sensitive information in production
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

/**
 * Error Response Pattern Documentation
 *
 * All error responses follow this consistent structure:
 *
 * {
 *   success: false,                    // Always false for error responses
 *   message: "Error description",      // Main error message
 *   errorSources: [                    // Array of detailed error information
 *     {
 *       path: "fieldName",             // Field path where error occurred (empty string for general errors)
 *       message: "Specific error message" // Detailed error message for this field
 *     }
 *   ],
 *   gotError: { ... },                 // Original error object (for debugging)
 *   stack: "..."                       // Stack trace (only in development)
 * }
 *
 * This standardized format ensures consistent error handling across the entire application
 * and makes it easier for frontend developers to parse and display errors appropriately.
 */
