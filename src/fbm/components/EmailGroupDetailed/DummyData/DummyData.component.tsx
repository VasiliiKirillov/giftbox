import React, { FC, memo } from 'react';

type DummyDataProps = { withSkeleton?: boolean };

export const DummyData: FC<DummyDataProps> = memo(
  ({ withSkeleton = false }) => {
    return (
      <>
        {dummyArray.map((dummyObject, index) => (
          <tr key={index}>
            {Object.keys(dummyObject).map((key) => (
              <td key={key}>
                <div className={withSkeleton ? 'bp4-skeleton' : ''}>
                  {dummyObject[key]}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }
);

type DummyData = Record<string, string>;

const dummyObject: DummyData = {
  0: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  1: 'xxxxxxxx',
  3: 'xxxxxxx',
  4: 'xxxxxxx',
};

const dummyArray: DummyData[] = [];

for (let i = 0; i < 24; i++) {
  dummyArray.push(dummyObject);
}
