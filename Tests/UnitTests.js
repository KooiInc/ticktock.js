import assert from 'node:assert';
import {describe, it} from 'node:test';
import $D from "../index.js";
import {retrieveDateValueFromInput} from "../src/genericHelpers.js";

// globally used
const tzs = {
  auckland: "Pacific/Auckland",
  losAngeles: "America/Los_Angeles",
  vancouver: "America/Vancouver",
  amsterdam: "Europe/Amsterdam",
  paris: "Europe/Paris"
};

describe(`Basics $D`, () => {
  const now = new Date();
  const dateToTestAgainst = new Date(2000, 0, 1, 13, 0, 0).toISOString();
  it(`$D(new Date("2000/01/01 13:00:00")) should return instance with date 2000/01/01 and time 13:00:00`, () =>
    assert.equal($D(new Date("2000/01/01 13:00:00")).ISO, dateToTestAgainst) );
  it(`$D([any Number]) should return current Date`, () => {
    assert.strictEqual(String(retrieveDateValueFromInput(42)), String(new Date()));
    assert.strictEqual(
      String(retrieveDateValueFromInput(Number(new Date(`2200/01/01`)))),
      String(new Date()));
    const now$ = $D(42);
    const now = new Date();
    now$.milliseconds = 0;
    now.setMilliseconds(0)
    assert.strictEqual(now$.ISO, now.toISOString());
  });
  it(`$D([2000, 0, 1, 13, 0, 0]) should return instance with date 2000/01/01 and time 13:00:00`, () =>
    assert.equal($D([2000, 0, 1, 13, 0, 0]).ISO, dateToTestAgainst) );
  it(`$D("2000/01/01 13:00:00") should return instance with date 2000/01/01 and time 13:00:00`, () =>
    assert.equal($D("2000/01/01 13:00:00").ISO, dateToTestAgainst) );
  it(`$D("invalid") should return instance with current Date`, () => {
    const now$ = $D("invalid");
    const now = new Date();
    now$.milliseconds = 0;
    now.setMilliseconds(0);
    assert.strictEqual(String(now$.value), String(now));
  });
  it(`$D() should return instance with current Date`, () => {
    const now$ = $D();
    const now = new Date();
    now$.milliseconds = 0;
    now.setMilliseconds(0);
    assert.strictEqual(String(now$.value), String(now));
  });
  it(`$D({timeZone: "Pacific/Auckland"}) Date value is valid Date`, () =>
    assert.strictEqual($D({timeZone: tzs.auckland}).value.constructor, Date));
  it(`$D({timeZone: "Pacific/Auckland"}) instance embeds Auckland time zone`, () =>
    assert.strictEqual($D({timeZone: tzs.auckland}).timeZone, tzs.auckland));
  it(`$D({locale: "zh"}) Date value is valid Date`, () =>
    assert.strictEqual($D({locale: "zh"}).value.constructor, Date));
  it(`$D({locale: "zh"}) instance embeds zh (china) locale`, () =>
    assert.strictEqual($D({locale: "zh"}).locale, `zh`));
  it(`Stringified [$D instance].value and new Date() should be equal`, _ =>
    assert.strictEqual(String(now), String($D(now))));
  it(`[$D instance].value.constructor and new Date().constructor should be equal`, _ =>
    assert.strictEqual(now.constructor, $D(now).value.constructor));
  it(`[$D([[var now = ]new Date())].ISO should equal now.toISOString()`, _ =>
    assert.strictEqual(now.toISOString(), $D(now).ISO));
});

describe(`Constructor ($D) static methods/getters`, () => {
  // setup
  const timeZoneDate = "2025/01/15 15:00:00";
  const localZoneInformation = Intl.DateTimeFormat().resolvedOptions();
  $D.addCustom({name: `addEra`, method: instance => instance.add(`100 years`), isGetter: true});
  $D.addCustom({
    name: `quarterString`,
    method: (instance, showDate = false) => {
      let quarter = instance.quarter;
      quarter = showDate ? quarter.slice(0, 1).toLowerCase() + quarter.slice(1) : quarter;
      return `${showDate ? `${instance.local} is in the ` : ``}${quarter} quarter`;
    },
    enumerable: true,
  });
  it(`$D.localMonthNames("nl-NL")[0] (long and short) should be "januari" and "jan"`, _ => {
    assert.strictEqual($D.localMonthnames(`nl-NL`).long[0], `januari`);
    assert.strictEqual($D.localMonthnames(`nl-NL`).short[0], `jan`);
  });
  it(`$D.localMonthNames ("zh") (long and short) should be "一月" and "1月"`, _ => {
    assert.strictEqual($D.localMonthnames(`zh`).long[0], "一月");
    assert.strictEqual($D.localMonthnames(`zh`).short[0], "1月");
  });
  it(`$D.localWeekdaynames("nl-NL")[0] (long and short) should be "maandag" and "ma"`, _ => {
    assert.strictEqual($D.localWeekdaynames(`nl-NL`).long[0], `zondag`);
    assert.strictEqual($D.localWeekdaynames(`nl-NL`).short[0], `zo`);
  });
  it(`$D.localWeekdayNames("zh")[0] (long and short) should be "星期日" and "周日"`, _ => {
    assert.strictEqual($D.localWeekdaynames(`zh`).long[0], "星期日");
    assert.strictEqual($D.localWeekdaynames(`zh`).short[0], "周日");
  });
  it(`$D.daysInMonth(1) should be 31`, () => assert.equal($D.daysInMonth(1), 31));
  it(`$D.validateLocaleInformation({locale: "nl"}).locale should be "nl" (and timeZone the user TZ)`, () => {
    const validatedNL = $D.validateLocaleInformation({locale: `nl`});
    assert.equal(validatedNL.locale, `nl`);
    assert.equal(validatedNL.timeZone, localZoneInformation.timeZone);
  });
  it(`$D.validateLocaleInformation({TimeZone: "Pacific/Auckland"}).timeZone should be "Pacific/Auckland" (and locale the user locale)`, () => {
    const validatedNL = $D.validateLocaleInformation({timeZone: tzs.auckland});
    assert.equal(validatedNL.locale, localZoneInformation.locale);
    assert.equal(validatedNL.timeZone, tzs.auckland);
  });
  it(`$D.validateLocaleInformation() should return Intl.DateTimeFormat().resolvedOptions()`, () => {
    const validatedHere = $D.validateLocaleInformation();
    assert.deepStrictEqual(validatedHere, localZoneInformation);
  });
  it(`$D.from(2020, 0, 5, 13, 0, 0) should return a TickTock instance with ISOstring "2020-01-05T12:00:00.000Z"`, () => {
    const testD = $D.from(2020, 0, 5, 13, 0, 0);
    assert.equal(testD.ISO, '2020-01-05T12:00:00.000Z');
  });
  it(`$D.from() should return a TickTock instance with value new Date() (so: now)`, () => {
    const nowISO = new Date().toISOString();
    const testD_ISO = $D.from().ISO;
    assert.equal(testD_ISO, nowISO);
  });
  it(`$D.timeAcrossZones for ${timeZoneDate}, ${tzs.vancouver} vs ${tzs.amsterdam}`, () => {
    const vancouver = $D.timeAcrossZones({
      timeZoneDate: new Date("2025/01/15 15:00:00"),
      timeZoneID: "America/Vancouver",
      userTimeZoneID: "Europe/Amsterdam"
    });
    assert.deepStrictEqual(vancouver, {
      remoteTimezone: "America/Vancouver",
      userTimezone: "Europe/Amsterdam",
      timeDifference: "Time offset +09:00: Europe/Amsterdam is 9 hours ahead of America/Vancouver",
      result: {
        America_Vancouver: "2025/01/15 15:00:00",
        Europe_Amsterdam: "2025/01/16 00:00:00"
      }
    });
  });
  it(`$D.timeAcrossZones for ${timeZoneDate}, ${tzs.auckland} vs ${tzs.losAngeles}`, () => {
    const aucklandVsLosAngeles = $D.timeAcrossZones({
      timeZoneDate,
      timeZoneID: tzs.auckland,
      userTimeZoneID: tzs.losAngeles
    });
    assert.deepStrictEqual(aucklandVsLosAngeles, {
      remoteTimezone: "Pacific/Auckland",
      userTimezone: "America/Los_Angeles",
      timeDifference: "Time offset -21:00: America/Los_Angeles is 21 hours behind Pacific/Auckland",
      result: {
        Pacific_Auckland: "2025/01/15 15:00:00",
        America_Los_Angeles: "2025/01/14 18:00:00"
      }
    });
  });
  it(`$D.yearCalendar({year: 2000, locale: "de"})`, () => {
    const {year, calendar} = $D.yearCalendar({year: 2000, locale: "de"});
    assert.equal(year, 2000);
    assert.equal(calendar.january[0].isLeapYear, true, `isLeapyear not true`);
    assert.equal(calendar.january[0].zoneMonthname, `Januar`, "zoneMonthname 01/01 not 'Januar'");
    assert.equal(calendar.december[0].zoneMonthname, `Dezember`, "zoneMonthname 01/12 not 'Dezember'");
    assert.equal(calendar.december[0].local, `1.12.2000, 00:00:00`, "1/2 local not '1.12.2000, 00:00:00'");
    assert.equal(calendar.december[0].hasDST, true, `hasDST not true`);
    assert.equal(calendar.december[0].DSTActive, false, `DSTActive winter not false`);
    assert.equal(calendar.may[0].DSTActive, true, `DSTActive summer not true`);
  });
  it(`$D.monthCalendar({year: 2000, monthNr: 2, locale: "fr"})`, () => {
    const calendar = $D.monthCalendar({year: 2000, monthNr: 2, locale: `fr`});
    assert.equal(calendar[0].year, 2000);
    assert.equal(calendar[0].zoneMonthname, "février");
    assert.equal(calendar[0].local, "01/02/2000 00:00:00");
    assert.equal(calendar[0].isLeapYear, true);
    assert.equal(calendar.slice(-1)[0].date.date, 29);
  });
  it(`$D.localeInformation equals Intl.DateTimeFormat().resolvedOptions()`, () =>
    assert.deepStrictEqual($D.localeInformation, Intl.DateTimeFormat().resolvedOptions()));
  it(`$D.addCustom added non enumerable getter "addEra"`, () => {
    assert($D.keys.indexOf(`addEra`) < 0, "addEra is NOT expected to be in the $D.keys collection");
    assert.equal($D(`2000/01/01`).addEra.year, 2100);
  });
  it(`$D.addCustom added enumerable method "quarterString"`, () => {
    assert($D.keys.indexOf(`quarterString`) > -1, "quarterString is expected to be in the $D.keys collection");
    const d = $D(`2000/01/01`, {locale: `en-CA`});
    assert.equal(d.quarterString(), `First quarter`);
    assert.equal(d.quarterString(true), `2000-01-01, 12:00:00 a.m. is in the first quarter`);
  });
  it(`$D.keys is Array and contains all (enumerable) instance getter/method names`, () => {
    const keys = $D.keys;
    assert(Array.isArray(keys), `keys must be an Array`);
    assert.strictEqual(keys.find(k => k === `clone`), `clone`, "'clone' in $D.keys should not be null");
    assert.strictEqual(keys.find(k => k === `daysUntil`), `daysUntil`, "'daysUntil' in $D.keys should not be null");
    // custom extension quarterString (see top) is enumerable
    assert.strictEqual(keys.find(k => k === `quarterString`), `quarterString`, "'quarterString' in $D.keys should not be null");
  });
});

describe(`$D instance extensions`, () => {
  describe(`.clone[With]/revalue`, () => {
    it(`.clone is indeed a clone`, () => {
      const now$ = $D.now;
      const clone = now$.clone;
      const dateInitial = now$.dateSingle;
      assert.notStrictEqual(now$, clone);
      clone.date = {date: dateInitial + 5};
      assert(clone.dateSingle === dateInitial + 5);
      assert(clone.dateSingle - 5 === dateInitial);
    });
    it(`.cloneWith without a Date parameter returns instance clone`, () => {
      const now$ = $D.now;
      const clone = now$.cloneWith();
      assert.notStrictEqual(now$, clone);
      assert(String(now$) === String(clone), `toString clone and now should be equal`);
    });
    it(`.cloneWith with an invalid Date parameter returns instance clone`, () => {
      const now$ = $D.now;
      const clone = now$.cloneWith(42);
      const clone2 = now$.cloneWith(`go away`);
      assert.strictEqual(String(now$), String(clone), `toString clone and now should be equal ${clone.ISO}`);
      assert.strictEqual(String(now$), String(clone2), `toString clone2 and now should be equal ${clone.ISO}`);
    });
    it(`.cloneWith with [Date] gives a new  instance with new [Date]`, () => {
      const now$ = $D.now;
      const clone = now$.cloneWith(new Date(`2000/01/01`));
      assert.notEqual(String(now$), String(clone));
      assert.notEqual(String(now$), String(clone), `toString clone and now should NOT be equal`);
      assert(clone.year === 2000, `clone year should be 2000`);
    });
    it(`.cloneWith with [TickTock instance] gives a new instance with new [given TickTock instance value]`, () => {
      const now$ = $D.now;
      const clone = now$.cloneWith($D(`2000/01/01`));
      assert.notEqual(String(now$), String(clone), `toString clone and now should NOT be equal`);
      assert(clone.year === 2000, `clone year should be 2000`);
    });
    it(`.revalue without parameters returns current instance (not a clone)`, () => {
      const now$ = $D.now;
      assert.strictEqual(now$, now$.revalue());
    });
    it(`.revalue with plain date parameter changes the instance Date`, () => {
      const now$ = $D.now;
      now$.revalue(new Date(2015, 2, 17));
      assert.strictEqual(String(new Date(2015, 2, 17)), String(now$.value));
    });
    it(`.revalue with TickTock instance changes the instance Date`, () => {
      const now$ = $D.now;
      const reValueInstance = $D.from(2015, 12, 1);
      assert.strictEqual(String(new Date(2015, 12, 1)), String(now$.revalue(reValueInstance).value));
    });
    it(`.revalue with TickTock instance and different timeZone changes the instance timeZone`, () => {
      const now$ = $D.now;
      const relocateInstance = $D.now.relocate({timeZone: "America/Los_Angeles"});
      assert.strictEqual(now$.revalue(relocateInstance).timeZone, "America/Los_Angeles");
    });
  });
  
  describe(`.next/previous`, () => {
    it(`.next([day after today]) works as expected`, () => {
      // note: for test we must retrieve the english day name, so relocate and zoneNames
      const now$ = $D.now.relocate({locale: `en`});
      const nextDayName = now$.zoneNames.dayNames.long[now$.getDay() + 1];
      const next = now$.next(nextDayName);
      assert.strictEqual(next.dateSingle, now$.dateSingle + 1, `${nextDayName}, ${next.local}`);
    });
    it(`.previous([day before today]) works as expected`, () => {
      // note: for test we must retrieve the english day name, so relocate and zoneNames
      const now$ = $D.now.relocate({locale: `en`});
      const previousDayName = now$.zoneNames.dayNames.long[now$.getDay() - 1];
      const previous = now$.previous(previousDayName);
      assert.strictEqual(previous.dateSingle, now$.dateSingle - 1);
    });
  });
  
  describe(`.offset`, () => {
    // note: using winter time mostly
    const now$ = $D(`2025/01/01`, {timeZone: `Europe/Paris`});
    const auckland = now$.clone.relocate({timeZone: `Pacific/Auckland`});
    const testAucklandToLA = {fromTZ: tzs.auckland, toTZ: tzs.losAngeles, offset: '-21:00'};
    
    it(`.offsetFrom Paris to Auckland (+12)`, () => {
      const parisToAcukland = {fromTZ: tzs.paris, toTZ: tzs.auckland, offset: '+12:00'};
      assert.deepStrictEqual(
        now$.offsetFrom({timeZone: `Pacific/Auckland`}),
        parisToAcukland);
    });
    it(`.offsetFrom Auckland to Paris (-12)`, () => {
      const testAucklandToParis = {fromTZ: tzs.auckland, toTZ: tzs.paris, offset: '-12:00'};
      assert.deepStrictEqual(
        auckland.offsetFrom($D.now.relocate({timeZone: tzs.paris})),
        testAucklandToParis);
    });
    it(`.offsetFrom Auckland to Los Angeles (-21)`, () => {
      assert.deepStrictEqual(
        auckland.offsetFrom($D({timeZone: tzs.losAngeles})),
        testAucklandToLA);
    });
    it(`.offsetFrom Auckland to Los Angeles no matter the date (-21)`, () => {
      assert.deepStrictEqual(
        $D(`2022/01/01 13:00:30`, {timeZone: tzs.auckland})
          .offsetFrom($D({timeZone: tzs.losAngeles})),
        testAucklandToLA);
    });
    it(`.offsetFrom Paris *summerTime* to Auckland (+10)`, () => {
      const paris2AucklandSummer = {fromTZ: 'Europe/Paris', toTZ: 'Pacific/Auckland', offset: '+10:00'};
      assert.deepStrictEqual(
        $D(`2025/06/01`, {timeZone: tzs.paris}).offsetFrom({timeZone: tzs.auckland}),
        paris2AucklandSummer);
    });
    it(`.offsetFrom Paris *winterTime* to Auckland (+12)`, () => {
      const aucklandSummer2Paris = {fromTZ: tzs.paris, toTZ: tzs.auckland, offset: '+12:00'};
      assert.deepStrictEqual(
        $D(`2025/01/01`, {timeZone: `Europe/Paris`}).offsetFrom($D.now.relocate({timeZone: `Pacific/Auckland`})),
        aucklandSummer2Paris);
    });
    it(`.UTCOffset getter for Auckland summer time (-13)`, () => {
      const shouldBe = {fromTZ: tzs.auckland, toTZ: 'UTC', offset: '-13:00'};
      assert.deepStrictEqual($D(`2025/01/01`, {timeZone: tzs.auckland}).UTCOffset, shouldBe);
    });
    it(`.UTCOffset getter for Auckland winter time (-12)`, () => {
      const shouldBe = {fromTZ: tzs.auckland, toTZ: 'UTC', offset: '-12:00'};
      assert.deepStrictEqual($D(`2025/06/01`, {timeZone: tzs.auckland}).UTCOffset, shouldBe);
    });
  });
  
  describe(`various methods/getters`, () => {
    it(`.isFuture([no parameter]) works as expected`, () => {
      const now$ = $D.now;
      now$.date = {date: now$.date.date + 5};
      assert(now$.isFuture() === true, "now$ should be future");
    });
    it(`.isFuture([plain (past) Date]) works as expected`, () => {
      const now$ = $D.now;
      now$.date = {date: now$.date.date + 5};
      assert(now$.isFuture() === true, "now$ should be future");
      assert($D.now.isFuture($D.now.value) === true, "now$ should be future for $D.now.value (plain Date)");
      assert($D.now.isFuture($D.now.addDays(-15).value) === true, "now$ should not be future for $D.now.addDays(-15).value");
    });
    it(`.isFuture([TickTock (past) instance]) works as expected`, () => {
      const now$ = $D.now;
      now$.date = {date: now$.date.date + 5};
      assert(now$.isFuture() === true, "now$ should be future");
      assert($D.now.isFuture($D(`2000/01/01`)) === true, "now$ should be future for 2000/01/01");
    });
    it(`.isPast([no parameter]) works as expected`, () => {
      const now$ = $D.now;
      now$.date = {date: now$.date.date - 10};
      assert(now$.isPast() === true, "now$ should be past");
    });
    it(`.isPast([plain (past) Date]) works as expected`, () => {
      const now$ = $D.now;
      now$.date = {date: now$.date.date - 10};
      assert(now$.isPast() === true, "now$ should be past");
      assert($D.now.isPast(new Date(2000, 0, 1)) === false, "now$ should not be past for plain Date (2000/01/01)");
      assert($D.now.isPast($D.now.addDays(15).value) === true, "now$ should not be past for $D.now.addDays(15).value");
    });
    it(`.isPast([TickTock instance]) works as expected`, () => {
      const now$ = $D.now;
      now$.date = {date: now$.date.date - 10};
      assert(now$.isPast() === true, "now$ should be past");
      assert($D.now.isPast($D(`2000/01/01`)) === false, "now$ should not be past for 2000/01/01");
      assert($D.now.isPast($D.now.addDays(15)) === true, "now$ should not be past for $D.now.addDays(5)");
    });
    it(`.daysUntil([Date + 15 days]) works as expected (+15)`, () => {
      const now$ = $D.now;
      const then = now$.clone.addDays(15);
      assert.strictEqual(now$.daysUntil(then), +15);
    });
    it(`.daysUntil([Date -15 days]) works as expected (-15)`, () => {
      const now$ = $D.now;
      const then = now$.clone.addDays(-15);
      assert.strictEqual(now$.daysUntil(then), -15);
    });
    it(`.firstWeekday([for sunday]) works as expected`, () => {
      const now$ = $D.now;
      const fwdSunday = now$.firstWeekday({sunday: true});
      const prevSunday = now$.previous(`sunday`);
      assert.strictEqual(prevSunday.local, fwdSunday.local, `${fwdSunday.local} !== ${prevSunday.local}`);
    });
    it(`.firstWeekday([for monday]) works as expected`, () => {
      const now$ = $D.now;
      const fwdMonday = now$.firstWeekday();
      const prevMonday = now$.previous(`monday`);
      assert.strictEqual(prevMonday.local, fwdMonday.local, `${fwdMonday.local} !== ${prevMonday.local}`);
    });
    it(`.weeknr for 2024/12/30 (UTC) is 1`, () => {
      assert.equal($D(`2024/12/30`).UTC.weeknr, 1);
    });
    it(`.weeknr for 2022/01/01 (UTC) is 52`, () => {
      assert.equal($D(`2022/01/01`).UTC.weeknr, 52);
    });
    it(`.quarter for date 2025/02/01 is 'First'`, () => {
      assert.equal($D(`2025/02/01`).quarter, `First`);
    });
    it(`.quarter for date 2000/08/01 is 'Third'`, () => {
      assert.equal($D(`2000/08/01`).quarter, `Third`);
    });
    it(`.quarterNr for date 2025/04/01 is 2`, () => {
      assert.equal($D(`2025/04/01`).quarterNr, 2);
    });
    it(`.quarterNr for date 2000/08/01 is 3`, () => {
      assert.equal($D(`2000/10/01`).quarterNr, 4);
    });
  })
});