## TICKTOCK

A nifty [Class Free Object Oriented](https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming/) ES20xx `Date` extension.

It presents a wrapped *locale and time zone sensitive* `ES-Date` 'constructor'. Instances are *immutable*, except for setting 
the instance's individual date/time/locale/timeZone values.

The library has *no dependencies* and a *small footprint*. The bundled file size is around 15kb.

### locale and timezone sensitivity
A 'ticktock date' can be instantiated with locale and time zone information. That information will be embedded within 
the instance (retrievable by the instance property `localeInfo`) and used for (among other things) display or formatting the date (e.g. 
`[instance].local` or `[instance].localeString`). For example, when a ticktock date is instantiated with locale `pl-PL`, 
the week day names for that instance can be retrieved as `[instance].names.dayNames.long`, resulting in an array with values
 *'niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'* (starting with *sunday*). When an instance
 was instantiated with locale: 'zh' and timeZone "Asia/Chongqing", [instance].local will display the date and time *in
 that time zone* (so, UTC+0900).

### For example

`[instance].year = [new value]` sets the year of the current instance
<br>`[instance].localeInfo = {locale: "es", timeZone: " Europe/Madrid"}` relocates the current instance,
<br>`[instance].revalue([some date])` changes the current instance's Date value to [some date], 
<br>but
<br>`[instance].clone([some date])` delivers a *new* instance derived from the current instance with possibly a new date ([some date])
<br>`[instance].UTC` delivers a *new* instance for the UTC timeZone derived from the current instance and
<br>`[instance].add("1 year, 2 days, 13 hours")` delivers a *new* instance derived from the current instance

## Instances are proxies
An instance is actually a [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 
for a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance. 
This means that all native methods and properties for a `Date` can be used with an instance (e.g. `[instance].toLocaleString()`).

## Work in progress
This library is a rewrite from [es-date-fiddler](https://github.com/KooiInc/es-date-fiddler) based on evolvings insights. 

Currently a work in progress.

## Example

The `[instance].info` getter may explain what this library is about

```javascript
import $Date from "[location of the library]";

// create an instance, within a different timeZone
const inChina = $Date(new Date(`2025/01/23 22:00:00`), {locale: `zh`, timeZone: 'Asia/Shanghai'});

console.log(inChina.info);
/**
   Result (my time zone is Europe/Amsterdam, so the date wraps because of the time difference)
   --------------------------------------------------------------------------------------------    
   {
     note: "'user' are values for your locale/timeZone, 'remote' idem for the instance",
     locales: {
       user: { locale: 'en-US', timeZone: 'Europe/Amsterdam' },
       remote: { locale: 'zh', timeZone: 'Asia/Shanghai' }
     },
     dateTime: {
       user: {
         values4Timezone: 'Europe/Amsterdam',
         year: 2025,
         month: 0,
         date: 23,
         hours: 22,
         minutes: 0,
         seconds: 0,
         milliseconds: 0,
         monthName: 'January',
         weekdayNr: 4,
         weekdayName: 'Thursday',
         dayPeriodTime: '10:00:00 PM',
         hasDST: true,
         DSTActive: false,
         string: 'Thu Jan 23 2025 22:00:00 GMT+0100 (Central European Standard Time)'
       },
       remote: {
         values4Timezone: 'Asia/Shanghai',
         year: 2025,
         month: 0,
         date: 24,
         hours: 5,
         minutes: 0,
         seconds: 0,
         milliseconds: 0,
         monthName: '一月',
         weekdayNr: 5,
         weekdayName: '星期五',
         dayPeriodTime: '05:00:00 AM',
         hasDST: false,
         DSTActive: false,
         string: 'Fri Jan 24 2025 05:00:00 GMT+0800 (China Standard Time)'
       }
     },
     offset: {
       fromUserTime: 'Asia/Shanghai 7 hours ahead of Europe/Amsterdam',
       fromUTC: 'Asia/Shanghai 8 hours ahead of GMT'
     }
   }
*/
```

## Current extensions for a wrapped date

***Note**: documentation follows*
<!--LIST-->
- `add(whatToAdd:String|String[])`<br>adds [whatToAd] to the instance Date value.
  `whatToAdd` Can be a single string (e.g. '1 week, 3 hours, -5 minutes'), or 1 or more strings (e.g. '2 years', '1 month')`
      <br>returns new TickTock `instance` with Date + [whatToAdd]
- `addDays(nDays:Number)`<br>adds [nDays] days to the instance Date value
  <br>returns new TickTock `instance` with Date + [nDays] days
- `addMonths(nMonths:Number)`<br>adds [nMonths] months to the instance Date value
  <br>returns new TickTock `instance` with Date + [nMonths] months
- `addWeeks(nWeeks:Number)`<br>adds [nWeeks] weeks to the instance Date value
  <br>returns new TickTock `instance` with Date + [nWeeks] days
- `addYears(nYears:Number)`<br>adds [nYears] years to the instance Date value
  <br>returns new TickTock `instance` with Date + [nYears] years
- `age`<br>the current age, based on the instance Date (vs now). Absolute, so future Dates will also show a value
  <br>returns `Number`
- `ageParts`<br>the current age for all parts (years, months, days, hours, etc), based on the instance Date (vs now). Absolute, so future Dates will also show a value
  <br>returns `String`
- `between({start:Date|instance, end:Date|instance, include: {start:boolean=false, end:boolean=false}})`<br>does the instance Date fall between [start] and [end]. Optionally include [include.start/-end]
  <br>returns `Boolean`
- `clone`<br>clone the instance, preserving the instance locale and timeZone information
  <br>returns new TickTock `instance`
- `cloneWith(withDate:Date|instance)`<br>clone the instance with [withDate], preserving the instance locale and timeZone information. In absence of [withDate] will be equivalent to [instance].clone
  <br>returns new TickTock `instance`
- `date`<br>date values in *user* timeZone, use `zoneDate` for values in *instance* timeZone
  <br>returns `{year:Number, month:Number, date:Number}`
- `dateSingle`<br>the date value in *user* timeZone, use `zoneDateSingle` for date in *instance* timeZone
  <br>returns `Number`
- `dateTime`<br>date and time values in *user* timeZone, use `zoneDateTime` for *instance* timeZone
  <br>returns `{year:Number, month:Number, date:Number, hours:Number, minutes:Number, seconds:Number, milliSeconds:Number}`
- `dateTimeValues`<br>values for *user* timeZone, use `zoneDateTimeValues` for *instance* timeZone
  <br>returns `Number[]` [year, month (zero based), date, hours, minutes, seconds, milliseconds]
- `dateValues`<br>values for *user* timeZone, use zoneDateValues for *instance* timeZone
  <br>returns `Number[]` [year, month (zero based), date]
- `day`<br>weekday value for *user* timeZone, use `zoneDay` for value in *instance* timeZone
  <br>returns `Number`
- `dayName`<br>the name of the instances' Date weekday. Value for *user* locale, use zoneDayName for locale specific name
  <br>returns `String`
- `daysThisMonth`<br>the number of days in the month of the instance Date
  <br>returns `Number`
- `daysUntil(untilDate:Date|instance)`<br>the number of full days until [untilDate]. May be negative.
  <br>returns `Number`
- `differenceTo(differenceToDate:Date|instance)`<br>the difference of the instance Date with [differenceToDate] in years, months ... etc.
  <br>returns `{years:Number, months:Number, days:Number, hours:Number, minutes:Number, seconds:Number, milliseconds:Number,<br> sign:String, ISOPeriod:String, jsPeriod:String,fromUTC:String,toUTC:string, timeZoneStart:String, timeZoneEnd:String, clean:String, full:String}`
- `DSTActive`<br>is Daylight Saving Time active for the instance Date in its timeZone (see also `hasDST` getter)
  <br>returns `Boolean`
- `firstWeekday({sunday = false})`<br>the Date of the first day of the week (monday by default) of the instance Date
  <br>returns a new TickTock `instance`
- `format(template: string, formatOptions: string)`<br>Formats the date according to the parameters. [formatOptions] is encapsulated in the instance, based on its localeInfo values.<br>Based on the [dateformat](https://github.com/KooiInc/dateformat) library
  <br>returns `String`
- `hasDST`<br>is Daylight Saving Time used in the *instance* timeZone?
  <br>returns `Boolean`
- `hours`<br>value for user locale, use zoneHours for *instance* timeZone specific name
  <br>returns Number
- `info`<br>aggregated information about the instance (for user and instance locale/timeZone).
  <br>returns `Object` See example above
- `isFuture`<br>is the instance Date in the future?
  <br>returns `Boolean`
- `isLeapYear`<br>is the instance Date in a leap year?
  <br>returns `Boolean`
- `ISO`<br>shorthand for toISOString()
  <br>returns `String`
- `isPast`<br>is the instance Date in the past?
  <br>returns `Boolean`
- `local`<br>shorthand for `toLocaleString` (using the *instance* locale and timeZone)
  <br>returns String
- `locale`<br>what is the instances encapsulated locale?
  <br>returns `String` (e.g. 'en-CA', 'fr')
- `localeInfo`<br>the locale/timeZone information encapsulated within the instance. **note**: the setter mutates instance Date value.
  <br>returns `{locale:String, timeZone:String, calendar:String, numberingSystem:String, year:String, month:String, day:String}`
- `localeString`<br>shorthand for `toLocaleString` (using the instance locale and timeZone). Alias: [instance].local
  <br>returns `String`
- `milliseconds`<br>The number of milliseconds of the instance Date. **note**: the setter mutates instance Date value.
  <br>returns Number
- `minutes`<br>getter returns value for *user* timeZone (use `zoneMinutes` for the *instance* timeZone). **note**: the setter mutates instance Date value.
  <br>returns Number
- `month`<br>**note**: getter returns zero based value for *user* timeZone (see also zoneMonth), but setter is not zero based (so january is 1)
  <br>returns Number
- `monthName`<br>**note**: for user locale, use zoneMonthName for instance locale
  <br>returns String
- `names`<br>names for months (short/long), weekdays (short/long), month, weekday within the user locale/timeZone. See zoneNames for the same within the instance locale/timeZone
  <br>returns {locale:String, dayName:String, dayNames:{long:Array<String>, short:Array<String>}, montName:String, monthNames:{long:Array<String>, short:Array<String>},timeZone:String}
- `next(day:String (english weekday name, either short or long, case insensitive, e.g. 'mon' or 'MONDAY'))`
  <br>returns new TickTock instance derived from the instance for the first [day] after the instance Date
- `nextMonth`
  <br>returns new TickTock instance derived from the instance for the instance Date + one month
- `nextWeek`
  <br>returns new TickTock instance derived from the instance for the instance Date + one week
- `nextYear`
  <br>returns new TickTock instance derived from the instance for the instance Date + one year
- `offsetFrom(fromDate: Date|TickTock instance|undefined)`<br>**note**: assumes 'GMT' Date with a plain Date parameter [fromDate] or without [fromDate]
  <br>returns Object {from:String (timeZone), to:String (timeZone), offset:String}
- `previous(day:String (english weekday name, either short or long, case insensitive, e.g. 'sat' or 'saturDAY'))`
  <br>returns new TickTock instance derived from the instance for the first [day] before the instance Date
- `previousMonth`
  <br>returns new TickTock instance derived from the instance for the instance Date - one month
- `previousWeek`
  <br>returns new TickTock instance derived from the instance for the instance Date - one week
- `previousYear`
  <br>returns new TickTock instance derived from the instance for the instance Date - one year
- `quarter`
  <br>returns String (First, Second ...)
- `quarterNr`
  <br>returns Number
- `relocate({locale:String, timeZone:String})`<br>Mutates, can also be done with the <code>localeInfo</code> setter
  <br>returns instance with locale/timeZone from parameters
- `removeTime`
  <br>returns new TickTock instance derived from the instance without time 00:00:00
- `revalue(newValue:Date)`<br>Mutates
  <br>returns The instance with Date from [newValue]
- `seconds`
  <br>returns Number
- `subtract`
  <br>returns new TickTock instance derived from the instance with Date value according to subtracted values
- `time`<br>getter returns values for *user* timeZone, use zoneTime for localized time values
  <br>returns {hours:Number, minutes:Number, seconds:Number, milliseconds:Number}
- `timeValues`<br>Returns values for *user* timeZone, use zoneTimeValues for localized time values
  <br>returns [hours:Number, minutes:Number, seconds:Number, milliseconds:Number]
- `timeZone`
  <br>returns String
- `tomorrow`
  <br>returns new TickTock instance with Date + one day
- `unixEpochTimestamp`
  <br>returns Number
- `userLocaleInfo`
  <br>returns Object
- `UTC`
  <br>returns new TickTock instance within the GMT timeZone
- `UTCOffset`
  <br>returns {from:String, to:String ('UTC'), offset:String}
- `value`
  <br>returns Date
- `weekDay`<br>**note**: returns weekday number (zero based) in *user* timeZone, use zoneWeekday for *instance* timeZone
  <br>returns Number
- `weeknr`
  <br>returns Number
- `weeksInYear`
  <br>returns Number
- `year`<br>**note**: getter returns year in *user* timeZone, see also zoneYear getter
  <br>returns Number
- `yesterday`
  <br>returns new TickTock instance with Date - one day
- `zoneDate`<br>Returns Date values for *instance* timeZone
  <br>returns {year:Number, month:Number, date:Number}
- `zoneDateSingle`<br>Returns value for *instance* timeZone
  <br>returns Number
- `zoneDateTime`<br>Returns values for *instance* timeZone
  <br>returns {year:Number, month:Number, date:Number, hours:Number, minutes:Number, seconds:Number, milliseconds:Number}
- `zoneDateTimeValues`
  <br>returns [year:Number, month:Number, date:Number, hours:Number, minutes:Number, seconds:Number, milliseconds:Number]
- `zoneDateValues`<br>Returns Date values for *instance* timeZone
  <br>returns [year:Number, month:Number, date:Number]
- `zoneDay`<br>Returns (zero based) weekday value from *instance* timeZone
  <br>returns Number
- `zoneDayname`<br>Returns weekday name from instance locale
  <br>returns String
- `zoneHours`<br>Returns value within the *instance* timeZone
  <br>returns Number
- `zoneISO`<br>returns ISO string for *instance* timeZone
  <br>returns String
- `zoneMinutes`<br>Returns value within the *instance* timeZone
  <br>returns Number
- `zoneMonth`<br>Returns (zero based) month value within the *instance* timeZone
  <br>returns Number
- `zoneMonthname`<br>Returns month name from the instance locale
  <br>returns String
- `zoneNames`
  <br>returns {locale:String, dayName:String, dayNames:{long:Array<String>, short:Array<String>}, montName:String, monthNames:{long:Array<String>, short:Array<String>},timeZone:String}
- `zoneSeconds`<br>Returns value within the *instance* timeZone
  <br>returns Number
- `zoneTime`<br>Returns values within the *instance* timeZone
  <br>returns {hours:Number, minutes:Number, seconds:Number, milliseconds:Number}
- `zoneTimeValues`<br>Returns values within the *instance* timeZone
  <br>returns [hours:Number, minutes:Number, seconds:Number, milliseconds:Number]
- `zoneYear`<br>Returns value within the *instance* timeZone
  <br>returns Number
- <!--end-->