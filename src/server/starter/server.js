
import starter from './<%= builder.dirs.tgt.server %>/scripts/start';
// eslint-disable-next-line no-unused-vars
const server = starter({});

// server.error(function(err, req, res, next){
//   if (err instanceof NotFound) {
//     res.render('404.pug', { locals: {
//         analyticssiteid: 'XXXXXXX'
//       },
//       status: 404
//     });
//   } else {
//     res.render('500.pug', {
//       locals: {
//         analyticssiteid: 'XXXXXXX'
//         ,error: err
//       },
//       status: 500
//     });
//   }
// });
