# Bootstrap Workflow
Bootstrap Build System is gulp based build system, ready for [Bootstrap 3](http://getbootstrap.com/)
## Installation
* Download and extract Zip File
* Run ```bower install```
* Run ```npm install```

## Directory Structure
Project source files are located in the folder ```src```
* assets
  * sass
  * js
  * img 
  * fonts
* layouts
* pages
* partials
  
## How to use
* ```gulp watch``` : Start the server, and watch for files updates
* ```gulp build```: Build the project
* ```gulp build --production``` : Build and prepare the project for production by apply additional plugins like: image optimization, css minification etc...

## Configuration
Configuration option are located in the file config.yml

* **Server** : [BrowserSync](https://browsersync.io/) Params
 * **Path** : App base directory 
 * **Port** : Port number
* **Support**: browser support option for autoprefixer plugin, See (Bootstrap browser support)[http://getbootstrap.com/getting-started/#support]
* **Dist**: Build destination folder
* **Images**: Image source folder (default to: src/img/)
* **Fonts** : fonts files to copy, This is a [key:value] format, the key will be used as the folder name for the font files and the value is the path to font source files, see the ex :
  ```bootstrap: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*'```
* **Sass** : Sass files to include when compiler resolving SASS @import
* **Templates** : Template files to lookup by the template engine (Nunjucks)[http://mozilla.github.io/nunjucks/]
* **JavaScript** :
  * **Components** : Each file will be generated as a standalone JavaScript file
  * **Bootstrap** : All Bootstrap Javascript files including the script.js file will be compiled and concat in one file named *script.js*, you can add or remove Bootstrap JavaScript components as needed
