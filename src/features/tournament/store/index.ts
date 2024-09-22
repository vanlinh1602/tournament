import { useInjectReducer, useInjectSaga } from '@/utils/redux-injectors';

import { actions, key, reducer } from './reducer';
import saga from './saga';

export const useTournamentSlice = () => {
  useInjectReducer({ key, reducer });
  useInjectSaga({
    key,
    saga,
  });
  return { actions };
};
