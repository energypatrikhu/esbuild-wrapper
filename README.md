# esbuild-wrapper
`esbuild-wrapper` is a small config based wrapper for [esbuild](https://github.com/evanw/esbuild)

# Warning
This package is not well tested, and may not work as expected, use at your own risk,
the package was only tested on Windows, and may not work on other platforms

# Usage
1. Install the package
    ```
    npm install -D @energypatrikhu/esbuild-wrapper
    ```

2. Add the following scripts to your `package.json`
    ```json
    {
      "scripts": {
        "build": "esbuild-wrapper"
      }
    }
    ```

3. Start the script
    > this creates an example configuration file, that later can be modified to your needs
    ```
    npm run build
    ```

4. After that is done, you have to start `esbuild-wrapper` again
    > now the script minifies and bundles the script to the desired location
    ```
    npm run build
    ```

# Configuration
- `inputFiles`: the files to bundle
- `outDir`: the directory to output the bundled files
- `options`: the options for esbuild
    - `platform`: the platform to bundle the script for ([esbuild platform](https://esbuild.github.io/api/#platform))
    - `minify`: whether to minify the script or not ([esbuild minify](https://esbuild.github.io/api/#minify))
    - `format`: the format of the output ([esbuild format](https://esbuild.github.io/api/#format))
    - `logLevel`: the log level to use ([esbuild logLevel](https://esbuild.github.io/api/#log-level))
    - `treeShaking`: whether to tree shake the output or not ([esbuild tree shaking](https://esbuild.github.io/api/#tree-shaking))
