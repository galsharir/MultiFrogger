var firebaseRef;
var roomRef;
var EVENT_NORTH = 0;
var EVENT_EAST = 1;
var EVENT_SOUTH = 2;
var EVENT_WEST = 3;
var STATUS_READ = 1;
var STATUS_WRITTEN = 2;

$(document).ready(function(){
  firebaseRef = new Firebase('https://pennexchange-yhack.firebaseio.com/');
  $("#btnRoom").click(function(){
    openRoom($("#nameRoom").val());
  });
});

function openRoom(roomName) {
  log('openRoom(' + roomName + ')');
  if(roomRef != null)
    roomRef.off('child_changed');
  roomRef = firebaseRef.child(roomName);
  roomRef.child('0/attr').once('value', function(snap){
    if(snap.val() === null) {
      for(var i=0; i<4; i++){
        roomRef.child(i + '/attr').set('');
        roomRef.child(i + '/event').set(EVENT_NORTH);
        roomRef.child(i + '/attrStat').set(STATUS_READ);
        roomRef.child(i + '/eventStat').set(STATUS_READ);
      }
    }
  });
  roomRef.on('child_changed', function(snap){
    log('child_changed');
    var playerId = snap.name();
    var playerAttr = snap.child('attr').val();
    var playerEvent = snap.child('event').val();
    var playerAttrStat = snap.child('attrStat').val();
    var playerEventStat = snap.child('eventStat').val();
    //log('' + playerId + ' ' + playerAttr + ' ' + playerEvent + ' ' + playerAttrStat + ' ' + playerEventStat);
    
    if(playerAttrStat == STATUS_WRITTEN){
      snap.ref().child('attrStat').set(STATUS_READ);
      if(playerAttr == ''){
        removePlayer(playerId);
      }
      else{
        var playerNew = playerAttr.substr(0, 4) == 'new-';
        if(playerNew){
          playerAttr = playerAttr.substr(4);
          snap.ref().child('attr').set(playerAttr);
        }
        var playerAttrArr = playerAttr.split('-');
        var playerColor = playerAttrArr[0];
        var playerName = playerAttrArr[1];
        if(playerNew)
          addPlayer(playerId, playerColor, playerName);
        else
          updatePlayer(playerId, playerColor, playerName);
      }
    }
    
    if(playerEventStat == STATUS_WRITTEN){
      snap.ref().child('eventStat').set(STATUS_READ);
      movePlayer(playerId, playerEvent);
    }
  });
}

function log(entry){
  var currentdate = new Date(); 
  var timestamp = currentdate.getHours() + ':'  
                + currentdate.getMinutes() + ':' 
                + currentdate.getSeconds();
  $('#log').prepend(timestamp + ' - ' + entry + '<br/>');
}

function addPlayer(n, color, name){
  log('addPlayer(' + n + ', ' + color + ', ' + name + ')');
}

function updatePlayer(n, color, name){
  log('updatePlayer(' + n + ', ' + color + ', ' + name + ')');
}

function removePlayer(n){
  log('removePlayer(' + n + ')');
}

function movePlayer(n, direction){
  log('movePlayer(' + n + ', ' + direction + ')');
}
