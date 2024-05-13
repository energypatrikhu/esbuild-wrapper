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
        "esbuild": "esbuild-wrapper"
      }
    }
    ```

3. Start the script
    > this creates an example configuration file, that later can be modified to your needs
    ```
    npm run esbuild
    ```

4. After that is done, you have to start `esbuild-wrapper` again
    > now the script minifies and bundles the script to the desired location
    ```
    npm run esbuild
    ```

# Configuration
- `inputFile`: this is the location of the main file, commonly `src/index.[ts,js]`
- `outFile`: the path to the minified and bundled script (this most of the times does not need to be changed)