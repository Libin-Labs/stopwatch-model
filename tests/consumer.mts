import { createStopwatch, transitionStopwatch, elapsedAt } from '@lp-labs/stopwatch-model';
const state = transitionStopwatch(createStopwatch(), 'start', 100);
if (elapsedAt(state, 350) !== 250) throw new Error('Stopwatch');
// @ts-expect-error invalid argument must be rejected by declarations
transitionStopwatch(createStopwatch(), 'invalid', 0);
