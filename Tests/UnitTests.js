import assert from 'node:assert';
import {describe, it} from 'node:test';
import $D from "../Bundle/index.min.js";
import {retrieveDateValueFromInput, localeInfoValidator} from "../src/genericHelpers.js";

// globally used
const tzs = {
  auckland: "Pacific/Auckland",
  losAngeles: "America/Los_Angeles",
  vancouver: "America/Vancouver",
  amsterdam: "Europe/Amsterdam",
  paris: "Europe/Paris"
};
const localLocaleInformation = localeInfoValidator();

describe(`Basics $D`, () => {
  const now = new Date();
  const dateToTestAgainst = new Date(2000, 0, 1, 13, 0, 0).toISOString();
  it(`$D(new Date("2000/01/01 13:00:00")) should return instance with date 2000/01/01 and time 13:00:00`, () =>
    assert.strictEqual($D(new Date("2000/01/01 13:00:00")).ISO, dateToTestAgainst) );
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
    assert.strictEqual($D([2000, 0, 1, 13, 0, 0]).ISO, dateToTestAgainst) );
  it(`$D([2020]) should return instance with date 2020/01/01`, () =>
    assert.strictEqual($D([2020]).ISO, new Date(2020,0,1).toISOString()) );
  it(`$D("2000/01/01 13:00:00") should return instance with date 2000/01/01 and time 13:00:00`, () =>
    assert.strictEqual($D("2000/01/01 13:00:00").ISO, dateToTestAgainst) );
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
  // local setup
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
  it(`$D.daysInMonth(1) should be 31`, () => assert.strictEqual($D.daysInMonth(1), 31));
  it(`$D.validateLocaleInformation({locale: "nl"}).locale should be "nl" (and timeZone the user TZ)`, () => {
    const validatedNL = $D.validateLocaleInformation({locale: `nl`});
    assert.strictEqual(validatedNL.locale, `nl`);
    assert.strictEqual(validatedNL.timeZone, localZoneInformation.timeZone);
  });
  it(`$D.validateLocaleInformation({TimeZone: "Pacific/Auckland"}).timeZone should be "Pacific/Auckland" (and locale the user locale)`, () => {
    const validatedNL = $D.validateLocaleInformation({timeZone: tzs.auckland});
    assert.strictEqual(validatedNL.locale, localZoneInformation.locale);
    assert.strictEqual(validatedNL.timeZone, tzs.auckland);
  });
  it(`$D.validateLocaleInformation() should return Intl.DateTimeFormat().resolvedOptions()`, () => {
    const validatedHere = $D.validateLocaleInformation();
    assert.deepStrictEqual(validatedHere, localZoneInformation);
  });
  it(`$D.from(2020, 0, 5, 13, 0, 0) should return a TickTock instance with ISOstring "2020-01-05T12:00:00.000Z"`, () => {
    const testD = $D.from(2020, 0, 5, 13, 0, 0);
    assert.strictEqual(testD.ISO, '2020-01-05T12:00:00.000Z');
  });
  it(`$D.from(2000) (single value) should return a TickTock instance with value new Date(2000, 0, 1) (so: now)`, () => {
    const nowISO = new Date(2000, 0, 1).toISOString();
    const testD_ISO = $D.from(2000).ISO;
    assert.strictEqual(testD_ISO, nowISO);
  });
  it(`$D.from() should return a TickTock instance with value new Date() (so: now)`, () => {
    const nowISO = new Date().toISOString();
    const testD_ISO = $D.from().ISO;
    assert.strictEqual(testD_ISO, nowISO);
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
    assert.strictEqual(year, 2000);
    assert.strictEqual(calendar.january[0].isLeapYear, true, `isLeapyear not true`);
    assert.strictEqual(calendar.january[0].zoneMonthname, `Januar`, "zoneMonthname 01/01 not 'Januar'");
    assert.strictEqual(calendar.december[0].zoneMonthname, `Dezember`, "zoneMonthname 01/12 not 'Dezember'");
    assert.strictEqual(calendar.december[0].local, `1.12.2000, 00:00:00`, "1/2 local not '1.12.2000, 00:00:00'");
    assert.strictEqual(calendar.december[0].hasDST, true, `hasDST not true`);
    assert.strictEqual(calendar.december[0].DSTActive, false, `DSTActive winter not false`);
    assert.strictEqual(calendar.may[0].DSTActive, true, `DSTActive summer not true`);
  });
  it(`$D.monthCalendar({year: 2000, monthNr: 2, locale: "fr"})`, () => {
    const calendar = $D.monthCalendar({year: 2000, monthNr: 2, locale: `fr`});
    assert.strictEqual(calendar[0].year, 2000);
    assert.strictEqual(calendar[0].zoneMonthname, "février");
    assert.strictEqual(calendar[0].local, "01/02/2000 00:00:00");
    assert.strictEqual(calendar[0].isLeapYear, true);
    assert.strictEqual(calendar.slice(-1)[0].date.date, 29);
  });
  it(`$D.localeInformation equals Intl.DateTimeFormat().resolvedOptions()`, () => {
    assert.deepStrictEqual($D.localeInformation, Intl.DateTimeFormat().resolvedOptions());
  });
  it(`$D.addCustom added non enumerable getter "addEra"`, () => {
    assert($D.keys.indexOf(`addEra`) < 0, "addEra is NOT expected to be in the $D.keys collection");
    assert.strictEqual($D(`2000/01/01`).addEra.year, 2100);
  });
  it(`$D.addCustom added enumerable method "quarterString"`, () => {
    assert($D.keys.indexOf(`quarterString`) > -1, "quarterString is expected to be in the $D.keys collection");
    const d = $D(`2000/01/01`, {locale: `en-CA`});
    assert.strictEqual(d.quarterString(), `First quarter`);
    assert.strictEqual(d.quarterString(true), `2000-01-01, 12:00:00 a.m. is in the first quarter`);
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
      const dateInitial = now$.dateNr;
      assert.notStrictEqual(now$, clone);
      clone.date = {date: dateInitial + 5};
      assert.strictEqual(clone.dateNr, dateInitial + 5);
      assert.strictEqual(clone.dateNr - 5, dateInitial);
    });
    it(`.cloneWith without a Date parameter returns instance clone`, () => {
      const now$ = $D.now;
      const clone = now$.cloneWith();
      assert.notStrictEqual(now$, clone);
      assert.strictEqual(String(now$), String(clone));
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
      assert.notEqual(String(now$), String(clone));
      assert.strictEqual(clone.year, 2000);
    });
    it(`.cloneWith with [TickTock instance] gives a new instance with new [given TickTock instance value]`, () => {
      const now$ = $D.now;
      const clone = now$.cloneWith($D(`2000/01/01`));
      assert.notEqual(String(now$), String(clone), `toString clone and now should NOT be equal`);
      assert.strictEqual(clone.year, 2000, `clone year should be 2000`);
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
      assert.strictEqual(next.dateNr, now$.dateNr + 1, `${nextDayName}, ${next.local}`);
    });
    it(`.previous([day before today]) works as expected`, () => {
      // note: for test we must retrieve the english day name, so relocate and zoneNames
      const now$ = $D.now.relocate({locale: `en`});
      const previousDayName = now$.zoneNames.dayNames.long[now$.getDay() - 1];
      const previous = now$.previous(previousDayName);
      assert.strictEqual(previous.dateNr, now$.dateNr - 1);
    });
  });
  
  describe(`.between`, () => {
    it(`.between({start: [now - 1 day], end: [now + 1 year]}) is true`, () => {
      assert.strictEqual($D.now.between({start: $D.now.subtract(`1 day`), end: $D.now.add(`1 year`)}), true);
    });
    it(`.between({start: [now], end: [now + 1 year]}) is false`, () => {
      const now$ = $D.now;
      assert.strictEqual(now$.between({start: now$, end: $D.now.add(`1 year`)}), false);
    });
    it(`.between({start: [now], end: [now + 1 year], include: {start: true}}) is true`, () => {
      const now$ = $D.now;
      assert.strictEqual(now$.between({start: now$, end: $D.now.add(`1 year`), include: {start: true}}), true);
    });
    it(`.between({start: [now], end: [now + 1 year], include: {end: true}}) is true`, () => {
      const now$PlusOneYear = $D.now.add(`1 year`);
      assert.strictEqual(now$PlusOneYear.between({start: $D.now, end: now$PlusOneYear, include: {end: true}}), true);
    });
    it(`.between({start: [now], end: [now + 1 year], include: {start: true, end: true}}) is true`, () => {
      const now$PlusOneYear = $D.now.add(`1 year`);
      assert.strictEqual($D.now.between({start: $D.now, end: now$PlusOneYear, include: {start: true, end: true}}), true);
    });
    // same with plain dates
    it(`.between({start: [now - 1 day], end: [now + 1 year]}) start/end plain dates is true`, () => {
      assert.strictEqual($D.now.between(
        {start: $D.now.subtract(`1 day`).value, end: $D.now.add(`1 year`).value}), true);
    });
    it(`.between({start: [now], end: [now + 1 year]}) start/end plain dates is false`, () => {
      const now$ = $D.now;
      assert.strictEqual(now$.between({start: now$.value, end: $D.now.add(`1 year`).value}), false);
    });
    it(`.between({start: [now], end: [now + 1 year], include: {start: true}}) start/end plain dates is true`, () => {
      const now$ = $D.now;
      assert.strictEqual(now$.between(
        {start: now$.value, end: $D.now.add(`1 year`).value, include: {start: true}}), true);
    });
    it(`.between({start: [now], end: [now + 1 year], include: {end: true}}) start/end plain dates  is true`, () => {
      const now$PlusOneYear = $D.now.add(`1 year`);
      assert.strictEqual(now$PlusOneYear.between(
        {start: $D.now.value, end: now$PlusOneYear.value, include: {end: true}}), true);
    });
    it(`.between({start: [now], end: [now + 1 year], include: {start: true, end: true}}) start/end plain dates is true`, () => {
      const now$PlusOneYear = $D.now.add(`1 year`);
      assert.strictEqual(
        $D.now.between({start: $D.now.value, end: now$PlusOneYear.value, include: {start: true, end: true}}), true);
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
      const shouldBe = {fromTZ: tzs.auckland, toTZ: 'UTC', offset: '+13:00'};
      assert.deepStrictEqual($D(`2025/01/01`, {timeZone: tzs.auckland}).UTCOffset, shouldBe);
    });
    it(`.UTCOffset getter for Auckland winter time (-12)`, () => {
      const shouldBe = {fromTZ: tzs.auckland, toTZ: 'UTC', offset: '+12:00'};
      assert.deepStrictEqual($D(`2025/06/01`, {timeZone: tzs.auckland}).UTCOffset, shouldBe);
    });
  });
  
  describe(`.differenceTo`, () => {
    it(`accurately calculates difference from Auckland - to Los Angeles time zone`, () => {
      const la = $D(new Date(`2025/01/23 22:00:00`), {locale: `en`, timeZone: 'America/Los_Angeles'});
      const auckland = $D(new Date(`2025/01/23 22:00:00`), {locale: `en`, timeZone: 'Pacific/Auckland'});
      const diff = JSON.stringify(la.differenceTo(auckland));
      assert.deepStrictEqual(JSON.parse(diff), {
        timeZoneStart: "America/Los_Angeles",
        timeZoneEnd: "Pacific/Auckland",
        fromUTC: "2025-01-23T12:00:00.000Z",
        toUTC: "2025-01-24T09:00:00.000Z",
        sign: "+",
        years: 0,
        months: 0,
        days: 0,
        hours: 21,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        diffInDays: 0,
        full: "0 years, 0 months, 0 days, 21 hours, 0 minutes and 0 seconds",
        clean: "21 hours",
        equalDates: false,
        jsPeriod: "+PT21H",
        ISOPeriod: "PT21H"
      });
    });
    it(`accurately calculates difference from Los Angeles - to Auckland time zone`, () => {
      const la = $D(new Date(`2025/01/23 22:00:00`), {locale: `en`, timeZone: 'America/Los_Angeles'});
      const auckland = $D(new Date(`2025/01/23 22:00:00`), {locale: `en`, timeZone: 'Pacific/Auckland'});
      const diff = JSON.stringify(auckland.differenceTo(la));
      assert.deepStrictEqual(JSON.parse(diff), {
        timeZoneStart: "Pacific/Auckland",
        timeZoneEnd: "America/Los_Angeles",
        fromUTC: "2025-01-24T09:00:00.000Z",
        toUTC: "2025-01-23T12:00:00.000Z",
        sign: "-",
        years: 0,
        months: 0,
        days: 0,
        hours: 21,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        diffInDays: 0,
        full: "0 years, 0 months, 0 days, 21 hours, 0 minutes and 0 seconds",
        clean: "21 hours",
        equalDates: false,
        jsPeriod: "-PT21H",
        ISOPeriod: "PT21H"
      });
    });
  })
  
  describe(`various methods/getters`, () => {
    it(`.age for $D.from(1933,1,5) is 92`, () => {
      const birthDate = $D.from(1933,1,5);
      assert.strictEqual(birthDate.age, birthDate.differenceTo(new Date()).years);
    });
    it(`.ageFull for $D.from(1933,1,5) works as expected`, () => {
      const birthDate = $D.from(1933,1,5);
      const now$ = $D.now;
      assert.strictEqual(birthDate.ageFull, birthDate.differenceTo(now$).clean);
    });
    it(`.ageFullUntil for $D.from(1933,1,5) until $D.from(2026,1,5) works as expected`, () => {
      const birthDate = $D.from(1933,1,5);
      const nextBirthdate = $D.from(2026,1,5);
      assert.strictEqual(birthDate.ageFullUntil(nextBirthdate), birthDate.differenceTo(nextBirthdate).clean);
    });
    it(`.dateNr equals [instance].getDate()`, () => {
      const now$ = $D.now;
      assert.strictEqual(now$.dateNr, now$.getDate());
    });
    it(`.dateValues for 2020/02/01 23:28:30.441, TZ "Asia/Chongqing" returns date values for user timeZone`, () => {
      const dtChina = $D([2020, 2, 1, 23, 28, 30, 441], {timeZone: "Asia/Chongqing"});
      assert.strictEqual(dtChina.dateValues.join(`,`), `2020,2,1`);
    });
    it(`.dateTimeValues for 2020/02/01 23:28:30.441, TZ "Asia/Chongqing" returns DT values for user timeZone`, () => {
      const dtChina = $D([2020, 2, 1, 23, 28, 30, 441], {timeZone: "Asia/Chongqing"});
      assert.strictEqual(dtChina.dateTimeValues.join(`,`), `2020,2,1,23,28,30,441`);
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
    it(`.isFuture([no parameter]) is false`, () => {
      assert.strictEqual($D.now.addDays(5).isFuture(),true);
    });
    it(`.isFuture([plain (past) Date]) is true`, () => {
      assert.strictEqual($D.now.isFuture($D.now.addDays(-5).value), true);
    });
    it(`.isFuture([TickTock (past) instance]) is true`, () => {
      assert.strictEqual($D.now.isFuture($D.now.addDays(-5)), true);
    });
    it(`.isLeapYear for $D.from(2000, 0, 1) is true`, () => {
      assert.strictEqual($D.from(2000, 0, 1).isLeapYear, true);
    });
    it(`.isLeapYear for $D.from(2005, 0, 1) is false`, () => {
      assert.strictEqual($D.from(2005, 0, 1).isLeapYear, false);
    });
    it(`.isPast([no parameter]) for $D.now is false`, () => {
      assert.strictEqual($D.now.isPast(), false);
    });
    it(`.isPast([plain future Date]) is true`, () => {
      assert.strictEqual($D.now.isPast($D.now.addDays(15).value), true);
    });
    it(`.isPast([TickTock (future) instance]) true`, () => {
      const then = $D.now.add(`10 days`);
      assert.strictEqual($D.now.isPast(then), true);
    });
    it(`.local / .localeString) works as expected`, () => {
      const local1 = $D.now;
      const local2 = $D.now.relocate($D.localeInformation);
      assert.strictEqual(local1.local, local2.local);
      assert.strictEqual(local1.localeString, local2.localeString);
    });
    it(`.localDate works as expected`, () => {
      const local1 = $D.now;
      const local2 = $D.now.relocate($D.localeInformation);
      assert.strictEqual(local1.localDate, local2.localDate);
    });
    it(`.localTime works as expected`, () => {
      const local1 = $D.now;
      const local2 = $D.now.relocate($D.localeInformation);
      assert.strictEqual(local1.localTime, local2.localTime);
    });
    it(`.monthName 2020/02/01 delivers the day name in local user locale`, () => {
      const testD = $D(`2020/02/01`);
      const localMonthName = $D.localMonthnames(testD.locale).long[testD.getMonth()];
      assert.strictEqual(testD.monthName, localMonthName);
    })
    it(`.quarter for date 2025/02/01 is 'First'`, () => {
      assert.strictEqual($D(`2025/02/01`).quarter, `First`);
    });
    it(`.quarter for date 2000/08/01 is 'Third'`, () => {
      assert.strictEqual($D(`2000/08/01`).quarter, `Third`);
    });
    it(`.quarterNr for date 2025/04/01 is 2`, () => {
      assert.strictEqual($D(`2025/04/01`).quarterNr, 2);
    });
    it(`.quarterNr for date 2000/08/01 is 3`, () => {
      assert.strictEqual($D(`2000/10/01`).quarterNr, 4);
    });
    it(`.removeTime sets the instance (initial value 2020/02/01 12:28:30.441) time to 00:00:00.000`, () => {
      const noTime = $D.from(2020, 2, 1, 12, 28, 30, 441);
      assert.strictEqual(noTime.format(`hh:mmi:ss.ms`, `hrc:23`), `12:28:30.441`, noTime.milliseconds);
      noTime.removeTime;
      assert.strictEqual(noTime.format(`hh:mmi:ss.ms`, `hrc:23`), `00:00:00.000`, noTime.milliseconds);
      assert.deepStrictEqual(noTime.time, {
        values4Timezone: localLocaleInformation.timeZone,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
    });
    it(`.timeValues for 2020/02/01 12:28:30.441, TZ "Asia/Chongqing" returns values within user timeZone`, () => {
      const dtChina = $D([2020, 2, 1, 12, 28, 30, 441], {timeZone: "Asia/Chongqing"});
      assert.strictEqual(dtChina.timeValues.join(`,`), `12,28,30,441`);
    });
    it(`.toString no parameters equals plain Date toString (without timeZoneName)`, () => {
      const now$ = $D.now;
      const str1 = now$.toString();
      const str2 = now$.value.toString();
      assert.strictEqual(str1.slice(0, str1.indexOf(` (`)), str2.slice(0, str2.indexOf(` (`)));
    });
    it(`.toString with formatString "yyyy/mm/dd WD" equals .format("yyyy/mm/dd WD")`, () => {
      const now$ = $D.now;
      const str1 = now$.toString(`yyyy/mm/dd WD`);
      const str2 = now$.format(`yyyy/mm/dd WD`);
      assert.strictEqual(str1, str2);
    });
    it(`.toString with formatString "yyyy/mm/dd WD" and locale formatOption "l:pl" equals .format("yyyy/mm/dd WD", "l:pl")`, () => {
        const now$ = $D.now;
        const str1 = now$.toString(`yyyy/mm/dd WD`, `l:pl`);
        const str2 = now$.format(`yyyy/mm/dd WD`, `l:pl`);
        assert.strictEqual(str1, str2);
      } );
    it(`.unixEpochTimestamp for 2000/01/01 is 946681200`, () => {
      assert.strictEqual($D.from(2000,0,1).unixEpochTimestamp, 946681200);
    });
    it(`.unixEpochTimestamp for 1900/03/01 is -2203891200`, () => {
      assert.strictEqual($D(`1900/03/01`).unixEpochTimestamp, -2203891200);
    });
    it(`.userLocaleInfo for an instance equals $D.localeInformation`, () => {
      assert.deepStrictEqual($D.now.userLocaleInfo, $D.localeInformation);
    });
    it(`.UTC delivers a clone with embedded timeZone Etc/UTC`, () => {
      const testDate = $D([2020, 2, 1, 12, 28, 30, 441], {timeZone: "America/New_York"});
      const utcDate = testDate.UTC;
      assert.notEqual(testDate.toString(), utcDate.toString());
      assert.strictEqual(utcDate.timeZone, `UTC`);
    });
    it(`.UTCOffset for America/New_York is {..., offset: '-05:00'}`, () => {
      const testDate = $D({timeZone: "America/New_York"});
      assert.deepStrictEqual(testDate.UTCOffset,{fromTZ: 'America/New_York', toTZ: 'UTC', offset: '-05:00'});
    }),
    it(`.value is a plain Date`, () => {
      const testD = $D(`2020/02/01`);
      assert.strictEqual(testD.value.constructor, new Date(`2020/02/01`).constructor);
      assert.strictEqual(String(testD.value), String(new Date(`2020/02/01`)));
    });
    it(`.weekDayname/.dayName for 2020/02/01 returns the right day name`, () => {
      const testD = $D(`2020/02/01`);
      const localDayName = $D.localWeekdaynames(testD.locale).long[testD.getDay()];
      assert.strictEqual(testD.weekDayname, localDayName);
      assert.strictEqual(testD.dayName, localDayName);
    });
    it(`.weeksInYear 2000 is 52, 2004 is 53`, () => {
        assert.strictEqual($D([2000]).weeksInYear, 52);
        assert.strictEqual($D([2004]).weeksInYear, 53);
      });
    it(`.weeknr for 2024/12/30 (UTC) is 1`, () => {
      assert.strictEqual($D(`2024/12/30`).UTC.weeknr, 1);
    });
    it(`.weeknr for 2022/01/01 (UTC) is 52`, () => {
      assert.strictEqual($D(`2022/01/01`).UTC.weeknr, 52);
    });
    it(`.zoneDateValues for 2020/02/01 23:28:30.441, TZ "Asia/Chongqing" returns date values for embedded timeZone`, () => {
      const dtChina = $D([2020, 2, 1, 23, 28, 30, 441], {timeZone: "Asia/Chongqing"});
      assert.strictEqual(dtChina.zoneDateValues.join(`,`), `2020,2,2`);
    });
    it(`.zoneDateTimeValues for 2020/02/01 23:28:30.441, TZ "Asia/Chongqing" returns DT values for user timeZone`, () => {
      const dtChina = $D([2020, 2, 1, 23, 28, 30, 441], {timeZone: "Asia/Chongqing"});
      assert.strictEqual(dtChina.zoneDateTimeValues.join(`,`), `2020,2,2,6,28,30,441`);
    });
    it(`.zoneMonthname for 2020/02/01, locale "zh" is 三月`, () => {
      const dt = $D([2020, 2, 1], {locale: `zh`});
      assert.strictEqual(dt.zoneMonthname, "三月");
    });
    it(`.zoneDayname for 2020/02/01 12:28:30.441, locale "zh" is 星期日`, () => {
      const dt = $D([2020, 2, 1, 12, 28, 30, 441], {locale: `zh`});
      assert.strictEqual(dt.zoneDayname, "星期日");
    });
    it(`.zoneTimeValues for 2020/02/01 12:28:30.441, TZ "Asia/Chongqing" returns values within embedded timeZone`, () => {
      const dtChina = $D([2020, 2, 1, 12, 28, 30, 441], {timeZone: "Asia/Chongqing"});
      assert.strictEqual(dtChina.zoneTimeValues.join(`,`), `19,28,30,441`);
    });
  });
});

describe(`Setters, mutating methods/getters`, () => {
  describe(`individual date/time parts setters`, () => {
    it(`.year setter sets the instance year to 2050`, () => {
      const now$ = $D.now;
      now$.year = 2050;
      assert.strictEqual(now$.year, 2050);
    });
    it(`.year setter using += sets the year to year + value`, () => {
      const now$ = $D.now;
      now$.year = 2030;
      now$.year += 10;
      assert.strictEqual(now$.year, 2040);
    });
    it(`.month setter sets the instance month to march`, () => {
      const now$ = $D.now.relocate({locale: `en`});
      now$.month = 2;
      assert.strictEqual(now$.month, 2);
      assert.strictEqual(now$.zoneNames.monthNames.long[now$.month], `March`);
      assert.strictEqual(now$.zoneMonthname, `March`);
    });
    it(`.month setter using += sets the month to month + value`, () => {
      const now$ = $D(`2000/02/01`).relocate({locale: `en`});
      now$.month += 1;
      assert.strictEqual(now$.month, 2);
      assert.strictEqual(now$.zoneMonthname, `March`);
      assert.strictEqual(now$.zoneNames.monthNames.long[now$.month], `March`);
    });
    it(`.dateNr setter sets the instance date to 18`, () => {
      const now$ = $D.now;
      now$.dateNr = 18;
      assert.strictEqual(now$.dateNr, 18);
    });
    it(`.dateNr setter using += sets the date to hours + value`, () => {
      const now$ = $D(`2000/01/01 17:00:00`);
      now$.dateNr += 1;
      assert.strictEqual(now$.dateNr, 2);
    });
    it(`.hours setter sets the instance hour to 18`, () => {
      const now$ = $D(`2000/01/01`);
      now$.hours = 18;
      assert.strictEqual(now$.hours, 18);
    });
    it(`.hours setter using += sets the hours to hours + value`, () => {
      const now$ = $D(`2000/01/01 17:00:00`);
      now$.hours += 1;
      assert.strictEqual(now$.hours, 18);
    });
    it(`.minutes setter sets the instance minutes to 35`, () => {
      const now$ = $D(`2000/01/01`);
      now$.minutes = 35;
      assert.strictEqual(now$.minutes, 35);
    });
    it(`.minutes setter using += sets the minutes to minutes + value`, () => {
      const now$ = $D(`2000/01/01 17:10:00`);
      now$.minutes += 25;
      assert.strictEqual(now$.minutes, 35);
    });
    it(`.seconds setter sets the instance seconds to 55`, () => {
      const now$ = $D(`2000/01/01`);
      now$.seconds = 55;
      assert.strictEqual(now$.seconds, 55);
    });
    it(`.seconds setter using += sets the seconds to seconds + value`, () => {
      const now$ = $D(`2000/01/01 17:10:30`);
      now$.seconds += 25;
      assert.strictEqual(now$.seconds, 55);
    });
    it(`.milliseconds setter sets the instance milliseconds to 725`, () => {
      const now$ = $D(`2000/01/01`);
      now$.milliseconds = 725;
      assert.strictEqual(now$.milliseconds, 725);
    });
    it(`.milliseconds setter using += sets the milliseconds to milliseconds + value`, () => {
      const now$ = $D(`2000/01/01 17:10:30.600`);
      now$.milliseconds += 125;
      assert.strictEqual(now$.milliseconds, 725);
    });
  });
  
  describe(`.date and .time setters (initialDate = $D("2000/01/01"))`, () => {
    const initialDate = $D(`2000/01/01`);
    it(`initialDate.ISO is '1999-12-31T23:00:00.000Z'`, () => {
      assert.strictEqual(initialDate.ISO, '1999-12-31T23:00:00.000Z');
    });
    it(`.date = {year: 2050} sets instance year to 2050`, () => {
      initialDate.date = {year: 2050};
      assert.strictEqual(initialDate.year, 2050);
    });
    it(`.date = {month: 2} sets instance month to march (2)`, () => {
      initialDate.date = {month: 2};
      assert.strictEqual(initialDate.month, 2);
    });
    it(`.date = {date: 5} sets instance date to 5`, () => {
      initialDate.date = {date: 5};
      assert.strictEqual(initialDate.date.date, 5);
    });
    it(`initialDate.ISO is now '2050-03-04T23:00:00.000Z'`, () => {
      assert.strictEqual(initialDate.ISO, '2050-03-04T23:00:00.000Z');
    });
    it(`.time = {hours: 14} sets instance hours to 14`, () => {
      initialDate.time = {hours: 14};
      assert.strictEqual(initialDate.hours, 14);
    });
    it(`.time = {minutes: 30} sets instance minutes to 30`, () => {
      initialDate.time = {minutes: 30};
      assert.strictEqual(initialDate.minutes, 30);
    });
    it(`.time = {seconds: 30} sets instance seconds to 30`, () => {
      initialDate.time = {seconds: 30};
      assert.strictEqual(initialDate.seconds, 30);
    });
    it(`.time = {milliseconds: 250} sets instance milliseconds to 250`, () => {
      initialDate.time = {milliseconds: 250};
      assert.strictEqual(initialDate.milliseconds, 250);
    });
    it(`initialDate.ISO is now '2050-03-05T13:30:30.250Z'`, () => {
      assert.strictEqual(initialDate.ISO, '2050-03-05T13:30:30.250Z');
    })
  });
  
  describe(`.add, subtract and aggregate adding methods (initialDate = $D("2000/01/01"))`, () => {
    const initialDate = $D(`2000/01/01`);
    it(`.add("1 year, 3 months") sets instance date to 2001/04/01`, () => {
      initialDate.add("1 year, 3 months");
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2001/04/01`);
    });
    it(`.subtract("1 year, 3 months") sets instance date to 2000/01/01`, () => {
      initialDate.subtract("1 year, 3 months");
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.add("don't bother") keeps instance date at 2000/01/01 (aka does nothing)`, () => {
      initialDate.add("don't bother");
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.addYears() set instance date to 2001/01/01 (default value is 1)`, () => {
      initialDate.addYears();
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2001/01/01`);
    });
    it(`.addYears("not numeric") keeps the current date value (2001/01/01)`, () => {
      initialDate.addYears("not number");
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2001/01/01`);
    });
    it(`.addYears(1) sets instance date to 2002/01/01`, () => {
      initialDate.addYears(1);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2002/01/01`);
    });
    it(`.addYears(-2) sets instance date to 2000/01/01`, () => {
      initialDate.addYears(-2);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.addMonths(1) sets instance date to 2000/02/01`, () => {
      initialDate.addMonths(1);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/02/01`);
    });
    it(`.addMonths(-1) sets instance date to 2000/01/01`, () => {
      initialDate.addMonths(-1);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.addWeeks(1) sets instance date to 2000/01/08`, () => {
      initialDate.addWeeks(1);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/08`);
    });
    it(`.addWeeks(-1) sets instance date to 2000/01/01`, () => {
      initialDate.addWeeks(-1);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.nextWeek sets instance date to 2000/01/08`, () => {
      assert.strictEqual(initialDate.nextWeek.format(`yyyy/mm/dd`), `2000/01/08`);
    });
    it(`.previousWeek sets instance date to 2000/01/01`, () => {
      assert.strictEqual(initialDate.previousWeek.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.addDays(1) sets instance date to 2000/01/02`, () => {
      initialDate.addDays(1);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/02`);
    });
    it(`.addDays(-1) sets instance date to 2000/01/01`, () => {
      initialDate.addDays(-1);
      assert.strictEqual(initialDate.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.tomorrow sets instance date to 2000/01/02`, () => {
      assert.strictEqual(initialDate.tomorrow.format(`yyyy/mm/dd`), `2000/01/02`);
    });
    it(`.yesterday sets instance date to 2000/01/01`, () => {
      assert.strictEqual(initialDate.yesterday.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.nextYear sets instance date to 2001/01/01`, () => {
      assert.strictEqual(initialDate.nextYear.format(`yyyy/mm/dd`), `2001/01/01`);
    });
    it(`.previousYear sets instance date to 2000/01/01`, () => {
      assert.strictEqual(initialDate.previousYear.format(`yyyy/mm/dd`), `2000/01/01`);
    });
    it(`.nextMonth sets instance date to 2000/02/01`, () => {
      assert.strictEqual(initialDate.nextMonth.format(`yyyy/mm/dd`), `2000/02/01`);
    });
    it(`.previousMonth sets instance date to 2000/01/01`, () => {
      assert.strictEqual(initialDate.previousMonth.format(`yyyy/mm/dd`), `2000/01/01`);
    });
  });
  
  describe(`Mutating methods/getters`, () => {
    it(`.revalue([plain JS Date]) changes instance Date value`, () => {
      const now = new Date();
      const newDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      const now$ = $D.now.revalue(newDate);
      assert.strictEqual(now$.toDateString(), newDate.toDateString());
    });
    it(`.revalue([TickTock instance]) changes instance Date value`, () => {
      const newDate = $D.now.addYears(1);
      const now$ = $D.now.revalue(newDate);
      assert.strictEqual(now$.toDateString(), newDate.toDateString());
    });
    it(`.relocate({locale:pt}) changes instance associated locale to pt (Portugese)`, () => {
      const testDate = $D.from(2000,0,1).relocate({locale: `pt`});
      assert.strictEqual(testDate.localeInfo.locale, `pt`);
      assert.strictEqual(testDate.zoneMonthname, `janeiro`);
      assert.strictEqual(testDate.zoneDayname, 'sábado');
    });
    it(`.relocate({timeZone}) changes instance associated timeZone`, () => {
      const testDate = $D(`2000/01/01 07:00`).relocate({timeZone: `America/Vancouver`});
      assert.strictEqual(testDate.timeZone, `America/Vancouver`);
      assert.strictEqual(testDate.zoneDateTime.values4Timezone, testDate.timeZone);
      // user date/time
      assert.strictEqual(testDate.dateTime.hours, 7);
      assert.strictEqual(testDate.dateTime.year, 2000);
      assert.strictEqual(testDate.dateTime.month, 0);
      // timeZone date/time
      assert.strictEqual(testDate.zoneDateTime.hours, 22);
      assert.strictEqual(testDate.zoneDateTime.year, 1999);
      assert.strictEqual(testDate.zoneDateTime.month, 11);
      
    });
  });
});

describe(`Native Date methods (sample tests)`, () => {
  const getTestDate = () => $D("August 19, 1975 23:15:30 GMT-3:00");
  describe(`Date setters`, () => {
    it(`.setUTCDate(...) changes the instance date value`, () => {
      const testDate = getTestDate();
      assert.strictEqual(testDate.UTC.dateNr, 20);
      testDate.setUTCDate(19);
      assert.strictEqual(testDate.UTC.dateNr, 19);
    });
    it(`.setDate(...) changes the instance date value`, () => {
      const testDate = getTestDate().relocate({timeZone: `Europe/Berlin`});
      assert.strictEqual(testDate.dateNr, 20);
      testDate.setDate(23);
      assert.strictEqual(testDate.dateNr, 23);
    });
    it(`.setDate(...) and [instance].date = {date} setter are equal`, () => {
      const testDate = getTestDate().relocate({timeZone: `Europe/Berlin`});
      const clone = testDate.clone;
      clone.date = {date: 23};
      assert.strictEqual(testDate.dateNr, 20);
      testDate.setDate(23);
      assert.strictEqual(testDate.dateNr, 23);
      assert.deepStrictEqual(testDate.date, clone.date);
    });
    it(`.setDate(...) and [instance].dateNr setter are equal`, () => {
      const testDate = getTestDate().relocate({timeZone: `Europe/Berlin`});
      const clone = testDate.clone;
      clone.dateNr = 23;
      assert.strictEqual(testDate.dateNr, 20);
      testDate.setDate(23);
      assert.strictEqual(testDate.dateNr, 23);
      assert.deepStrictEqual(testDate.date, clone.date);
    });
    it(`.setHours(...) changes the instance time value`, () => {
      const testDate = getTestDate().relocate({timeZone: `Europe/Berlin`});
      assert.strictEqual(testDate.hours, 3);
      testDate.setHours(testDate.getHours() - 4);
      assert.strictEqual(testDate.hours, 23);
    });
    it(`.setHours and instance.hours setter are equal`, () => {
      const testDate = getTestDate().relocate({timeZone: `Europe/Berlin`});
      assert.strictEqual(testDate.hours, 3);
      const cloned = testDate.clone;
      cloned.hours -= 4;
      testDate.setHours(testDate.getHours() - 4);
      assert.strictEqual(cloned.hours, 23);
      assert.strictEqual(testDate.hours, 23);
    });
  });
  describe(`Date getters`, () => {
    it(`.getUTCDate() equals [instance].UTC.dateNr`, () => {
      const testDate = getTestDate();
      assert.strictEqual(testDate.UTC.dateNr, 20);
      assert.strictEqual(testDate.UTC.dateNr, testDate.getUTCDate());
    });
    it(`.getDate() equals [instance].dateNr`, () => {
      const testDate = getTestDate().relocate({timeZone: `Europe/Berlin`});
      assert.strictEqual(testDate.dateNr, testDate.getDate());
    });
  })
});