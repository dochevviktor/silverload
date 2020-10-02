import React, { useState, useEffect, RefObject } from 'react';

interface DragAndDropParams {
  handleDrop: (files: FileList) => void;
  dropRef: RefObject<HTMLDivElement>;
}

const DragAndDrop = (props: DragAndDropParams): JSX.Element => {
  const [state, changeState] = useState(false);

  let dragCounter = 0;

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      changeState(true);
    }
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      changeState(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    changeState(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  useEffect(() => {
    const div = props.dropRef.current;

    div.addEventListener('dragenter', handleDragIn);
    div.addEventListener('dragleave', handleDragOut);
    div.addEventListener('dragover', handleDrag);
    div.addEventListener('drop', handleDrop);

    return () => {
      div.removeEventListener('dragenter', handleDragIn);
      div.removeEventListener('dragleave', handleDragOut);
      div.removeEventListener('dragover', handleDrag);
      div.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <div style={{ display: 'inline-block', position: 'absolute' }}>
      {state && (
        <div
          style={{
            position: 'fixed',
            border: 'dashed grey 4px',
            backgroundColor: 'rgba(255,255,255,.8)',
            width: '100vw',
            height: 'calc(100vh - 70px)',
            zIndex: 2,
          }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              textAlign: 'center',
              color: 'grey',
              fontSize: 36,
              translate: 'translate(-50%,-50%)',
            }}>
            <div>drop here :)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
