//HomePage.jsx
import React, { useState } from 'react';
import TopMenu from '../components/TopMenu';
import SideMenu from '../components/SideMenu';
import SVGCanvas from '../components/SVGCanvas';
import { useDispatch, useSelector } from 'react-redux';
const HomePage = () => {
  const [selectedSvg, setSelectedSvg] = useState(null); // State to track selected SVG
  
  const [currentSvg, setCurrentSvg] = useState(null); // State to track selected SVG

  const [codeToCopy, setCodeToCopy] = useState(null); // State to track selected SVG

 
  console.log("homepage called")

  const [selectedTool, setSelectedTool] = useState(null);
  const handleToolChange = (toolName) => {
    setSelectedTool(toolName);
    alert(toolName)
  };
  const getCursorForTool = (tool) => {
    switch (tool) {
      case "Translate":
        return "move";
      case "Scale":
        return "crosshair"; // or any other cursor style for scale tool
      case "Rotate":
        return "ew-resize"; // or any other cursor style for rotate tool
      default:
        return "default"; // default cursor style
    }
  };

  return (
    <div className="App flex flex-row " style={{ cursor: getCursorForTool(selectedTool) }}>

      <SideMenu handleToolChange={handleToolChange}codeToCopy={codeToCopy}/>
      <div className=" sec-box flex flex-col ">
        <TopMenu currentSvg={currentSvg} setCurrentSvg={setCurrentSvg} selectedSvg={selectedSvg} setSelectedSvg={setSelectedSvg} ></TopMenu>
        <SVGCanvas setCodeToCopy={setCodeToCopy} currentSvg={currentSvg} setCurrentSvg={setCurrentSvg} selectedSvg={selectedSvg} setSelectedSvg={setSelectedSvg} setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
      </div>


    </div>
  )
};
export default HomePage;