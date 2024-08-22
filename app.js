const express = require('express');
const path = require('path');
const morgan = require('morgan');
var xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
var hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const { application } = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: 'http://localhost:5173', // Allow only this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

// // Set the view engine to Pug
// app.set('view engine', 'pug');

// // // Set the path of views directory
// app.set('views', path.join(__dirname, 'views'));

// // // Serve static files from public directory

// // // Set Security HTTP headers
// // // set the Content Security Policy
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       // connectSrc: ["'self'", 'https://natours-api-z82r.onrender.com'],
//     },
//   }),
// );

// // Parse JSON request body and limit its size to 10KB
app.use(express.json({ limit: '10kb' }));

// // Configure the app to use URL-encoded request bodies
app.use(
  express.urlencoded({
    // Allow the middleware to parse complex objects and arrays
    extended: true,
    // Set a limit of 10 kilobytes for the incoming request body
    limit: '10kb',
  }),
);

// // The cookieParser() middleware is being used to parse cookies from incoming requests.
app.use(cookieParser());

// // Enable Cross-Origin Resource Sharing (CORS) for all routes
// // app.use(cors());

// // //Limit requests from the same API to prevent abuse
// const apiLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 100, // 100 requests per window (per IP)
//   message: 'Too many requests from this IP, please try again in an hour',
// });
// app.use('/api', apiLimiter); // apply the rate limiter to API routes only

// // Sanitize request data to prevent NoSQL injection attacks
// app.use(mongoSanitize());

// // Sanitize request data to prevent cross-site scripting (XSS) attacks
// app.use(xss());

// // Prevent parameter pollution by whitelisting certain query parameters
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsAverage',
//       'ratingsQuantity',
//       'maxGroupSize',
//       'difficulty',
//       'price',
//     ],
//   }),
// );

// // // Log HTTP requests in the console in the "dev" format
// // // Development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// app.use(compression());
// // practice middleware
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });
app.use((req, res, next) => {
  const clientUrl = req.get('Referer');
  console.log('ALI RE ALI QUERY ALI', clientUrl);
  next();
});
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle requests that do not match any of the defined routes
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server.`, 404),
  );
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
