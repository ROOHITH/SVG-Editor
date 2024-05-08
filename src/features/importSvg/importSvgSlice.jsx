import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  svgs: [],
  history: [],
  redoHistory: [], // Store snapshots for redo
};

export const importSvgSlice = createSlice({
  name: "importSvg",
  initialState,
  reducers: {
    importSvg: (state, action) => {
      
      const { width, height } = parseSvgDimensions(action.payload);
      const { viewBox, transform } = parseSvgAttributes(action.payload);
      console.log(transform)
      const newSvg = {
        id: nanoid(),
        content: action.payload,
        // Additional properties for position, size, and rotation
        position: { x: 1, y: 1 },
        size: { width: width, height: height },
        viewBox: viewBox,
        rotation: 0, // Example rotation
        transform: transform,
      };
      state.svgs.push(newSvg);
      state.history.push([...state.svgs]); // Save state history
    },
    undo: (state) => {
      if (state.history.length > 1) {
        const previousSnapshot = state.history.pop();
        state.redoHistory.push([...state.svgs]); // Save current state to redoHistory
        state.svgs = [...previousSnapshot]; // Go back to previous state
      }
    },

    redo: (state) => {
      if (state.redoHistory.length > 0) {
        const nextSnapshot = state.redoHistory.pop();
        state.history.push([...state.svgs]); // Save current state to history
        state.svgs = [...nextSnapshot]; // Go forward to next state
      }
    },
    deleteSvg: (state, action) => {
      state.svgs = []; // Clear all SVGs
      state.history.push([]); // Clear history as well
    },
    updateSvgContentThroughCode: (state, action) => {
      const { svgId, newContent } = action.payload;

      // Find the SVG object by its ID
      const svgToUpdate = state.svgs.find((svg) => svg.id === svgId);

      // If SVG found, update its content and extract details
      if (svgToUpdate) {
        svgToUpdate.content = newContent;

        // Extract details from the new content
        const { width, height, viewBox, transform, position, rotation } = parseSvgDetails(newContent);

        // Update SVG attributes
        svgToUpdate.transform = transform;
        svgToUpdate.viewBox = viewBox;
        svgToUpdate.position = position;
        svgToUpdate.rotation = rotation;
        svgToUpdate.size = { width, height };

        // Log the updated SVG attributes for debugging
        console.log("Updated SVG Attributes via code :");
        console.log("ViewBox:", svgToUpdate.viewBox);
        console.log("Transform:", svgToUpdate.transform);
        console.log("Position:", svgToUpdate.position);
        console.log("Size:", svgToUpdate.size.height);
        console.log("Size:", svgToUpdate.size.width);
        console.log("Rotation:", svgToUpdate.rotation);
        console.log("Content:", svgToUpdate.content);

        // Update history
        state.history.push([...state.svgs]);
      }
    },

    updateSvgContent: (state, action) => {
      const { svgId, newContent, newTransform } = action.payload;

      // Find the SVG object by its ID
      const svgToUpdate = state.svgs.find((svg) => svg.id === svgId);

      // If SVG found, update its content

      if (svgToUpdate) {
        svgToUpdate.content = newContent;

        const { width, height } = parseSvgDimensions(newContent);
        const { viewBox } = parseSvgAttributes(newContent);
        svgToUpdate.transform = newTransform;
        svgToUpdate.viewBox = viewBox;
        // svgToUpdate.size = { width, height };

        console.log("Updated SVG Attributes:");
        console.log("ViewBox:", svgToUpdate.viewBox);
        console.log("transform:", svgToUpdate.transform);
        console.log("Position:", svgToUpdate.position);
        console.log("Size:", svgToUpdate.size);
        console.log("Rotation:", svgToUpdate.rotation);
        console.log("Content:", svgToUpdate.content);
        // Update history
        state.history.push([...state.svgs]);
      }
    },
    updateSvgPosition: (state, action) => {
      const { svgId, newPosition } = action.payload;
      const svgToUpdate = state.svgs.find((svg) => svg.id === svgId);
      if (svgToUpdate) {
        svgToUpdate.position = newPosition;
        // Update history
        state.history.push([...state.svgs]);
      }
    },
    updateSvgSize: (state, action) => {
      const { svgId, newSize } = action.payload;
      const svgToUpdate = state.svgs.find((svg) => svg.id === svgId);
      if (svgToUpdate) {
        svgToUpdate.size = newSize;
        // Update history
        state.history.push([...state.svgs]);
      }
    },
    updateSvgRotation: (state, action) => {
      const { svgId, newRotation } = action.payload;
      const svgToUpdate = state.svgs.find((svg) => svg.id === svgId);
      if (svgToUpdate) {

        svgToUpdate.rotation = newRotation;
        console.log("called isnide store");
        console.log(svgToUpdate.rotation);
        // Update history
        state.history.push([...state.svgs]);
      }
    },
    flipHorizontal: (state, action) => {
      const { svgId } = action.payload;
      const svgIndex = state.svgs.findIndex((svg) => svg.id === svgId);
      if (svgIndex !== -1) {
        const updatedContent = flipSvgHorizontal(state.svgs[svgIndex].content);
        console.log("updatedContent")
        console.log(updatedContent)
        state.svgs[svgIndex].content = updatedContent;
        state.history.push([...state.svgs]);
      }
    },
    flipVertical: (state, action) => {
      const { svgId } = action.payload;
      const svgIndex = state.svgs.findIndex((svg) => svg.id === svgId);
      if (svgIndex !== -1) {
        const updatedContent = flipSvgVertical(state.svgs[svgIndex].content);
        state.svgs[svgIndex].content = updatedContent;
        state.history.push([...state.svgs]);
      }
    },
  },
});
// Function to parse SVG dimensions
const parseSvgDimensions = (svgContent) => {

  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = svgDocument.documentElement;

  const widthMatch = svgElement.getAttribute('width') ? parseFloat(svgElement.getAttribute('width')) : 300;
  const heightMatch = svgElement.getAttribute('height') ? parseFloat(svgElement.getAttribute('height')) : 300;

  console.log("widthMatch:", widthMatch);
  console.log("heightMatch:", heightMatch);

  return {
    width: widthMatch,
    height: heightMatch,
  };
};
// Function to parse SVG attributes
const parseSvgAttributes = (svgContent) => {
  // Convert SVG content string to DOM element
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = svgDocument.documentElement;

  // Get the viewBox attribute value from the SVG element
  const viewBox = svgElement.attributes.viewBox ? svgElement.attributes.viewBox.value : "0 0 124 124"; // Default viewBox value
  const transform = svgElement.attributes.transform ? svgElement.attributes.transform.value : ""; // Initial transform attribute

  return {
    viewBox: viewBox,
    transform: transform,
  };
};
// Utility function to flip SVG horizontally
const flipSvgHorizontal = (svgContent) => {
  // Check if the scale attribute is already present
  if (svgContent.includes("scale")) {
    // Replace the existing scale attribute with the flipped scale
    return svgContent.replace(
      /scale\([^)]*\)/,
      'scale(-1, 1) translate(-100, 0)'
    );
  } else {
    // If scale attribute is not present, add the flipped scale attribute
    return svgContent.replace(
      /<svg\s([^>]*)>/,
      '<svg $1 transform="scale(-1, 1) translate(-100, 0)">'
    );
  }
};

// Utility function to flip SVG vertically
const flipSvgVertical = (svgContent) => {
  // Check if the scale attribute is already present
  if (svgContent.includes("scale")) {
    // Replace the existing scale attribute with the flipped scale
    return svgContent.replace(
      /scale\([^)]*\)/,
      'scale(1, -1) translate(0, -100)'
    );
  } else {
    // If scale attribute is not present, add the flipped scale attribute
    return svgContent.replace(
      /<svg\s([^>]*)>/,
      '<svg $1 transform="scale(1, -1) translate(0, -100)">'
    );
  }
};
const parseSvgDetails = (svgContent) => {
  // Regular expression patterns to match specific attributes in the opening <svg> tag
  const openingSvgTagPattern = /<svg\s([^>]*)>/;
  const viewBoxPattern = /viewBox="([^"]*)"/;
  const transformPattern = /transform="([^"]*)"/;
  const positionPattern = /x="([^"]*)" y="([^"]*)"/;
  const widthPattern = /width="([^"]*)"/;
  const heightPattern = /height="([^"]*)"/;
  const rotationPattern = /rotate\(([^)]+)\)/;

  // Find the opening <svg> tag
  const openingSvgTagMatch = svgContent.match(openingSvgTagPattern);

  // Extract attributes from the opening <svg> tag
  const viewBoxMatch = openingSvgTagMatch ? openingSvgTagMatch[1].match(viewBoxPattern) : null;
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '';

  const transformMatch = openingSvgTagMatch ? openingSvgTagMatch[1].match(transformPattern) : null;
  const transform = transformMatch ? transformMatch[1] : '';

  const positionMatch = openingSvgTagMatch ? openingSvgTagMatch[1].match(positionPattern) : null;
  const position = positionMatch ? { x: parseFloat(positionMatch[1]), y: parseFloat(positionMatch[2]) } : {x:1,y:1};

  const widthMatch = openingSvgTagMatch ? openingSvgTagMatch[1].match(widthPattern) : null;
  const width = widthMatch ? parseFloat(widthMatch[1]) : 0;

  const heightMatch = openingSvgTagMatch ? openingSvgTagMatch[1].match(heightPattern) : null;
  const height = heightMatch ? parseFloat(heightMatch[1]) : 0;

  const rotationMatch = openingSvgTagMatch ? openingSvgTagMatch[1].match(rotationPattern) : null;
  const rotation = rotationMatch ? parseFloat(rotationMatch[1]) : 0;

  // Extract width and height from viewBox if available
  const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBox.split(/\s+/).map(parseFloat);
  const viewBoxWidthExtracted = viewBoxWidth || 0;
  const viewBoxHeightExtracted = viewBoxHeight || 0;

  // Return the extracted attributes
  return { width: width || viewBoxWidthExtracted, height: height || viewBoxHeightExtracted, viewBox, transform, position, rotation };
}



export const {updateSvgContentThroughCode, deleteSvg, flipVertical, flipHorizontal, updateSvgContent, importSvg, updateSvgPosition, updateSvgSize, undo, redo, updateSvgRotation, } = importSvgSlice.actions;