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

import React from 'react';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useArgs } from '@storybook/client-api';
import {
  ComponentFrameworkMockGenerator,
  DataSetMock,
  StringPropertyMock,
} from '@shko.online/componentframework-mock';

import type { IInputs, IOutputs } from '@shko.online/totp-verifier/TOTPVerifier/generated/ManifestTypes';
import type { StoryFn } from '@storybook/react';
import type { StoryArgs } from './StoryArgs';
import { TOTPVerifier as Component } from '@shko.online/totp-verifier/TOTPVerifier';

const Template: StoryFn<StoryArgs> = ({}) => {
  const [args, updateArgs] = useArgs<StoryArgs>();
  const container = useRef<HTMLDivElement>(null);
  const [, setLoaded] = useState<boolean>(false);

  const mockGenerator = useMemo(() => {
    if (container.current === null) return;
    const innerContainer = document.createElement('div');
    container.current.appendChild(innerContainer);

    const mockGenerator: ComponentFrameworkMockGenerator<IInputs, IOutputs> = new ComponentFrameworkMockGenerator(
      Component,
      {
        verifierDataSet: DataSetMock,
        Secret: StringPropertyMock,
      },
      innerContainer,
    );

    mockGenerator.context.mode.isControlDisabled = args.isDisabled;
    mockGenerator.context.mode.isVisible = args.isVisible;
    mockGenerator.context._SetCanvasItems({
      Secret: args.Secret,
    });

    mockGenerator.context._parameters.verifierDataSet._InitItems(args.datasetItems);

    mockGenerator.context._parameters.verifierDataSet.openDatasetItem.callsFake((item) => {
      var lastSubmission = {
        Message: mockGenerator.context._parameters.verifierDataSet.records[item.id.guid].getValue('Message') as string,
        Success: mockGenerator.context._parameters.verifierDataSet.records[item.id.guid].getValue('Success') as boolean,
      };
      updateArgs({ lastSubmission });
    });

    mockGenerator.ExecuteInit();
    return mockGenerator;
  }, [container.current]);

  if (mockGenerator) {
    mockGenerator.context.mode.isVisible = args.isVisible;
    mockGenerator.context.mode.isControlDisabled = args.isDisabled;
    mockGenerator.context._parameters.Secret._SetValue(args.Secret);
    mockGenerator.ExecuteUpdateView();
  }

  useEffect(() => {
    setLoaded(true);
  }, [container.current]);
  return <div ref={container}></div>;
};

export default Template;

