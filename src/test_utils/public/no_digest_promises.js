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

import Bluebird from 'bluebird';
import 'ui/promises';
import { uiModules } from 'ui/modules';

Bluebird.longStackTraces();

/**
 * replace the Promise service with Bluebird so that tests
 * can use promises without having to call $rootScope.apply()
 *
 * import noDigestPromises from 'test_utils/no_digest_promises';
 *
 * describe('some module that does complex shit with promises', function () {
 *   beforeEach(noDigestPromises.activate);
 *
 * });
 */

let active = false;

uiModules.get('kibana').config(function ($provide) {
  $provide.decorator('Promise', function ($delegate) {
    return active ? Bluebird : $delegate;
  });
});

export function activateForSuite() {
  before(() => {
    active = true;
  });
  after(() => {
    active = false;
  });
}
