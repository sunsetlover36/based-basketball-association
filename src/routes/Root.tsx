import { Outlet } from 'react-router-dom';

import { Wrapper } from '@/components/layout';

export const Root = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};
