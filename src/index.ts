function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
export interface StopwatchState {
  running: boolean;
  elapsedMs: number;
  lastTimestamp: number;
  laps: readonly number[];
}
export type StopwatchEvent = 'start' | 'pause' | 'lap' | 'reset';
export function createStopwatch(): StopwatchState {
  return { running: false, elapsedMs: 0, lastTimestamp: 0, laps: [] };
}
function check(state: StopwatchState, now: number): number {
  if (
    !state ||
    typeof state.running !== 'boolean' ||
    !Array.isArray(state.laps) ||
    state.laps.length > 10000
  )
    throw new TypeError('Invalid stopwatch state');
  finite(state.elapsedMs, 0, 1e12);
  finite(state.lastTimestamp, 0, 1e12);
  finite(now, state.lastTimestamp, 1e12);
  let previous = 0;
  for (const lap of state.laps) {
    finite(lap, previous, state.elapsedMs);
    previous = lap;
  }
  return finite(state.elapsedMs + (state.running ? now - state.lastTimestamp : 0), 0, 1e12);
}
export function elapsedAt(state: StopwatchState, nowMs: number): number {
  return check(state, nowMs);
}
export function transitionStopwatch(
  state: StopwatchState,
  event: StopwatchEvent,
  nowMs: number,
): StopwatchState {
  const elapsed = check(state, nowMs);
  if (event !== 'start' && event !== 'pause' && event !== 'lap' && event !== 'reset')
    throw new RangeError('Unknown event');
  if (event === 'reset') return { running: false, elapsedMs: 0, lastTimestamp: nowMs, laps: [] };
  if (event === 'lap' && (!state.running || state.laps.length >= 10000))
    throw new RangeError('Lap requires running state and available budget');
  return {
    running: event === 'start' ? true : event === 'pause' ? false : state.running,
    elapsedMs: elapsed,
    lastTimestamp: nowMs,
    laps: event === 'lap' ? [...state.laps, elapsed] : [...state.laps],
  };
}
