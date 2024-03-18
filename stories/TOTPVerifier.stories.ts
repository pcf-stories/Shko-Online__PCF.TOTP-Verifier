/*
   Copyright 2023 Betim Beja and Shko Online LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import type { ArgTypes, Meta, StoryObj } from '@storybook/html';
import type { IInputs, IOutputs } from '../TOTPVerifier/generated/ManifestTypes';
import { useArgs, useEffect } from '@storybook/preview-api';
import { TOTPVerifier as Component } from '../TOTPVerifier/index';
import '../TOTPVerifier/css/TOTPVerifier.css';
import { ComponentFrameworkMockGenerator, DataSetMock, StringPropertyMock } from '@shko.online/componentframework-mock';
import { getFromResource } from './getFromResource';

const secret_Name = getFromResource('Secret_Display_Key');
const secret_Description = getFromResource('Secret_Desc_Key');
// const dataset_Name = getFromResource('Verifier_DataSet_Display_Key');
const dataset_Description = getFromResource('Verifier_DataSet_Desc_Key');

const argTypes: Partial<ArgTypes<StoryArgs>> = {
  Secret: {
    name: secret_Name,
    description: secret_Description,
    type: 'string',
  },
  datasetItems: {
    //name: dataset_Name,
    description: dataset_Description,
    control: 'object',
    table: {
      category: 'Dataset',
    },
  },
  lastSubmission: {
    control: false,
  },
};
interface DatasetItem {
  Success: boolean;
  Message: string;
}

export interface StoryArgs {
  isVisible: boolean;
  isDisabled: boolean;
  Secret: string;
  datasetItems: DatasetItem[];
  lastSubmission?: DatasetItem;
}

export default {
  title: 'TOTP Verifier/TOTP Verifier',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes,
  args: {
    isVisible: true,
    isDisabled: false,
    Secret: 'LUFCAKIIEUTTA7RQ',
    datasetItems: [
      { Success: true, Message: 'You passed the test' },
      { Success: false, Message: 'You failed' },
    ],
  },
  decorators: [
    // Note: You can control the div assigned to your PCF component here.
    // Also, you can make this div resizable if you want to test trackContainerResize
    (Story) => {
      const container = document.createElement('div');
      container.style.margin = '2em';
      container.style.padding = '1em';
      container.style.maxWidth = '350px';
      container.style.border = 'dotted 1px';

      const storyResult = Story();
      if (typeof storyResult == 'string') {
        container.innerHTML = storyResult;
      } else {
        container.appendChild(storyResult);
      }
      return container;
    },
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/html/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<StoryArgs>;
const renderGenerator = () => {
  let container: HTMLDivElement | null;
  let mockGenerator: ComponentFrameworkMockGenerator<IInputs, IOutputs>;

  return function () {
    const [args, updateArgs] = useArgs<StoryArgs>();
    // Fires on unload story
    useEffect(
      () => () => {
        container = null;
        mockGenerator.control.destroy();
      },
      [],
    );
    if (!container) {
      container = document.createElement('div');
      container.className = '';
      mockGenerator = new ComponentFrameworkMockGenerator(
        Component,
        {
          verifierDataSet: DataSetMock,
          Secret: StringPropertyMock,
        },
        container,
      );

      mockGenerator.context.mode.isControlDisabled = args.isDisabled;
      mockGenerator.context.mode.isVisible = args.isVisible;
      mockGenerator.context._SetCanvasItems({
        Secret: args.Secret,
      });
      mockGenerator.context._parameters.verifierDataSet._InitItems(args.datasetItems);

      mockGenerator.context._parameters.verifierDataSet.openDatasetItem.callsFake((item) => {
        const lastSubmission = {
          Message: mockGenerator.context._parameters.verifierDataSet.records[item.id.guid].getValue(
            'Message',
          ) as string,
          Success: mockGenerator.context._parameters.verifierDataSet.records[item.id.guid].getValue(
            'Success',
          ) as boolean,
        };
        updateArgs({ lastSubmission });
      });

      mockGenerator.ExecuteInit();
    }

    if (mockGenerator) {
      mockGenerator.context.mode.isVisible = args.isVisible;
      mockGenerator.context.mode.isControlDisabled = args.isDisabled;
      mockGenerator.context._parameters.Secret._SetValue(args.Secret);
      mockGenerator.ExecuteUpdateView();
    }

    return container;
  };
};

export const TOTPVerifier = {
  render: renderGenerator(),
  parameters: { controls: { expanded: true } },
} as StoryObj<StoryArgs>;
