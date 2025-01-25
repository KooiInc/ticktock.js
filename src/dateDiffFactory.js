export default dateDiffFactory;

function dateDiffFactory() {
  const checkParams = (start, end) => {
    const noStart = isNaN(new Date(start));
    const noEnd = isNaN(new Date(end));
    if (noEnd) {
      const [message, full, clean] = Array(3).fill(`end date not valid`);
      return { error: true, message, full, clean };
    }

    if (noStart) {
      const [message, full, clean] = Array(3).fill(`start date not valid`);
      return { error: true, message, full, clean };
    }

    if (noStart && !noEnd) {
      const [message, full, clean] = Array(3).fill(`start- and/or end date are not valid`);
      return { error: true, message, full, clean };
    }
    return { error: false };
  };

  const stringify = stringifyComposed();

  return function getDifference({start, end, diffs = {}} = {}) {
    const checks = checkParams(start, end);
    if (checks.error) { return checks; }
    const diffRaw = start - end;
    const sign = diffRaw === 0 ? `` : diffRaw < 0 ? `-` : `+`;
    const differenceMs = Math.abs(start - end);
    const differenceDate = new Date(differenceMs);
    const years = differenceDate.getUTCFullYear() - 1970;
    const months = differenceDate.getUTCMonth();
    const days = differenceDate.getUTCDate() - 1;
    const weeks = Math.floor(days / 7);
    let hours = differenceDate.getUTCHours();
    let minutes = differenceDate.getUTCMinutes();
    const seconds = differenceDate.getUTCSeconds();
    const milliseconds = differenceDate.getUTCMilliseconds();
    const diffInDays = Math.floor(differenceMs/1000/60/1440);
    diffs = {
      ...diffs,
      fromUTC: start,
      toUTC: end,
      sign,
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      diffInDays };
    diffs.full = stringify({values: diffs, full: true});
    diffs.clean = stringify({ values: diffs });
    diffs.isoDuration = `${sign}P${
      years > 0 ? `${years}Y` : ``}${
      months > 0 ? `${months}M` : ``}${
      weeks > 0 ? `${weeks}W` : ``}${
      days > 0 ? `${days%7}D` : ``}${
      hours > 0 ? `${hours}H` : ``}${
      minutes > 0 ? `${minutes}M` : ``}${
      seconds > 0 ? `${seconds}S` : ``}`;
    console.log(weeks, days % 7);
    return diffs;
  };

  function stringifyComposed() {
    const pipe = (...functions) => initial => functions.reduce((param, func) => func(param), initial);
    const singleOrMultiple = (numberOf, term) => (numberOf === 1 ? term.slice(0, -1) : term);
    const filterRelevant = ({values, full}) =>
      [Object.entries(values).filter( ([key, ]) => /^(years|month|days|hours|minutes|seconds)/i.test(key)), full];
    const aggregateDiffs = ([diffs, full]) =>
      full ? diffs : diffs.filter(([, value]) => full ? +value : value > 0);
    const stringifyDiffs = diffsFiltered => diffsFiltered.reduce( (acc, [key, value])  =>
      [...acc, `${value} ${singleOrMultiple(value, key)}`], [] );
    const diffs2SingleString = diffStrings  => diffStrings.length < 1
      ? `Dates are equal` : `${diffStrings.slice(0, -1).join(`, `)}${
        diffStrings.length > 1 ? ` and ` : ``}${diffStrings.slice(-1).shift()}`;
    return pipe(filterRelevant, aggregateDiffs, stringifyDiffs, diffs2SingleString);
  }
}