'use strict';

const MAX_CONNECTIONS = 5;
const CONNECTION_PORT = 61750;

// Grunt project setting
var projects = [],
  currentProject;

// Port settings
var startPort = CONNECTION_PORT,
  currentPort = startPort,
  maxPort = currentPort + MAX_CONNECTIONS;

var projectListTpl = JST['src/templates/project-list.html'],
  panelTpl = JST['src/templates/panel-tpl.html'],
  taskListTpl = JST['src/templates/task-list.html'],
  bgTasksTpl = JST['src/templates/background-task-list.html'];

var $body = $('body'),
  $panel = $('#panel');

$panel.html(panelTpl({}));  

var $projects = $('#placeProjects'),
  $tasks = $('#tasks'),
  $output = $('#placeOutput'),
  $outputWrap = $('#output'),
  $regularTasks = $('#placeTasks'),
  $aliasTasks = $('#placeAliasTasks'),
  $warning = $('#updateWarning'),
  $bgSection = $('#backgroundTasks'),
  $bgTasks = $('#placeBackgroundTasks');  

/**
 * Console color styles
 * TODO: move this later
 */
var modStyles = {
// "name": [beginCode, endCode, htmlTag]
  'bold': [1, 22, "b"],
  'italic': [2, 23, "i"],
  'underline': [4, 24, "u"],
  'inverse': [7, 27, "span"],
  'strikethrough': [9, 29, "del"]
};

var colorStyles = {
// "name": beginCode (endCode is always "39" and htmlTag is "span")
  'white': 37,
  'grey': 90,
  'black': 30,
  'blue': 34,
  'cyan': 36,
  'green': 32,
  'magenta': 35,
  'red': 31,
  'yellow': 33
};

var regExps = null;

function beginTag(tag, cls) {
  return '<' + tag + ' class="' + cls + '">';
}

function endTag(tag) {
  return '</' + tag + '>';
}

function themeClass(name) {
  return 'theme-' + name;
}

function cliRegExp(num) {
  return new RegExp('\x1B\\[' + num + 'm', "g");
}

/**
 * Create regular expression from styles definition
 */
function getRegExps(modStyles, colorStyles) {
  if (!_.isNull(regExps)) return regExps;

  var i = 1, name;
  regExps = [
    [cliRegExp(39), endTag("span")]
  ];
  for (name in modStyles) {
    regExps[i++] = [
      cliRegExp(modStyles[name][0]),
      beginTag(modStyles[name][2], themeClass(name))
    ];
    regExps[i++] = [
      cliRegExp(modStyles[name][1]),
      endTag(modStyles[name][2])
    ];
  }
  for (name in colorStyles) {
    regExps[i++] = [
      cliRegExp(colorStyles[name]),
      beginTag("span", themeClass(name))
    ];
  }

  return regExps;
}

/**
 + * Colorize a message.
 + */
function colorize(msg) {
  var regExps = getRegExps(modStyles, colorStyles);
  var result = msg;
  for (var r in regExps) {
    result = result.replace(regExps[r][0], regExps[r][1]);
  }
  return result;
}


/**
 * Connect to a devtools socket
 */
 
function connect() {
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
  $body.removeClass('offline').addClass('online');
  this.send('handleSocketOpen');
}

/**
 * Handle socket message for an event
 */

function handleSocketMessage(event) {
  var data = event.data,
    action = false;

  try {
    data = JSON.parse(event.data);
    action = true;
  } catch(e) {} 

  if(action && data) {
    if(data.project) {
      projects.push({
        name : data.project,
        port : data.port,

        socket : this,
        taskListAlias : data.alias,
        taskListGeneric : data.task,
        tasks : [],
        running : false
      });

      updateProjectList();

      setProject(projects.length - 1);
    } else if(data.action == 'start') {
      currentProject.currentTask = {name : data.name, pid : data.pid, output : []};
      currentProject.tasks.push(currentProject.currentTask);
      updateTaskList();
    } else if(data.action == 'done') {
      currentProject.tasks = _.reject(currentProject.tasks, function (task) {
        return task.pid === data.pid;
      });
      updateTaskList();
      currentProject.running = false;
      enableActivity();
    }
  }  else {
    if(data && data.indexOf('Running Task:') == 0) {
      $output.html('');
    } else if(data.length > 1) {
      if(currentProject.tasks.length > 0) {
        var msg = data.split("|"),
          pid = msg[0],
          timestamp = new Date().toString().split(' ')[4],
          output = '';

        if(msg.length > 1) {
          output = '<pre><span class="theme-timestamp">' + timestamp + '</span> - ' + colorize(_.escape(msg[1])) + '</pre>';
        }  

        var pidTask = _.find(currentProject.tasks, function(task) {
          return task.pid === parseInt(pid);
        }); 

        if(pidTask) {
          pidTask.output.push(output);
        }

        if(currentProject.currentTask && parseInt(pid) === currentProject.currentTask.pid) {
          $output.append(output);
          $outputWrap.scrollTop($output.height());
        }
      }
    }
  }
}

function handleSocketClose(e) {
  var closedPort = parseInt(e.currentTarget.URL.split(':')[2].replace(/\D/g, ''));

  var newProjects = _.reject(projects, function(el) {
    return el.port === closedPort;
  });

  if(newProjects && newProjects.length !== projects.length) {
    if(closedPort === currentProject.port && currentProject.running) {
      currentProject.running = false;
      enableActivity();
    }

    projects = newProjects;
    updateTaskList();
    setProject(projects.length - 1);
  } else {
    projects = newProjects;
  }

  if(projects.length === 0) {
    $body.removeClass('online').addClass('offline');
  }
}

/**
 * Handle socket error
 */
function handleSocketError() {
  // TODO: update this
  console.log('Something went really wrong, please report this...');
}


function updateProjectList() {
  $projects.html(projectListTpl(projects));
}

function updateTaskList() {
  $aliasTasks.html(taskListTpl({buttons : currentProject.taskListAlias}));
  $regularTasks.html(taskListTpl({buttons : currentProject.taskListGeneric}));

  if(currentProject.currentTask) {
    $('.task[value="'+ currentProject.currentTask.name +'"]')
      .siblings('.b-kill').data('pid', currentProject.currentTask.pid).end()
      .parent().addClass('active-task');
  }

  var bgTasks = currentProject.tasks;

  if(currentProject.currentTask) {
    bgTasks = _.reject(currentProject.tasks, function(task) {
      return task.pid === currentProject.currentTask.pid;
    });
  }

  if(bgTasks.length > 0) {
    $bgSection.addClass('show');
    $bgTasks.html(bgTasksTpl({tasks : bgTasks}));
  } else {
    $bgSection.removeClass('show');
  }

  if(currentProject.running) {
    $('#tasks .task, #projects .task').prop('disabled', true);
  }  
}

function setProject(idx) {
  currentProject = projects[idx];

  var buttons = $projects.find('button');

  buttons.removeClass('active');
  $(buttons.get(idx)).addClass('active');

  if(currentProject && currentProject.currentTask) {
    $output.html(currentProject.currentTask.output);
  } else {
    $output.html('');
  }

  if(currentProject) {
    updateTaskList();
  }

  enableActivity();
}

$tasks.on('click', '.task', function() {
  var cmd = $(this).val();

  currentProject.running = true;
  $tasks.find('.b-on').each(function() {
    cmd += ' ' + $(this).val();
  });

  currentProject.socket.send(cmd);
  disableActivity();
});

$tasks.on('click', '.bgTask', function() {
  var pid = $(this).siblings('.b-kill').data(pid);
  currentProject.currentTask = _.find(currentProject.tasks, function(task) {
    return task.pid === pid;
  });

  if(currentProject.currentTask) {
    $output.html(currentProject.currentTask.output);
  }

  currentProject.currentTask = null;
  updateTaskList();
  currentProject.running = false;
  enableActivity();
});

$projects.on('click', 'button', function() {
  var idx = $(this).val();
  setProject(idx);
  currentProject.running ? disableActivity() : enableActivity();
});

$tasks.on('click', '.b-kill', function() {
  var btn = $(this),
    taskInfo = currentProject.currentTask;

  if(btn.data('pid')) {
    taskInfo = {name : btn.siblings('.task').val(), pid : btn.data('pid')};

    currentProject.tasks = _.reject(currentProject.tasks, function(task) {
      return task.pid === btn.data('pid');
    });

    updateTaskList();
  }  

  currentProject.socket.send(JSON.stringify({
    action : 'KillTask',
    task : taskInfo
  }));
});

function disableActivity() {
  $body.addClass('running');
  $('#tasks .task').prop('disabled', true);
}

function enableActivity() {
  $body.removeClass('running');
  $('#tasks .task').prop('disabled', false);
}

/**
 * Connect!
 */
connect();
