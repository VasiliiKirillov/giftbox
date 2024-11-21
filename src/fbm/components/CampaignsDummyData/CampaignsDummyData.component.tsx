import React, { FC, memo } from 'react';
import classes from '../CampaignsTable/CampaignsTable.module.css';

type CampaignsDummyDataProps = { withSkeleton?: boolean; isHomePage?: boolean };

export const CampaignsDummyData: FC<CampaignsDummyDataProps> = memo(
  ({ withSkeleton = false, isHomePage = false }) => {
    return (
      <>
        {dummyArray
          .slice(0, isHomePage ? 4 : dummyArray.length)
          .map((dummyObject, index) => (
            <tr key={index}>
              {Object.keys(dummyObject).map((key) => (
                <td
                  key={key}
                  className={
                    Number(key) === 0 ? classes.firstCampaignsElement : ''
                  }
                >
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
  0: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  1: 'xxxxxxxx',
  2: 'xxxxxxxxxxxxxxxxxxxxx',
  3: 'xxxxxxx',
  4: 'xxxxxxx',
};

const dummyArray: DummyData[] = [];

for (let i = 0; i < 16; i++) {
  dummyArray.push(dummyObject);
}
