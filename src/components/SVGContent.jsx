import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


import { flipHorizontal, flipVertical, updateSvgPosition, updateSvgSize, updateSvgRotation, updateSvgContent } from '../features/importSvg/importSvgSlice'; // Import your action

function SVGContent({ editorContent, setEditorContent, selectedTool, setSelectedTool, selectedSvg, setSelectedSvg }) {

  const dispatch = useDispatch();
  const svgs = useSelector((state) => state.importSvg.svgs);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });





  const handleMouseDown = (event, svgId) => {

    event.stopPropagation();
    if (event.button === 0) {
      setSelectedSvg(svgId);
      const { clientX, clientY } = event;
      const { x, y } = svgs.find(svg => svg.id === svgId).position;
      setDragging(true);
      setOffset({ x: clientX - x, y: clientY - y });
    }
    if (selectedTool === "Rotate") {
      handleRotate(svgId, svgs.find(svg => svg.id === svgId).rotation); // Pass rotation here
    }

    const svgToUpdate = svgs.find(svg => svg.id === svgId);
    if (selectedTool === "FlipX") {

      dispatch(flipHorizontal({ svgId: svgId }));
      updateSvgContentFunc(svgToUpdate, svgId, "FlipX"); // Add this line

    }

    if (selectedTool === "FlipY") {
      dispatch(flipVertical({ svgId: svgId }));
      updateSvgContentFunc(svgToUpdate, svgId, "FlipY"); // Add this line


    }


  };

  const handleMouseMove = (event) => {
    if (dragging && selectedSvg !== null && event.buttons === 1) {
      const { clientX, clientY } = event;
      const newPosX = clientX - offset.x;
      const newPosY = clientY - offset.y;
      const svgToUpdate = svgs.find(svg => svg.id === selectedSvg);
      dispatch(updateSvgPosition({ svgId: selectedSvg, newPosition: { x: newPosX, y: newPosY } }));
      // Update SVG content
      updateSvgContentFunc(svgToUpdate, selectedSvg, "notFliped");

    }

  };

  const handleMouseUp = (event) => {
    const svgElement = event.target.closest('svg');
    if (svgElement && svgElement.contains(event.target)) {
      // If the mouse is still over the SVG, do not deselect
      return;
    }
    setDragging(false);
  };

  const handleSvgClick = (svgId) => {
    if (selectedSvg === svgId) {
      setSelectedSvg(null);
    } else {
      setSelectedSvg(svgId);
    }
  };
  const handleScroll = (event, svgId) => {
    // Your scroll handling logic goes here
    if (event.buttons === 1 && selectedTool === "Scale" && selectedSvg !== null) {
      // alert(selectedSvg)
      const svgToUpdate = svgs.find(svg => svg.id === selectedSvg);
      if (svgToUpdate) {
        const scaleDelta = event.deltaY > 0 ? 0.1 : -0.1; // Adjust scale factor as needed
        const newSize = {
          width: svgToUpdate.size.width * (1 + scaleDelta),
          height: svgToUpdate.size.height * (1 + scaleDelta)
        };

        dispatch(updateSvgSize({ svgId: selectedSvg, newSize }));
        // Update SVG content
        updateSvgContentFunc(svgToUpdate, selectedSvg, "notFliped");

      }
    }


  };
  const handleRotate = (svgID, rotationn) => {
    const svgToUpdate = svgs.find(svg => svg.id === svgID);
    console.log("svgToUpdate.rotation ")
    console.log(svgToUpdate.rotation);

    const newRotation = (svgToUpdate.rotation + 35) % 360;
    console.log("newRotation");
    console.log(newRotation);
    console.log(svgID)
    dispatch(updateSvgRotation({ svgId: selectedSvg, newRotation: newRotation }));
    console.log("svgToUpdate.rotation");
    console.log(svgToUpdate.rotation);
    updateSvgContentFunc(svgToUpdate, selectedSvg, false);

  };

  // Function to update SVG content
  const updateSvgContentFunc = (savedSvg1, svgId, fliped) => {
    console.log(svgId)
    let savedSvg = svgs.find(svg => svg.id === svgId);
    const { x, y } = savedSvg.position || { x: 1, y: 1 }; // Use new position if available
    const { width, height } = savedSvg.size; // Use new size if available
    const rotation = savedSvg.rotation || 0; // Ensure rotation is defined
    const viewBox = savedSvg.viewBox;

    console.log("rotation==" + rotation);
    // Regular expression to match the opening <svg> tag with its attributes
    const openingSvgTagRegex = /<svg\s([^>]*)>/;

    // Find the opening <svg> tag
    const openingSvgTagMatch = savedSvg.content.match(openingSvgTagRegex);

    // If the opening <svg> tag is found
    if (openingSvgTagMatch) {
      // Get the attributes from the opening <svg> tag
      let attributes = openingSvgTagMatch[1];

      // Replace specific attributes if they exist, otherwise add them
      if (width) {
        if (attributes.includes('width')) {
          attributes = attributes.replace(/width="[^"]*"/, `width="${width}"`);
        } else {
          attributes += ` width="${width}"`;
        }
      }
      if (height) {
        if (attributes.includes('height')) {
          attributes = attributes.replace(/height="[^"]*"/, `height="${height}"`);
        } else {
          attributes += ` height="${height}"`;
        }
      }
      // Update viewBox attribute
      if (attributes.includes('viewBox')) {
        attributes = attributes.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`);
      } else {
        attributes += ` viewBox="${viewBox}"`;
      }

      // Update transform attribute for translation, scaling, and rotation
      let transform = '';
      // Apply translation and scaling
      transform += `translate(${x},${y}) scale(${width / 100},${height / 100})`;
      // Apply rotation
      if (rotation) {
        console.log("update rotation");
        console.log(rotation);
        transform += `rotate(${rotation}, ${width / 2}, ${height / 2}) `;
        console.log("transform");
        console.log(transform)
      }
      // Apply flip transformations first if any
      if (fliped === 'FlipX') {
        transform += `scale(-1, 1) translate(-100, 0) `;
      } else if (fliped === 'FlipY') {
        transform += `scale(1, -1) translate(0, -100) `;
      }




      // Replace the transform attribute
      console.log(transform)
      if (attributes.includes('transform')) {
        attributes = attributes.replace(/transform="[^"]*"/, `transform="${transform}"`);
      } else {
        alert()
        attributes += ` transform="${transform}"`;
      }

      console.log(transform)

      // Construct the updated opening <svg> tag
      const updatedSvgOpeningTag = `<svg ${attributes}>`;

      // Replace the opening <svg> tag with the updated one
      const updatedSvgContentData = savedSvg.content.replace(openingSvgTagRegex, updatedSvgOpeningTag);

      // Dispatch the updated SVG content
      dispatch(updateSvgContent({ svgId, newContent: updatedSvgContentData, newTransform: transform }));
      console.log("updatedSvgContentData")
      console.log(updatedSvgContentData)
    } else {
      // Handle case where opening <svg> tag is not found
      console.error("Opening <svg> tag not found in SVG content.");
    }
  };





  return (

    <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="100vh" className="w-full h-full" onWheel={handleScroll}>
      {/* Render the uploaded SVG content if available */}
      {svgs.map((svg) => (

        // <g viewBox={`${svg.viewBox}`} transform={`translate(${svg.position.x},${svg.position.y})  scale(${svg.size.width / 100},${svg.size.height / 100}) rotate(${svg.rotation-35}, ${svg.size.width / 2}, ${svg.size.height / 2}) ${selectedTool === 'FlipX' ? 'scale(-1, 1) translate(-100, 0)' : selectedTool === 'FlipY' ? 'scale(1, -1) translate(0, -100)' : ''}`} key={svg.id} onClick={() => handleSvgClick(svg.id)} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseDown={(event) => handleMouseDown(event, svg.id)}>




        <g key={svg.id} id={svg.id} dangerouslySetInnerHTML={{ __html: svg.content }} transform={svg.transform || `translate(${svg.position.x},${svg.position.y})  scale(${svg.size.width / 100},${svg.size.height / 100}) rotate(${svg.rotation - 35}, ${svg.size.width / 2}, ${svg.size.height / 2}) ${selectedTool === 'FlipX' ? 'scale(-1, 1) translate(-100, 0)' : selectedTool === 'FlipY' ? 'scale(1, -1) translate(0, -100)' : ''}`} onClick={() => handleSvgClick(svg.id)} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseDown={(event) => handleMouseDown(event, svg.id)}>

        </g>


      ))}
      {/* Render a default circle if no SVGs are imported */}
      {svgs.length === 0 && (
        <g>

          <text x="50%" y="50%" fill="black" textAnchor="middle" dominantBaseline="middle">No SVG</text>
        </g>
      )}
    </svg>
  );
}

export default SVGContent;