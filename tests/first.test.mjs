// tests/first.test.mjs

import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';

import { checkAvailability } from '../src/lib/booking.ts';
import { BOOKINGS } from '../src/config/rooms.ts';

const ROOM_ID = 'watson-101';
const NOW = 540;

const BASE = [
  {
    id: 'b1',
    roomId: 'watson-101',
    title: 'Algorithms',
    start: 600,
    end: 660,
  },
];

const ORIGINAL_BOOKINGS = structuredClone(BOOKINGS);

function restoreBookings(records) {
  BOOKINGS.splice(
    0,
    BOOKINGS.length,
    ...structuredClone(records),
  );
}

function isAvailable(start, end, blocked = false) {
  return checkAvailability(
    ROOM_ID,
    blocked,
    start,
    end,
    NOW,
  ).available;
}

beforeEach(() => {
  restoreBookings(BASE);
});

after(() => {
  restoreBookings(ORIGINAL_BOOKINGS);
});

test(
  'T01 - Starts exactly when existing booking ends',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(660, 720, false), true);
  },
);

test(
  'T02 - Start equals current time',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(540, 570, false), false);
  },
);

test(
  'T03 - Start and end are equal',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(720, 720, false), false);
  },
);

test(
  'T04 - End is before start',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(750, 720, false), false);
  },
);

test(
  'T05 - End exceeds day boundary',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(1380, 1441, false), false);
  },
);

test(
  'T06 - Duration exactly 120 minutes',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(720, 840, false), true);
  },
);

test(
  'T07 - Duration exceeds 120 minutes',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(720, 841, false), false);
  },
);

test(
  'T08 - Ends exactly when existing booking starts',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(570, 600, false), true);
  },
);

test(
  'T09 - Partially overlaps existing booking',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(630, 690, false), false);
  },
);

test(
  'T10 - Requested interval contains existing booking',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(570, 690, false), false);
  },
);

test(
  'T11 - Requested interval lies inside existing booking',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(615, 645, false), false);
  },
);

test(
  'T12 - Requested interval matches existing booking',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(600, 660, false), false);
  },
);

test(
  'T13 - Blocked room rejects valid interval',
  { concurrency: false },
  () => {
    assert.equal(isAvailable(660, 720, true), false);
  },
);

test(
  'T14 - Valid interval with empty bookings',
  { concurrency: false },
  () => {
    BOOKINGS.splice(0, BOOKINGS.length);

    assert.deepEqual(BOOKINGS, []);
    assert.equal(isAvailable(630, 690, false), true);
  },
);

test(
  'T15 - Data preservation for available and unavailable paths',
  { concurrency: false },
  () => {
    const snapshot = structuredClone(BOOKINGS);

    const availableResult = checkAvailability(
      ROOM_ID,
      false,
      660,
      720,
      NOW,
    ).available;

    assert.equal(availableResult, true);
    assert.deepEqual(
      BOOKINGS,
      snapshot,
      'Available path must not modify complete booking data',
    );

    const unavailableResult = checkAvailability(
      ROOM_ID,
      false,
      630,
      690,
      NOW,
    ).available;

    assert.equal(unavailableResult, false);
    assert.deepEqual(
      BOOKINGS,
      snapshot,
      'Unavailable path must not modify complete booking data',
    );
  },
);