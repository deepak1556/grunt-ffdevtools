grunt-ffdevtools
================

Grunt task runner for firefox devtools

**grunt-devtools not runnning** : 
![grunt-inactive](https://raw.github.com/deepak1556/grunt-ffdevtools/screenshots/screenshots/Grunt-devtools-inactive.png)

**grunt-devtools runnning** : 
![grunt-inactive](https://raw.github.com/deepak1556/grunt-ffdevtools/screenshots/screenshots/Grunt-devtools-active.png)

## Setup

1. Install grunt-devtools globally
```
npm install -g grunt-devtools
```
2. Run `grunt-devtools` in a directory with `Gruntfile.js`

## Building the Extension

```
npm install
grunt       //builds xpi
```

## Installing the Extension

1. Open Firefox -> Addons -> install extension from file
2. Choose the generated xpi present in the `tmp/` folder of `grunt-ffdevtools`
3. Fire up Devtools and Enjoy!

