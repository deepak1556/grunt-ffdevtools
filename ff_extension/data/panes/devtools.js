'use strict';

const MAX_CONNECTIONS = 5;
const CONNECTION_PORT = 9966;

// Grunt project setting
var projects = [],
  currentProject;

// Port settings
var startPort = CONNECTION_PORT,
  currentPort = startPort,
  maxPort = currentPort + MAX_CONNECTIONS;

alert("hello"); 

/**
 * Connect to a devtools socket
 */
 
function connect() {
  alert("hi");
  // find a project where the port is currentPort
  var exists = _.find(projects, function (project) {
    return project.port === currentPort;
  });

  // if no project on that port
  if (!exists) {
    var socketAddr = 'ws://localhost:' + currentPort;

    var socket = new WebSocket(socketAddr, 'echo-protocol');
    socket.onopen = handleSocketOpen;
    socket.onmessage = handleSocketMessage;
    socket.onclose = handleSocketClose;
    socket.onerror = handleSocketError;
  }

  if (maxPort === currentPort) {
    currentPort = startPort;
  }
  currentPort++;
  setTimeout(connect, 1000);
}

/**
 * Handle socket open event
 */
 
function handleSocketOpen(e) {
  this.send('handleSocketOpen');
  alert("open");
}

/**
 * Handle socket message for an event
 */

function handleSocketMessage(event) {
  var data = event.data;
  alert("message");
}

/**
 * Connect!
 */
connect();
