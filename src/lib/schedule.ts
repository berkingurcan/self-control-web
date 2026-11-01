import type { Session } from './demo.ts';
import type { SiteId } from './site.ts';
export type GymClock = { day: number; hour: number; minute: number };
export const mondayIndex = (date: Date | GymClock) => date instanceof Date ? (date.getDay() + 6) % 7 : date.day;
export function nextSession(list: Session[], now: Date | GymClock, discipline: SiteId) {
  const minute = now instanceof Date ? now.getHours() * 60 + now.getMinutes() : now.hour * 60 + now.minute;
  return list.filter(session => discipline === 'academy' || session.discipline === discipline).map(session => {
    const [hour, mins] = session.time.split(':').map(Number);
    let dayOffset = (session.day - mondayIndex(now) + 7) % 7;
    if (dayOffset === 0 && hour * 60 + mins <= minute) dayOffset = 7;
    return { session, dayOffset, wait: dayOffset * 1440 + hour * 60 + mins - minute };
  }).sort((a, b) => a.wait - b.wait)[0] ?? null;
}
/** Calendar fields in the gym's timezone, independent of the visitor's device timezone. */
export function zonedClock(date: Date, timezone: string) {
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const get=(key:string)=>Number(parts.find(part=>part.type===key)?.value);
  return { day:(new Date(Date.UTC(get('year'),get('month')-1,get('day'))).getUTCDay()+6)%7, hour:get('hour'), minute:get('minute') };
}
