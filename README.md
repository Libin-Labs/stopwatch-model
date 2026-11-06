# @lp-labs/stopwatch-model

Pure timestamp-driven stopwatch transitions and lap snapshots.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/stopwatch-model
```

## Working example

```js
import { createStopwatch, transitionStopwatch, elapsedAt } from '@lp-labs/stopwatch-model';
const state = transitionStopwatch(createStopwatch(), 'start', 100);
if (elapsedAt(state, 350) !== 250) throw new Error('Stopwatch');
```

CommonJS: `const api = require('@lp-labs/stopwatch-model')`.

## Behavior, customization and limits

createStopwatch returns paused elapsed0,lastTimestamp0,laps[]. transitionStopwatch(state,event,nowMs) supports start/pause/lap/reset; elapsedAt reads projected elapsed. Monotonic caller timestamps (>=lastTimestamp), nonnegative<=1e12; elapsed<=1e12, <=10000 laps. start while running and pause while paused are idempotent but advance timestamp; lap requires running, reset pauses clears elapsed/laps. Immutable detached snapshots, no timers or clocks. O(laps) validation/copy; injected monotonic time, not wall-clock guarantees.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface StopwatchState {
  running: boolean;
  elapsedMs: number;
  lastTimestamp: number;
  laps: readonly number[];
}
export type StopwatchEvent = 'start' | 'pause' | 'lap' | 'reset';
export declare function createStopwatch(): StopwatchState;
export declare function elapsedAt(state: StopwatchState, nowMs: number): number;
export declare function transitionStopwatch(
  state: StopwatchState,
  event: StopwatchEvent,
  nowMs: number,
): StopwatchState;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
