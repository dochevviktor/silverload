import { DragEvent } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SLDragAndDrop {
  dragCounter: number;
  showOverlay: boolean;
}

const initialDragState: SLDragAndDrop = {
  dragCounter: 0,
  showOverlay: false,
};

const noDefaultAndPropagation = (e: DragEvent): DragEvent => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return e;
};

const DragAndDrop = createSlice({
  name: 'DragAndDrop',
  initialState: initialDragState,
  reducers: {
    handleDrag(state, action: PayloadAction<DragEvent>) {
      noDefaultAndPropagation(action.payload);
    },
    handleDragIn(state, action: PayloadAction<DragEvent>) {
      const e = noDefaultAndPropagation(action.payload);

      state.dragCounter++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        state.showOverlay = true;
      }
    },
    handleDragOut(state, action: PayloadAction<DragEvent>) {
      noDefaultAndPropagation(action.payload);
      state.dragCounter--;
      if (state.dragCounter === 0) {
        state.showOverlay = false;
      }
    },
    handleDragDrop(state, action: PayloadAction<DragEvent>) {
      noDefaultAndPropagation(action.payload);

      state.showOverlay = false;
      state.dragCounter = 0;
    },
  },
});

export const { handleDrag, handleDragIn, handleDragOut, handleDragDrop } = DragAndDrop.actions;

export default DragAndDrop.reducer;
