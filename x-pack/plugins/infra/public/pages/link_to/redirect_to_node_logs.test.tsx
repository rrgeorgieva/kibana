/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createLocation } from 'history';
import React from 'react';
import { matchPath } from 'react-router-dom';
import { shallow } from 'enzyme';

import { RedirectToNodeLogs } from './redirect_to_node_logs';

jest.mock('../../containers/source/source', () => ({
  useSource: ({ sourceId }: { sourceId: string }) => ({
    sourceId,
    source: {
      configuration: {
        fields: {
          container: 'CONTAINER_FIELD',
          host: 'HOST_FIELD',
          pod: 'POD_FIELD',
        },
      },
    },
    isLoading: sourceId === 'perpetuallyLoading',
  }),
}));

describe('RedirectToNodeLogs component', () => {
  it('renders a redirect with the correct host filter', () => {
    const component = shallow(
      <RedirectToNodeLogs {...createRouteComponentProps('/host-logs/HOST_NAME')} />
    );

    expect(component).toMatchInlineSnapshot(`
      <Redirect
        to="/stream?sourceId=default&logFilter=(expression:'HOST_FIELD:%20HOST_NAME',kind:kuery)"
      />
    `);
  });

  it('renders a redirect with the correct container filter', () => {
    const component = shallow(
      <RedirectToNodeLogs {...createRouteComponentProps('/container-logs/CONTAINER_ID')} />
    );

    expect(component).toMatchInlineSnapshot(`
      <Redirect
        to="/stream?sourceId=default&logFilter=(expression:'CONTAINER_FIELD:%20CONTAINER_ID',kind:kuery)"
      />
    `);
  });

  it('renders a redirect with the correct pod filter', () => {
    const component = shallow(
      <RedirectToNodeLogs {...createRouteComponentProps('/pod-logs/POD_ID')} />
    );

    expect(component).toMatchInlineSnapshot(`
      <Redirect
        to="/stream?sourceId=default&logFilter=(expression:'POD_FIELD:%20POD_ID',kind:kuery)"
      />
    `);
  });

  it('renders a redirect with the correct position', () => {
    const component = shallow(
      <RedirectToNodeLogs
        {...createRouteComponentProps('/host-logs/HOST_NAME?time=1550671089404')}
      />
    );

    expect(component).toMatchInlineSnapshot(`
      <Redirect
        to="/stream?logPosition=(end:'2019-02-20T14:58:09.404Z',position:(tiebreaker:0,time:1550671089404),start:'2019-02-20T12:58:09.404Z',streamLive:!f)&sourceId=default&logFilter=(expression:'HOST_FIELD:%20HOST_NAME',kind:kuery)"
      />
    `);
  });

  it('renders a redirect with the correct user-defined filter', () => {
    const component = shallow(
      <RedirectToNodeLogs
        {...createRouteComponentProps(
          '/host-logs/HOST_NAME?time=1550671089404&filter=FILTER_FIELD:FILTER_VALUE'
        )}
      />
    );

    expect(component).toMatchInlineSnapshot(`
      <Redirect
        to="/stream?logPosition=(end:'2019-02-20T14:58:09.404Z',position:(tiebreaker:0,time:1550671089404),start:'2019-02-20T12:58:09.404Z',streamLive:!f)&sourceId=default&logFilter=(expression:'(HOST_FIELD:%20HOST_NAME)%20and%20(FILTER_FIELD:FILTER_VALUE)',kind:kuery)"
      />
    `);
  });

  it('renders a redirect with the correct custom source id', () => {
    const component = shallow(
      <RedirectToNodeLogs
        {...createRouteComponentProps('/SOME-OTHER-SOURCE/host-logs/HOST_NAME')}
      />
    );

    expect(component).toMatchInlineSnapshot(`
      <Redirect
        to="/stream?sourceId=SOME-OTHER-SOURCE&logFilter=(expression:'HOST_FIELD:%20HOST_NAME',kind:kuery)"
      />
    `);
  });
});

const createRouteComponentProps = (path: string) => {
  const location = createLocation(path);
  return {
    match: matchPath(location.pathname, { path: '/:sourceId?/:nodeType-logs/:nodeId' }) as any,
    history: null as any,
    location,
  };
};
