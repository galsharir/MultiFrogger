var firebaseRef;
var roomRef;
var EVENT_NORTH = 0;
var EVENT_EAST = 1;
var EVENT_SOUTH = 2;
var EVENT_WEST = 3;
var STATUS_READ = 1;
var STATUS_WRITTEN = 2;

 firebaseRef = new Firebase('https://pennexchange-yhack.firebaseio.com/');

function openRoom(roomName) {
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
        if(playerNew) {
          addPlayer(playerId, playerName, playerColor);
        }
        else {
          updatePlayer(playerId, playerName, playerColor);
        }
      }
    }
    
    if(playerEventStat == STATUS_WRITTEN){
      snap.ref().child('eventStat').set(STATUS_READ);
      movePlayer(playerId, playerEvent);
    }
  });
}

