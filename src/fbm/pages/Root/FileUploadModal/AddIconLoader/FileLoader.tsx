import React, { FC, ReactNode, useCallback, useRef, useState } from 'react';
import classes from './FileLoader.module.css';
import PictureDocument from './picture-document.svg';

export const FileLoader = () => {
  const [file, setFile] = useState<null | File>(null);
  const fileInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  console.log(file);
  const handleFilePicker = useCallback(() => {
    fileInputRef.current.click();
  }, []);
  const handlerLoadIcon = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setFile(event.target.files?.[0] || null);
    },
    []
  );

  return (
    <DragAndDropIconHOC setFile={setFile}>
      {(isDragActive) => (
        <div
          className={`${classes.iconLoaderBodyStyled} ${
            isDragActive ? classes.dragActive : ''
          }`}
        >
          <img src={PictureDocument} alt="Document picture" />
          <div className={classes.textHelperStyled}>
            Drop your image here, or
            <div
              className={classes.filePickerStyled}
              onClick={handleFilePicker}
            >
              browse
            </div>
            <input
              className={classes.fileInputStyled}
              ref={fileInputRef}
              onChange={handlerLoadIcon}
              type="file"
              accept="image/*,.png,.jpg,.svg+xml,.svg,"
            />
          </div>
          <div className={classes.textFormatLoaderStyled}>
            Supports: .txt .doc
          </div>
        </div>
      )}
    </DragAndDropIconHOC>
  );
};

type DragAndDropIconHOCProps = {
  children: (isDragActive: boolean) => ReactNode;
  setFile: (file: File | null) => void;
};

const DragAndDropIconHOC: FC<DragAndDropIconHOCProps> = ({
  children,
  setFile,
}) => {
  const [isDragActive, setDragActive] = useState(false);

  const dragOverHandler = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  }, []);
  const dragLeaveHandler = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  }, []);
  const onDropHandler = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
    setDragActive(false);
  }, []);

  return (
    <div
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={onDropHandler}
    >
      {children(isDragActive)}
    </div>
  );
};
