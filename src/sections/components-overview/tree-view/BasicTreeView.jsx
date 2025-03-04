'use client';

// material-ui
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { ArrowDown2, ArrowRight2 } from 'iconsax-react';

// ==============================|| TREE VIEW - BASIC ||============================== //

export default function BasicTreeView() {
  const basicTreeviewCodeString = `<SimpleTreeView
  aria-label="file system navigator"
  defaultCollapseIcon={<ArrowDown2 />}
  defaultExpandIcon={<ArrowRight2 />}
  defaultExpanded={['5']}
  sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
>
  <TreeItem itemId="1" label="Applications">
    <TreeItem itemId="2" label="Calendar" />
  </TreeItem>
  <TreeItem itemId="5" label="Documents">
    <TreeItem itemId="10" label="OSS" />
    <TreeItem itemId="6" label="MUI">
      <TreeItem itemId="8" label="index.js" />
    </TreeItem>
  </TreeItem>
</SimpleTreeView>`;

  return (
    <MainCard title="Basic" codeHighlight codeString={basicTreeviewCodeString}>
      <SimpleTreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ArrowDown2 />}
        defaultExpandIcon={<ArrowRight2 />}
        defaultExpanded={['5']}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        <TreeItem itemId="1" label="Applications">
          <TreeItem itemId="2" label="Calendar" />
        </TreeItem>
        <TreeItem itemId="5" label="Documents">
          <TreeItem itemId="10" label="OSS" />
          <TreeItem itemId="6" label="MUI">
            <TreeItem itemId="8" label="index.js" />
          </TreeItem>
        </TreeItem>
      </SimpleTreeView>
    </MainCard>
  );
}
