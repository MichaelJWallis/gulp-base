# Install

1) Download and install Node.js

  a) https://nodejs.org/en/ -- download latest

  b) Verify node installation by running:

    ```
    node -v
    ```

    from the command line

2) Navigate to folder in the command line and run the following command:

  ```
  npm install
  ```

  This will install all the saved dependencies in our package.json file

3) Install LiveReload

Search for the LiveReload plugin in your browser app store.

Ensure you have activated the LiveReload extension in your browser to see resuts of live reloading CSS and JS

# Commands

The commands for the task in the gulpfile.js

  ```
  gulp watch
  ```

  Watch files in assets folder for process on change.

  ```
  gulp build
  ```

  Processes all files in img, js and sass assets folders.

  ```
  gulp clean
  ```

  Cleans all folders in public folder, empties HTML partials in includes (Comments must remain in these files).

  ```
  gulp sass
  ```

  Compiles all .scss files in the sass assets folder, autoprefixes styles with browser prefixes and outputs minified .css file into public css folder.

  ```
  gulp lintjs
  ```

  Lints custom js files for syntax errors.

  ```
  gulp buildjs
  ```

  Concatenates all javascript files in the assets js folder and outputs minified file into public js folder.

  NB: The order the files are concatenated can be changed by editing the assetsorder_js variable at the top of the gulpfile.js

  ```
  gulp imagemin
  ```

  Optimizes all images in the assets img folder and outputs into the public img folder.

  Will only process images if new or hanged..

  ```
  gulp spritecreate
  ```

  Generates spritesheet from images in assets img sprite folder. Outputs css classes into _sprite.scss file in scss folder and outputs minified image into public img sprite folder.

  ```
  gulp stylesinject
  ```

  Inserts css link tags for all css files in public css folder into stylesheets.html file in includes folder.

  ```
  gulp scriptsinject
  ```

  Inserts script tags for all js files in public js folder into scripts.html file in includes folder.

# Directory variables

At the top of the gulpfile.js you will find all the variables to be changed if a different file structure is used

# Project Directories

```
-assets
  -img
    Our raw images and sprites. All images to be made into a sprite inside the "sprites" folder
  -js
    Unminified javascript files.
  -sass
    Raw sass files

-public
  -css
    Minified and compiled CSS
  -img
    Optimised images and sprite sheet in own folder
  -includes
    HTML snippets that will contain our injected assets
  -js
    Minified and concatenated js files
```
