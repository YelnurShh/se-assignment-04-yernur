import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAvailability, checkAvailability } from '../src/lib/booking.ts';
import { BOOKINGS } from '../src/config/rooms.ts';
test('P9 pure core accepts frozen independent booking fixtures',()=>{
 const entries=Object.freeze([Object.freeze({id:'f1',roomId:'watson-101',title:'Fixed',start:600,end:660})]);
 const before=structuredClone(entries);
 for(const [start,end,expected] of [[540,570,false],[750,720,false],[720,841,false],[630,690,false],[660,720,true],[570,600,true]]){
  assert.equal(evaluateAvailability(entries,'watson-101',false,start,end,540).available,expected);
 }
 assert.equal(evaluateAvailability(entries,'watson-101',true,720,780,540).available,false);
 assert.deepEqual(entries,before);
});
test('P9 independent datasets do not require mutating global bookings',()=>{
 const saved=structuredClone(BOOKINGS);
 assert.equal(evaluateAvailability([],'watson-101',false,630,645,540).available,true);
 assert.deepEqual(BOOKINGS,saved);
 assert.deepEqual(checkAvailability('watson-101',false,720,780,540),evaluateAvailability(BOOKINGS,'watson-101',false,720,780,540));
});
