## TICKTOCK

A nifty [Class Free Object Oriented](https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming/) ES20xx `Date` extension.

It presents a wrapped *locale sensitive* `ES-Date` 'constructor'. Instances are *immutable*, except for setting 
the instance's individual date/time/locale/timeZone values.

For example

`[instance].year = [new value]` sets the year of the current instance
<br>`[instance].localeInfo = {locale: "es", timeZone: " Europe/Madrid"}` relocates the current instance, but
<br>`[instance].UTC` delivers a *new* instance for the UTC timeZone derived from the current instance and
<br>`[instance].add("1 year, 2 days, 13 hours")` delivers a *new* instance derived from the current instance

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
- `date` (getter)
- `dateSingle` (getter)
- `dateTime` (getter)
- `dateTimeValues` (getter)
- `dateValues` (getter)
- `day` (getter)
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
- `month` (getter)
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
- `revalue`
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
- `weeksInYear` (getter)
- `year` (getter)
- `yesterday` (getter, returns a clone)
