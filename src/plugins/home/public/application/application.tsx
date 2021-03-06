/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { i18n } from '@kbn/i18n';
import { ScopedHistory, CoreStart } from 'kibana/public';
import { KibanaContextProvider } from '../../../kibana_react/public';
// @ts-ignore
import { HomeApp } from './components/home_app';
import { getServices } from './kibana_services';

import './index.scss';

export const renderApp = async (
  element: HTMLElement,
  coreStart: CoreStart,
  history: ScopedHistory
) => {
  const homeTitle = i18n.translate('home.breadcrumbs.homeTitle', { defaultMessage: 'Home' });
  const { featureCatalogue, chrome } = getServices();

  // all the directories could be get in "start" phase of plugin after all of the legacy plugins will be moved to a NP
  const directories = featureCatalogue.get();

  chrome.setBreadcrumbs([{ text: homeTitle }]);

  // dispatch synthetic hash change event to update hash history objects
  // this is necessary because hash updates triggered by using popState won't trigger this event naturally.
  // This must be called before the app is mounted to avoid call this after the redirect to default app logic kicks in
  const unlisten = history.listen((location) => {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  render(
    <KibanaContextProvider services={{ ...coreStart }}>
      <HomeApp directories={directories} />
    </KibanaContextProvider>,
    element
  );

  return () => {
    unmountComponentAtNode(element);
    unlisten();
  };
};
