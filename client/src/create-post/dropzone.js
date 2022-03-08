import React from 'react';
import './editpost.css'
const DropZone = () => {
function onFileLoad(e) {
    //Get current selected or dropped file (it gives you the ability to load multiple images).
    console.log(e.currentTarget.files[0])
    if( e.currentTarget.files[0]) {
    const file = e.currentTarget.files[0];
    //Create instance 
    let fileReader = new FileReader();
    //Register event listeners
    fileReader.onload = () => {
     let image = new Image();
     image.src = fileReader.result
     image.className = 'post-image'
     document.getElementById('files-here').append(image)
    }
    //Read the file as a Data URL (which gonna give you a base64 encoded image data)
    fileReader.readAsDataURL(file);
  }
  }
    return (
        <>
          <div id="draggable-container">
              <label className="custom-file-upload">
                <input 
                  type="file"id="files"
                  name="file-browser-input"
                  onDragOver={(e) => {
                  e.preventDefault();
                     e.stopPropagation();
                  }}
                  onDrop={onFileLoad}
                  onChange={onFileLoad}/>
              </label>
          </div>
        </>
    )
}
export default DropZone;