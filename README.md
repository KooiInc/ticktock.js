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
<br>`[instance].revalue([some date])` changes the current instance's Date value to [some date], but
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

## Current extensions for a wrapped date

***Note**: documentation follows*

- `add`
- `addDays`
- `addMonths`
- `addWeeks`
- `addYears`
- `age` (getter)
- `ageParts` (getter)
- `between`
- `clone`
- `date` (getter/setter)
   <br>**Note**: setter for month part is ***not*** zero based 
   <br>**Note**: the setter *mutates the instance value*
- `dateSingle` (getter)
- `dateTime` (getter)
- `dateTimeValues` (getter)
- `dateValues` (getter)
- `day` (getter)
- `dayName` (getter)
- `daysInMonth` (getter)
- `daysThisMonth`  (getter, alias for `daysInMonth`)
- `daysUntil`
- `differenceTo`
- `DSTActive` (getter)
- `firstWeekday`
- `format`
- `formatStr` (getter)
- `hasDST` (getter)
- `hours` (getter/setter)
   <br>**Note**: the setter *mutates the instance value*
- `info` (gettter)
- `isFuture` (getter)
- `isLeapYear` (getter)
- `ISO` (getter)
- `isPast`
- `isTT` (this is a 'is ticktock instance')
- `keys` (getter)
- `local` (getter, alias for `[instance].localString`)
- `locale` (getter)
- `localeInfo` (setter)
- `localeString` (getter)
- `milliseconds` (getter/setter)
   <br>**Note**: the setter *mutates the instance value*
- `minutes` (getter/setter)
   <br>**Note**: the setter *mutates the instance value*
- `month` (getter/setter)
   <br>**Note**: setter is ***not*** zero based
   <br>**Note**: the setter *mutates the instance value*
- `monthName` (getter)
- `names` (getter)
- `next`
- `nextMonth` (getter, returns a clone)
- `nextWeek` (getter, returns a clone)
- `nextYear` (getter, returns a clone)
- `offsetFrom`
- `previous`
- `previousMonth` (getter, returns a clone)
- `previousWeek` (getter, returns a clone)
- `previousYear` (getter, returns a clone)
- `quarter` (getter)
- `quarterNr` (getter)
- `relocate`
   <br>**Note**: this setter *mutates the instance value*
- `revalue` (setter)
   <br>**Note**: this setter *mutates the instance value*
- `seconds` (getter/setter)
   <br>**Note**: the setter *mutates the instance value*
- `subtract`
- `time` (getter/setter)
   <br>**Note**: the setter *mutates the instance value*
- `timeValues` (getter)
- `timeZone` (getter)
- `tomorrow` (getter, returns a clone)
- `toString` (method),
   <br>**Note**: overrides native `Date.prototype.toString`, the resulting string is for the embedded instance locale/timeZone
- `UTC` (getter, returns a clone))
- `UTCOffset` (getter)
- `weekDay` (getter)
- `weeknr` (getter)
  <br>**Note**: delivers the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) week number
- `weeksInYear` (getter)
- `year` (getter/setter)
   <br>**Note**: the setter *mutates the instance value*
- `yesterday` (getter, returns a clone)
- `zoneDate` (getter)
- `zoneDateTimeValues` (getter)
- `zoneTime` (getter)
- `zoneTimeValue` (getter)

## Example

The `[instance].info` method may explain what this library is about

```javascript
import $Date from "[location of the library]";

// create an instance for the current date, within a different timeZone
const inChina = $Date({locale: `zh`, timeZone: 'Asia/Shanghai'});

console.log(JSON.stringify(inChina.info, null, 2));
/**
 result (note: my time zone is Europe/Amsterdam, locale )
   {
     "note": "'user' are values for your locale/timeZone, 'remote' idem for the instance",
     "locales": {
       "user": {
         "locale": "en-US",
         "timeZone": "Europe/Amsterdam",
         "string": "Wed Jan 22 2025 11:07:22 GMT+0100 (Central European Standard Time)"
       },
       "remote": {
         "locale": "zh",
         "timeZone": "Asia/Shanghai",
         "string": "Wed Jan 22 2025 18:07:22 GMT+0800 (China Standard Time)"
       }
     },
     "dateTime": {
       "user": {
         "values4Timezone": "Europe/Amsterdam",
         "year": 2025,
         "month": 0,
         "date": 22,
         "hours": 11,
         "minutes": 7,
         "seconds": 22,
         "milliseconds": 0
       },
       "remote": {
         "values4Timezone": "Asia/Shanghai",
         "year": 2025,
         "month": 0,
         "date": 22,
         "hours": 18,
         "minutes": 7,
         "seconds": 22,
         "milliseconds": 0
       }
     },
     "offset": {
       "fromUserTime": "Asia/Shanghai 7 hours later than Europe/Amsterdam",
       "fromUTC": "Asia/Shanghai 8 hours later than GMT"
     },
     "monthName": {
       "user": "January",
       "remote": "一月"
     },
     "dayName": {
       "user": "Wednesday",
       "remote": "星期三"
     },
     "dayPeriodTime": {
       "user": "11:07:22 AM",
       "remote": "06:07:22 PM"
     }
   }
 */

```