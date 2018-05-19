const SocketIO = require('socket.io');
const Bed = require('../models/bed.model');
const bedService = require('../services/bed.service');
const _ = require('lodash');

//make global array variables
let devActiveArr = [];


function SocketManager(server) {
  const io = SocketIO(server);
  io.on('connection',function(socket){
    console.log(`Socket ${socket.id} connected...`);

    socket.on('overwrite',function(data){
      console.log(`Report to ${data.device_key}:`);
      console.log(data);
    });
     
    socket.on('report',function(data){
      data.socket_id = socket.id;
      if(_.find(devActiveArr,(d)=>{
          return d.device_key == data.device_key;
      }) == null ){
          devActiveArr.push(data);
          console.log(`${_.last(devActiveArr).device_key} registered to actives table`);
          // update bed db
          Bed.findOneAndUpdate({bedMonitoringDevKey: data.device_key},{bedMonitoringDevActive: true },(err,doc,res)=>{
              if(err) console.log('Error setting bedMonitoringDevActive to true');
              if(doc) console.log('Success setting bedMonitoringDevActive to true');
          });
      }else{
        //socket.emit('present',_.omit(data,'socket_id'));
        socket.broadcast.emit('present',data);
      }
    });
    
    socket.on('disconnect',function(){
        let index = _.findIndex(devActiveArr,(d)=>{
            return d.socket_id == socket.id;
        });

        if (index > -1){
            Bed.findOneAndUpdate({bedMonitoringDevKey: devActiveArr[index].device_key},{bedMonitoringDevActive: false },(err,doc,res)=>{
              if(err) console.log('Error setting bedMonitoringDevActive to false');
              if(doc) console.log('Success setting bedMonitoringDevActive to false');
            });
            devActiveArr.splice(index,1);
            
        }
        console.log(`Device ${socket.id} disconnected...`);
    });
  });
}
// class methods
/* SocketManager.prototype. = function() {
  
}; */
// export the class
module.exports = SocketManager;