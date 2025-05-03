import { ReactRelayContext } from 'react-relay';
import { Suspense, useMemo } from 'react';

import { PageWithLayout, RelayHydrate } from './RelayHydrate';
import { createEnvironment } from './environment';

export function ReactRelayContainer<T>({ Component, props }: { Component: PageWithLayout<T>; props: any }) {
  const environment = useMemo(() => createEnvironment(), []);
  return (
    <ReactRelayContext.Provider value={{ environment }}>
      <Suspense fallback={<div>Carregando...</div>}>
        <RelayHydrate Component={Component} props={props} />
      </Suspense>
    </ReactRelayContext.Provider>
  );
}
