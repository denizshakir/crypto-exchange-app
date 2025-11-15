import { useCallback } from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import useAppDispatch from './useAppDispatch';

const useWithDispatch = <Payload, Type extends string>(
  func: ActionCreatorWithPayload<Payload, Type>,
) => {
  const dispatch = useAppDispatch();

  const callback = useCallback(
    (payload: Payload) => {
      dispatch(func(payload));
    },
    [dispatch, func],
  );

  return callback;
};

export default useWithDispatch;
