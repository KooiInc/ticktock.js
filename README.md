## TICKTOCK

A nifty [Class Free Object Oriented](https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming/) ES20xx `Date` extension.

It presents a wrapped *locale sensitive* `ES-Date` 'constructor'. Instances are *immutable*, except for setting 
the instance's individual date/time/locale/timeZone values.

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
This library is the a rewrite from [es-date-fiddler](https://github.com/KooiInc/es-date-fiddler) based on evolvings insights. 

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
- `firstWeekday`
- `format`
- `formatStr` (getter)
- `hasDST` (getter)
- `hours` (getter)
- `isFuture` (getter)
- `isLeapYear` (getter)
- `ISO` (getter)
- `isPast`
- `keys` (getter)
- `local` (getter)
- `locale` (getter)
- `localeInfo` (setter)
- `localeString` (getter)
- `midnight` (getter, returns a clone)
- `milliseconds` (getter)
- `minutes` (getter)
- `month` (getter/setter)
   <br>**Note**: setter is ***not*** zero based
- `monthName` (getter)
- `names` (getter)
- `next`
- `nextMonth` (getter, returns a clone)
- `nextWeek` (getter, returns a clone)
- `nextYear` (getter, returns a clone)
- `offsetFrom`
- `offsetFromUTC` (getter)
- `previous`
- `previousMonth` (getter, returns a clone)
- `previousWeek` (getter, returns a clone)
- `previousYear` (getter, returns a clone)
- `quarter` (getter)
- `quarterNr` (getter)
- `relocate`
- `revalue` (setter)
   <br>**Note**: this setter *mutes the instance value*
- `seconds` (getter)
- `subtract`
- `time` (getter)
- `timeValues` (getter)
- `timeZone` (getter)
- `tomorrow` (getter, returns a clone)
- `UTC` (getter)
- `UTCDiff`
- `weekDay` (getter)
- `weeknr` (getter)
  <br>**Note**: delivers the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) week number
- `weeksInYear` (getter)
- `year` (getter)
- `yesterday` (getter, returns a clone)
