// TopMenu.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { CloudUpload, Undo, Redo, Delete } from '@mui/icons-material'; // Import Material-UI icons
import { useDispatch, useSelector } from 'react-redux';
import { importSvg, undo, redo, deleteSvg } from '../features/importSvg/importSvgSlice'; // Import importSvg action

import AlertBox from "./AlertBox";
import { styled } from '@mui/material/styles';
import SaveButton from "../components/SaveButton";
const TopMenu = ({ setCurrentSvg, currentSvg, selectedSvg, setSelectedSvg }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const history = useSelector((state) => state.importSvg.history);
  

  const handleFileUpload = (event) => {
    console.log("File upload event triggered");
    const file = event.target.files[0];
   //alert()
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("FileReader onload event triggered");
        const svgContent = event.target.result;
        console.log("SVG content:");
        console.log(svgContent);
        const newSvgId = dispatch(importSvg(svgContent)); // Dispatch importSvg action and get the new SVG ID
        setCurrentSvg(newSvgId);

      };
      reader.readAsText(file);
    }
  };
  // Select the state to access the newly imported SVGs
  const svgs = useSelector((state) => state.importSvg.svgs);

  // When the number of SVGs changes, set the last SVG as selected
  useEffect(() => {
   
    if (svgs.length > 0) {
      const lastSvgId = svgs[svgs.length - 1].id;
      setCurrentSvg(lastSvgId);
    }
  }, [svgs, setCurrentSvg]);


  const handleUndo = () => {
    if (history.length > 1) {
      dispatch(undo());
    }
  };

  const handleRedo = () => {
    if (history.length > 1) {
      dispatch(redo());
    }
  };



  const handleDeleteSvg = () => {
    setOpenConfirmDialog(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    dispatch(deleteSvg({ svgId: selectedSvg }));
    setSelectedSvg(null);
    setCurrentSvg(null);
    setOpenConfirmDialog(false); // Close the confirmation dialog
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false); // Close the confirmation dialog
  };

  return (
    <Box className="bg-green-500 w-full border-b border-gray-300 p-2">
      <Box className="flex justify-between" sx={{ padding: '10px' }}>
        <Tooltip title="Import SVG">
          <Button color="inherit" className="flex items-center text-white hover:text-gray-100" startIcon={<CloudUpload className="mr-1" />} onClick={() => fileInputRef.current.click()}>
            Import SVG

          </Button>
        </Tooltip>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".svg"
          onChange={handleFileUpload}
        />
        <Box className="flex items-center space-x-2">

          <SaveButton currentSvg={currentSvg} selectedSvg={selectedSvg} setSelectedSvg={setSelectedSvg} />
          <Tooltip title="Undo">
            <Button className="text-white hover:text-gray-100" color="inherit" startIcon={<Undo />} onClick={handleUndo} disabled={history.length <= 1}>Undo</Button>
          </Tooltip>

          <Tooltip title="Redo">
            <Button className="text-white hover:text-gray-100" color="inherit" startIcon={<Redo />} onClick={handleRedo} disabled={history.length <= 1}>Redo</Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button className="text-white hover:text-gray-100" color="inherit" startIcon={<Delete />} onClick={handleDeleteSvg}disabled={svgs.length <= 0}>Delete</Button>
          </Tooltip>
          {/* onClick={() => dispatch(undo())}  onClick={() => dispatch(redo())} */}
        </Box>
        <AlertBox open={openConfirmDialog} handleClose={handleCloseDialog} handleConfirm={handleConfirmDelete} />

      </Box>
    </Box>
  );
};

export default TopMenu;
