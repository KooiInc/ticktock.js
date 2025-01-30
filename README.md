## TICKTOCK

A nifty [Class Free Object Oriented](https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming/) ES20xx `Date` extension.

It presents a wrapped *locale and time zone sensitive* `ES-Date` 'constructor'. Instances are *immutable*, except for setting 
the instance's individual date/time/locale/timeZone values.

The library has *no dependencies* and a *small footprint*. The bundled file size is around 18kb.

### Importing
The library exports the TickTock constructor by default, ready for use.

```javascript
import $D from "[location of library]";
const now = $D(`2025/01/22 22:00`, {timeZone: `Etc/UTC`});
console.log(now.clone.relocate({timeZone: `Pacific/Auckland`}).differenceTo(now));
```

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

## Constructor static methods
The constructor includes a few static methods

☑️ `daysInMonth(month:Number)` <ins>method</ins>
<br>retrieves the number of days in `month`, a number from 1 (january) to 12 (december).
<br><ins>returns</ins> `Number (28 - 31)`

☑️ `from(...numbers:Number[])` <ins>method</ins>
<br>tries creating an instance from `...numbers`. E.g. `$D.from(2000, 0, 4, 22)`. When the resulting
Date is invalid, will return `[TickTock constructor].now`
<br><ins>returns</ins>  new TickTock instance

☑️ `keys` <ins>getter</ins>
<br>retrieves a sorted list of all keys (getter/method names) of a TickTock instance, sorted alphabetically.
<br><ins>returns</ins> `String[]`

☑️ `localeInformation` <ins>getter</ins>
<br>retrieves the users' default locale/timeZone information
<br><ins>returns</ins> `Object<String, String> {locale, timeZone, calendar, numberingSystem, year, month, day}`

☑️ `localMonthNames(locale:String)` <ins>method</ins>
<br>retrieves the month names (long and short) for the given `locale` (e.g. `"fr-FR"`, `"zh"`)
<br><ins>returns</ins> `Object<String, Array<String>> {long, short}`

☑️ `localWeekdayNames(locale:String)` <ins>method</ins>
<br>retrieves the weekday names (long and short) for the given `locale` (e.g. `"fr-FR"`, `"zh"`)
<br><ins>returns</ins> `Object<String, Array<String>> {long, short}`

☑️ `now` <ins>getter</ins>
<br>converts the current Date to a TickTock instance, within the user locale/timeZone.
<br><ins>returns</ins> new TickTock instance

☑️ `monthCalendar({monthNr:Number, locale:String})` <ins>method</ins>
<br>creates an Array containing TickTock instances for all Dates in `month`.
If `locale` is given (e.g. `nl-BE`, `pl`) and valid the calendar Date instances encapsulates that locale, 
otherwise the default (user) locale.
<br>**Note**: `month` is not zero based, so january = 1, december = 12.
<br><ins>returns</ins> `Array<String>`

☑️ `yearCalendar({year:Number, locale:String})` <ins>method</ins>
<br>creates an Object containing for every month of the `year` an array of TickTock instances for all Dates in that month.
If `locale` is given (e.g. `de-DE`, `fr`) and valid the calendar Date instances encapsulates that locale, 
otherwise the default (user) locale.
<br><ins>returns</ins> `Object<String, Number|Object<String, Array<TickTock instance>>>`

### add custom methods and/or getters
☑️ `addCustom({ name, method, enumerable, isGetter })` <ins>method</ins>
<br>the `addCustom` method enables creating custom methods and/or getters for instances.
<br><ins>returns</ins> nothing

The `addCustom` parameters are:
- `name:String`: the method/getter name
- `method:Function(instance, ...arguments)`: the method to use. `instance` should always be given
- `enumerable:Boolean`: default value false. The custom getter/method can be made *enumerable*.  
   &nbsp;&nbsp;In that case its name will show up in the `keys` list
- `isGetter`: false by default. When true, will function as getter.

*examples* `addCustom`
```javascript
import $D from "[location of the library]";
// getter
$D.addCustom({name: "addEra", method: instance => instance.add("100 years"), isGetter: true});
$D("1970/01/01 12:00").addEra.ISO;
  // ↳ '2070-01-01T11:00:00.000Z'

// method
$D.addCustom({
  name: "kwartaalStr", 
  method: (instance, showDate = true) => ` Resultaten voor kwartaal ${
            instance.quarterNr} ${showDate ? `(${instance.local})` : ``}`;
$D("2022/04/01 12:00", {locale: "nl"}).kwartaalStr();
  // ↳ 'Resultaten voor kwartaal 2 (1-4-2022, 12:00:00)'
$D("2022/04/01 12:00", {locale: "nl"}).kwartaalStr(false);
  // ↳ 'Resultaten voor kwartaal 2'
```

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

## Current extensions for a TickTock instance (a wrapped `Date`)

### Notes
- in the following list the TickTock constructor is referred to as `$D`.
- getters for date values return a zero based month (like `[date instance]getMonth()`, january = 0). Setters for `month` are not zero based. So `[instance].month = 1` sets the month to january.
- getters for date values (e.g. `[instance]month`) return the value within the *user* timeZone. For each of these getters, a getter preceded with `zone` is available to retrieve the value for the *instance* Timezone, for example `[instance.zoneYear]` or `[instance].zoneTimeValues`.
- setters for date values are changing (*mutatating*) the instance Date.

<!--LIST-->
☑️ `add(whatToAdd:String|String[])` <ins>method</ins>
<br>adds `whatToAdd` to the instance Date value.
<br>**note**: `whatToAdd` Can be a single string (e.g. '1 week, 3 hours, -5 minutes'), or 1 or more strings (e.g. '2 years', '1 month')
<br>example `$D("2000/01/01").add("1 year")`
<br><ins>returns</ins> new TickTock instance with Date + `whatToAdd`


☑️ `addDays(nDays:Number)` <ins>method</ins>
<br>adds `nDays` days to the instance Date value
<br><ins>returns</ins> new TickTock instance with Date + `nDays` days


☑️ `addMonths(nMonths:Number)` <ins>method</ins>
<br>adds `nMonths` months to the instance Date value
<br><ins>returns</ins> new TickTock instance with Date + `nMonths` months


☑️ `addWeeks(nWeeks:Number)` <ins>method</ins>
<br>adds `nWeeks` weeks to the instance Date value
<br><ins>returns</ins> new TickTock instance with Date + `nWeeks` days


☑️ `addYears(nYears:Number)` <ins>method</ins>
<br>adds `nYears` years to the instance Date value
<br><ins>returns</ins> new TickTock instance with Date + `nYears` years


☑️ `age` <ins>getter</ins>
<br>the age in years from the instance date to now.
<br>**note**: absolute, future instance Dates will also show a value, e.g. `$D().add('1 year').age` => 1
<br><ins>returns</ins> `Number`


☑️ `ageParts` <ins>getter</ins>
<br>the current age for all parts (years, months, days, hours, etc), from the instance Date to now.
<br>**note**: absolute, future instance Dates will also show a value
<br><ins>returns</ins> `String`


☑️ `between({start, end, include: {start, end}})` <ins>method</ins>
<br>does the instance Date fall between `start` and `end` (both Date or instance)?
<br>Optionally include `include.start` and/or `include.end` (Boolean, default false).
<br><ins>returns</ins> `Boolean`


☑️ `clone` <ins>getter</ins>
<br>clone the instance, preserving the *instance* locale and timeZone information
<br><ins>returns</ins> new TickTock instance


☑️ `cloneWith(withDate:Date|instance)` <ins>method</ins>
<br>clone the instance and revalue to `withDate`, preserving the *instance* locale and timeZone information.
<br>**note**: will, in absence of `withDate`, be equivalent to `instance.clone`
<br><ins>returns</ins> new TickTock instance


☑️ `date` <ins>getter</ins>
<br>date values in *user* timeZone, use `[instance].zoneDate` for values in *instance* timeZone
<br><ins>returns</ins> `Object<String, Number> {year, month, date}`


☑️ `dateSingle` <ins>getter</ins>
<br>the date value in *user* timeZone, use `[instance].zoneDateSingle` for date in *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `dateTime` <ins>getter</ins>
<br>date and time values in *user* timeZone, use `[instance].zoneDateTime` for *instance* timeZone.
<br>**note**: month value is zero based (january = 0)
<br><ins>returns</ins> `Object<String, Number> {year, month, date, hours, minutes, seconds, milliSeconds}`


☑️ `dateTimeValues` <ins>getter</ins>
<br>values for *user* timeZone, use `zoneDateTimeValues` for *instance* timeZone.
<br>**note**: month value is zero based (january = 0)
<br><ins>returns</ins> `Number[] [year, month, date, hours, minutes, seconds, milliseconds]`


☑️ `dateValues` <ins>getter</ins>
<br>values for *user* timeZone, use zoneDateValues for *instance* timeZone.
<br>**note**: month value is zero based (january = 0)
<br><ins>returns</ins> `Number[] [year, month, date]`


☑️ `day` <ins>getter</ins>
<br>weekday value for *user* timeZone, use `zoneDay` for value in *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `dayName` <ins>getter</ins>
<br>the name of the instances' Date weekday. Value for *user* locale, use zoneDayName for locale specific name
<br><ins>returns</ins> `String`


☑️ `daysThisMonth` <ins>getter</ins>
<br>the number of days in the month of the instance Date
<br><ins>returns</ins> `Number` (28 - 31)


☑️ `daysUntil(untilDate:Date|instance)` <ins>method</ins>
<br>the number of full days until `untilDate`. May be negative.
<br><ins>returns</ins> `Number`


☑️ `differenceTo(differenceToDate:Date|instance)` <ins>method</ins>
<br>the difference of the instance Date with `differenceToDate` in years, months ... etc.
<br>**note**: timeZone specific for both the instance Date and `differenceToDate`.
<br>In other words, will accurately calculate the difference between two dates in different time zones.
<br><ins>returns</ins> `Object<String, String|Number`>


☑️ `DSTActive` <ins>getter</ins>
<br>is **D**aylight **S**aving **T**ime active for the instance Date in its timeZone (see also `hasDST` getter)
<br><ins>returns</ins> `Boolean`


☑️ `firstWeekday({sunday = false})` <ins>method</ins>
<br>the Date of the first day of the week (monday by default) of the instance Date
<br><ins>returns</ins> a new TickTock instance


☑️ `format(template:String, formatOptions:String)` <ins>method</ins>
<br>Formats the date according to the parameters. `formatOptions` is encapsulated in the instance,
<br>based on its localeInfo values and will be used as default value.
<br>Based on the [dateformat](https://github.com/KooiInc/dateformat) library, see README.MD up there
<br><ins>returns</ins> `String`


☑️ `fullMonth(forLocale:String)` <ins>method</ins>
<br>creates an Array containing all dates within the month of the instance Date. Optionally for locale `forLocale`.
<br><ins>returns</ins> `Array<TickTock instance>`


☑️ `hasDST` <ins>getter</ins>
<br>is **D**aylight **S**aving **T**ime used in the *instance* timeZone?
<br><ins>returns</ins> `Boolean`


☑️ `hours` <ins>getter/setter</ins>
<br>value for *user* locale, use `[instance].zoneHours` for *instance* timeZone specific name.
<br><ins>returns</ins> `Number`


☑️ `info` <ins>getter</ins>
<br>aggregated information about the instance (for user and *instance* locale/timeZone).
<br><ins>returns</ins> `Object` See example above


☑️ `isFuture` <ins>getter</ins>
<br>is the instance Date in the future?
<br><ins>returns</ins> `Boolean`


☑️ `isLeapYear` <ins>getter</ins>
<br>is the instance Date in a leap year?
<br><ins>returns</ins> `Boolean`


☑️ `ISO` <ins>getter</ins>
<br>shorthand for toISOString()
<br><ins>returns</ins> `String`


☑️ `isPast` <ins>getter</ins>
<br>is the instance Date in the past?
<br><ins>returns</ins> `Boolean`


☑️ `local` <ins>getter</ins>
<br>shorthand for `toLocaleString` (using the *instance* locale and timeZone)
<br><ins>returns</ins> `String`


☑️ `localDate` <ins>getter</ins>
<br>shorthand for `toLocaleDateString` (using the *instance* locale and timeZone).
<br><ins>returns</ins> `String`


☑️ `locale` <ins>getter</ins>
<br>what is the instances encapsulated locale?
<br><ins>returns</ins> `String` (e.g. 'en-CA', 'fr')


☑️ `localeInfo` <ins>getter/setter</ins>
<br>the locale/timeZone information encapsulated within the instance.
<br><ins>returns</ins> `Object<String, String> {locale, timeZone, calendar, numberingSystem year, month, day}`


☑️ `localeString` <ins>getter</ins>
<br>shorthand for `toLocaleString` (using the *instance* locale and timeZone). Alias: [instance].local
<br><ins>returns</ins> `String`


☑️ `localTime` <ins>getter</ins>
<br>shorthand for `toLocaleTimeString` (using the *instance* locale and timeZone).
<br><ins>returns</ins> `String`


☑️ `milliseconds` <ins>getter/setter</ins>
<br>The number of milliseconds of the instance Date.
<br><ins>returns</ins> `Number`


☑️ `minutes` <ins>getter/setter</ins>
<br>getter returns value for *user* timeZone (use `zoneMinutes` for the *instance* timeZone).
<br><ins>returns</ins> `Number`


☑️ `month` <ins>getter/setter</ins>
<br>**note**: getter returns zero based value for *user* timeZone (use `[instance].zoneMonth` for the value
<br>in the *instance* timeZone),but setter is not zero based (so january is 1)
<br><ins>returns</ins> `Number`


☑️ `monthName` <ins>getter</ins>
<br>**note**: for *user* locale, use zoneMonthName for *instance* locale
<br><ins>returns</ins> `String`


☑️ `names` <ins>getter</ins>
<br>names for months (short/long), weekdays (short/long), month, weekday within the *user* locale/timeZone.
<br>Use `[instance].zoneNames` for the same within the *instance* locale/timeZone.
<br><ins>returns</ins> `Object<String, Array<string>>`


☑️ `next(day:String)` <ins>method</ins>
<br>retrieve new instance for next `day` (the english weekday name, either short or long,
<br>case insensitive, e.g. 'mon' or 'MONDAY')
<br><ins>returns</ins> new TickTock instance derived from the instance for the first day *after* the instance Date


☑️ `nextMonth` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance derived from the instance for the instance Date + one month


☑️ `nextWeek` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance derived from the instance for the instance Date + one week


☑️ `nextYear` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance derived from the instance for the instance Date + one year


☑️ `offsetFrom(fromDate: Date|TickTock instance|undefined)` <ins>method</ins>
<br>**note**: assumes Date within *user* timeZone with a plain Date or no `fromDate`.
<br><ins>returns</ins> `Object<String, Array<String>> { from, to, offset }`


☑️ `previous(day:String)` <ins>method</ins>
<br>retrieve new instance for previous `day` (the english weekday name,
<br>either short or long, case insensitive, e.g. 'mon' or 'MONDAY')
<br><ins>returns</ins> new TickTock instance derived from the instance for the first day *before* the instance Date


☑️ `previousMonth` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance derived from the instance for the instance Date - one month


☑️ `previousWeek` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance derived from the instance for the instance Date - one week


☑️ `previousYear` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance derived from the instance for the instance Date - one year


☑️ `quarter` <ins>getter</ins>
<br><ins>returns</ins> `String` (First, ..., Fourth)


☑️ `quarterNr` <ins>getter</ins>
<br><ins>returns</ins> `Number` (1 - 4)


☑️ `relocate({locale:String, timeZone:String})` <ins>method</ins>
<br>change the locale/timeZone information of the instance (so: **mutating**)
<br>**note**: can also be done with the `localeInfo` setter
<br><ins>returns</ins> instance with `locale` and/or `timeZone` from parameters


☑️ `removeTime` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance derived from the instance without time 00:00:00


☑️ `revalue(newValue:Date)` <ins>method</ins>
<br>change the instance Date value, (so **mutating**)
<br><ins>returns</ins> The instance with Date from `newValue`


☑️ `seconds` <ins>getter/setter</ins>
<br>get/set seconds of the instance Date.
<br><ins>returns</ins> `Number`


☑️ `subtract(whatToSubtract:String|String[])` <ins>method</ins>
<br>subtracts `whatToSubtract` to the instance Date value.
<br>**note**: `whatToSubtract` Can be a single string
<br>(e.g. '1 week, 3 hours, 5 minutes'), or 1 or more strings (e.g. '2 years', '1 month')
<br><ins>returns</ins> new TickTock instance derived from the instance with Date value according to subtracted values


☑️ `time` <ins>getter/setter</ins>
<br>getter returns values for *user* timeZone, use `[instance].zoneTime` for localized time values.
<br><ins>returns</ins> `Object<String, Number} {hours, minutes, seconds, milliseconds}`


☑️ `timeValues` <ins>getter</ins>
<br>Returns values for *user* timeZone, use `[instance].zoneTimeValues` for localized time values
<br><ins>returns</ins> `Array<Number> [hours, minutes, seconds, milliseconds]`


☑️ `timeZone` <ins>getter</ins>
<br>retrieve the timeZone value (a string) of the instance
<br><ins>returns</ins> `String`


☑️ `tomorrow` <ins>getter</ins>
<br>retrieve a new instance with Date + one day
<br><ins>returns</ins> new TickTock instance


☑️ `unixEpochTimestamp` <ins>getter</ins>
<br>retrieve the instances' Date unix timestamp
<br><ins>returns</ins> `Number`


☑️ `userLocaleInfo` <ins>getter</ins>
<br>retrieve the *user* locale information.
<br>**note**: one can also use a static constructor getter `$D.localeInformation`
<br><ins>returns</ins> `Object`


☑️ `UTC` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance within the GMT timeZone


☑️ `UTCOffset` <ins>getter</ins>
<br><ins>returns</ins> `{from:String, to:String, offset:String}`


☑️ `value` <ins>getter</ins>
<br><ins>returns</ins> `Date`


☑️ `weekDay` <ins>getter</ins>
<br>**note**: returns weekday number (zero based) in *user* timeZone, use zoneWeekday for *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `weeknr` <ins>getter</ins>
<br><ins>returns</ins> `Number`


☑️ `weeksInYear` <ins>getter</ins>
<br>the number of weeks in the instance Date year
<br><ins>returns</ins> `Number`


☑️ `year` <ins>getter/setter</ins>
<br>**note**: getter returns year in *user* timeZone, use `[instance].zoneYear` getter
<br>for year in the *instance* timeZone.
<br><ins>returns</ins> `Number`


☑️ `yesterday` <ins>getter</ins>
<br><ins>returns</ins> new TickTock instance with Date - one day


☑️ `zoneDate` <ins>getter</ins>
<br>Returns Date values Object for *instance* timeZone
<br><ins>returns</ins> `Object<String, Number> {year, month, date}`


☑️ `zoneDateSingle` <ins>getter</ins>
<br>Returns instance Date date value for *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `zoneDateTime` <ins>getter</ins>
<br>Returns values for *instance* timeZone
<br><ins>returns</ins> `Object<String, Number> {year, month, date, hours, minutes, seconds, milliseconds}`


☑️ `zoneDateTimeValues` <ins>getter</ins>
<br><ins>returns</ins> `Number[] [year, month, date, hours, minutes, seconds, milliseconds]`


☑️ `zoneDateValues` <ins>getter</ins>
<br>Returns Date values for *instance* timeZone
<br><ins>returns</ins> `Number[] [year, month, date]`


☑️ `zoneDay` <ins>getter</ins>
<br>Returns (zero based, sunday = 0) weekday value from *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `zoneDayname` <ins>getter</ins>
<br>Returns weekday name from *instance* locale
<br><ins>returns</ins> `String`


☑️ `zoneHours` <ins>getter</ins>
<br>Returns value within the *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `zoneMinutes` <ins>getter</ins>
<br>Returns instance Date minutes value within the *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `zoneMonth` <ins>getter</ins>
<br>Returns (zero based, january = 0) month value within the *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `zoneMonthname` <ins>getter</ins>
<br>Returns month name from the *instance* locale
<br><ins>returns</ins> `String`


☑️ `zoneNames` <ins>getter</ins>
<br><ins>returns</ins> `Object<String, String|Object<String, Array<String>> {locale, timeZone, dayName, montName, dayNames:{long, short}, monthNames:{long, short}}`


☑️ `zoneSeconds` <ins>getter</ins>
<br>Returns instance Date seconds value within the *instance* timeZone
<br><ins>returns</ins> `Number`


☑️ `zoneTime` <ins>getter</ins>
<br>Returns instance Date time values within the *instance* timeZone
<br><ins>returns</ins> `Object<String, Number> {hours, minutes, seconds, milliseconds}`


☑️ `zoneTimeValues` <ins>getter</ins>
<br>Returns instance Date time values within the *instance* timeZone
<br><ins>returns</ins> `Number[] [hours, minutes, seconds, milliseconds]`


☑️ `zoneYear` <ins>getter</ins>
<br>Returns the instance Date year value within the *instance* timeZone
<br><ins>returns</ins> `Number`
