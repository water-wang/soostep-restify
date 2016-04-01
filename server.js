var config  = require('./config');

/** 
 * single mode
*/
var server = require('./worker');
server.listen(config.PORT, function () {
    console.log('%s is listening localhost:%s', server.name, config.PORT);
});

/**
 * cluster mode
 */
//var cluster = require('cluster');
// if (cluster.isMaster) {
//     var cpus     = require('os').cpus();
//     var workers  = {};
//     var requests = {};

//     for (var i = 0; i < cpus.length; i++) {
//         // child-process instance.
//         workers[i] = cluster.fork();
        
//         (function (i) {
//             // communicate between cluster and workers.
//             workers[i].on('message', function (message) {
//                 if (message.cmd == 'incrementRequestTotal') {
//                     requests++;
//                     for (var j = 0; j < cpus.length; j++) {
//                         workers[j].send({
//                             workerid: workers[j].id,
//                             cmd: 'updateOfRequestTotal',
//                             requests: requests
//                         });                        
//                     }
//                 }
//             });
//         })(i);
//     }
    
//     /** 
//      * cluster events
//     */
//     cluster.on('fork', function (worker) {
//         console.log('fork: worker %s, process id: %s', worker.id, worker.process.pid);
//     });
    
//     cluster.on('online', function (worker) {
//         console.log('online: worker %s, process id: %s', worker.id, worker.process.pid);
//     });
    
//     cluster.on('exit', function (worker, code, signal) {
//         console.log('Worker ' + worker.process.pid + ' died.');
//         // when worker died, fork a new worker instance.
//         var worker = cluster.fork();
//     });
    
// } else {   
//     /** 
//      * worker process instance
//     */
//     var worker = require('./worker');
//     worker.listen(config.PORT, function () {
//         console.log('%s is listening localhost:%s', worker.name, config.PORT);
//     });
// }