import { PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Tournament } from '../type';
import { actions as tournamentActions } from './reducer';

function* getTournaments() {
  try {
    const result: WithApiResult<CustomObject<Tournament>> =
      yield backendService.post('/tournament/get', {});
    if (result.kind === 'ok') {
      const tournaments = result.data;
      yield put(tournamentActions.fetchTournaments(tournaments));
    } else {
      yield put(tournamentActions.updateHanding(false));
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: formatError(result),
      });
    }
  } catch (err) {
    tournamentActions.updateHanding(false);
    toast({
      variant: 'destructive',
      title: 'Failed',
      description: formatError(err),
    });
  }
}

function* updateTournament(action: PayloadAction<Tournament>) {
  try {
    const result: WithApiResult<Tournament> = yield backendService.post(
      '/tournament/update',
      {
        data: action.payload,
      },
    );
    if (result.kind === 'ok') {
      const tournament = result.data;
      yield put(
        tournamentActions.modifyTournament({
          path: [tournament.id],
          data: tournament,
        }),
      );
    } else {
      yield put(tournamentActions.updateHanding(false));
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: formatError(result),
      });
    }
  } catch (err) {
    tournamentActions.updateHanding(false);
    toast({
      variant: 'destructive',
      title: 'Failed',
      description: formatError(err),
    });
  }
}

function* createTournament(action: PayloadAction<Partial<Tournament>>) {
  try {
    const result: WithApiResult<Tournament> = yield backendService.post(
      '/tournament/create',
      {
        data: action.payload,
      },
    );
    if (result.kind === 'ok') {
      const tournament = result.data;
      yield put(
        tournamentActions.modifyTournament({
          path: [tournament.id],
          data: tournament,
        }),
      );
    } else {
      yield put(tournamentActions.updateHanding(false));
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: formatError(result),
      });
    }
  } catch (err) {
    tournamentActions.updateHanding(false);
    toast({
      variant: 'destructive',
      title: 'Failed',
      description: formatError(err),
    });
  }
}

export default function* saga() {
  yield all([
    takeLatest(tournamentActions.getTournaments.type, getTournaments),
    takeLatest(tournamentActions.updateTournament.type, updateTournament),
    takeLatest(tournamentActions.createTournament.type, createTournament),
  ]);
}
