import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
function SaveButton({ currentSvg, selectedSvg, setSelectedSvg }) {
  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const svgs = useSelector((state) => state.importSvg.svgs);

  // const svgs = useSelector((state) => state.importSvg.svgs);
  // console.log(svgs); 
  // const savedSvg = svgs.find((svg) => svg.id === selectedSvg);
  // console.log(savedSvg);

  const downloadSvg = () => {
  //  alert()
    setButtonClicked(true);
    if (currentSvg) {
      const savedSvg = svgs.find((svg) => svg.id === currentSvg);
      console.log("savedSvg");
      console.log(savedSvg);
      if (savedSvg) {
        const svgString = generateSvgString(savedSvg);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'edited.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert("Failed to find selected SVG in the list.");
      }
    } else {
      setOpen(true);
    }
  };

  // const generateSvgString = (savedSvg) => {
  //   // Function to generate the SVG string from the svgs array
  //   // Concatenate all SVG contents into a single string
  //   const { x, y } = savedSvg.position;
  //   const { width, height } = savedSvg.size;
  //   const rotation = savedSvg.rotation || 0; // Ensure rotation is defined
  //   // Replace the <svg> tag with updated attributes

  //   // Match and replace specific attributes using regular expressions
  //   // let updatedSvgContent = savedSvg.content.replace(/x="[^"]*"/, `x="${x}"`);
  //   // updatedSvgContent = updatedSvgContent.replace(/y="[^"]*"/, `y="${y}"`);
  //   let updatedSvgContent = savedSvg.content.replace(/width="[^"]*"/, `width="${width}"`);
  //   updatedSvgContent = updatedSvgContent.replace(/height="[^"]*"/, `height="${height}"`);

  //   // Construct the transform attribute based on position, size, and rotation
  //   const transformAttribute = `translate(${x},${y}) scale(${width / 100},${height / 100}) rotate(${rotation})`;
  //   // updatedSvgContent = updatedSvgContent.replace(/<svg\s([^>]*)>/, ` transform="${transformAttribute}"`);
  //   updatedSvgContent = updatedSvgContent.replace(/transform="[^"]*"/, `transform="${transformAttribute}"`);


  //   // Update transform attribute for translation, scaling, and rotation
  //   let transform = `translate(${x},${y}) scale(${width / 100},${height / 100})`;

  //   // Add rotation to transform if available
  //   if (rotation) {
  //     transform += ` rotate(${rotation})`;
  //   }
  //   // Replace the transform attribute
  //   updatedSvgContent = updatedSvgContent.replace(/transform="[^"]*"/, `transform="${transform}"`);

  //   return updatedSvgContent;

  // };
  const generateSvgString = (savedSvg) => {
    const { position, size, rotation, content } = savedSvg;
    console.log("savedSvg.content");
    console.log(savedSvg.content);
    const { x, y } = position || { x: 0, y: 0 };
    const { width, height } = size || { width: 300, height: 300 };
    const svgRotation = rotation || 0;

    // Regular expressions to match the attributes
    const transformRegex = /transform="([^"]*)"/;
    const widthRegex = /width="([^"]*)"/;
    const heightRegex = /height="([^"]*)"/;

    // Find existing attributes in the SVG content
    const existingTransformMatch = content.match(transformRegex);
    const existingWidthMatch = content.match(widthRegex);
    const existingHeightMatch = content.match(heightRegex);

    // Construct the transform attribute based on position, size, and rotation
    const newTransform = `translate(${x},${y}) scale(${width / 100},${height / 100}) rotate(${rotation}, ${width / 2}, ${height / 2}) `;

    // Replace the <svg> tag with updated attributes or add missing ones
    let updatedContent = content;

    if (!existingTransformMatch) {
      
      updatedContent = updatedContent.replace(/<svg\s/, `<svg transform="${newTransform}" `);
    }

    if (!existingWidthMatch) {
      updatedContent = updatedContent.replace(/<svg\s/, `<svg width="${width}" `);
    }

    if (!existingHeightMatch) {
      updatedContent = updatedContent.replace(/<svg\s/, `<svg height="${height}" `);
    }

    console.log("savedSvg.UPDATED content");
    console.log(updatedContent);

    return updatedContent;
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Save SVG"><button onClick={downloadSvg}>Save SVG</button></Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>No SVG Selected</DialogTitle>
        <DialogContent>
          Please select an SVG to save.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SaveButton;
