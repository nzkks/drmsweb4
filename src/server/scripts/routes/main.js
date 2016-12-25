import express from 'express';
let router = express.Router();
let title = 'Shanthosh Krishnakumar';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',
    {title});
});

//A Route for Creating a 500 Error (Useful to keep around)
// router.get('/500', function(req, res) {
//   throw new Error('This is a 500 Error');
// });

//The 404 Route (ALWAYS Keep this as the last route)
// router.get('/*', function(req, res) {
//   throw new NotFound;
// });
//
// function NotFound(msg){
//   this.name = 'NotFound';
//   Error.call(this, msg);
//   Error.captureStackTrace(this, arguments.callee);
// }

export default router;
