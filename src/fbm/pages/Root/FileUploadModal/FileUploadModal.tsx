import React, { useState } from 'react';
import classes from './FileUploadModal.module.css';
import {
  Colors,
  Divider,
  Card,
  Icon,
  Button,
  Spinner,
} from '@blueprintjs/core';
import { FileLoader } from './AddIconLoader/FileLoader';
import Pic1 from './1.png';
import Pic2 from './2.png';

export const FileUploadModal = () => {
  const [isUploadClicked, setIsUploadClicked] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const handleClick = () => {
    setIsUploadClicked(true);
    setTimeout(() => {
      setShowSecond(true);
      setIsUploadClicked(false);
    }, 1000);
  };

  return (
    <div className={classes.modalMain}>
      <div className={classes.modalBackground}></div>
      <Card className={classes.modalContainer}>
        <div className={classes.modalMetaInfo}>
          <div className={classes.modalTitle}>File uploader modal window</div>
          <Divider className={classes.divider} />
          {showSecond ? (
            <>
              <img src={Pic1} alt="Document picture" />
              <img src={Pic2} alt="Document picture" />
            </>
          ) : (
            <>
              <div className={classes.modalNote}>
                <div className={classes.noteLogo}>
                  <Icon icon="info-sign" size={16} color={Colors.BLUE3} />
                </div>
                <div className={classes.noteMessage}>
                  Welcome to File uploader tool! This feature is in beta
                </div>
              </div>
              <Divider className={classes.divider} />
              <div className={classes.modalUploadInstruction}>
                Upload your file
              </div>
              <FileLoader />
            </>
          )}
        </div>
        <div className={classes.modalActionButtons}>
          <Button
            text={'Cancel'}
            large
            style={{ flex: 1 }}
            onClick={() => void 0}
          />
          <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
            <Button
              text={showSecond && !isUploadClicked ? 'Next' : 'Upload'}
              large
              disabled={isUploadClicked}
              intent={isUploadClicked ? undefined : 'success'}
              style={{
                flex: 1,
                ...(isUploadClicked ? { cursor: 'default' } : {}),
              }}
              onClick={handleClick}
            />
            {isUploadClicked && (
              <Spinner
                style={{ position: 'absolute', top: 16, right: 44 }}
                size={24}
              ></Spinner>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
