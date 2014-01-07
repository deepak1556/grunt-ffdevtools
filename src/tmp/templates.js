this["JST"] = this["JST"] || {};

this["JST"]["src/templates/background-task-list.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(tasks, function(task) { ;
__p += '\r\n<li>\r\n  <button class=\'bgTask\' value=\'' +
((__t = ( task.name )) == null ? '' : __t) +
'\'>' +
((__t = ( task.name )) == null ? '' : __t) +
'</button>\r\n  <button title=\'Kill Task\' class=\'b b-kill\' data-pid=\'' +
((__t = ( task.pid )) == null ? '' : __t) +
'\'>X</button>\r\n</li>';
 }); ;
__p += '\r\n';

}
return __p
};

this["JST"]["src/templates/panel-tpl.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<header id=\'projects\'>\r\n  <h2>Grunt Projects</h2>\r\n  <div id=\'placeProjects\'></div>\r\n</header>\r\n<div id=\'tools\'>\r\n  <section id=\'tasks\'>\r\n    <div id=\'backgroundTasks\'>\r\n      <header><h2>Background Tasks</h2></header>\r\n      <ul id=\'placeBackgroundTasks\'></ul>\r\n    </div>\r\n\r\n    <header><h2>Alias Tasks</h2></header>\r\n    <ul id=\'placeAliasTasks\'></ul>\r\n\r\n    <header><h2>Tasks</h2></header>\r\n    <ul id=\'placeTasks\'></ul>\r\n  </section>\r\n  <section id=\'output\'>\r\n    <aside id=\'updateWarning\'>\r\n      <p>\r\n        The version of <code>grunt-devtools</code> is out of date.\r\n        Please update the node module or update this extension, the versions should match.\r\n      </p>\r\n    </aside>\r\n    <header>\r\n      <h2>Output</h2>\r\n    </header>\r\n    <div id=\'placeOutput\'></div>\r\n  </section>\r\n</div>\r\n<progress id=\'running\'></progress>\r\n';

}
return __p
};

this["JST"]["src/templates/project-list.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(projects, function(project, i) { ;
__p += '\r\n  <button value=\'' +
((__t = ( i )) == null ? '' : __t) +
'\'>' +
((__t = ( project.name )) == null ? '' : __t) +
'</button>\r\n';
 }); ;
__p += '\r\n';

}
return __p
};

this["JST"]["src/templates/task-list.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(buttons, function(task) { ;
__p += '\r\n<li>\r\n  <button class=\'task\' value=\'' +
((__t = ( task.name )) == null ? '' : __t) +
'\'>' +
((__t = ( task.name )) == null ? '' : __t) +
'</button>\r\n  <button title=\'Set --verbose\' class=\'b b-second b-flag b-verbose\' value=\'-v\'>V</button>\r\n  <button title=\'Set --force\' class=\'b b-first b-flag b-force\' value=\'-f\'>F</button>\r\n\r\n  <button title=\'Add to Background Tasks\' class=\'b b-second b-bg\'>B</button>\r\n  <button title=\'Kill Task\' class=\'b b-first b-kill\'>X</button>\r\n</li>\r\n';
 }); ;
__p += '\r\n';

}
return __p
};