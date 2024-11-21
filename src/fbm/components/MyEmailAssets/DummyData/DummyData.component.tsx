import React, { FC, memo } from 'react';
import { Card, H5 } from '@blueprintjs/core';

import commonClasses from '../../../misc/common.module.css';
import classes from '../MyEmailAssets.module.css';

const dummyObject: Record<string, string> = {
  0: 'xxxxxxxxxxx',
  1: 'xxxxxxxx',
  2: 'xxxxxxxx',
};

const dummyArray = [
  dummyObject,
  dummyObject,
  dummyObject,
  dummyObject,
  dummyObject,
  dummyObject,
  dummyObject,
  dummyObject,
];

// TODO: move to common
type DummyDataProps = { withSkeleton?: boolean };

const DummyData: FC<DummyDataProps> = memo(({ withSkeleton = false }) => (
  <>
    {dummyArray.map((dummyObject, index) => (
      <Card
        key={index}
        elevation={2}
        className={`${commonClasses.cardStyle} ${classes.cardStyle}`}
      >
        <H5 className={withSkeleton ? 'bp4-skeleton' : ''}>
          Group title: {dummyObject[0]}
        </H5>
        <p className={withSkeleton ? 'bp4-skeleton' : ''}>
          Created: {dummyObject[1]}
        </p>
        <p className={withSkeleton ? 'bp4-skeleton' : ''}>
          Last modified: {dummyObject[2]}
        </p>
      </Card>
    ))}
  </>
));

export default DummyData;
