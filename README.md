# Color Details Figma Plugin

## Project Overview and Description

`get-colors-details` is a Figma plugin that enhances design workflow by extracting and displaying color variations from selected elements. It showcases different color formats like Hex, HSL, and RGB in adjacent labels, making it invaluable for designers who need to work with consistent color schemes and require quick access to color details.

## How to Use

1. **Clone the Repository**: Run `git clone https://github.com/FabriBorgobello/figma-get-color-detail` in your terminal to clone the repository.
2. **Install Dependencies**: Run `npm install` to install required dependencies.
3. **Build the Package**: Execute `npm run build` to build the plugin. A new file called code.js will be created in the root folder.
4. **Import into Figma**: Add the built plugin to your Figma application.
5. **Select a Frame**: In Figma, select a frame containing all the **Color** elements. These elements should be instances of a main component that includes:
   - Name (text)
   - HEX (text)
   - HSL (text)
   - RGB (text)
   - Pigment (rectangle filled with the desired color)

Example:
   - ![image](https://github.com/FabriBorgobello/figma-get-color-detail/assets/57123494/2dd6c8bb-eff7-4bb8-a913-bfae37e9480f)


## Development

- **Watch**: Use `npm run watch` for real-time code compilation while developing. This script watches for any changes in the code and rebuilds automatically.

## Requirements

- **Figma**: The plugin is designed to be used within the Figma environment.
- **Node.js**: Required for managing dependencies and running build scripts.

## Dependencies

- `@figma/plugin-typings`: TypeScript typings for Figma Plugin API.
- `typescript`: TypeScript language support.
