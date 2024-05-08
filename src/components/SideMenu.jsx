// SideMenu.js
import React from 'react';
import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Transform, RotateLeft, OpenWith, HorizontalSplit, VerticalSplit, Help, ContentCopy } from '@mui/icons-material'; // Import Material-UI icons
import { CopyToClipboard } from 'react-copy-to-clipboard';


function SideMenu({ handleToolChange, codeToCopy }) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const handleIconClick = (iconName) => {
    if (selectedIcon === iconName) {
      // If the same tool is clicked again, deselect it
      setSelectedIcon(null);
      handleToolChange(null); // Deselect the tool
    } else {
      setSelectedIcon(iconName);
      handleToolChange(iconName);

    }
  };
  const handleHelpDialogOpen = () => {
    setOpenHelpDialog(true);
  };

  const handleHelpDialogClose = () => {
    setOpenHelpDialog(false);
  };


  return (
    <>
      <Box className="w-16 h-full border-r border-gray-300 flex flex-col items-start justify-start" sx={{ alignItems: "center", height: '100vh' }}>
        <List sx={{ paddingTop: "70px" }} className=" flex flex-col justify-center">
          <Tooltip title="Scale">
            <ListItemButton className="" selected={selectedIcon === "Scale"} onClick={() => handleIconClick("Scale")}>
              <Transform />

            </ListItemButton>
          </Tooltip>

          <Tooltip title="Rotate">
            <ListItemButton selected={selectedIcon === "Rotate"} onClick={() => handleIconClick("Rotate")}>
              <RotateLeft />

            </ListItemButton>
          </Tooltip>
          <Tooltip title="Translate">
            <ListItemButton selected={selectedIcon === "Translate"} onClick={() => handleIconClick("Translate")}>
              <OpenWith />

            </ListItemButton>
          </Tooltip>
          <Tooltip title="FlipX">
            <ListItemButton selected={selectedIcon === "FlipX"} onClick={() => handleIconClick("FlipX")}>
              <HorizontalSplit />
            </ListItemButton>
          </Tooltip>
          <Tooltip title="FlipY">
            <ListItemButton selected={selectedIcon === "FlipY"} onClick={() => handleIconClick("FlipY")}>
              <VerticalSplit />
            </ListItemButton>
          </Tooltip>
          {/* <CopyToClipboard text={codeToCopy}>
            <Tooltip title="Copy Code">
              <ListItemButton selected={selectedIcon === "CopyCode"} onClick={() => handleIconClick("CopyCode")} variant="contained" color="primary" >
                <ContentCopy />
              </ListItemButton>
            </Tooltip>
          </CopyToClipboard> */}
          <Tooltip title="Help">
            <ListItemButton onClick={handleHelpDialogOpen}>
              <Help />
            </ListItemButton>
          </Tooltip>

        </List>
      </Box>
      {/* Help Dialog */}
      <Dialog open={openHelpDialog} onClose={handleHelpDialogClose}>
       
        <DialogContent>
          <div className="text-start">
            <h2 className="text-xl font-bold mb-4">How to Use</h2>
            <p className="mb-2">Click on the icons to select the respective tool:</p>
            <ul className="list-disc list-inside mb-4">
              <li className="mb-1"><b>Scale:</b> Adjust the size of an SVG element.</li>
              <li className="mb-1"><b>Rotate:</b> Rotate an SVG element.</li>
              <li className="mb-1"><b>Translate:</b> Move an SVG element to a different position.</li>
              <li className="mb-1"><b>FlipX:</b> Flip an SVG element horizontally.</li>
              <li className="mb-1"><b>FlipY:</b> Flip an SVG element vertically.</li>
            </ul>
            <p>To deselect a tool, click on the selected tool icon again.</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpDialogClose} autoFocus>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default SideMenu;
