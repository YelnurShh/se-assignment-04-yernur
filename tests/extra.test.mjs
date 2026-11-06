// tests/extra.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { checkAvailability, formatTime } from '../src/lib/booking.ts';
import { BOOKINGS } from '../src/config/rooms.ts';

const ROOM_ID = 'watson-101';
const NOW = 540;

test(
  'T16 - Start one minute after current time is valid',
  { concurrency: false },
  () => {
    const result = checkAvailability(
      ROOM_ID,
      false,
      541,
      570,
      NOW,
    ).available;

    assert.equal(result, true);
  },
);

test(
  'T17 - Conflict with second Watson booking preserves complete booking data and order',
  { concurrency: false },
  () => {
    BOOKINGS.push({
      id: 'b2',
      roomId: 'watson-101',
      title: 'Databases',
      start: 750,
      end: 810,
    });

    const snapshot = structuredClone(BOOKINGS);

    const result = checkAvailability(
      ROOM_ID,
      false,
      720,
      780,
      NOW,
    ).available;

    assert.equal(result, false);
    assert.deepEqual(BOOKINGS, snapshot);
  },
);

test(
  'T18 - Fractional start and NaN end are rejected',
  { concurrency: false },
  () => {
    assert.equal(
      checkAvailability(
        ROOM_ID,
        false,
        660.5,
        720,
        NOW,
      ).available,
      false,
    );

    assert.equal(
      checkAvailability(
        ROOM_ID,
        false,
        660,
        Number.NaN,
        NOW,
      ).available,
      false,
    );
  },
);

test(
  'T19 - formatTime distinguishes midnight from noon',
  { concurrency: false },
  () => {
    assert.equal(formatTime(1440), '12:00 AM');
    assert.equal(formatTime(720), '12:00 PM');
  },
);
