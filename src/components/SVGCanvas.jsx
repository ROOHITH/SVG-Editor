// SVGCanvas.js
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Paper } from '@mui/material';
import SVGContent from './SVGContent';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useDispatch, useSelector } from 'react-redux';

import {  importSvg,updateSvgContentThroughCode } from '../features/importSvg/importSvgSlice'; // Import your action

// Import the necessary CodeMirror CSS
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';


function SVGCanvas({ selectedTool, setSelectedTool, selectedSvg, setSelectedSvg, setCurrentSvg, currentSvg,setCodeToCopy }) {
  console.log("SVGCanvas component is called")
  const dispatch = useDispatch();

  const [editorContent, setEditorContent] = useState('');
  const svgs = useSelector((state) => state.importSvg.svgs);

  // Update editor content when currentSvg changes
  useEffect(() => {
    //  alert("currentSvg   "+currentSvg)
    const svg = svgs.find((svg) => svg.id === currentSvg);
    if (svg) {
      setEditorContent(svg.content);
      console.log("changed");
      console.log(svg.content);
    } else {
      //  alert("deleye"+currentSvg)
      setEditorContent("");
      console.log("editorContent")
      console.log(editorContent)
    }
  }, [currentSvg, svgs]);

  // useEffect(() => {

  //   if (selectedTool === "CopyCode") {
  //     console.log(editorContent)
  //     setCodeToCopy(editorContent)
       
  //   }
  // }, [selectedTool]);

  // Update SVG content in editor and Redux store
  const handleCodeChange = (editor, data, value) => {
    const svg = svgs.find((svg) => svg.id === currentSvg);
    if (svg) {
      setEditorContent(value);
      dispatch(updateSvgContentThroughCode({ svgId: currentSvg, newContent: value }));
    }else{
      const newSvgId = dispatch(importSvg(value)); // Dispatch importSvg action and get the new SVG ID
      setCurrentSvg(newSvgId);
    }
    // setEditorContent(value);
    // dispatch(updateSvgContentThroughCode({ svgId: currentSvg, newContent: value }));
  };
  

  return (
    <Paper elevation={3} className="SVGCanvas flex flex-1 m-3" id="svg-canvas">
      <div className="code-column flex-1 ">
        <CodeMirror
          value={editorContent}
          onBeforeChange={(editor, data, value) => handleCodeChange(editor, data, value)}
          options={{
            mode: 'xml',
            theme: 'material',
            lineNumbers: true,
           
          }}

        />
      </div>
      <div className="preview-column flex-1 bg-slate-300">
        <SVGContent editorContent={editorContent} setEditorContent={setEditorContent} selectedSvg={selectedSvg} setSelectedSvg={setSelectedSvg} selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      </div>


    </Paper>
  );
}

export default SVGCanvas;
