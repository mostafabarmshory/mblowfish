
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {
  moment: { exports: moment }
};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};

require.register("jalaali-js", function (exports, module) {
/*
  Expose functions.
*/
module.exports =
  { toJalaali: toJalaali
  , toGregorian: toGregorian
  , isValidJalaaliDate: isValidJalaaliDate
  , isLeapJalaaliYear: isLeapJalaaliYear
  , jalaaliMonthLength: jalaaliMonthLength
  , jalCal: jalCal
  , j2d: j2d
  , d2j: d2j
  , g2d: g2d
  , d2g: d2g
  }

/*
  Converts a Gregorian date to Jalaali.
*/
function toJalaali(gy, gm, gd) {
  return d2j(g2d(gy, gm, gd))
}

/*
  Converts a Jalaali date to Gregorian.
*/
function toGregorian(jy, jm, jd) {
  return d2g(j2d(jy, jm, jd))
}

/*
  Checks whether a Jalaali date is valid or not.
*/
function isValidJalaaliDate(jy, jm, jd) {
  return  jy >= -61 && jy <= 3177 &&
          jm >= 1 && jm <= 12 &&
          jd >= 1 && jd <= jalaaliMonthLength(jy, jm)
}

/*
  Is this a leap year or not?
*/
function isLeapJalaaliYear(jy) {
  return jalCal(jy).leap === 0
}

/*
  Number of days in a given month in a Jalaali year.
*/
function jalaaliMonthLength(jy, jm) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  if (isLeapJalaaliYear(jy)) return 30
  return 29
}

/*
  This function determines if the Jalaali (Persian) year is
  leap (366-day long) or is the common year (365 days), and
  finds the day in March (Gregorian calendar) of the first
  day of the Jalaali year (jy).

  @param jy Jalaali calendar year (-61 to 3177)
  @return
    leap: number of years since the last leap year (0 to 4)
    gy: Gregorian year of the beginning of Jalaali year
    march: the March day of Farvardin the 1st (1st day of jy)
  @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
  @see: http://www.fourmilab.ch/documents/calendar/
*/
function jalCal(jy) {
  // Jalaali years starting the 33-year rule.
  var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
                , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
                ]
    , bl = breaks.length
    , gy = jy + 621
    , leapJ = -14
    , jp = breaks[0]
    , jm
    , jump
    , leap
    , leapG
    , march
    , n
    , i

  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error('Invalid Jalaali year ' + jy)

  // Find the limiting years for the Jalaali year jy.
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i]
    jump = jm - jp
    if (jy < jm)
      break
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }
  n = jy - jp

  // Find the number of leap years from AD 621 to the beginning
  // of the current Jalaali year in the Persian calendar.
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4)
    leapJ += 1

  // And the same in the Gregorian calendar (until the year gy).
  leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

  // Determine the Gregorian date of Farvardin the 1st.
  march = 20 + leapJ - leapG

  // Find how many years have passed since the last leap year.
  if (jump - n < 6)
    n = n - jump + div(jump + 4, 33) * 33
  leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }

  return  { leap: leap
          , gy: gy
          , march: march
          }
}

/*
  Converts a date of the Jalaali calendar to the Julian Day number.

  @param jy Jalaali year (1 to 3100)
  @param jm Jalaali month (1 to 12)
  @param jd Jalaali day (1 to 29/31)
  @return Julian Day number
*/
function j2d(jy, jm, jd) {
  var r = jalCal(jy)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}

/*
  Converts the Julian Day number to a date in the Jalaali calendar.

  @param jdn Julian Day number
  @return
    jy: Jalaali year (1 to 3100)
    jm: Jalaali month (1 to 12)
    jd: Jalaali day (1 to 29/31)
*/
function d2j(jdn) {
  var gy = d2g(jdn).gy // Calculate Gregorian year (gy).
    , jy = gy - 621
    , r = jalCal(jy)
    , jdn1f = g2d(gy, 3, r.march)
    , jd
    , jm
    , k

  // Find number of days that passed since 1 Farvardin.
  k = jdn - jdn1f
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      jm = 1 + div(k, 31)
      jd = mod(k, 31) + 1
      return  { jy: jy
              , jm: jm
              , jd: jd
              }
    } else {
      // The remaining months.
      k -= 186
    }
  } else {
    // Previous Jalaali year.
    jy -= 1
    k += 179
    if (r.leap === 1)
      k += 1
  }
  jm = 7 + div(k, 30)
  jd = mod(k, 30) + 1
  return  { jy: jy
          , jm: jm
          , jd: jd
          }
}

/*
  Calculates the Julian Day number from Gregorian or Julian
  calendar dates. This integer number corresponds to the noon of
  the date (i.e. 12 hours of Universal Time).
  The procedure was tested to be good since 1 March, -100100 (of both
  calendars) up to a few million years into the future.

  @param gy Calendar year (years BC numbered 0, -1, -2, ...)
  @param gm Calendar month (1 to 12)
  @param gd Calendar day of the month (1 to 28/29/30/31)
  @return Julian Day number
*/
function g2d(gy, gm, gd) {
  var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

/*
  Calculates Gregorian and Julian calendar dates from the Julian Day number
  (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
  calendars) to some millions years ahead of the present.

  @param jdn Julian Day number
  @return
    gy: Calendar year (years BC numbered 0, -1, -2, ...)
    gm: Calendar month (1 to 12)
    gd: Calendar day of the month M (1 to 28/29/30/31)
*/
function d2g(jdn) {
  var j
    , i
    , gd
    , gm
    , gy
  j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  i = div(mod(j, 1461), 4) * 5 + 308
  gd = div(mod(i, 153), 5) + 1
  gm = mod(div(i, 153), 12) + 1
  gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return  { gy: gy
          , gm: gm
          , gd: gd
          }
}

/*
  Utility helper functions.
*/

function div(a, b) {
  return ~~(a / b)
}

function mod(a, b) {
  return a - ~~(a / b) * b
}
})
require.register("moment-jalaali", function (exports, module) {

module.exports = jMoment

var moment = require('moment')
  , jalaali = require('jalaali-js')

/************************************
    Constants
************************************/

var formattingTokens = /(\[[^\[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g
  , localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS?|LL?L?L?|l{1,4})/g

  , parseTokenOneOrTwoDigits = /\d\d?/
  , parseTokenOneToThreeDigits = /\d{1,3}/
  , parseTokenThreeDigits = /\d{3}/
  , parseTokenFourDigits = /\d{1,4}/
  , parseTokenSixDigits = /[+\-]?\d{1,6}/
  , parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i
  , parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i
  , parseTokenT = /T/i
  , parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/
  , symbolMap = {
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
    '0': '۰'
  }
  , numberMap = {
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '۰': '0'
  }


  , unitAliases =
    { jm: 'jmonth'
    , jmonths: 'jmonth'
    , jy: 'jyear'
    , jyears: 'jyear'
    }

  , formatFunctions = {}

  , ordinalizeTokens = 'DDD w M D'.split(' ')
  , paddedTokens = 'M D w'.split(' ')

  , formatTokenFunctions =
    { jM: function () {
        return this.jMonth() + 1
      }
    , jMMM: function (format) {
        return this.localeData().jMonthsShort(this, format)
      }
    , jMMMM: function (format) {
        return this.localeData().jMonths(this, format)
      }
    , jD: function () {
        return this.jDate()
      }
    , jDDD: function () {
        return this.jDayOfYear()
      }
    , jw: function () {
        return this.jWeek()
      }
    , jYY: function () {
        return leftZeroFill(this.jYear() % 100, 2)
      }
    , jYYYY: function () {
        return leftZeroFill(this.jYear(), 4)
      }
    , jYYYYY: function () {
        return leftZeroFill(this.jYear(), 5)
      }
    , jgg: function () {
        return leftZeroFill(this.jWeekYear() % 100, 2)
      }
    , jgggg: function () {
        return this.jWeekYear()
      }
    , jggggg: function () {
        return leftZeroFill(this.jWeekYear(), 5)
      }
    }

function padToken(func, count) {
  return function (a) {
    return leftZeroFill(func.call(this, a), count)
  }
}
function ordinalizeToken(func, period) {
  return function (a) {
    return this.localeData().ordinal(func.call(this, a), period)
  }
}

(function () {
  var i
  while (ordinalizeTokens.length) {
    i = ordinalizeTokens.pop()
    formatTokenFunctions['j' + i + 'o'] = ordinalizeToken(formatTokenFunctions['j' + i], i)
  }
  while (paddedTokens.length) {
    i = paddedTokens.pop()
    formatTokenFunctions['j' + i + i] = padToken(formatTokenFunctions['j' + i], 2)
  }
  formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3)
}())

/************************************
    Helpers
************************************/

function extend(a, b) {
  var key
  for (key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key]
  return a
}

function leftZeroFill(number, targetLength) {
  var output = number + ''
  while (output.length < targetLength)
    output = '0' + output
  return output
}

function isArray(input) {
  return Object.prototype.toString.call(input) === '[object Array]'
}

// function compareArrays(array1, array2) {
//   var len = Math.min(array1.length, array2.length)
//     , lengthDiff = Math.abs(array1.length - array2.length)
//     , diffs = 0
//     , i
//   for (i = 0; i < len; i += 1)
//     if (~~array1[i] !== ~~array2[i])
//       diffs += 1
//   return diffs + lengthDiff
// }

function normalizeUnits(units) {
  if (units) {
    var lowered = units.toLowerCase()
    units = unitAliases[lowered] || lowered
  }
  return units
}

function setDate(m, year, month, date) {
  var d = m._d
  if (m._isUTC) {
    /*eslint-disable new-cap*/
    m._d = new Date(Date.UTC(year, month, date,
        d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
    /*eslint-enable new-cap*/
  } else {
    m._d = new Date(year, month, date,
        d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())
  }
}

function objectCreate(parent) {
  function F() {}
  F.prototype = parent
  return new F()
}

function getPrototypeOf(object) {
  if (Object.getPrototypeOf)
    return Object.getPrototypeOf(object)
  else if (''.__proto__)
    return object.__proto__
  else
    return object.constructor.prototype
}

/************************************
    Languages
************************************/
extend(getPrototypeOf(moment.localeData()),
  { _jMonths: [ 'Farvardin'
              , 'Ordibehesht'
              , 'Khordaad'
              , 'Tir'
              , 'Amordaad'
              , 'Shahrivar'
              , 'Mehr'
              , 'Aabaan'
              , 'Aazar'
              , 'Dey'
              , 'Bahman'
              , 'Esfand'
              ]
  , jMonths: function (m) {
      return this._jMonths[m.jMonth()]
    }

  , _jMonthsShort:  [ 'Far'
                    , 'Ord'
                    , 'Kho'
                    , 'Tir'
                    , 'Amo'
                    , 'Sha'
                    , 'Meh'
                    , 'Aab'
                    , 'Aaz'
                    , 'Dey'
                    , 'Bah'
                    , 'Esf'
                    ]
  , jMonthsShort: function (m) {
      return this._jMonthsShort[m.jMonth()]
    }

  , jMonthsParse: function (monthName) {
      var i
        , mom
        , regex
      if (!this._jMonthsParse)
        this._jMonthsParse = []
      for (i = 0; i < 12; i += 1) {
        // Make the regex if we don't have it already.
        if (!this._jMonthsParse[i]) {
          mom = jMoment([2000, (2 + i) % 12, 25])
          regex = '^' + this.jMonths(mom, '') + '|^' + this.jMonthsShort(mom, '')
          this._jMonthsParse[i] = new RegExp(regex.replace('.', ''), 'i')
        }
        // Test the regex.
        if (this._jMonthsParse[i].test(monthName))
          return i
      }
    }
  }
)

/************************************
    Formatting
************************************/

function makeFormatFunction(format) {
  var array = format.match(formattingTokens)
    , length = array.length
    , i

  for (i = 0; i < length; i += 1)
    if (formatTokenFunctions[array[i]])
      array[i] = formatTokenFunctions[array[i]]

  return function (mom) {
    var output = ''
    for (i = 0; i < length; i += 1)
      output += array[i] instanceof Function ? '[' + array[i].call(mom, format) + ']' : array[i]
    return output
  }
}

/************************************
    Parsing
************************************/

function getParseRegexForToken(token, config) {
  switch (token) {
  case 'jDDDD':
    return parseTokenThreeDigits
  case 'jYYYY':
    return parseTokenFourDigits
  case 'jYYYYY':
    return parseTokenSixDigits
  case 'jDDD':
    return parseTokenOneToThreeDigits
  case 'jMMM':
  case 'jMMMM':
    return parseTokenWord
  case 'jMM':
  case 'jDD':
  case 'jYY':
  case 'jM':
  case 'jD':
    return parseTokenOneOrTwoDigits
  case 'DDDD':
    return parseTokenThreeDigits
  case 'YYYY':
    return parseTokenFourDigits
  case 'YYYYY':
    return parseTokenSixDigits
  case 'S':
  case 'SS':
  case 'SSS':
  case 'DDD':
    return parseTokenOneToThreeDigits
  case 'MMM':
  case 'MMMM':
  case 'dd':
  case 'ddd':
  case 'dddd':
    return parseTokenWord
  case 'a':
  case 'A':
    return moment.localeData(config._l)._meridiemParse
  case 'X':
    return parseTokenTimestampMs
  case 'Z':
  case 'ZZ':
    return parseTokenTimezone
  case 'T':
    return parseTokenT
  case 'MM':
  case 'DD':
  case 'YY':
  case 'HH':
  case 'hh':
  case 'mm':
  case 'ss':
  case 'M':
  case 'D':
  case 'd':
  case 'H':
  case 'h':
  case 'm':
  case 's':
    return parseTokenOneOrTwoDigits
  default:
    return new RegExp(token.replace('\\', ''))
  }
}

function addTimeToArrayFromToken(token, input, config) {
  var a
    , datePartArray = config._a

  switch (token) {
  case 'jM':
  case 'jMM':
    datePartArray[1] = input == null ? 0 : ~~input - 1
    break
  case 'jMMM':
  case 'jMMMM':
    a = moment.localeData(config._l).jMonthsParse(input)
    if (a != null)
      datePartArray[1] = a
    else
      config._isValid = false
    break
  case 'jD':
  case 'jDD':
  case 'jDDD':
  case 'jDDDD':
    if (input != null)
      datePartArray[2] = ~~input
    break
  case 'jYY':
    datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400)
    break
  case 'jYYYY':
  case 'jYYYYY':
    datePartArray[0] = ~~input
  }
  if (input == null)
    config._isValid = false
}

function dateFromArray(config) {
  var g
    , j
    , jy = config._a[0]
    , jm = config._a[1]
    , jd = config._a[2]

  if ((jy == null) && (jm == null) && (jd == null))
    return [0, 0, 1]
  jy = jy != null ? jy : 0
  jm = jm != null ? jm : 0
  jd = jd != null ? jd : 1
  if (jd < 1 || jd > jMoment.jDaysInMonth(jy, jm) || jm < 0 || jm > 11)
    config._isValid = false
  g = toGregorian(jy, jm, jd)
  j = toJalaali(g.gy, g.gm, g.gd)
  config._jDiff = 0
  if (~~j.jy !== jy)
    config._jDiff += 1
  if (~~j.jm !== jm)
    config._jDiff += 1
  if (~~j.jd !== jd)
    config._jDiff += 1
  return [g.gy, g.gm, g.gd]
}

function makeDateFromStringAndFormat(config) {
  var tokens = config._f.match(formattingTokens)
    , string = config._i + ''
    , len = tokens.length
    , i
    , token
    , parsedInput

  config._a = []

  for (i = 0; i < len; i += 1) {
    token = tokens[i]
    parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0]
    if (parsedInput)
      string = string.slice(string.indexOf(parsedInput) + parsedInput.length)
    if (formatTokenFunctions[token])
      addTimeToArrayFromToken(token, parsedInput, config)
  }
  if (string)
    config._il = string
  return dateFromArray(config)
}

function makeDateFromStringAndArray(config, utc) {
  var len = config._f.length
    , i
    , format
    , tempMoment
    , bestMoment
    , currentScore
    , scoreToBeat

  if (len === 0) {
    return makeMoment(new Date(NaN))
  }

  for (i = 0; i < len; i += 1) {
    format = config._f[i]
    currentScore = 0
    tempMoment = makeMoment(config._i, format, config._l, config._strict, utc)

    if (!tempMoment.isValid()) continue

    // currentScore = compareArrays(tempMoment._a, tempMoment.toArray())
    currentScore += tempMoment._jDiff
    if (tempMoment._il)
      currentScore += tempMoment._il.length
    if (scoreToBeat == null || currentScore < scoreToBeat) {
      scoreToBeat = currentScore
      bestMoment = tempMoment
    }
  }

  return bestMoment
}

function removeParsedTokens(config) {
  var string = config._i + ''
    , input = ''
    , format = ''
    , array = config._f.match(formattingTokens)
    , len = array.length
    , i
    , match
    , parsed

  for (i = 0; i < len; i += 1) {
    match = array[i]
    parsed = (getParseRegexForToken(match, config).exec(string) || [])[0]
    if (parsed)
      string = string.slice(string.indexOf(parsed) + parsed.length)
    if (!(formatTokenFunctions[match] instanceof Function)) {
      format += match
      if (parsed)
        input += parsed
    }
  }
  config._i = input
  config._f = format
}

/************************************
    Week of Year
************************************/

function jWeekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
  var end = firstDayOfWeekOfYear - firstDayOfWeek
    , daysToDayOfWeek = firstDayOfWeekOfYear - mom.day()
    , adjustedMoment

  if (daysToDayOfWeek > end) {
    daysToDayOfWeek -= 7
  }
  if (daysToDayOfWeek < end - 7) {
    daysToDayOfWeek += 7
  }
  adjustedMoment = jMoment(mom).add(daysToDayOfWeek, 'd')
  return  { week: Math.ceil(adjustedMoment.jDayOfYear() / 7)
          , year: adjustedMoment.jYear()
          }
}

/************************************
    Top Level Functions
************************************/

function makeMoment(input, format, lang, strict, utc) {
  if (typeof lang === 'boolean') {
    utc = strict
    strict = lang
    lang = undefined
  }

  if (format && typeof format === 'string')
    format = fixFormat(format, moment)

  var config =
      { _i: input
      , _f: format
      , _l: lang
      , _strict: strict
      , _isUTC: utc
      }
    , date
    , m
    , jm
    , origInput = input
    , origFormat = format
  if (format) {
    if (isArray(format)) {
      return makeDateFromStringAndArray(config, utc)
    } else {
      date = makeDateFromStringAndFormat(config)
      removeParsedTokens(config)
      format = 'YYYY-MM-DD-' + config._f
      input = leftZeroFill(date[0], 4) + '-'
            + leftZeroFill(date[1] + 1, 2) + '-'
            + leftZeroFill(date[2], 2) + '-'
            + config._i
    }
  }
  if (utc)
    m = moment.utc(input, format, lang, strict)
  else
    m = moment(input, format, lang, strict)
  if (config._isValid === false)
    m._isValid = false
  m._jDiff = config._jDiff || 0
  jm = objectCreate(jMoment.fn)
  extend(jm, m)
  if (strict && jm.isValid()) {
    jm._isValid = jm.format(origFormat) === origInput
  }
  return jm
}

function jMoment(input, format, lang, strict) {
  return makeMoment(input, format, lang, strict, false)
}

extend(jMoment, moment)
jMoment.fn = objectCreate(moment.fn)

jMoment.utc = function (input, format, lang, strict) {
  return makeMoment(input, format, lang, strict, true)
}

jMoment.unix = function (input) {
  return makeMoment(input * 1000)
}

/************************************
    jMoment Prototype
************************************/

function fixFormat(format, _moment) {
  var i = 5
  var replace = function (input) {
    return _moment.localeData().longDateFormat(input) || input
  }
  while (i > 0 && localFormattingTokens.test(format)) {
    i -= 1
    format = format.replace(localFormattingTokens, replace)
  }
  return format
}

jMoment.fn.format = function (format) {

  if (format) {
    format = fixFormat(format, this)

    if (!formatFunctions[format]) {
      formatFunctions[format] = makeFormatFunction(format)
    }
    format = formatFunctions[format](this)
  }
  return moment.fn.format.call(this, format)
}

jMoment.fn.jYear = function (input) {
  var lastDay
    , j
    , g
  if (typeof input === 'number') {
    j = toJalaali(this.year(), this.month(), this.date())
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(input, j.jm))
    g = toGregorian(input, j.jm, lastDay)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jy
  }
}

jMoment.fn.jMonth = function (input) {
  var lastDay
    , j
    , g
  if (input != null) {
    if (typeof input === 'string') {
      input = this.lang().jMonthsParse(input)
      if (typeof input !== 'number')
        return this
    }
    j = toJalaali(this.year(), this.month(), this.date())
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(j.jy, input))
    this.jYear(j.jy + div(input, 12))
    input = mod(input, 12)
    if (input < 0) {
      input += 12
      this.jYear(this.jYear() - 1)
    }
    g = toGregorian(this.jYear(), input, lastDay)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jm
  }
}

jMoment.fn.jDate = function (input) {
  var j
    , g
  if (typeof input === 'number') {
    j = toJalaali(this.year(), this.month(), this.date())
    g = toGregorian(j.jy, j.jm, input)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jd
  }
}

jMoment.fn.jDayOfYear = function (input) {
  var dayOfYear = Math.round((jMoment(this).startOf('day') - jMoment(this).startOf('jYear')) / 864e5) + 1
  return input == null ? dayOfYear : this.add(input - dayOfYear, 'd')
}

jMoment.fn.jWeek = function (input) {
  var week = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).week
  return input == null ? week : this.add((input - week) * 7, 'd')
}

jMoment.fn.jWeekYear = function (input) {
  var year = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year
  return input == null ? year : this.add(input - year, 'y')
}

jMoment.fn.add = function (val, units) {
  var temp
  if (units !== null && !isNaN(+units)) {
    temp = val
    val = units
    units = temp
  }
  units = normalizeUnits(units)
  if (units === 'jyear') {
    this.jYear(this.jYear() + val)
  } else if (units === 'jmonth') {
    this.jMonth(this.jMonth() + val)
  } else {
    moment.fn.add.call(this, val, units)
  }
  return this
}

jMoment.fn.subtract = function (val, units) {
  var temp
  if (units !== null && !isNaN(+units)) {
    temp = val
    val = units
    units = temp
  }
  units = normalizeUnits(units)
  if (units === 'jyear') {
    this.jYear(this.jYear() - val)
  } else if (units === 'jmonth') {
    this.jMonth(this.jMonth() - val)
  } else {
    moment.fn.subtract.call(this, val, units)
  }
  return this
}

jMoment.fn.startOf = function (units) {
  units = normalizeUnits(units)
  if (units === 'jyear' || units === 'jmonth') {
    if (units === 'jyear') {
      this.jMonth(0)
    }
    this.jDate(1)
    this.hours(0)
    this.minutes(0)
    this.seconds(0)
    this.milliseconds(0)
    return this
  } else {
    return moment.fn.startOf.call(this, units)
  }
}

jMoment.fn.endOf = function (units) {
  units = normalizeUnits(units)
  if (units === undefined || units === 'milisecond') {
    return this
  }
  return this.startOf(units).add(1, (units === 'isoweek' ? 'week' : units)).subtract(1, 'ms')
}

jMoment.fn.isSame = function (other, units) {
  units = normalizeUnits(units)
  if (units === 'jyear' || units === 'jmonth') {
    return moment.fn.isSame.call(this.startOf(units), other.startOf(units))
  }
  return moment.fn.isSame.call(this, other, units)
}

jMoment.fn.clone = function () {
  return jMoment(this)
}

jMoment.fn.jYears = jMoment.fn.jYear
jMoment.fn.jMonths = jMoment.fn.jMonth
jMoment.fn.jDates = jMoment.fn.jDate
jMoment.fn.jWeeks = jMoment.fn.jWeek

/************************************
    jMoment Statics
************************************/

jMoment.jDaysInMonth = function (year, month) {
  year += div(month, 12)
  month = mod(month, 12)
  if (month < 0) {
    month += 12
    year -= 1
  }
  if (month < 6) {
    return 31
  } else if (month < 11) {
    return 30
  } else if (jMoment.jIsLeapYear(year)) {
    return 30
  } else {
    return 29
  }
}

jMoment.jIsLeapYear = jalaali.isLeapJalaaliYear

jMoment.loadPersian = function (args) {
  var usePersianDigits =  args !== undefined && args.hasOwnProperty('usePersianDigits') ? args.usePersianDigits : false
  var dialect =  args !== undefined && args.hasOwnProperty('dialect') ? args.dialect : 'persian'
  moment.locale('fa')
  moment.updateLocale('fa'
  , { months: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_')
    , monthsShort: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_')
    , weekdays:
      {
        'persian': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_'),
        'persian-modern': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه').split('_')
      }[dialect]
    , weekdaysShort:
      {
        'persian': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_'),
        'persian-modern': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه').split('_')
      }[dialect]
    , weekdaysMin:
      {
        'persian': 'ی_د_س_چ_پ_آ_ش'.split('_'),
        'persian-modern': 'ی_د_س_چ_پ_ج_ش'.split('_')
      }[dialect]
    , longDateFormat:
      { LT: 'HH:mm'
      , L: 'jYYYY/jMM/jDD'
      , LL: 'jD jMMMM jYYYY'
      , LLL: 'jD jMMMM jYYYY LT'
      , LLLL: 'dddd، jD jMMMM jYYYY LT'
      }
    , calendar:
      { sameDay: '[امروز ساعت] LT'
      , nextDay: '[فردا ساعت] LT'
      , nextWeek: 'dddd [ساعت] LT'
      , lastDay: '[دیروز ساعت] LT'
      , lastWeek: 'dddd [ی پیش ساعت] LT'
      , sameElse: 'L'
      }
    , relativeTime:
      { future: 'در %s'
      , past: '%s پیش'
      , s: 'چند ثانیه'
      , m: '1 دقیقه'
      , mm: '%d دقیقه'
      , h: '1 ساعت'
      , hh: '%d ساعت'
      , d: '1 روز'
      , dd: '%d روز'
      , M: '1 ماه'
      , MM: '%d ماه'
      , y: '1 سال'
      , yy: '%d سال'
      }
    , preparse: function (string) {
        if (usePersianDigits) {
          return string.replace(/[۰-۹]/g, function (match) {
            return numberMap[match]
          }).replace(/،/g, ',')
        }
        return string
    }
    , postformat: function (string) {
        if (usePersianDigits) {
          return string.replace(/\d/g, function (match) {
            return symbolMap[match]
          }).replace(/,/g, '،')
        }
        return string
    }
    , ordinal: '%dم'
    , week:
      { dow: 6 // Saturday is the first day of the week.
      , doy: 12 // The week that contains Jan 1st is the first week of the year.
      }
    , meridiem: function (hour) {
        return hour < 12 ? 'ق.ظ' : 'ب.ظ'
      }
    , jMonths:
      {
        'persian': ('فروردین_اردیبهشت_خرداد_تیر_امرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_'),
        'persian-modern': ('فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_')
      }[dialect]
    , jMonthsShort:
      {
        'persian': 'فرو_ارد_خرد_تیر_امر_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_'),
        'persian-modern': 'فرو_ارد_خرد_تیر_مرد_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_')
      }[dialect]
    }
  )
}

jMoment.jConvert =  { toJalaali: toJalaali
                    , toGregorian: toGregorian
                    }

/************************************
    Jalaali Conversion
************************************/

function toJalaali(gy, gm, gd) {
  var j = jalaali.toJalaali(gy, gm + 1, gd)
  j.jm -= 1
  return j
}

function toGregorian(jy, jm, jd) {
  var g = jalaali.toGregorian(jy, jm + 1, jd)
  g.gm -= 1
  return g
}

/*
  Utility helper functions.
*/

function div(a, b) {
  return ~~(a / b)
}

function mod(a, b) {
  return a - ~~(a / b) * b
}
});

if (typeof exports == "object") {
  module.exports = require("moment-jalaali");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("moment-jalaali"); });
} else {
  this["moment"] = require("moment-jalaali");
}
})();

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc action-group
@name User
@description Global user menu

There are several registred menu in the $actions service. Modules can contribute
to the dashbord by addin action into it.

- mb.user : All action related to the current user
- mb.toolbar.menu : All action related to the toolbar menu
- navigationPathMenu: All items related to navigation.

 */
var mbApplicationModule = angular
	.module('mblowfish-core', [ //
		//	Angular
		'ngMaterial',
		'ngAnimate',
		'ngCookies',
		'ngSanitize', //
		//	Seen
		'seen-core',
		'seen-user',
		'seen-tenant',
		'seen-supertenant',
		'seen-cms',
		'seen-monitor',
		'seen-shop',
		'seen-sdp',
		'seen-seo',
		//	AM-WB
		'am-wb-core',
		//	Others
		'lfNgMdFileInput', // https://github.com/shuyu/angular-material-fileinput
		'vcRecaptcha', //https://github.com/VividCortex/angular-recaptcha
		'ng-appcache',//
		'ngFileSaver',//
		'mdSteppers',//
		'angular-material-persian-datepicker',
		'mdColorPicker',
	])
	.config(function($mdThemingProvider) {
		// Dark theme
		$mdThemingProvider
			.theme('dark')//
			.primaryPalette('grey', {
				'default': '900',
				'hue-1': '700',
				'hue-2': '600',
				'hue-3': '500'
			})//
			.accentPalette('grey', {
				'default': '700'
			})//
			.warnPalette('red')
			.backgroundPalette('grey')
			.dark();

		$mdThemingProvider.alwaysWatchTheme(true);
	})
	.run(function instantiateRoute($widget, $mbRouteParams, $injector, $window, $mbEditor) {
		$widget.setProvider('$mbRouteParams', $mbRouteParams);

		$mbEditor.registerEditor('/ui/notfound/:path*', {
			template: '<h1>Not found</h1>'
		});

		var extensions = $window.mblowfish.extensions;
		$window.mblowfish.extensions = [];

		/**
		 * Enable an extionsion
		 */
		$window.mblowfish.addExtension = function(loader) {
			$window.mblowfish.extensions.push(loader);
			$injector.invoke(loader);
		};

		angular.forEach(extensions, function(ext) {
			$window.mblowfish.addExtension(ext);
		});
	});

/***************************************************************************
 * Mblowfish global service
 ***************************************************************************/
window.mblowfish = {
	extensions: [],
	addExtension: function(loader) {
		this.extensions.push(loader);
		return window.mblowfish;
	},



	//-------------------------------------------------------------
	// Module
	//-------------------------------------------------------------
	controller: function() {
		mbApplicationModule.controller.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	service: function() {
		mbApplicationModule.service.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	directive: function() {
		mbApplicationModule.directive.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	filter: function() {
		mbApplicationModule.filter.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	run: function() {
		mbApplicationModule.run.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	config: function() {
		mbApplicationModule.config.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	provider: function() {
		mbApplicationModule.provider.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	factory: function() {
		mbApplicationModule.factory.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	constant: function() {
		mbApplicationModule.constant.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},


	//-------------------------------------------------------------
	// Angular Map
	//-------------------------------------------------------------
	element: function() {
		angular.element.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	bootstrap: function(dom) {
		angular.bootstrap(dom, ['mblowfish-core'], {});
		return window.mblowfish;
	},
	loadModules: function(prefixKey) {
		var storage = storageSupported(window, 'localStorage');
		var moduleList = JSON.parse(storage.getItem(prefixKey + '.' + MODULE_STORAGE_KEY));
		var jobs = [];
		_.forEach(moduleList, function(module) {
			jobs.push(moduleLoad(module));
		});
		return jQuery.when.apply(jQuery, jobs);
	}
};


/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Services
@name $mbAccount
@description Mnages and follow the state fo current account.

The application can serve a singele accoutn at a time. 

This serivce is designe to follow the state of the current account.

Here is some commone functions:

- login
- logout
- getting account detaile
- change profile, account, email, ...
- check groups
- check rolses

# Expression-Based Access Control

Mblowfish Security introduced the ability to use expressions as an 
authorization mechanism in addition to the simple use of configuration attributes 
and access-decision voters which have seen before. 

Expression-based access control is built on the same architecture but allows complicated 
boolean logic to be encapsulated in a single expression.

MBlowfish Security uses AngularJS Expression for expression support and you should look at 
how that works if you are interested in understanding the topic in more depth. 
Expressions are evaluated with a “rootScope” as the evaluation context. 
Mblowfish Security uses specific classes for web and method security as the rootScope, in order to 
provide built-in expressions and access to values such as the current principal.

## Common Built-In Expressions

The base class for expression rootScope is $mbAccount. This provides some 
common expressions which are available in security.

- hasRole([role])
- hasAnyRole([role1,role2])
- principal: Allows direct access to the principal object representing the current user
- authentication: Allows direct access to the current Authentication object obtained from the SecurityContext
- permitAll: Always evaluates to true
- denyAll: Always evaluates to false
- isAnonymous()
- isRememberMe()
- isAuthenticated()
- isFullyAuthenticated()

For example, to add security into a view or editor:

	{
		url: '/view/url',
		...
		preAuthorize: 'isAuthenticated() && hasRole('account.manager')'
	}


 */
angular.module('mblowfish-core').provider('$mbAccount', function() {
	//---------------------------------------
	// Services
	//---------------------------------------
	var rolesToPermissions;
	var httpParamSerializerJQLike;

	var provider;
	var service;

	var rootScope;
	var http;
	var usr;
	var dispatcher;

	var Account;
	var Profile;
	var Group;
	var Role;

	//---------------------------------------
	// variables
	//---------------------------------------
	var USER_DETAIL_GRAPHQL = '{id, login, profiles{first_name, last_name, language, timezone}, roles{id, application, code_name}, groups{id, name, roles{id, application, code_name}}}';

	var ACCOUNT_STORE_NAME = '/user/account/current';
	var ACCOUNT_PROFILES_STORE_NAME = '/user/account/current';

	var STATE_INIT = 0;
	var STATE_LOGIN = 1;
	var STATE_ANONYMOUS = 2;
	var state;

	/*
	Force to remember the login
	*/
	var rememberMe = true;
	var exrpressionsEnabled = true;

	/*
	True if is authenticated at the current run
	 */
	var authenticated = false;

	var account;
	var roles;
	var groups;
	var permissions;
	var profile;
	var profiles;

	//---------------------------------------
	// functions
	//---------------------------------------

	function setExrpressionsEnabled(flag) {
		exrpressionsEnabled = flag;
		return provider;
	}

	function parsAccount(accountData) {
		var oldAccount = account;
		var oldProfiles = profiles;
		var oldProfile = profile;
		var oldGroups = groups;

		//>> Load profiles
		profiles = [];
		profile = undefined;
		if (angular.isArray(accountData.profiles)) {
			_.forEach(accountData.profiles, function(profileConfig) {
				profiles.push(new Profile(profileConfig))
			});
		}
		if (profiles[0]) {
			profile = profiles[0];
		}

		//>> Load rolses
		permissions = rolesToPermissions(accountData.roles || []);
		roles = [];
		_.forEach(accountData.roles, function(role) {
			roles[role.application + '_' + role.code_name] = new Role(role);
		});

		//>> Load groups
		var groups = {};
		_.forEach(accountData.groups, function(group) {
			groups[group.name] = new Group(group);
			_.assign(permissions, rolesToPermissions(group.roles || []));
		});


		//>> set account
		account = new Account(accountData);


		//>> Fire events
		if (exrpressionsEnabled) {
			updateRootScope();
		}
		var $event = {
			src: this,
			type: 'update',
		};
		dispatcher.dispatch(ACCOUNT_STORE_NAME, _.assign({}, $event, {
			value: account,
			oldValue: oldAccount
		}));
	}


	/**
	 Loads current user informations
	 
	 If there is a role x.y (where x is application code and y is code name)
	 in role list then the following var is added in user:
	 
	 @name reload
	 @memberof $mbAccount
	 */
	function reload() {
		return usr.getAccount('current', {
			graphql: USER_DETAIL_GRAPHQL
		}).then(parsAccount);
	}

	/**
	 Logins into the backend
	 
	 @memberof $mbAccount
	 @param {object} credential User and password of the user
	 */
	function login(credential) {
		return http({
			method: 'POST',
			url: '/api/v2/user/login',
			data: httpParamSerializerJQLike(credential),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(reload);
	}

	/**
	 Application logout
	 
	 Logout and clean user data, this will change state of the application.
	 
	 @memberof $mbAccount
	 */
	function logout() {
		if (state = STATE_ANONYMOUS) {
			return;
		}
		return http({
			method: 'POST',
			url: '/api/v2/user/logout',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(reload);
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getAccount() {
		return account;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getProfile() {
		return profile;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getProfiles() {
		return profiles;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getRoles() {
		return roles;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getGroups() {
		return groups;
	}

	/**
	Returns true if the current principal has the specified role.
	 */
	function hasRole(role) {
		return hasAnyRole(role);
	}

	/**
	Returns true if the current principal has any of the supplied roles (given as a comma-separated list of strings)
	
	 */
	function hasAnyRole() {
		for (var i = 0; i < arguments.length; i++) {
			if (permissions[arguments[i]]) {
				return true;
			}
		}
		return false;
	}

	/**
	Returns true if the current principal is an anonymous user
	
	@memberof $mbAccount
	 */
	function isAnonymous() {
		return !account || account.isAnonymous();
	}

	/**
	Returns true if the current principal is a remember-me user
	
	@memberof $mbAccount
	 */
	function isRememberMe() {
		return rememberMe;
	}

	/**
	Set remember me option enable
	
	@memberof $mbAccount
	 */
	function setRememberMe(flag) {
		rememberMe = flag;
		return provider;
	}

	/**
	Returns true if the user is not anonymous
	 */
	function isAuthenticated() {
		return account && !account.isAnonymous();
	}

	/**
	Returns true if the user is not an anonymous or a remember-me user
	 */
	function isFullyAuthenticated() {
		return authenticated && isAuthenticated();
	}


	function loadExpressions() {
		_.assign(rootScope, {
			isAnonymous: isAnonymous,
			hasRole: hasRole,
			hasAnyRole: hasAnyRole,
			principal: roles,
			authentication: account,
			permissions: permissions,
			permitAll: true,
			denyAll: false,
			isRememberMe: isRememberMe,
			isAuthenticated: isAuthenticated,
			isFullyAuthenticated: isFullyAuthenticated,
		});
	}

	/*
	Updates all global modules in root scope
	*/
	function updateRootScope() {
		_.assign(rootScope, {
			principal: roles,
			authentication: account,
			permissions: permissions,
		}, account);
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		STATE_INIT: STATE_INIT,
		STATE_LOGIN: STATE_LOGIN,
		STATE_ANONYMOUS: STATE_ANONYMOUS,
		login: login,
		logout: logout,
		isAnonymous: isAnonymous,
		hasRole: hasRole,
		hasAnyRole: hasAnyRole,
		isRememberMe: isRememberMe,
		isAuthenticated: isAuthenticated,
		isFullyAuthenticated: isFullyAuthenticated,
		getGroups: getGroups,
		getRoles: getRoles,
		getProfile: getProfile,
		getProfiles: getProfiles,
		getAccount: getAccount,
		reload: reload,
	};
	provider = {
		/* @ngInject */
		$get: function(
			$rootScope, $http, $usr, $dispatcher,
			$mbUtil, $httpParamSerializerJQLike,
			UserAccount, UserProfile, UserGroup, UserRole
		) {
			//>> Static methosd
			rolesToPermissions = $mbUtil.rolesToPermissions;
			httpParamSerializerJQLike = $httpParamSerializerJQLike;

			//>> Services
			rootScope = $rootScope;
			http = $http;
			usr = $usr;
			dispatcher = $dispatcher;

			Account = UserAccount;
			Profile = UserProfile;
			Group = UserGroup;
			Role = UserRole;

			//>> load the service
			if (exrpressionsEnabled) {
				loadExpressions();
			}
			return service;
		},
		setExrpressionsEnabled: setExrpressionsEnabled,
		setRememberMe: setRememberMe,
	};
	return provider;
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core').config(function($httpProvider) {
	// An interceptor to handle errors of server response
	// All that the interceptor does is in 'httpRequestInterceptor' factory.
	$httpProvider.interceptors.push('MbHttpRequestInterceptor');

	/*
	 * Disabling AngularJS $http cache
	 * @see https://stackoverflow.com/questions/38196452/disabling-angularjs-http-cache
	 */
	//initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}

	// Answer edited to include suggestions from comments
	// because previous version of code introduced browser-related errors

	//disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	// extra
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Services
@name $mbApplication
@description Application manager
	
The application service is responsible to:
	
- Loading Modules
- Loading Settings
- Loading locals
- Loading current user details
- Monitoring network state
- Monitoring current user state
	
These are required to load an applications.
*/
angular.module('mblowfish-core').provider('$mbApplication', function() {

	//-------------------------------------------------
	// Services
	//-------------------------------------------------
	var Job;
	var provider;
	var service;
	var q;
	var dispatcher;



	//-------------------------------------------------
	// Common jobs
	//-------------------------------------------------
	var loadSettingsJob = {
		title: 'Loading Application Settings',
		/* @ngInject */
		action: function($mbSettings) {
			return $mbSettings.load();
		}
	};

	var loadTenantSettings = {
		title: 'Loading Tenant Settings',
		/* @ngInject */
		action: function() {
			// XXX: maso, 2020: 
		}
	};

	var loadAccountDetail = {
		title: 'Loading Account Details',
		/* @ngInject */
		action: function($mbAccount) {
			return $mbAccount.reload();
		}
	};

	var forceAccountLogin = {
		title: 'Login',
		/* @ngInject */
		action: function(MbComponent, $rootElement, $mbAccount, $mbDispatcher) {
			loginComponent = new MbComponent(loginComponentConfig);
			function renderPanel() {
				element = angular.element('<mb-login-panel></mb-login-panel>');
				$rootElement.append(element);
				return loginComponent.render({
					$element: element,
				});
			}

			function destroy() {
				loginComponent.destroy();
			}

			$mbDispatcher.on('/account', function() {
				if ($mbAccount.isAnonymous()) {
					renderPanel();
				} else {
					destroy();
				}
			});

			if ($mbAccount.isAnonymous()) {
				return renderPanel();
			}
		}
	};

	var loadPreloadingContainer = {
		title: 'Load Preloading View',
		/* @ngInject */
		action: function(MbComponent, $rootElement) {
			element = angular.element('<mb-preloading-panel></mb-preloading-panel>');
			$rootElement.append(element);

			preloadingComponent = new MbComponent(preloadingComponentConfig);
			return preloadingComponent.render({
				$element: element
			});
		}
	};

	var removePreloadingContainer = {
		title: 'Remove Preloading View',
		/* @ngInject */
		action: function() {
			preloadingComponent.destroy();
		}
	};

	//-------------------------------------------------
	// Local Variables
	//-------------------------------------------------
	var key = 'mblowfish';
	var tenantRequired = false;
	var accountDetailRequired = false;
	var settingsRequired = true;
	var logingRequired = false;
	var loginComponentConfig = {
		templateUrl: 'views/mb-login-default.html',
		controller: 'MbAccountContainerCtrl',
		controllerAs: 'ctrl',
	};
	var loginComponent;
	var settinsRequired = true;

	var STATE_INIT = 'init';
	var STATE_READY = 'ready';
	var state;
	/*
	List of actions must be run on the specific state.
	*/
	var actions = {
		init: [],
		ready: []
	}

	var preloadingEnabled = false;
	var preloadingComponent;
	var preloadingComponentConfig = {
		templateUrl: 'views/mb-preloading-default.html',
		controller: 'MbApplicationPreloadingContainerCtrl',
		controllerAs: 'ctrl',
	};


	//---------------------------------------
	// Function
	//---------------------------------------
	function setKey(appkey) {
		key = appkey;
		return provider;
	}

	function getKey() {
		return key;
	}

	function setPreloadingEnabled(flag) {
		preloadingEnabled = flag;
		return provider;
	}

	function isPreloadingEnabled() {
		return preloadingEnabled;
	}

	function setPreloadingComponent(componentConfig) {
		preloadingComponentConfig = componentConfig;
		return provider;
	}

	function getPreloadingComponent() {
		return preloadingComponent;
	}

	function setLogingRequired(flag) {
		logingRequired = flag;
		return provider;
	}

	function isLoginRequired() {
		return logingRequired;
	}

	function setLoginComponent(componentConfig) {
		loginComponentConfig = componentConfig;
		return provider;
	}

	function setTenantRequired(flag) {
		tenantRequired = flag;
		return provider;
	}

	function isTenantRequired() {
		return tenantRequired;
	}

	function setAccountDetailRequired(flag) {
		accountDetailRequired = flag;
		return provider;
	}

	function isAccountDetailRequired() {
		return accountDetailRequired;
	}

	function setSettingsRequired(flag) {
		settingsRequired = flag;
		return provider;
	}

	function isSettingsRequired() {
		return settingsRequired;
	}

	function addAction(state, action) {
		actions[state].push(action);
		return provider;
	}


	/**
	 * Gets the state of the application
	 * 
	 * @memberof $mbApplication
	 */
	function getState() {
		return state;
	}

	/**
	 * Sets state of the service
	 * 
	 * NOTE: must be used locally
	 */
	function setState(newState) {
		var oldState = state;
		state = newState;

		var stateActions = actions[state];
		var jobs = [];

		//>> Loading extra jobs
		_.forEach(stateActions, function(actionConfig) {
			var job = new Job(actionConfig);
			jobs.push(job.schedule());
		});

		//>> fire state changed
		var $event = {
			type: 'update',
			value: state,
			oldValue: oldState
		};
		dispatcher.dispatch('/app/state', $event);

		//>> Waiting for all job to done
		return q.all(jobs);
	}

	function load() {
		//>> Loading common jobs
		if (preloadingEnabled) {
			addAction(STATE_INIT, loadPreloadingContainer);
			addAction(STATE_READY, removePreloadingContainer);
		}
		if (settinsRequired) {
			addAction(STATE_INIT, loadSettingsJob);
		}
		if (tenantRequired) {
			addAction(STATE_INIT, loadTenantSettings);
		}
		if (accountDetailRequired || logingRequired) {
			addAction(STATE_INIT, loadAccountDetail);
		}
		if (logingRequired) {
			addAction(STATE_READY, forceAccountLogin);
		}
		return setState(STATE_INIT)
			.finally(function() {
				return setState(STATE_READY);
			});
	}


	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		getKey: getKey,
		isPreloadingEnabled: isPreloadingEnabled,
		getPreloadingComponent: getPreloadingComponent,
		isLoginRequired: isLoginRequired,
		isTenantRequired: isTenantRequired,
		isAccountDetailRequired: isAccountDetailRequired,
		isSettingsRequired: isSettingsRequired,
		getState: getState,
	};
	provider = {
		$get: function($q, $mbSettings, MbJob, $dispatcher) {
			//>> Set services
			mbSettings = $mbSettings;
			q = $q;
			Job = MbJob;
			dispatcher = $dispatcher;

			//>> Load application
			load();

			//>> ENd
			return service;
		},
		setKey: setKey,
		addAction: addAction,
		setPreloadingEnabled: setPreloadingEnabled,
		setPreloadingComponent: setPreloadingComponent,
		setTenantRequired: setTenantRequired,
		setAccountDetailRequired: setAccountDetailRequired,
		setSettingsRequired: setSettingsRequired,
		setLogingRequired: setLogingRequired,
		setLoginComponent: setLoginComponent,
	};
	return provider;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**

Manages clipboard
 */
angular.module('mblowfish-core').service('$clipboard', function() {

	this.copyTo = function(model) {
        /*
         * TODO: Masood, 2019: There is also another solution but now it doesn't
         * work because of browsers problem A detailed solution is presented in:
         * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
         */
		var js = JSON.stringify(model);
		var fakeElement = document.createElement('textarea');
		fakeElement.value = js;
		document.body.appendChild(fakeElement);
		fakeElement.select();
		document.execCommand('copy');
		document.body.removeChild(fakeElement);
		return;
	};
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc Filters
 * @name wbmd5
 * @function
 * @description Hash the input
 * 
 * @example 
 ```html 
 <span>{{ 'text to hash' | wbmd5 }}</span> 
 ```
 */
angular.module('mblowfish-core').filter('wbmd5', function($mbCrypto) {
	return function(val) {
		return $mbCrypto.md5(val + '');
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Services
@name $mbCrypto
@description Crypto services


 */
angular.module('mblowfish-core').service('$mbCrypto', function() {

	function md5cycle(x, k) {
		var a = x[0], b = x[1], c = x[2], d = x[3];

		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17, 606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12, 1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7, 1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7, 1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22, 1236535329);

		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14, 643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9, 38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5, 568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20, 1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14, 1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);

		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16, 1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11, 1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4, 681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23, 76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16, 530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);

		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10, 1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6, 1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6, 1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21, 1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15, 718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);

		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);

	}

	function cmn(q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	}

	function ff(a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function gg(a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t) {
		return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function md51(s) {
		//        var txt = '';
		var n = s.length, state = [1732584193, -271733879,
			-1732584194, 271733878], i;
		for (i = 64; i <= s.length; i += 64) {
			md5cycle(state, md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0];
		for (i = 0; i < s.length; i++)
			tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
		tail[i >> 2] |= 0x80 << ((i % 4) << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i = 0; i < 16; i++)
				tail[i] = 0;
		}
		tail[14] = n * 8;
		md5cycle(state, tail);
		return state;
	}

	/*
	 * there needs to be support for Unicode here, unless we
	 * pretend that we can redefine the MD-5 algorithm for
	 * multi-byte characters (perhaps by adding every four
	 * 16-bit characters and shortening the sum to 32 bits).
	 * Otherwise I suggest performing MD-5 as if every
	 * character was two bytes--e.g., 0040 0025 = @%--but
	 * then how will an ordinary MD-5 sum be matched? There
	 * is no way to standardize text to something like UTF-8
	 * before transformation; speed cost is utterly
	 * prohibitive. The JavaScript standard itself needs to
	 * look at this: it should start providing access to
	 * strings as preformed UTF-8 8-bit unsigned value
	 * arrays.
	 */
	function md5blk(s) { /* I figured global was faster. */
		var md5blks = [], i;
		/*
		 * Andy King said do it this
		 * way.
		 */
		for (i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i)
				+ (s.charCodeAt(i + 1) << 8)
				+ (s.charCodeAt(i + 2) << 16)
				+ (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	}

	var hex_chr = '0123456789abcdef'.split('');

	function rhex(n) {
		var s = '', j = 0;
		for (; j < 4; j++)
			s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
				+ hex_chr[(n >> (j * 8)) & 0x0F];
		return s;
	}

	function hex(x) {
		for (var i = 0; i < x.length; i++)
			x[i] = rhex(x[i]);
		return x.join('');
	}

	function md5(s) {
		return hex(md51(s));
	}

	/*
	 * this function is much faster, so if possible we use
	 * it. Some IEs are the only ones I know of that need
	 * the idiotic second function, generated by an if
	 * clause.
	 */

	function add32(a, b) {
		return (a + b) & 0xFFFFFFFF;
	}

	/**! http://stackoverflow.com/a/2117523/377392 */
	var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
	this.uuid = function() {
		return fmt.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	this.md5 = md5;
	return this;
});




/**

@name DispatcherUtils

Dispatcher Utils is a set of basic utility classes to help get you started with Flux. These base classes are a solid foundation for a simple Flux application, but they are not a feature-complete framework that will handle all use cases. There are many other great Flux frameworks out there if these utilities do not fulfill your needs.

# Usage

There are three main factory exposed in Dispatcher Utils:

- Store
- ReduceStore
- Container

These base factories can be imported from dispatcher utils like this:

@example
import { ReduceStore } from 'flux/utils';
class CounterStore extends ReduceStore<number> {
  getInitialState(): number {
    return 0;
  }
  reduce(state: number, action: Object): number {
    switch (action.type) {
      case 'increment':
        return state + 1;

      case 'square':
        return state * state;

      default:
        return state;
    }
  }
}

# Best practices

There are some best practices we try to follow when using these factories:

## Stores

- Cache data
- Expose public getters to access data (never have public setters)
- Respond to specific actions from the dispatcher
- Always emit a change when their data changes
- Only emit changes during a dispatch

## Actions

Describe a user's action, are not setters. (e.g. select-page not set-page-id)

## Containers

- Are React components that control a view
- Primary job is to gather information from stores and save it in their state
- Have no props and no UI logic

#Views

- Are React components that are controlled by a container
- Have all of the UI and rendering logic
- Receive all information and callbacks as props

 */
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Services
@name $mbDispatcher
@description a wrapper of FLUX

Dispatcher is used to broadcast payloads to registered callbacks. This is
different from generic pub-sub systems in two ways: 

- Callbacks are not subscribed to particular events. Every payload is dispatched to every registered callback.
- Callbacks can be deferred in whole or part until other callbacks have been executed.

@tutorial core-flux-dispatcher-hypotheticalFligh
 */
angular.module('mblowfish-core').provider('$mbDispatcher', function() {

	//---------------------------------------
	// service
	//---------------------------------------
	var service;
	var provider;

	//---------------------------------------
	// variables
	//---------------------------------------
    /*
	List of all dispatcher
	*/
	var dispatchers = {};

	//---------------------------------------
	// Function
	//---------------------------------------
    /*
	Finds dispatcher for the type
	*/
	function getDispatcherFor(type) {
		if (!dispatchers[type]) {
			dispatchers[type] = new Flux.Dispatcher();
		}
		return dispatchers[type];
	}

    /**
	Registers a callback to be invoked with every dispatched payload. Returns
	a token that can be used with `waitFor()`.
	
	This payload is digested by both stores:
	
	@example 
	dispatchToken = $ispatcher.register('action.type', function(payload) { 
	 if (payload.actionType === 'country-update') { 
	     CountryStore.country = payload.selectedCountry; 
	 } 
	});
	
	@param callback function to add 
	@memberof $mbDispatcher
     */
	function on(type, callback) {
		return getDispatcherFor(type).register(callback);
	}

    /** 
	Removes a callback based on its token. 

	@memberof $mbDispatcher
     */
	function off(type, id) {
		return getDispatcherFor(type).unregister(id);
	}

    /**
	Waits for the callbacks specified to be invoked before continuing
	execution of the current callback. This method should only be used by a
	callback in response to a dispatched payload.

	@memberof $mbDispatcher
     */
	function waitFor(type, ids) {
		return getDispatcherFor(type).waitFor(ids);
	}

    /**
	Dispatches a payload to all registered callbacks.
	
	 Payload contains key and values. You may add extra values to the 
	payload.

	@memberof $mbDispatcher
     */
	function dispatch(type, payload) {
		return getDispatcherFor(type).dispatch(payload);
	};

    /**
	Is this Dispatcher currently dispatching.

	@memberof $mbDispatcher
     */
	function isDispatching(type) {
		return getDispatcherFor(type).isDispatching();
	};


	//---------------------------------------
	// end
	//---------------------------------------
	service = {
		on: on,
		off: off,
		waitFor: waitFor,
		dispatch: dispatch,
		isDispatching: isDispatching,
	};
	provider = {
		$get: function() {
			return service;
		}
	};
	return provider;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
@ngdoc Factories
@name MbEvent
@description An event item

Events are used to propagate signals to the application. It is based on $dispatcher. 

NOTE: All platform events (from mb or children) are instance of this factory.

 */
angular.module('mblowfish-core').factory('MbEvent', function() {

	/**
	Creates new instance of event
		
	@generator
	@memberof MbEvent
	@params {Objct} data To bind as initial data
	 */
	function mbEvent(data) {
		if (!angular.isDefined(data)) {
			data = {};
		}
		angular.extend(this, data);
	};

	mbEvent.prototype.getType = function() {
		return this.type || 'unknown';
	};

	mbEvent.prototype.getKey = function() {
		return this.key || 'unknown';
	};

	mbEvent.prototype.getValues = function() {
		return this.values || [];
	};

	mbEvent.prototype.isCreated = function() {
		return this.key === 'create';
	};

	mbEvent.prototype.isRead = function() {
		return this.key === 'read';
	};

	mbEvent.prototype.isUpdated = function() {
		return this.key === 'update';
	};

	mbEvent.prototype.isDeleted = function() {
		return this.key === 'delete';
	};

	return mbEvent;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 @ngdoc Factories
 @name MbJob
 @description A wrapper of Promise
 
 */
angular.module('mblowfish-core').factory('MbJob', function($mbJobs, $q, $injector, $mbCrypto) {

	STATE_WORKING = 'working';
	STATE_FAILED = 'failed';
	STATE_SUCCESS = 'success';

	function MbJob(configs) {
		_.assign(this, configs);
		this.id = $mbCrypto.uuid();
	};

	MbJob.prototype.then = function() {
		this.promise.then.apply(this.promise, arguments);
	};

	MbJob.prototype.finally = function() {
		this.promise.finally.apply(this.promise, arguments);
	};

	MbJob.prototype.catch = function() {
		this.promise.catch.apply(this.promise, arguments);
	};

	MbJob.prototype.schedule = function() {
		var job = this;
		$mbJobs.addJob(job);
		job.state = STATE_WORKING;
		return $q.when($injector.invoke(job.action, job))
			.then(function() {
				job.state = STATE_SUCCESS;
			}, function() {
				job.state = STATE_FAILED;
			})
			.finally(function() {
				$mbJobs.removeJob(job);
			});
	};

	MbJob.STATE_WORKING = STATE_WORKING;
	MbJob.STATE_FAILED = STATE_FAILED;
	MbJob.STATE_SUCCESS = STATE_SUCCESS;
	return MbJob;
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc Services
@name $mbJobs
@description manage jobs of widgets

Deprecated : use $window
 */
angular.module('mblowfish-core').provider('$mbJobs', function() {

	//---------------------------------------
	// services
	//---------------------------------------
	var provider;
	var service;
	var injector;

	//---------------------------------------
	// variables
	//---------------------------------------
	var jobs = {};

	//---------------------------------------
	// functions
	//---------------------------------------
	function addJob(job) {
		var Job = injector.get('MbJob');
		if (!(job instanceof Job)) {
			job = new Job(job);
			job.schedule();
		} else {
			jobs[job.id] = job;
		}
		return this;
	}

	function removeJob(job) {
		delete jobs[job.id];
	}

	function getJobs() {
		return jobs;
	}
	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		addJob: addJob,
		getJobs: getJobs,
		removeJob: removeJob,
	};
	provider = {
		$get: function($injector) {
			//>> init services
			injector = $injector;

			//>> return service
			return service;
		}
	};
	return provider;
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var STORE_LOCAL_PATH = '/app/local';

var SETTING_LOCAL_LANGUAGE = 'local.language';
var SETTING_LOCAL_DATEFORMAT = 'local.dateformat';
var SETTING_LOCAL_DATETIMEFORMAT = 'local.datetimeformat';
var SETTING_LOCAL_CURRENCY = 'local.currency';
var SETTING_LOCAL_DIRECTION = 'local.direction';
var SETTING_LOCAL_CALENDAR = 'local.calendar';
var SETTING_LOCAL_TIMEZONE = 'local.timezone';


/**
@ngdoc Services
@name $mbLocal
@description manage localization of widgets

Many variables create system local:

- language
- currency
- direction
- calendar
- date formate
- date time format
- timezone


## Common Built-In Expressions

The base class for expressions is $mbLocal. This provides some 
common expressions which are available in templates.

By default, built in expressions are enabled automatically. However you can
disable it in configuration:

	$mbLocalProvider
		.setExpressionsEnabled(false);

- isLanguage(lang): check if language is set
- isCurrency(currency): check if currency is set
- isCalendar(calendar): checks if the callender is set
- isRtl : true if the direction is set right to left
- isLtr : true if the direction is set left to right

For example, to add security into a view or editor:

@example
	<div ng-show="!isRtl && isLanguage('fa')">Direction must be RTL for current language</div>
 */
mblowfish.provider('$mbLocal', function() {

	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;

	var rootScope;
	var mbStorage;
	var mbDispatcher;
	var mdDateLocale;
	var mbTranslate;

	//---------------------------------------
	// variables
	//---------------------------------------
	var defaultCalendar = 'en';
	var defaultCurrency = 'USD';
	var defaultDateFormat = 'jYYYY-jMM-jDD';
	var defaultDateTimeFormat = 'jYYYY-jMM-jDD hh:mm:ss';
	var defaultDirection = 'ltr';
	var defaultLanguage = 'en';
	var defaultTimezone = 'UTC';

	var dateFormat;
	var dateTimeFormat;
	var language;
	var currency;
	var direction;
	var calendar;
	var timezone;

	var autoSave = true;
	var exrpressionsEnabled = true;


	//---------------------------------------
	// functions
	//---------------------------------------

	function formatDateInternal(inputDate, format) {
		if (!inputDate) {
			return '';
		}
		try {
			if (calendar !== 'Jalaali') {
				format = format.replace('j', '');
			}
			return moment
				.utc(inputDate)
				.local()
				.format(format);
		} catch (ex) {
			return 'Bad date format:' + ex.message;
		}
	}
	/**
	 Formats the input date based on the format
	 
	 NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 
	 @params data {String | Date} to format
	 @params format {String} of the output
	 @memberof $mbLocal
	 */
	function formatDate(inputDate, format) {
		return formatDateInternal(inputDate, format || dateFormat || defaultDateFormat);
	}


	function setDateFormat(newDateFormat) {
		//>> change
		dateFormat = newDateFormat;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'dateFormat',
			values: [newDateFormat]
		});

		return service;
	}


	function getDateFormat() {
		return dateFormat;
	}

	/**
	 Formats the input date based on the format
	 
	 NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 
	 @params data {String | Date} to format
	 @params format {String} of the output
	 @memberof $mbLocal
	 */
	function formatDateTime(inputDate, format) {
		return formatDateInternal(inputDate, format || dateTimeFormat || defaultDateTimeFormat);
	}

	function setDateTimeFormat(newDateTimeFormat) {
		//>> change
		dateTimeFormat = newDateTimeFormat;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'dateTimeFormat',
			values: [newDateTimeFormat]
		});

		return service;
	}

	function getDateTimeFormat() {
		return dateTimeFormat;
	}

	/**
	 Get currency of the system
	 
	 @return currency ISO code
	 @memberof $mbLocal
	 */
	function getCurrency() {
		return currency;
	}

	/**
	 Sets currency of the system
	 
	 @param currency {String} ISO code
	 @memberof $mbLocal
	 */
	function setCurrency(newCurrency) {
		//>> change
		currency = newCurrency;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'currency',
			values: [currency]
		});

		return service;
	}

	function setDirection(newDirection) {
		//>> change
		// update variables
		direction = newDirection;
		// update expressions
		if (exrpressionsEnabled) {
			rootScope.isRtl = direction === 'rtl';
			rootScope.isLtr = direction === 'ltr';
		}

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'direction',
			values: [direction]
		});

		return service;
	}

	function getDirection() {
		return direction;
	}

	/**
	 Sets language of the system
	 
	 @params language {String} ISO code
	 @memberof $mbLocal
	 */
	function setLanguage(lang) {
		language = lang;
		mbTranslate.use(lang);

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'language',
			values: [language]
		});

		return service;
	}

	/**
	 Get language of the system
	 
	 @return language ISO code
	 @memberof $mbLocal
	 */
	function getLanguage() {
		return language;
	}

	function setCalendar(key) {
		calendar = key;
		//>> Chnage date format
		// Change moment's locale so the 'L'-format is adjusted.
		// For example the 'L'-format is DD-MM-YYYY for Dutch
		moment.loadPersian();
		moment.locale(key);
		// Set month and week names for the general $mdDateLocale service
		var localeDate = moment.localeData();
		mdDateLocale.months = localeDate._months;
		mdDateLocale.shortMonths = localeDate._monthsShort;
		mdDateLocale.days = localeDate._weekdays;
		mdDateLocale.shortDays = localeDate._weekdaysMin;
		// Optionaly let the week start on the day as defined by moment's locale data
		mdDateLocale.firstDayOfWeek = localeDate._week.dow;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'calendar',
			values: [calendar]
		});

		return service;
	}

	function getCalendar() {
		return calendar;
	}


	function setTimezone(newTimezone) {
		timezone = newTimezone;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'timezone',
			values: [timezone]
		});

		return service;
	}

	function getTimezone() {
		return timezone;
	}

	function save() {
		mbStorage[SETTING_LOCAL_CALENDAR] = calendar;
		mbStorage[SETTING_LOCAL_CURRENCY] = currency;
		mbStorage[SETTING_LOCAL_DATEFORMAT] = dateFormat;
		mbStorage[SETTING_LOCAL_DATETIMEFORMAT] = dateTimeFormat;
		mbStorage[SETTING_LOCAL_DIRECTION] = direction;
		mbStorage[SETTING_LOCAL_LANGUAGE] = language;
		mbStorage[SETTING_LOCAL_TIMEZONE] = timezone;
	}

	function load() {
		setCalendar(mbStorage[SETTING_LOCAL_CALENDAR] || defaultCalendar);
		setCurrency(mbStorage[SETTING_LOCAL_CURRENCY] || defaultCurrency);
		setDateFormat(mbStorage[SETTING_LOCAL_DATEFORMAT] || defaultDateFormat);
		setDateTimeFormat(mbStorage[SETTING_LOCAL_DATETIMEFORMAT] || defaultDateTimeFormat);
		setDirection(mbStorage[SETTING_LOCAL_DIRECTION] || defaultDirection);
		setLanguage(mbStorage[SETTING_LOCAL_LANGUAGE] || defaultLanguage);
		setTimezone(mbStorage[SETTING_LOCAL_TIMEZONE] || defaultLanguage);

		if (exrpressionsEnabled) {
			rootScope.isLanguage = function(lang) {
				return lang === language;
			};
			rootScope.isCurrency = function(cur) {
				return currency == cur;
			};
			rootScope.isCalendar = function(cal) {
				return calendar = cal;
			};
			rootScope.isRtl = direction === 'rtl';
			rootScope.isLtr = direction === 'ltr';
		}
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		load: load,
		save: save,

		setCalendar: setCalendar,
		getCalendar: getCalendar,

		formatDate: formatDate,
		setDateFormat: setDateFormat,
		getDateFormat: getDateFormat,

		formatDateTime: formatDateTime,
		setDateTimeFormat: setDateTimeFormat,
		getDateTimeFormat: getDateTimeFormat,

		setLanguage: setLanguage,
		getLanguage: getLanguage,

		setCurrency: setCurrency,
		getCurrency: getCurrency,

		setDirection: setDirection,
		getDirection: getDirection,

		setTimezone: setTimezone,
		getTimezone: getTimezone,
	};

	provider = {
		$get: function($mbStorage, $mdDateLocale, $mbDispatcher, $rootScope, $mbTranslate) {
			mbStorage = $mbStorage;
			mdDateLocale = $mdDateLocale;
			mbDispatcher = $mbDispatcher;
			rootScope = $rootScope;
			mbTranslate = $mbTranslate;

			if (autoSave) {
				load();
			} else {
				setLanguage(defaultLanguage);
			}
			return service;
		},
		setDefaultLanguage: function(language) {
			defaultLanguage = language;
			return provider;
		},
		setDefaultCurrency: function(currency) {
			defaultCurrency = currency;
			return provider;
		},
		setDefaultDateFormat: function(dateFormat) {
			defaultDateFormat = dateFormat;
			return provider;
		},
		setDefaultDateTimeFomrat: function(dateTimeFormat) {
			defaultDateTimeFormat = dateTimeFormat;
			return provider;
		},
		setDefaultDirection: function(direction) {
			defaultDirection = direction;
			return provider;
		},
		setDefaultCalendar: function(calendar) {
			defaultCalendar = calendar;
			return provider;
		},
		setDefaultTimezone: function(timezone) {
			defaultTimezone = timezone;
			return provider;
		}
	};
	return provider;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Services
@name $mbLogger
@description Manage and translate all backend error and messages



 */
angular.module('mblowfish-core').service('$mbLogger', function() {

	/**
	 * Checks status, message and data of the error. If given form is not null,
	 * it set related values in $error of fields in the form. It also returns a
	 * general message to show to the user.
	 */
	this.errorMessage = function(error, form) {
		var message = null;
		if (error.status === 400 && form) { // Bad request
			message = 'Form is not valid. Fix errors and retry.';
			error.data.data.forEach(function(item) {
				form[item.name].$error = {};
				item.constraints.map(function(cons) {
					if (form[item.name]) {
						form[item.name].$error[cons.toLowerCase()] = true;
					}
				});
			});
		} else {
			message = error.data.message;
		}
		return message;
	}
	
	this.error = function(){};
	this.warn = function(){};
	this.debug = function(){};
	this.info = function(){};
	

	return this;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var MODULE_STORAGE_KEY = 'mbModules';
var MODULE_STORE_PATH = '/modules';

function moduleLoadLibrary(path) {
	var defer = jQuery.Deferred();
	var script = document.createElement('script');
	script.src = path;
	script.async = 1;
	script.onload = function() {
		defer.resolve();
	};
	script.onerror = function() {
		defer.reject({
			path: path,
			message: 'fail'
		});
	};
	document.getElementsByTagName('head')[0].appendChild(script);
	return defer;
}

/**
 * Loads a style
 * 
 * loads css 
 * 
 * @memberof NativeWindowWrapper
 * @path path of library
 * @return promise to load the library
 */
function moduleLoadStyle(path) {
	var defer = jQuery.Deferred();
	var style = document.createElement('link');
	style.setAttribute('rel', 'stylesheet');
	style.setAttribute('type', 'text/css');
	style.setAttribute('href', path);
	style.onload = function() {
		defer.resolve(path);
	};
	style.onerror = function() {
		defer.reject({
			path: path,
			message: 'fail'
		});
	};
	document.getElementsByTagName('head')[0].appendChild(style);
	return defer;
}

function moduleLoad(module) {
	var deferred;
	switch (module.type) {
		case 'js':
			deferred = moduleLoadLibrary(module.url);
			break;
		case 'css':
			deferred = moduleLoadStyle(module.url);
			break;
	}
	return deferred;
}


/**
 * Manages system moduels
 */
mblowfish.provider('$mbModules', function() {

	//------------------------------------------------------------------------------
	// Services
	//------------------------------------------------------------------------------

	var q;
	var window;
	var mbApplication;
	var mbDispatcher;
	var mbStorage;

	var provider;
	var service;

	//------------------------------------------------------------------------------
	// variables
	//------------------------------------------------------------------------------
	var modules = {};

	function addModule(module) {
		modules[module.url] = module;
		saveModules();
		//>> fire changes
		mbDispatcher.dispatch(MODULE_STORE_PATH, {
			type: 'create',
			items: [module]
		});
	}

	function removeModule(module) {
		delete modules[module.url];
		saveModules();
		//>> fire changes
		mbDispatcher.dispatch(MODULE_STORE_PATH, {
			type: 'delete',
			items: [module]
		});
	}

	function getModules() {
		return modules;
	}

	function saveModules() {
		//>> Save changes
		mbStorage.mbModules =_.cloneDeep(modules);
	}

	function load() {
		modules = mbStorage.mbModules || {};
	}

	//------------------------------------------------------------------------------
	// End
	//------------------------------------------------------------------------------

	service = {
		removeModule: removeModule,
		addModule: addModule,
		getModules: getModules,
	};
	provider = {
		/* @ngInject */
		$get: function(
			/* Angularjs */ $window, $q,
			/* am-wb     */ $mbApplication, $mbDispatcher, $mbStorage) {
			q = $q;
			window = $window;
			mbApplication = $mbApplication;
			mbDispatcher = $mbDispatcher;
			mbStorage = $mbStorage;

			load();

			return service;
		},
		enable: function(enable) {
			moduleEnable = enable;
		}
	};
	return provider;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
 * @ngdoc Factories
 * @name httpRequestInterceptor
 * @description An interceptor to handle the error 401 of http response
 * @see https://docs.angularjs.org/api/ng/service/$http#interceptors
 */
angular.module('mblowfish-core').factory('MbHttpRequestInterceptor', function($q, $injector) {
	var httpRequestInterceptor = function() { };
	httpRequestInterceptor.prototype.responseError = function(rejection) {
		var app = $injector.get('$mbApplication');
		// do something on error
		if (rejection.status === 401) {
			app.logout();
		}
		return $q.reject(rejection);
	};
	return httpRequestInterceptor;
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc Services
@name $mbPreferences
@description System setting manager

 */
angular.module('mblowfish-core').provider('$mbPreferences', function() {

	//-------------------------------------------------
	// Services
	//-------------------------------------------------
	var provider;
	var service;

	var location;


	//-------------------------------------------------
	// Variables
	//-------------------------------------------------
	var preferences = {};

	//-------------------------------------------------
	// Functions
	//-------------------------------------------------

	/**
	 * Lists all created pages.
	 * 
	 * @returns
	 */
	function getPages() {
		return preferences;
	}

	/**
	 * Gets a preference page
	 * 
	 * @memberof $mbPreferences
	 * @param id {string} Pereference page id
	 */
	function getPage(id) {
		return preferences[id];
	}


	/**
	 * Opens a setting page
	 * 
	 * @param page
	 * @returns
	 */
	function open(page) {
		return location.url('preferences/' + page.id);
	}

	/**
	 * Creates a new setting page.
	 * 
	 * @param page
	 * @returns
	 */
	function addPage(pageId, page) {
		page.id = pageId;
		preferences[pageId] = page;
		return service;
	}


	function init() {

	}

	//-------------------------------------------------
	// End
	//-------------------------------------------------
	service = {
		getPages: getPages,
		getPage: getPage,
		addPage: addPage,
		open: open
	};
	provider = {
		$get: function($location, $mbEditor) {
			location = $location;

			init();
			return service;
		},
		addPage: function(pageId, page) {
			page.id = pageId;
			preferences[pageId] = page;
			return provider;
		}
	};
	return provider;
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var RESOURCE_CHILDREN_AUNCHOR = 'wb-select-resource-children';

/**
@ngdoc Services
@name $mbResource
@description Resource management system

This is a service to get resources. 

 */
mblowfish.provider('$mbResource', function() {



	//--------------------------------------------------------
	// Services
	//--------------------------------------------------------
	var provider;
	var service;

	var rootScope;
	var mbDialog;



	//--------------------------------------------------------
	// variables
	//--------------------------------------------------------
	var resourcePages = {};




    /**
    Fetches a page.
    
    @param {string} pageId The id of the page
    @returns Related page.
     */
	function getPage(pageId) {
		return resourcePages[pageId];
	}

    /**
     * Adds new page.
     * 
     * @returns
     */
	function addPage(pageId, page) {
		page.id = pageId;
		resourcePages[pageId] = page;
		return provider;
	}

    /**
     * Finds and lists all pages.
     * 
     * @returns
     */
	function getPages(tag) {
		var pages = [];
		_.forEach(resourcePages, function(page) {
			if (angular.isArray(page.tags) && page.tags.includes(tag)) {
				pages.push(page);
			}
		});
		return pages;
	}

    /**
     * Get a resource 
     * 
     * - option.data: current value of the date
     * - option.style: style of the dialog (title, descritpion, image, ..)
     * 
     * @param tags
     * @returns
     */
	function get(tag, option) {
		if (!option) {
			option = {};
		}
		var pages = getPages(tag);
		var tmplUrl = pages.length > 1 ? 'views/dialogs/wb-select-resource.html' : 'views/dialogs/wb-select-resource-single-page.html';
		return mbDialog.show({
			controller: 'ResourceDialogCtrl',
			controllerAs: 'ctrl',
			templateUrl: tmplUrl,
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			fullscreen: true,
			multiple: true,
			locals: {
				$pages: pages,
				$style: option.$style || {
					title: tag
				},
				$value: option.$value || {}
			}
		});
	}

	function hasPageFor(tag) {
		var pages = getPages(tag);
		return pages.length > 0;
	}


	//--------------------------------------------------------
	// End
	//--------------------------------------------------------
	service = {
		get: get,
		hasPageFor: hasPageFor,
		getPage: getPage,
		getPages: getPages,
	};
	provider = {
		$get: function($mbDialog) {
			mbDialog = $mbDialog;
			return service;
		},
		addPage: addPage
	};
	return provider;
});





/**
@name ResourceDialogCtrl
@description
Manages resource dialog and allows internal containers to work.

@ngInject
 */
mblowfish.controller('ResourceDialogCtrl', function(
	$scope, $value, $element, $pages, $style,
	$mdDialog, MbContainer) {

	//-------------------------------------------------------------
	// Variables
	//-------------------------------------------------------------

	var value = angular.copy($value);
	var ctrl = this;
	var currentContainer;
	var currentPage;


	//-------------------------------------------------------------
	// functions
	//-------------------------------------------------------------
	function cancel() {
		return $mdDialog.cancel();
	}

	/**
	Answer the dialog
	
	If there is an answer function in the current page controller
	then the result of the answer function will be returned as 
	the main result.
	
	@memberof WbResourceCtrl
	 */
	function answer() {
		return $mdDialog.hide(value);
	}

	function getValue() {
		return value;
	}

	function setValue(newValue) {
		value = newValue;
		return this;
	}

	/**
	 * تنظیمات را به عنوان تنظیم‌های جاری سیستم لود می‌کند.
	 * 
	 * @returns
	 */
	function loadPage(page) {
		// 1- Find element
		var target = $element.find('#' + RESOURCE_CHILDREN_AUNCHOR);

		// 2- Clear childrens
		if (currentContainer) {
			currentContainer.destroy();
			target.empty();
		}

		currentPage = page;
		currentContainer = new MbContainer(page);
		return currentContainer.render({
			$element: target,
			$scope: $scope.$new(false),
			$style: $style,
			$value: value,
			$resource: ctrl,
			$keepRootElement: true, // Do not remove element
		});
	}

	function isPageVisible(page) {
		return page === currentPage;
	}

	//-------------------------------------------------------------
	// end
	//-------------------------------------------------------------
	_.assign(ctrl, {
		style: $style,
		pages: $pages,

		getValue: getValue,
		setValue: setValue,
		answer: answer,
		cancel: cancel,

		loadPage: loadPage,
		isPageVisible: isPageVisible,
	});

	if ($pages.length) {
		loadPage($pages[0]);
	}
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc service
@name $mbSelection
@description Default selection system.
 */
angular.module('mblowfish-core').service('$mbSelection', function() {
	var selection = [];

	this.addItem = function($item, $event) { };
	this.clearItems = function() { };
	this.getItems = function() { };
	this.isSelected = function() { };

	return this;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc service
@name $mbSettings
@description Default selection system.
 */
angular.module('mblowfish-core').provider('$mbSettings', function() {
	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;
	var rootScope;
	var mbStorage;

	//---------------------------------------
	// Variables
	//---------------------------------------
	var templateUrl = 'resources/settings-template.json';

	//---------------------------------------
	// functions
	//---------------------------------------
	/**
	Loads settings and get ready
	
	@memberof $mbSettings
	@returns {Promise} A promise to load settings
	 */
	function load() {

	}

	function setTemplateUrl(url) {
		templateUrl = url;
		return provider;
	}

	function getTemplateUrl() {
		return templateUrl;
	}


	function loadLocalData() {
		/*
		 * TODO: masood, 2018: The lines below is an alternative for lines above
		 * but not recommended.
		 * 
		 * TODO: 'key' of app should be used $mbStorage,.setPrefix(key);
		 */
		var settings = mbStorage.$default({
			dashboardModel: {}
		});
		return q.resolve(settings)
			.then(parsAppSettings);
	}

	function setAutosaveEnabled(flag) {
		setAutosave = flag;
		return provider;
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		load: load,
		getTemplateUrl: getTemplateUrl,
	};

	provider = {
		$get: function($rootScope, $mbStorage, $q) {
			rootScope = $rootScope;
			mbStorage = $mbStorage;
			q = $q;

			return service;
		},
		setTemplateUrl: setTemplateUrl,
		setAutosaveEnabled: setAutosaveEnabled,
	};
	return provider;
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc Services
 * @name $mbStorage
 * @description A service to work with storage of browser
 * 
 */
angular.module('mblowfish-core').provider('$mbStorage', function() {



	var storageKeyPrefix = 'ngStorage-';
	var serializer = angular.toJson;
	var deserializer = angular.fromJson;
	var storageType = 'localStorage';

	var providerWebStorage = storageSupported(window, storageType);


	return {

		setKeyPrefix: function(prefix) {
			if (typeof prefix !== 'string') {
				throw new TypeError('[mblowfish] - $mbStorage Provider.setKeyPrefix() expects a String.');
			}
			storageKeyPrefix = prefix;
		},


		setSerializer: function(s) {
			if (typeof s !== 'function') {
				throw new TypeError('[mblowfish] -  $mbStorage Provider.setSerializer expects a function.');
			}
			serializer = s;
		},

		setDeserializer: function(d) {
			if (typeof d !== 'function') {
				throw new TypeError('[ngStorage] -  $mbStorage Provider.setDeserializer expects a function.');
			}
			deserializer = d;
		},

		supported: function(type) {
			type = type || 'localStorage';
			return !!storageSupported(window, storageType);
		},

		// Note: This is not very elegant at all.
		get: function(key) {
			return providerWebStorage && deserializer(providerWebStorage.getItem(storageKeyPrefix + key));
		},

		// Note: This is not very elegant at all.
		set: function(key, value) {
			return providerWebStorage && providerWebStorage.setItem(storageKeyPrefix + key, serializer(value));
		},

		remove: function(key) {
			providerWebStorage && providerWebStorage.removeItem(storageKeyPrefix + key);
		},

		/* @ngInject */
		$get: function(
			$rootScope, $window, $log, $timeout, $document
		) {

			// The magic number 10 is used which only works for some keyPrefixes...
			// See https://github.com/gsklee/ngStorage/issues/137
			var prefixLength = storageKeyPrefix.length;
			var isSupported = storageSupported($window, storageType);

			// #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
			// Note: recheck mainly for testing (so we can use $window[storageType] rather than window[storageType])
			var webStorage = isSupported || ($log.warn('This browser does not support Web Storage!'), { setItem: angular.noop, getItem: angular.noop, removeItem: angular.noop });
			var $storage = {
				//				get: function(name) {
				//					return $storage[name];
				//				},
				//				put: function(name, value) {
				//					$storage[name] = value;
				//					return $storage;
				//				},
				//				remove: function(name) {
				//					delete $storage[name];
				//					return $storage;
				//				},
				//				has: function(name) {
				//					return ($localStorage[name] ? true : false);
				//				},
				$default: function(items) {
					for (var k in items) {
						angular.isDefined($storage[k]) || ($storage[k] = angular.copy(items[k]));
					}
					$storage.$sync();
					return $storage;
				},
				$reset: function(items) {
					for (var k in $storage) {
						'$' === k[0] || (delete $storage[k] && webStorage.removeItem(storageKeyPrefix + k));
					}
					return $storage.$default(items);
				},
				$sync: function() {
					for (var i = 0, l = webStorage.length, k; i < l; i++) {
						// #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
						(k = webStorage.key(i)) && storageKeyPrefix === k.slice(0, prefixLength) && ($storage[k.slice(prefixLength)] = deserializer(webStorage.getItem(k)));
					}
				},
				$apply: function() {
					var temp$storage;
					_debounce = null;
					if (!_.isEqual($storage, _last$storage)) {
						temp$storage = angular.copy(_last$storage);
						angular.forEach($storage, function(v, k) {
							if (angular.isDefined(v) && '$' !== k[0]) {
								webStorage.setItem(storageKeyPrefix + k, serializer(v));
								delete temp$storage[k];
							}
						});
						for (var k in temp$storage) {
							webStorage.removeItem(storageKeyPrefix + k);
						}
						_last$storage = angular.copy($storage);
					}
				},
				$supported: function() {
					return !!isSupported;
				}
			};
			var _last$storage;
			var _debounce;

			$storage.$sync();

			_last$storage = angular.copy($storage);

			$rootScope.$watch(function() {
				_debounce || (_debounce = $timeout($storage.$apply, 100, false));
			});

			// #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
			$window.addEventListener && $window.addEventListener('storage', function(event) {
				if (!event.key) {
					return;
				}
				// Reference doc.
				var doc = $document[0];
				if ((!doc.hasFocus || !doc.hasFocus()) && storageKeyPrefix === event.key.slice(0, prefixLength)) {
					event.newValue ? $storage[event.key.slice(prefixLength)] = deserializer(event.newValue) : delete $storage[event.key.slice(prefixLength)];
					_last$storage = angular.copy($storage);
					$rootScope.$apply();
				}
			});

			$window.addEventListener && $window.addEventListener('beforeunload', function() {
				$storage.$apply();
			});

			return $storage;
		}
	};
});



/*
Checks if the storage type is supported

types:

- local
- cockie


@returns {map} Storage to use in application

 */
function storageSupported($window, storageType) {
	// Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
	// when accessing window.localStorage. This happens before you try to do anything with it. Catch
	// that error and allow execution to continue.

	// fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
	// when "Block cookies": "Always block" is turned on
	var supported;
	try {
		supported = $window[storageType];
	} catch (err) {
		return;
	}
	// When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage and sessionStorage
	// is available, but trying to call .setItem throws an exception below:
	// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
	if (supported) {
		var key = '__' + Math.round(Math.random() * 1e7);
		try {
			supported.setItem(key, key);
			supported.removeItem(key, key);
		} catch (err) {
			return;
		}
	}
	return supported;
}


angular.module('mblowfish-core').provider('$mbTenant', function() {

	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;
	var rootScope;


	//---------------------------------------
	// variables
	//---------------------------------------
//	var TENANT_GRAPHQL = '{id,title,description,' +
//		'account' + USER_DETAIL_GRAPHQL +
//		'configurations{key,value}' +
//		'settings{key,value}' +
//		'}';


	//---------------------------------------
	// functions
	//---------------------------------------
	/*
	 * Stores app configuration on the back end
	 */
	function storeApplicationConfig() {
		if (!$rootScope.__account.permissions.tenant_owner) {
			return;
		}
		if (appConfigurationContent) { // content loaded
			return appConfigurationContent.uploadValue($rootScope.__app.configs);
		}
		// create content
		promise = $cms.putContent({
			name: $rootScope.__app.configs_key,
			mimetype: APP_CNF_MIMETYPE
		})
			.then(function(content) {
				appConfigurationContent = content;
				return appConfigurationContent.uploadValue($rootScope.__app.configs);
			});
	};

	/*
	 * Check a module to see if it is enable or not
	 */
	// TODO: Masood, 2019: Improve the function to check based on tenant setting
	function isEnable(moduleName) {
		return $rootScope.__tenant.domains[moduleName];
	}


	function parsTenantConfiguration(configs) {
		$rootScope.__tenant.configs = keyValueToMap(configs);
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__tenant.configs
		};
		$dispatcher.dispatch('/tenant/configs', $event);

		// load domains
		var domains = {};
		var regex = new RegExp('^module\.(.*)\.enable$', 'i');
		for (var i = 0; i < configs.length; i++) {
			var config = configs[i];
			var match = regex.exec(config.key);
			if (match) {
				var key = match[1].toLowerCase();
				domains[key] = parseBooleanValue(config.value);
			}
		}
		$rootScope.__tenant.domains = domains;
		// Flux: fire account change
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__tenant.domains
		};
		$dispatcher.dispatch('/tenant/domains', $event);
	}

	function parsTenantSettings(settings) {
		$rootScope.__tenant.settings = keyValueToMap(settings);
		$rootScope.__app.options = $rootScope.__tenant.settings;

		// Flux: fire setting change
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__account
		};
		$dispatcher.dispatch('/tenant/settings', $event);
	}



	//---------------------------------------
	// End
	//---------------------------------------
	service = {};
	provider = {
		$get: function() {
			return service;
		}
	};
	return provider;
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc Services
@name $mbTheming
@description Manages theme of an element

 */
angular.module('mblowfish-core').provider('$mbTheming', function() {
	var mdTheming;

	function applyTheme(element) {
		element.addClass('_mb');
		element.addClass('_md');
		mdTheming(element);
	}

	return {
		/* @ngInject */
		$get: function($mdTheming) {
			mdTheming = $mdTheming;
			return applyTheme;
		}
	};
})
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc Services
 * @name $mbUtil
 * @description utility in Mblowfish
 * 
 */
angular.module('mblowfish-core').service('$mbUtil', function() {

	/**
	 * Creates a shallow copy of an object, an array or a primitive.
	 *
	 * Assumes that there are no proto properties for objects.
	 */
	function shallowCopy(src, dst) {
		if (this.isArray(src)) {
			dst = dst || [];
			for (var i = 0, ii = src.length; i < ii; i++) {
				dst[i] = src[i];
			}
		} else if (this.isObject(src)) {
			dst = dst || {};
			for (var key in src) {
				if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
					dst[key] = src[key];
				}
			}
		}
		return dst || src;
	};



	function parseBooleanValue(value) {
		value = value.toLowerCase();
		switch (value) {
			case true:
			case 'true':
			case '1':
			case 'on':
			case 'yes':
				return true;
			default:
				return false;
		}
	}

	/*
	 * Bind list of roles to app data
	 */
	function rolesToPermissions(roles) {
		var permissions = [];
		for (var i = 0; i < roles.length; i++) {
			var role = roles[i];
			permissions[role.application + '_' + role.code_name] = true;
			permissions[role.application + '.' + role.code_name] = true;
		}
		return permissions;
	}

	function keyValueToMap(keyvals) {
		var map = [];
		for (var i = 0; i < keyvals.length; i++) {
			var keyval = keyvals[i];
			map[keyval.key] = keyval.value;
		}
		return map;
	}

	this.rolesToPermissions = rolesToPermissions;
	this.keyValueToMap = keyValueToMap;
	this.shallowCopy = shallowCopy;
	this.parseBooleanValue = parseBooleanValue;
	this.noop = angular.noop;
	this.isArray = angular.isArray;
	this.isObject = angular.isObject;
	this.isDefined = angular.isDefined;
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name compare-to
 * @description Compare two attributes.
 */
.directive('compareTo', function(){
	return {
		require: 'ngModel',
		scope: {
			otherModelValue: '=compareTo'
		},
		link: function(scope, element, attributes, ngModel){
			ngModel.$validators.compareTo = function(modelValue) {
				return modelValue === scope.otherModelValue;
			};

			scope.$watch('otherModelValue', function() {
				ngModel.$validate();
			});
		}
	};
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mb-badge
 * @description Display a badge on items
 * 
 */
.directive('mbBadge', function($mdTheming, $rootScope) {

	function __badge_toRGB(color){
		var split = (color || '').split('-');
		if (split.length < 2) {
			split.push('500');
		}

		var hueA = split[1] || '800'; // '800'
		var colorR = split[0] || 'primary'; // 'warn'

		var theme = $mdTheming.THEMES[$rootScope.app.setting.theme || $rootScope.app.config.theme || 'default'];
		if(typeof theme === 'undefined'){
			theme = $mdTheming.THEMES['default'];
		}
		var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
		var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
		return 'rgb(' + colorValue.join(',') + ')';
	}

	function postLink(scope, element, attributes) {
		$mdTheming(element);

		function style(where, color) {
			if (color) {
				element.css(where, __badge_toRGB(color));
			}
		}
//		function getPosition(){
//		return {
//		top: element.prop('offsetTop'),
//		left: element.prop('offsetLeft'),
//		width: element.prop('offsetWidth'),
//		height: element.prop('offsetHeight')
//		};
//		}
		scope.$watch(function() {
			return attributes.mbBadgeColor;
		}, function(value){
			style('color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadgeFill;
		}, function(value){
			style('background-color', value);
		});
	}

	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		link: postLink,
		template: function(/*element, attributes*/) {
			return '<div class="mb-badge" ng-transclude></div>';
		}
	};
});

angular.module('mblowfish-core')
.directive('mbBadge', function($mdTheming,/* $mdColors, $timeout, $window,*/ $compile, $rootScope) {


	function __badge_toRGB(color){
		var split = (color || '').split('-');
		if (split.length < 2) {
			split.push('500');
		}

		var hueA = split[1] || '800'; // '800'
		var colorR = split[0] || 'primary'; // 'warn'

		var theme = $mdTheming.THEMES[$rootScope.app.setting.theme || $rootScope.app.config.theme || 'default'];
		if(typeof theme === 'undefined'){
			theme = $mdTheming.THEMES['default'];
		}
		var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
		var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
		return 'rgb(' + colorValue.join(',') + ')';
	}

	function postLink(scope, element, attributes) {
		$mdTheming(element);
		//
		var parent = element.parent();
		var bg = angular.element('<div></div>');
		var link = $compile(bg);
		var badge = link(scope);

		var offset = parseInt(attributes.mdBadgeOffset);
		if (isNaN(offset)) {
			offset = 10;
		}

		function style(where, color) {
			if (color) {
				badge.css(where, __badge_toRGB(color));
			}
		}
		function getPosition(){
			return {
				top: element.prop('offsetTop'),
				left: element.prop('offsetLeft'),
				width: element.prop('offsetWidth'),
				height: element.prop('offsetHeight')
			};
		}

		function position(value) {
			var top = element.prop('offsetTop');
			badge.css({
				'display' : attributes.mbBadge && top ? 'initial' : 'none',
						'left' : value.left + value.width - 20 + offset + 'px',
						'top' : value.top + value.height - 20 + offset + 'px'
			});
		}

//		function update () {
//		position(getPosition());
//		}

		badge.addClass('mb-badge');
		badge.css('position', 'absolute');
		parent.append(badge);
		scope.$watch(function() {
			return attributes.mbBadgeColor;
		}, function(value){
			style('color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadgeFill;
		}, function(value){
			style('background-color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadge;
		}, function(value){
			badge.text(value);
			badge.css('display', value ? 'initial' : 'none');
		});

		scope.$watch(getPosition, function(value) {
			position(value);
		}, true);

//		angular.element($window)
//		.bind('resize', function(){
//		update();
//		});
	}
	return {
		priority: 100,
		restrict: 'A',
		link: postLink
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mb-captcha
 * @description Adding captcha value
 * 
 * In some case, user must send captcha to the server fro auth. This a directive
 * to enablie captcha
 * 
 */
.directive('mbCaptcha', function() {

    /**
     * Adding preloader.
     * 
     * @param scope
     * @param element
     * @param attr
     * @returns
     */
    function postLink(scope, element, attrs, ctrls) {
        var form=ctrls[0];
//        var ngModel=ctrls[1];

        function validate(){
            if(form){
                form.$setValidity('captcha', scope.required === false ? null : Boolean(scope.response));
            }
        }

//        function destroy() {
//            if (form) {
//                // reset the validity of the form if we were removed
//                form.$setValidity('captcha', null);
//            }
//        }


        if(form && angular.isDefined(attrs.required)){
            scope.$watch('required', validate);
        }
        scope._response = null;
        scope.$watch('_response', function(){
            scope.response = scope._response;
        });
        scope.$watch('response', function(){
            scope._response = scope.response;
        });


    }

    return {
        restrict : 'E',
        require: ['?^^form'],
        templateUrl: 'views/directives/mb-captcha.html',
        scope: {
            response: '=?ngModel'
        },
        link: postLink
    };
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc Directives
 * @name mb-context-menu
 * @description Set internal md-menu as context menu
 * 
 */
angular.module('mblowfish-core').directive('mbContextMenu', function() {
	return {
		restrict: 'A',
		require: 'mdMenu',
		scope: true,
		link: function(scope, element, attrs, menu) {
			element.bind('contextmenu', function(event) {
				scope.$apply(function() {
					menu.open(event);
				});
			});
		}
	};
});
/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')


	/**
	 * @ngdoc Directives
	 * @name mb-datepicker
	 * @descritpion Date picker
	 * 
	 * Select a date based on local.
	 * 
	 */
	.directive('mbDatepicker', function($mdUtil, $rootScope) {

		// **********************************************************
		// Private Methods
		// **********************************************************
		function postLink(scope, element, attr, ctrls) {
			scope.app = $rootScope.app || {};
			var ngModelCtrl = ctrls[0] || $mdUtil.fakeNgModel();

			function render() {
				if (!ngModelCtrl.$modelValue) {
					return;
				}
				var date = moment //
					.utc(ngModelCtrl.$modelValue) //
					.local();
				if (date.isValid()) {
					scope.date = date;
					return;
				}
				// TODO: maso, 2018: handle invalid date
			}

			function setValue() {
				if (!scope.date) {
					ngModelCtrl.$setViewValue(scope.date);
					return;
				}
				var date = moment(scope.date) //
					.utc() //
					.format(scope.dateFormat || 'YYYY-MM-DD HH:mm:ss');
				ngModelCtrl.$setViewValue(date);
			}

			ngModelCtrl.$render = render;
			scope.$watch('date', setValue);
		}


		return {
			replace: false,
			template: function() {
				var app = $rootScope.app || {};
				if (app.calendar === 'Gregorian') {
					return '<md-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-datepicker>';
				}
				return '<md-persian-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-persian-datepicker>';
			},
			restrict: 'E',
			scope: {
				minDate: '=mbMinDate',
				maxDate: '=mbMaxDate',
				placeholder: '@mbPlaceholder',
				hideIcons: '@?mbHideIcons',
				dateFormat: '@?mbDateFormat'
				//		        currentView: '@mdCurrentView',
				//		        dateFilter: '=mdDateFilter',
				//		        isOpen: '=?mdIsOpen',
				//		        debounceInterval: '=mdDebounceInterval',
				//		        dateLocale: '=mdDateLocale'
			},
			require: ['ngModel'],
			priority: 210, // Run before ngAria
			link: postLink
		};
	});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mbDynamicForm
 * @description Get a list of properties and fill them
 * 
 * Each property will be managed by an indevisual property editor.
 */
.directive('mbDynamicForm', function ($mbResource) {

    /**
     * Adding preloader.
     * 
     * @param scope
     * @param element
     * @param attr
     * @param ctrls
     * @returns
     */
    function postLink(scope, element, attrs, ctrls) {
        // Load ngModel
        var ngModelCtrl = ctrls[0];
        scope.values = {};
        ngModelCtrl.$render = function () {
            scope.values = ngModelCtrl.$viewValue || {};
        };

        scope.modelChanged = function (key, value) {
            scope.values[key] = value;
            ngModelCtrl.$setViewValue(scope.values);
        };

        scope.hasResource = function(prop){
            return $mbResource.hasPageFor(prop.name);
        };
        
        scope.setValueFor = function(prop){
            return $mbResource.get(prop.name, {
                data: prop.defaultValue
            })
            .then(function(value){
                scope.modelChanged(prop.name, value);
            });
        };
    }

    return {
        restrict: 'E',
        require: ['ngModel'],
        templateUrl: 'views/directives/mb-dynamic-form.html',
        scope: {
            mbParameters: '='
        },
        link: postLink
    };
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-dynamic-tabs
 * @description Display tabs dynamically
 * 
 * In some case, a dynamic tabs are required. This module add them dynamically.
 * 
 */
.directive('mbDynamicTabs', function($wbUtil, $q, $rootScope, $compile, $controller) {
	var CHILDREN_AUNCHOR = 'mb-dynamic-tabs-select-resource-children';


	/**
	 * encapsulate template srce with panel widget template.
	 * 
	 * @param page
	 *            setting page config
	 * @param tempateSrc
	 *            setting page html template
	 * @returns encapsulate html template
	 */
	function _encapsulatePanel(page, template) {
		// TODO: maso, 2017: pass all paramter to the setting
		// panel.
		return template;
	}


	function link($scope, $element) {
		// Load pages in scope
		function loadPage(index){
			var jobs = [];
			var pages2 = [];
			
			var mbTabs = $scope.mbTabs || [];
			if(index > mbTabs.length || index < 0 || mbTabs.length == 0){
				return;
			}
			var page = mbTabs[index];

			// 1- Find element
			var target = $element.find('#' + CHILDREN_AUNCHOR);

			// 2- Clear childrens
			target.empty();

			// 3- load pages
			var template = $wbUtil.getTemplateFor(page);
			if (angular.isDefined(template)) {
				jobs.push(template.then(function(templateSrc) {
					templateSrc = _encapsulatePanel(page, templateSrc);
					var element = angular.element(templateSrc);
					var scope = $rootScope.$new(false, $scope);
					scope.page = page;
					scope.value = $scope.value;
					if (angular .isDefined(page.controller)) {
						$controller(page.controller, {
							$scope : scope,
							$element : element
						});
					}
					$compile(element)(scope);
					pages2.push(element);
				}));
			}

			$q.all(jobs).then(function() {
				angular.forEach(pages2, function(element) {
					target.append(element);
				});
			});
		}
		
		// Index of selected page
		$scope.$watch('pageIndex', function(value){
			if(value >= 0){
				loadPage(value);
			}
		});
	}



	return {
		restrict: 'E',
		replace: true,
		scope: {
			mbTabs: '='
		},
		templateUrl: 'views/directives/mb-dynamic-tabs.html',
		link: link
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-error-messages
 * @description An error message display
 */
.directive('mbErrorMessages', function($compile) {

    /*
     * Link function
     */
    function postLink(scope, element){

        /**
         * Original element which replaced by this directive.
         */
        var origin = null;

        scope.errorMessages = function(err){
            if(!err) {
                return;
            }
            var message = {};
            message[err.status]= err.statusText;
            message[err.data.code]= err.data.message;
            return message;
        };

        scope.$watch(function(){
            return scope.mbErrorMessages;
        }, function(value){	
            if(value){
                var tmplStr = 
                    '<div ng-messages="errorMessages(mbErrorMessages)" role="alert" multiple>'+
                    '	<div ng-messages-include="views/mb-error-messages.html"></div>' +
                    '</div>';
                var el = angular.element(tmplStr);
                var cmplEl = $compile(el);
                var myEl = cmplEl(scope);
                origin = element.replaceWith(myEl);
            } else if(origin){
                element.replaceWith(origin);
                origin = null;
            }
        });
    }

    /*
     * Directive
     */
    return {
        restrict: 'A',
        scope:{
            mbErrorMessages : '='
        },
        link: postLink
    };
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-infinate-scroll
 * @description Infinet scroll
 * 
 * 
 * Manage scroll of list
 */
.directive('mbInfinateScroll', function ($parse, $q, $timeout) {
    // FIXME: maso, 2017: tipo in diractive name (infinite)
    function postLink(scope, elem, attrs) {
        var raw = elem[0];

        /*
         * Load next page
         */
        function loadNextPage() {
            // Call the callback for the first time:
            var value = $parse(attrs.mbInfinateScroll)(scope);
            return $q.when(value)//
            .then(function (value) {
                if (value) {
                    return $timeout(function () {
                        if (raw.scrollHeight <= raw.offsetHeight) {
                            return loadNextPage();
                        }
                    }, 100);
                }
            });
        }

        /*
         * Check scroll state and update list
         */
        function scrollChange() {
            if (raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight) {
                loadNextPage();
            }
        }

        // adding infinite scroll class
        elem.addClass('mb-infinate-scroll');
        elem.on('scroll', scrollChange);
        loadNextPage();
    }

    return {
        restrict : 'A',
        link : postLink
    };
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
 * @ngdoc Directives
 * @name mb-inline
 * @description Inline editing field
 */
angular.module('mblowfish-core').directive('mbInline', function($q, $parse, $mbResource) {

    /**
     * Link data and view
     */
	function postLink(scope, elem, attr, ctrls) {

		var ngModel = ctrls[1];
		var ctrl = ctrls[0];

		scope.myDataModel = {};
		scope.errorObject = {};

		scope.mbInlineType = attr.mbInlineType;
		scope.mbInlineLabel = attr.mbInlineLabel;
		scope.mbInlineDescription = attr.mbInlineDescription;

		scope.$watch(attr.mbInlineEnable, function(value) {
			scope.mbInlineEnable = value;
		});
		scope.$watch(attr.mbInlineSaveButton, function(value) {
			scope.mbInlineSaveButton = value;
		});
		scope.$watch(attr.mbInlineCancelButton, function(value) {
			scope.mbInlineCancelButton = value;
		});

		ngModel.$render = function() {
			ctrl.model = ngModel.$viewValue;
		};

		/*
		 * @depricated use ngChange
		 */
		ctrl.saveModel = function(d) {
			ngModel.$setViewValue(d);
			if (attr.mbInlineOnSave) {
				scope.$data = d;
				var value = $parse(attr.mbInlineOnSave)(scope);
				$q.when(value).then(function() {
					delete scope.error;
				}, function(error) {
					scope.error = error;
				});
			}
		};
	}

	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		require: ['mbInline', '^ngModel'],
		scope: true,
        /*
         * @ngInject
         */
		controller: function($scope) {
			this.edit = function() {
				this.editMode = true;
			};

			this.setEditMode = function(editMode) {
				this.editMode = editMode;
			};

			this.getEditMode = function() {
				return this.editMode;
			};

			this.save = function() {
				this.saveModel(this.model);
				this.setEditMode(false);
			};

			this.cancel = function() {
				this.setEditMode(false);
			};


            /*
             * Select image url
             */
			this.updateImage = function() {
				var ctrl = this;
				return $mbResource.get('image', {
					style: {
						icon: 'image',
						title: $scope.mbInlineLabel || 'Select image',
						description: $scope.mbInlineDescription || 'Select a file from resources to change current image'
					},
					data: this.model
				}).then(function(url) {
					ctrl.model = url;
					ctrl.save();
				});
			};

			/*
             * Select image url
             */
			this.updateFile = function() {
				var ctrl = this;
				return $mbResource.get('local-file', {
					style: {
						icon: 'file',
						title: $scope.mbInlineLabel || 'Select file',
						description: $scope.mbInlineDescription || 'Select a file from resources to change current data'
					},
					data: this.model
				}).then(function(file) {
					ctrl.model = file;
					ctrl.save();
				});
			};
		},
		controllerAs: 'ctrlInline',
		templateUrl: 'views/directives/mb-inline.html',
		link: postLink
	};
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-navigation-path
 * @description Display current navigation path of system
 * 
 * Navigation path is a menu which is updated by the $navigation service. This menu
 * show a chain of menu items to show the current path of the system. It is very
 * usefull to show current path to the users.
 * 
 * 
 */
.directive('mbNavigationBar' , function($mbActions, $navigator) {


	/**
	 * Init the bar
	 */
	function postLink(scope) {
		scope.isVisible = function(menu){
			// default value for visible is true
			if(angular.isUndefined(menu.visible)){
				return true;
			}
			if(angular.isFunction(menu.visible)){
				return menu.visible();
			}
			return menu.visible;
		};
		
		scope.goToHome = function(){
			$navigator.openPage('');
		};
		
		/*
		 * maso, 2017: Get navigation path menu. See $navigator.scpoePath for more info
		 */
		scope.pathMenu = $mbActions.getGroup('navigationPathMenu');
	}
	
    return {
        restrict : 'E',
        replace: false,
        templateUrl: 'views/directives/mb-navigation-bar.html',
        link: postLink
    };
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc Directives
 * @name mb-pagination-bar
 * @property {Object}    mb-model           -Data model
 * @property {function}  mb-reload          -Reload function
 * @property {Array}     mb-sort-keys       -Array
 * @property {Array}     mb-properties      -Array
 * @property {Array}     mb-more-actions    -Array
 * @property {string}    mb-title           -String
 * @property {string}    mb-icon            -String
 * @description Pagination bar
 *
 * Pagination parameters are a complex data structure and it is hard to manage
 * it. This is a toolbar to manage the pagination options. mb-reload get a function 
 * as reload. mb-sort-keys get an array of keys which is used in sort section of 
 * pagination bar and the sort could be done based on this keys. mb-properties get
 * an array of keys which is used in filter section of pagination bar. really mb-properties
 * gets children array of schema of a collection. The controller of collection is 
 * responsible to get the schema of a collection and pass it's children array to this 
 * attribute of directive. The directive itself do the required work to set the values
 * in filter section.
 * 
 */
angular.module('mblowfish-core').directive('mbPaginationBar', function($window, $timeout, $parse) {

	function postLink(scope, element, attrs) {

		var query = {
			sortDesc: true,
			sortBy: typeof scope.mbSortKeys === 'undefined' ? 'id' : scope.mbSortKeys[0],
			searchTerm: null
		};
        /*
         * مرتب سازی مجدد داده‌ها بر اساس حالت فعلی
         */
		function __reload() {
			if (!angular.isDefined(attrs.mbReload)) {
				return;
			}
			$parse(attrs.mbReload)(scope.$parent);
		}
        /**
         * ذخیره اطلاعات آیتم‌ها بر اساس مدل صفحه بندی
         */
		function exportData() {
			if (!angular.isFunction(scope.mbExport)) {
				return;
			}
			scope.mbExport(scope.mbModel);
		}

		function searchQuery() {
			scope.mbModel.setQuery(scope.query.searchTerm);
			__reload();
		}

		function focusToElementById(id) {
			$timeout(function() {
				var searchControl;
				searchControl = $window.document.getElementById(id);
				searchControl.focus();
			}, 50);
		}

		function setSortOrder() {
			scope.mbModel.clearSorters();
			var key = scope.query.sortBy;
			var order = scope.query.sortDesc ? 'd' : 'a';
			scope.mbModel.addSorter(key, order);
			__reload();
		}

        /*
         * Add filter to the current filters
         */
		function addFilter() {
			if (!scope.filters) {
				scope.filters = [];
			}
			scope.filters.push({
				key: '',
				value: ''
			});
		}

		function putFilter(filter, index) {
			scope.filters[index] = {
				key: filter.key,
				value: filter.value
			};
		}

		function applyFilter() {
			scope.reload = false;
			scope.mbModel.clearFilters();
			if (scope.filters && scope.filters.length > 0) {
				scope.filters.forEach(function(filter) {
					if (filter.key !== '' && filter.value && filter.value !== '') {
						scope.mbModel.addFilter(filter.key, filter.value);
						scope.reload = true;
					}
				});
			}
			if (scope.reload) {
				__reload();
			}
		}

        /*
         * Remove filter to the current filters
         */
		function removeFilter(filter, index) {
			Object.keys(scope.mbModel.filterMap).forEach(function(key) {
				if (key === filter.key) {
					scope.mbModel.removeFilter(scope.filters[index].key);
				}
			});
			scope.filters.splice(index, 1);
			if (scope.filters.length === 0) {
				__reload();
			}
		}

		function setFilterValue(value, index) {
			scope.filterValue = value;
			putFilter(index);
		}


		//Fetch filters from children array of collection schema
		function fetchFilterKeys() {
			scope.mbProperties.forEach(function(object) {
				scope.filterKeys.push(object.name);
			});
		}

		scope.runAction = function(action, $event) {
			action.exec($event);
		};

		scope.showBoxOne = false;
		scope.focusToElement = focusToElementById;
		// configure scope:
		scope.searchQuery = searchQuery;
		scope.setSortOrder = setSortOrder;
		scope.addFilter = addFilter;
		scope.putFilter = putFilter;
		scope.applyFilter = applyFilter;
		scope.removeFilter = removeFilter;
		//scope.setFilterKey = setFilterKey;
		scope.setFilterValue = setFilterValue;
		scope.__reload = __reload;
		scope.query = query;
		if (angular.isFunction(scope.mbExport)) {
			scope.exportData = exportData;
		}
		if (typeof scope.mbEnableSearch === 'undefined') {
			scope.mbEnableSearch = true;
		}

		scope.$watch('mbProperties', function(mbProperties) {
			if (angular.isArray(mbProperties)) {
				scope.filterKeys = [];
				fetchFilterKeys();
			}
		});
	}

	return {
		restrict: 'E',
		templateUrl: 'views/directives/mb-pagination-bar.html',
		scope: {
            /*
             * مدل صفحه بندی را تعیین می‌کند که ما اینجا دستکاری می‌کنیم.
             */
			mbModel: '=',
            /*
             * تابعی را تعیین می‌کند که بعد از تغییرات باید برای مرتب سازی
             * فراخوانی شود. معمولا بعد تغییر مدل داده‌ای این تابع فراخوانی می‌شود.
             */
			mbReload: '@?',
            /*
             * تابعی را تعیین می‌کند که بعد از تغییرات باید برای ذخیره آیتم‌های موجود در لیست
             * فراخوانی شود. این تابع معمولا باید بر اساس تنظیمات تعیین شده در مدل داده‌ای کلیه آیتم‌های فهرست را ذخیره کند.
             */
			mbExport: '=',
            /*
             * یک آرایه هست که تعیین می‌که چه کلید‌هایی برای مرتب سازی باید استفاده
             * بشن.
             */
			mbSortKeys: '=',
            /*
             * آرایه ای از آبجکتها که بر اساس فیلدهای هر آبجکت کلیدهایی برای فیلتر کردن استخراج می شوند
             */
			mbProperties: '=?',

			/* titles corresponding to sort keys */
			mbSortKeysTitles: '=?',

            /*
             * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
             */
			mbMoreActions: '=',

			mbTitle: '@?',
			mbIcon: '@?',

			mbEnableSearch: '=?'
		},
		link: postLink
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

	/**
	 *
	 */
	.directive('mbPay', function ($bank, $parse, $location, $navigator, $mbTranslate, QueryParameter) {

	    var qp = new QueryParameter();

	    function postLink(scope, elem, attrs, ctrls) {
		var ngModelCtrl = ctrls[0];
		var ctrl = this;
		ngModelCtrl.$render = function () {
		    ctrl.currency = ngModelCtrl.$modelValue;
		    if (ctrl.currency) {
			ctrl.loadGates();
		    }
		};

		this.loadGates = function () {
		    if (this.loadingGates) {
			return;
		    }
		    this.loadingGates = true;
		    qp.setFilter('currency', this.currency);
		    var ctrl = this;
		    return $bank.getBackends(qp)//
			    .then(function (gatesPag) {
				ctrl.gates = gatesPag.items;
				return gatesPag;
			    })//
			    .finally(function () {
				ctrl.loadingGates = false;
			    });
		};

		//function pay(backend, discountCode){
		this.pay = function (backend, discountCode) {
		    if (this.paying) {
			return;
		    }
		    this.paying = true;
		    // create receipt and send to bank receipt page.
		    var data = {
			backend: backend.id,
			callback: attrs.mbCallbackUrl ? attrs.mbCallbackUrl : $location.absUrl()
		    };
		    if (typeof discountCode !== 'undefined' && discountCode !== null) {
			data.discount_code = discountCode;
		    }
		    var ctrl = this;
		    $parse(attrs.mbPay)(scope.$parent, {
			$backend: backend,
			$discount: discountCode,
			$callback: data.callback,
			$data: data
		    })//
			    .then(function (receipt) {
				ctrl.paying = false;
				$navigator.openPage('bank/receipts/' + receipt.id);
			    }, function (error) {
				ctrl.paying = false;
				alert($mbTranslate.instant(error.data.message));
			    });
		};

//		function checkDiscount(code){
//			$discount.discount(code)//
//			.then(function(discount){
//				if(typeof discount.validation_code === 'undefined' || discount.validation_code === 0){
//					$scope.discount_message = 'discount is valid';
//				}else{
//					switch(discount.validation_code){
//					case 1:
//						$scope.discount_message = 'discount is used before';
//						break;
//					case 2: 
//						$scope.discount_message = 'discount is expired';
//						break;
//					case 3: 
//						// discount is not owned by user.
//						$scope.discount_message = 'discount is not valid';
//						break;
//					}
//				}
//			}, function(error){
//				$scope.error = error.data.message;
//				if(error.status === 404){				
//					$scope.discount_message = 'discount is not found';
//				}else{
//					$scope.discount_message = 'unknown error while get discount info';
//				}
//			});
//		}

		

		scope.ctrl = this;
	    }

	    return {
		replace: true,
		restrict: 'E',
		templateUrl: 'views/directives/mb-pay.html',
		scope: {
		    mbCallbackUrl: '@?',
		    mbPay: '@',
		    mbDiscountEnable: '='
		},
		link: postLink,
		require: ['ngModel']
	    };
	});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-preloading
 * @description Show a preloading of a module
 * 
 * The mb-preload-animate is added to element automatically to add user
 * animation.
 * 
 * The class mb-preload is added if the value of the directive is true.
 * 
 * @example To add preload:
 * 
 * <pre><code>
 *  	&lt;div mb-preload=&quot;preloadState&quot;&gt; DIV content &lt;/div&gt;
 * </code></pre>
 * 
 * 
 * User can define a custom class to add at preload time.
 * 
 * @example Custom preload class
 * 
 * <pre><code>
 *  	&lt;div mb-preload=&quot;preloadState&quot; mb-preload-class=&quot;my-class&quot;&gt; DIV content &lt;/div&gt;
 * </code></pre>
 * 
 */
.directive('mbPreloading', function(/*$animate*/) {
	var PRELOAD_CLASS = 'mb-preload';
	var PRELOAD_ANIMATION_CLASS = 'mb-preload-animate';

	/*
	 * Init element for preloading
	 */
	function initPreloading(scope, element/*, attr*/) {
		element.addClass(PRELOAD_ANIMATION_CLASS);
	}

	/*
	 * Remove preloading
	 */
	function removePreloading(scope, element, attr) {
		if (attr.mbPreloadingClass) {
			element.addClass(attr.mbPreloadingClass);
		}
		element.removeClass(PRELOAD_CLASS);
	}

	/*
	 * Adding preloading
	 */
	function addPreloading(scope, element, attr) {
		if (attr.mbPreloadingClass) {
			element.addClass(attr.mbPreloadingClass);
		}
		element.addClass(PRELOAD_CLASS);
	}

	/*
	 * Post linking
	 */
	function postLink(scope, element, attr) {
		initPreloading(scope, element, attr);
		scope.$watch(function(){
			return scope.$eval(attr.mbPreloading);
		}, function(value) {
			if (!value) {
				removePreloading(scope, element, attr);
			} else {
				addPreloading(scope, element, attr);
			}
		});
	}

	return {
		restrict : 'A',
		link : postLink
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Directives
@name mb-titled-block
@descritpion Title block


 */
mblowfish.directive('mbTitledBlock', function($mbActions) {

	function postLink(scope) {
		scope.$evalAction = function(item) {
			if (item.expression) {
				return scope.$parent.$eval(item.expression);
			}
			if (item.actionId) {
				return $mbActions.exec(item.actionId);
			}
			if (angular.isFunction(item.action)) {
				item.action();
			}
		}
	}
	return {
		replace: true,
		restrict: 'E',
		transclude: true,
		scope: {
			mbTitle: '@?',
			mbIcon: '@?',
			mbProgress: '<?',
			mbMoreActions: '='
		},
		link: postLink,
		templateUrl: 'views/directives/mb-titled-block.html'
	};
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-user-toolbar
 * @description User toolbar
 * 
 * Display tree menu
 * 
 */
.directive('mbUserToolbar', function($mbActions) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/directives/mb-user-toolbar.html',
		link: function($scope) {
			$scope.menu = $actions.group('mb.user');
		},
		controller : 'MbAccountCtrl'
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
 * @ngdoc Directives
 * @name ngSrcError
 * @description Handle ngSrc error
 * 
 * 
 * For example if you are about to set image of a user
 * 
 * @example
 * TO check if the directive works:
 ```html
 <img 
    alt="Test avatar" 
    ng-src="/this/path/dose/not/exist"
    ng-src-error="https://www.gravatar.com/avatar/{{ 'avatar id' | wbsha1}}?d=identicon&size=32">
 ```
 * @example
 * In this example we show an account avatar or a random from avatar generator
 ```html
  <img 
      ng-src="/api/v2/user/accounts/{{account.id}}/avatar"
      ng-src-error="https://www.gravatar.com/avatar/{{account.id}}?">
  ```
 */
angular.module('mblowfish-core').directive('ngSrcError', function() {
	return {
		link: function(scope, element, attrs) {
			element.bind('error', function() {
				if (attrs.src !== attrs.ngSrcError) {
					attrs.$set('src', attrs.ngSrcError);
				}
			});
		}
	};
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-dragstart
 * @description Call an action on dragstart
 * 
 */
.directive('wbOnDragstart', function() {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            element.bind('dragstart', function(event, data) {
                // call the function that was passed
                if (attrs.wbOnDragstart) {
                    scope.$eval(attrs.wbOnDragstart, {
                        $event: event,
                        $element: element,
                        $data: data
                    });
                }
            });
        }
    };
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-enter
 * @description Call an action on ENTER
 * 
 * ```
 * <input
 *  wb-on-enter="toast('ESC')">
 * ```
 */
.directive('wbOnEnter', function() {
    return function(scope, elm, attr) {
        elm.bind('keypress', function(e) {
            if (e.keyCode === 13) {
                scope.$apply(attr.wbOnEnter);
            }
        });
    };
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-error
 * @description Call an action on error
 * 
 * This directive is used to run an action on error of an element
 * 
 * ```
 * <img
 * 	wb-on-error="toast('image is not loaded')"
 * 	href="image/path">
 * ```
 */
.directive('wbOnError', function() {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            element.bind('error', function() {
                // call the function that was passed
                if (attrs.wbOnError) {
                    scope.$apply(attrs.wbOnError);
                }
            });
        }
    };
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-esc
 * @description Call an action on ESC
 * 
 * ```
 * <input
 *  wb-on-esc="toast('ESC')">
 * ```
 */
.directive('wbOnEsc', function() {
    return function(scope, elm, attr) {
        elm.bind('keydown', function(e) {
            if (e.keyCode === 27) {
                scope.$apply(attr.wbOnEsc);
            }
        });
    };
});


/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-load
 * @description Call an action on load
 * 
 * This directive is used to run an action on load of an element. For exmaple
 * use to show alert on load of image:
 * 
 * ```
 * <img
 * 	wb-on-load="toast('image is loaded')"
 * 	href="image/path">
 * ```
 */
.directive('wbOnLoad', function() {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            element.bind('load', function(event, data) {
                // call the function that was passed
                if (attrs.wbOnLoad) {
                    scope.$eval(attrs.wbOnLoad, {
                        $event: event,
                        $element: element,
                        $data: data
                    });
                }
            });
        }
    };
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc Directives
 * @name mb-user-menu
 * @restrict E
 * @description Display global user menu
 * 
 * Load current user action into the scope. It is used to show user menu
 * in several parts of the system.
 */
angular.module('mblowfish-core').directive('mbUserMenu', function($mbAccount, $mdSidenav) {
	/**
	 * Post link 
	 */
	function postLink($scope) {
		// maso, 2017: Get user menu
		$scope.menu = $actions.group('mb.user');
		$scope.logout = $mbAccount.logout;
		$scope.settings = function() {
			return $mdSidenav('settings').toggle();
		};
	}

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'views/directives/mb-user-menu.html',
		link: postLink,
		controller: 'MbAccountCtrl'
	};
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Controllers
@name MbAccountCtrl
@description Manages account of users.

Manages current user action:

- login
- logout
- recover pass
- login with CAS

@param {string} isProcessingLogout True if the controller is wait for logout
@param {string} isProcessingLogin True if the controller is wait for login

 */
mblowfish.controller('MbAccountContainerCtrl', function(
	/* Angularjs */ $scope, $rootScope, $mbTranslate, $window, $usr,
	/* MBlowfish */ $mbAccount, $mbLogger) {


	// support old systems
	var ctrl = this;


	/**
	 Call login process for current user
	 
	 @memberof MbAccountContainerCtrl
	 @name login
	 @param {object} cridet Username, password, token and others required in login
	 @param {string} cridet.login Login name of the user
	 @param {stirng} cridet.password Password ot the user
	 @param {stirng} cridet.token Token to use in the login
	 @param {stirng} cridet.captcha captcah to send
	 @returns {promiss} TO do the login
	 */
	function login(cridet) {
		if (ctrl.isProcessingLogin) {
			return false;
		}
		return ctrl.isProcessingLogin = $mbAccount.login(cridet)
			.catch(function(error) {
				// TODO: maso, 2020: chanage state to error
			})
			.finally(function() {
				delete ctrl.isProcessingLogin;
			});
	}

	function logout() {
		if (ctrl.isProcessingLogout) {
			return false;
		}
		return ctrl.isProcessingLogout = $mbAccount.logout()//
			.catch(function(error) {
				// TODO: maso, 2020: chanage state to error
			})
			.finally(function() {
				delete ctrl.isProcessingLogout;
			});
	}

	/**
	 Creates a new request to recover password
	 
	 @name load
	 @memberof MbAccountCtrl
	 @returns {promiss} to change password
	 */
	function recoverPasswrodRequest(data) {
		if (ctrl.changingPassword) {
			return;
		}
		ctrl.changingPassword = true;
		var param = {
			'old': data.oldPass,
			'new': data.newPass,
			'password': data.newPass
		};
		// return $usr.resetPassword(param)//
		$usr.putCredential(param)
			.then(function() {
				$mbAccount.logout();
				ctrl.changePassState = 'success';
				$scope.changePassMessage = null;
				toast($mbTranslate.instant('Password is changed successfully. Login with new password.'));
			}, function(error) {
				ctrl.changePassState = 'fail';
				$scope.changePassMessage = $mbLogger.errorMessage(error, form);
				alert($mbTranslate.instant('Failed to change the password.'));
			})//
			.finally(function() {
				ctrl.changingPassword = false;
			});
	}


	function isAnonymous() {
		return $mbAccount.isAnonymous();
	}

	//-----------------------------------------------------------------
	// END
	//-----------------------------------------------------------------
	ctrl.login = login;
	ctrl.logout = logout;

	ctrl.isAnonymous = isAnonymous;
});



/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbProfileCtrl
 * @description Manages profile of a user
 *
 */
//TODO: maso, 2019: replace with MbSeenAccountCtrl
.controller('MbProfileCtrl', function ($scope, $rootScope, $mbTranslate, $window, UserProfile, $usr) {

    // set initial data
    this.user = null;
    this.profile = null;
    this.loadingProfile = false;
    this.savingProfile = false;

    /*
     * - normal
     * - edit
     */
    this.avatarState = 'normal';

    /**
     * Loads user data
     *
     * @returns
     */
    this.loadUser = function () {
        $usr.getAccount($rootScope.__account.id)
        .then(function(account){
            ctrl.user = account;
            return ctrl.loadProfile();
        });
    }

    this.loadProfile = function () {
        if (this.loadinProfile) {
            return;
        }
        this.loadingProfile = true;
        var ctrl = this;
        return this.user.getProfiles()//
        .then(function (profiles) {
            ctrl.profile = angular.isDefined(profiles.items[0]) ? profiles.items[0] : new UserProfile();
            return ctrl.profile;
        }, function () {
            alert($mbTranslate.instant('Fail to load profile.'));
        })//
        .finally(function () {
            ctrl.loadingProfile = false;
        });
    }

    /**
     * Save current user
     *
     * @returns
     */
    this.save = function () {
        if (this.savingProfile) {
            return;
        }
        this.savingProfile = true;
        var $promise = angular.isDefined(this.profile.id) ? this.profile.update() : this.user.putProfile(this.profile);
        var ctrl = this;
        return $promise//
        .then(function () {
            toast($mbTranslate.instant('Save is successfull.'));
        }, function () {
            alert($mbTranslate.instant('Fail to save item.'));
        })//
        .finally(function () {
            ctrl.savingProfile = false;
        });
    }

    this.back = function () {
        $window.history.back();
    }

    this.deleteAvatar = function () {
        var ctrl = this;
        confirm($mbTranslate.instant('Delete the avatar?'))
        .then(function () {
            ctrl.avatarState = 'working';
            return ctrl.user.deleteAvatar();
        })
        .finally(function () {
            ctrl.avatarState = 'normal';
        });
    }

    this.uploadAvatar = function (files) {
        if (!angular.isArray(files) || !files.length) {
        }
        var file = null;
        file = files[0].lfFile;
        this.avatarLoading = true;
        var ctrl = this;
        this.user.uploadAvatar(file)
        .then(function () {
            // TODO: reload the page
        })
        .finally(function () {
            ctrl.avatarLoading = false;
            ctrl.avatarState = 'normal';
        });
    }

    this.editAvatar = function () {
        this.avatarState = 'edit';
    }

    this.cancelEditAvatar = function () {
        this.avatarState = 'normal';
    }

    /*
     * To support old version of the controller
     */
    var ctrl = this;
    $scope.load = function () {
        ctrl.loadUser();
    };
    $scope.reload = function () {
        ctrl.loadUser();
    };
    $scope.save = function () {
        ctrl.save();
    };
    $scope.back = function () {
        ctrl.back();
    };
    $scope.cancel = function () {
        ctrl.back();
    };

    // Load account information
    this.loadUser();

    // re-labeling lf-ng-md-file component for multi languages support
    angular.element(function () {

        var elm = angular.element('.lf-ng-md-file-input-drag-text');
        if (elm[0]) {
            elm.text($mbTranslate.instant('Drag & Drop File Here'));
        }

        elm = angular.element('.lf-ng-md-file-input-button-brower');
        if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
            elm[0].childNodes[1].data=' '+$mbTranslate.instant('Browse');
        }

        elm = angular.element('.lf-ng-md-file-input-button-remove');
        if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
            elm[0].childNodes[1].data=$mbTranslate.instant('Remove');
        }

        elm = angular.element('.lf-ng-md-file-input-caption-text-default');
        if (elm[0]) {
            elm.text($mbTranslate.instant('Select File'));
        }

    });

});


/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.controller('MbSeenCmsContentsCtrl',function ($scope, $cms, $q, $controller) {

    /*
     * Extends collection controller
     */
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Override the schema function
    this.getModelSchema = function () {
        return $cms.contentSchema();
    };

    // get contents
    this.getModels = function (parameterQuery) {
        return $cms.getContents(parameterQuery);
    };

    // get a content
    this.getModel = function (id) {
        return $cms.getContent(id);
    };

    // delete account
    this.deleteModel = function (content) {
        return $cms.deleteContent(content.id);
    };

    /**
     * Uploads a file on the server.
     * 
     * To upload the file there are two actions:
     * 
     * <ul>
     * <li>create a new content</li>
     * <li>upload content value</li>
     * </ul>
     * 
     * This function change the state of the controller into the
     * working.
     */
    this.uploadFile = function (content, file) {
        /*
         * upload file
         */
        function uploadContentValue(newContent) {
            if (file) {
                return newContent.uploadValue(file)//
                .then(function () {
                    return newContent;
                });
            }
            return $q.resolve(newContent);
        }

        // XXX: maso, 2018: check content is not anonymous
        return $cms.putContent(content)//
        .then(uploadContentValue);
    }

    this.init({
        eventType: '/cms/contents'
    });
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('mblowfish-core')
/*
 * 
 */
.controller('MbSeenCmsTermTaxonomiesCtrl',function ($scope, $cms, $controller) {

    /*
     * Extends collection controller
     */
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Override the schema function
    this.getModelSchema = function () {
        return $cms.termTaxonomySchema();
    };

    // get contents
    this.getModels = function (parameterQuery) {
        return $cms.getTermTaxonomies(parameterQuery);
    };

    // get a content
    this.getModel = function (id) {
        return $cms.getTermTaxonomy(id);
    };

    // delete account
    this.deleteModel = function (content) {
        return $cms.deleteTermTaxonomy(content.id);
    };

    this.init({
        eventType: '/cms/term-taxonomies'
    });
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
 * @ngdoc Services
 * @name $help
 * @description A help management service
 * 
 * Manage application help.
 * 
 * Set help id for an item:
 * 
 * <pre><code>
 * 	var item = {
 * 		...
 * 		helpId: 'help-id'
 * 	};
 * 	$help.openHelp(item);
 * </code></pre>
 * 
 * 
 * 
 * Open help for an item:
 * 
 * <pre><code>
 * $help.openHelp(item);
 * </code></pre>
 * 
 */
mblowfish.service('$help', function ($q, $rootScope, /*$mbTranslate,*/ $injector) {

//    var _tips = [];
//    var _currentItem = null;
//
//    /*
//     * Get help id
//     */
//    function _getHelpId(item) {
//        if (!item) {
//            return null;
//        }
//        var id = item.helpId;
//        if (angular.isFunction(item.helpId)) {
//            return $injector.invoke(item.helpId, item);
//        }
//        return id;
//    }
//
//    /**
//     * Adds new tip
//     * 
//     * New tip is added into the tips list.
//     * 
//     * @memberof $help
//     * @param {object}
//     *            tipData - Data of a tipe
//     */
//    function tip(tipData) {
//        _tips.push(tipData);
//        return this;
//    }
//
//    /**
//     * List of tips
//     * 
//     * @memberof $help
//     * @return {promise<Array>} of tips
//     */
//    function tips() {
//        return $q.resolve({
//            items: _tips
//        });
//    }
//
//    /**
//     * Gets current item in help system
//     * 
//     * @memberof $help
//     * @return {Object} current item
//     */
//    function currentItem() {
//        return _currentItem;
//    }
//
//    /**
//     * Sets current item in help system
//     * 
//     * @memberof $help
//     * @params item {Object} target of the help system
//     */
//    function setCurrentItem(item) {
//        _currentItem = item;
//    }
//
//    /**
//     * Gets help path
//     * 
//     * @memberof $help
//     * @params item {Object} an item to show help for
//     * @return path of the help
//     */
//    function getHelpPath(item) {
//        // Get from help id
//        var myId = _getHelpId(item || _currentItem);
//        if (myId) {
//            var lang = $mbTranslate.use();
//            // load content
//            return 'resources/helps/' + myId + '-' + lang + '.json';
//        }
//
//        return null;
//    }
//
//    /**
//     * Check if there exist a help on item
//     * 
//     * @memberof $help
//     * @params item {Object} an item to show help for
//     * @return path if the item if exist help or false
//     */
//    function hasHelp(item) {
//        return !!_getHelpId(item);
//    }
//
//    /**
//     * Display help for an item
//     * 
//     * This function change current item automatically and display help for it.
//     * 
//     * @memberof $help
//     * @params item {Object} an item to show help for
//     */
//    function openHelp(item) {
//        if (!hasHelp(item)) {
//            return;
//        }
//        if (_currentItem === item) {
//            $rootScope.showHelp = !$rootScope.showHelp;
//            return;
//        }
//        setCurrentItem(item);
//        $rootScope.showHelp = true;
//    }
//
//    /*
//     * Service structure
//     */
//    return {
//        tip: tip,
//        tips: tips,
//
//        currentItem: currentItem,
//        setCurrentItem: setCurrentItem,
//        openHelp: openHelp,
//        hasHelp: hasHelp,
//        getHelpPath: getHelpPath
//    };
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 @ngdoc Editor
 @name MbIFrameContainerCtrl
 @description A page preview editor
 
 */
angular.module('mblowfish-core').controller('MbIFrameContainerCtrl', function($sce, $state) {

	// Load secure path
	this.currentContenttUrl = $sce.trustAsResourceUrl($state.params.url);

});


/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
angular.module('mblowfish-core').run(function(
	/* AngularJs */ $window,
	/* Mblowfish */ $mbEditor, $mbActions, $mbToolbar) {

	//
	//  $mbEditor: manages all editor of an application. An editor has a dynamic
	// address and there may be multiple instance of it at the same time but with
	// different parameter.
	//
	// There are serveral editor registered here to cover some of our system 
	// functionalities such as:
	//
	// - Open a new URL
	//
	$mbEditor.registerEditor('/mb/iframe/:url*', {
		title: 'IFrame',
		description: 'Open external page',
		controller: 'MbIFrameContainerCtrl',
		controllerAs: 'ctrl',
		template: '<iframe class="mb-module-iframe" ng-src="{{ctrl.currentContenttUrl}}"></iframe>',
		groups: ['Utilities']
	});

	$mbActions.addAction('mb.iframe.open', {
		title: 'Open URL',
		description: 'Open a url',
		icon: 'open_in_browser',
		/* @ngInject */
		action: function($location) {
			$window.prompt('Enter the URL.', 'https://viraweb123.ir/wb/')
				.then(function(input) {
					$location.url('/mb/iframe/' + input);
					// $mbEditor.open('/mb/iframe/' + input, {param1: 'value1'});
				});
		}
	});

	$mbToolbar.addToolbar('/mb/iframe', {
		items: ['mb.iframe.open']
	});

//	//-----------------------------------------------------------------------
//	//  Adds iframe toolbar into the main toolbar group. Note that, this 
//	// must handle in the final application.
//	//-----------------------------------------------------------------------
//	$mbToolbar.getToolbarGroup()
//		.addToolbar('/mb/iframe');
});


/**
@ngdoc directive
@name mb-translate-attr
@restrict A

@description
Translates attributes like mb-translate-attr-ATTR, but with an object like ng-class.
Internally it uses `translate` service to translate translation id. It possible to
pass an optional `mb-translate-values` object literal as string into translation id.

@param {string=} mb-translate-attr Object literal mapping attributes to translation ids.
@param {string=} mb-translate-values Values to pass into the translation ids. Can be passed as object literal string.
@param {string=} translate-sanitize-strategy defines locally sanitize strategy

@example
<example module="ngView">
 <file name="index.html">
   <div ng-controller="TranslateCtrl">

     <input mb-translate-attr="{ placeholder: translationId, title: 'WITH_VALUES' }" mb-translate-values="{value: 5}" />

   </div>
 </file>
 <file name="script.js">
   angular.module('ngView', ['pascalprecht.translate'])

   .config(function ($mbTranslateProvider) {

     $mbTranslateProvider.translations('en',{
       'TRANSLATION_ID': 'Hello there!',
       'WITH_VALUES': 'The following value is dynamic: {{value}}',
     }).preferredLanguage('en');

   });

   angular.module('ngView').controller('TranslateCtrl', function ($scope) {
     $scope.translationId = 'TRANSLATION_ID';

     $scope.values = {
       value: 78
     };
   });
 </file>
 <file name="scenario.js">
   it('should translate', function () {
     inject(function ($rootScope, $compile) {
       $rootScope.translationId = 'TRANSLATION_ID';

       element = $compile('<input mb-translate-attr="{ placeholder: translationId, title: 'WITH_VALUES' }" mb-translate-values="{ value: 5 }" />')($rootScope);
       $rootScope.$digest();
       expect(element.attr('placeholder)).toBe('Hello there!');
       expect(element.attr('title)).toBe('The following value is dynamic: 5');
     });
   });
 </file>
</example>
 */
mblowfish.directive('translateAttr', function($mbTranslate, $rootScope) {
	function linkFn(scope, element, attr) {

		var translateAttr,
			translateValues,
			translateSanitizeStrategy,
			previousAttributes = {};

		// Main update translations function
		var updateTranslations = function() {
			angular.forEach(translateAttr, function(translationId, attributeName) {
				if (!translationId) {
					return;
				}
				previousAttributes[attributeName] = true;

				// if translation id starts with '.' and translateNamespace given, prepend namespace
				if (scope.translateNamespace && translationId.charAt(0) === '.') {
					translationId = scope.translateNamespace + translationId;
				}
				$mbTranslate(translationId, translateValues, attr.translateInterpolation, undefined, scope.translateLanguage, translateSanitizeStrategy)
					.then(function(translation) {
						element.attr(attributeName, translation);
					}, function(translationId) {
						element.attr(attributeName, translationId);
					});
			});

			// Removing unused attributes that were previously used
			angular.forEach(previousAttributes, function(flag, attributeName) {
				if (!translateAttr[attributeName]) {
					element.removeAttr(attributeName);
					delete previousAttributes[attributeName];
				}
			});
		};

		// Watch for attribute changes
		watchAttribute(
			scope,
			attr.translateAttr,
			function(newValue) { translateAttr = newValue; },
			updateTranslations
		);
		// Watch for value changes
		watchAttribute(
			scope,
			attr.translateValues,
			function(newValue) { translateValues = newValue; },
			updateTranslations
		);
		// Watch for sanitize strategy changes
		watchAttribute(
			scope,
			attr.translateSanitizeStrategy,
			function(newValue) { translateSanitizeStrategy = newValue; },
			updateTranslations
		);

		if (attr.translateValues) {
			scope.$watch(attr.translateValues, updateTranslations, true);
		}

		// Replaced watcher on translateLanguage with event listener
		scope.$on('translateLanguageChanged', updateTranslations);

		// Ensures the text will be refreshed after the current language was changed
		// w/ $mbTranslate.use(...)
		var unbind = $rootScope.$on('$mbTranslateChangeSuccess', updateTranslations);

		updateTranslations();
		scope.$on('$destroy', unbind);
	}

	return {
		restrict: 'A',
		priority: $mbTranslate.directivePriority(),
		link: linkFn
	};
})



/**
@ngdoc directive
@name mb-translate-cloak
@requires $mbTranslate
@restrict A

$description
Adds a `mb-translate-cloak` class name to the given element where this directive
is applied initially and removes it, once a loader has finished loading.

This directive can be used to prevent initial flickering when loading translation
data asynchronously.

The class name is defined in
{@link pascalprecht.translate.$mbTranslateProvider#cloakClassName $mbTranslate.cloakClassName()}.

@param {string=} mb-translate-cloak If a translationId is provided, it will be used for showing
                                 or hiding the cloak. Basically it relies on the translation
                                 resolve.
 */
mblowfish.directive('mbTranslateCloak', function($mbTranslate, $rootScope) {

	function compileFn(tElement) {
		function applyCloak(element) {
			element.addClass($mbTranslate.cloakClassName());
		}
		function removeCloak(element) {
			element.removeClass($mbTranslate.cloakClassName());
		}
		applyCloak(tElement);

		return function linkFn(scope, iElement, iAttr) {
			//Create bound functions that incorporate the active DOM element.
			var iRemoveCloak = removeCloak.bind(this, iElement), iApplyCloak = applyCloak.bind(this, iElement);
			if (iAttr.translateCloak && iAttr.translateCloak.length) {
				// Register a watcher for the defined translation allowing a fine tuned cloak
				iAttr.$observe('mbTranslateCloak', function(translationId) {
					$mbTranslate(translationId).then(iRemoveCloak, iApplyCloak);
				});
				$rootScope.$on('$mbTranslateChangeSuccess', function() {
					$mbTranslate(iAttr.translateCloak).then(iRemoveCloak, iApplyCloak);
				});
			} else {
				$mbTranslate.onReady(iRemoveCloak);
			}
		};
	}

	return {
		compile: compileFn
	};
});



/**
@ngdoc directive
@name mb-translate-namespace
@restrict A

@description
Translates given translation id either through attribute or DOM content.
Internally it uses `translate` filter to translate translation id. It is possible to
pass an optional `mb-translate-values` object literal as string into translation id.

@param {string=} translate namespace name which could be either string or interpolated string.

@example
   <example module="ngView">
    <file name="index.html">
      <div mb-translate-namespace="CONTENT">

        <div>
            <h1 translate>.HEADERS.TITLE</h1>
            <h1 translate>.HEADERS.WELCOME</h1>
        </div>

        <div mb-translate-namespace=".HEADERS">
            <h1 translate>.TITLE</h1>
            <h1 translate>.WELCOME</h1>
        </div>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($mbTranslateProvider) {

        $mbTranslateProvider.translations('en',{
          'TRANSLATION_ID': 'Hello there!',
          'CONTENT': {
            'HEADERS': {
                TITLE: 'Title'
            }
          },
          'CONTENT.HEADERS.WELCOME': 'Welcome'
        }).preferredLanguage('en');

      });

    </file>
   </example>
 */
mblowfish.directive('mbTranslateNamespace', function translateNamespaceDirective() {


	/**
	 Returns the scope's namespace.
	 @private
	 @param scope
	 @returns {string}
	 */
	function _getTranslateNamespace(scope) {
		if (scope.translateNamespace) {
			return scope.translateNamespace;
		}
		if (scope.$parent) {
			return _getTranslateNamespace(scope.$parent);
		}
	}

	function compileFn() {
		return {
			pre: function(scope, iElement, iAttrs) {
				scope.translateNamespace = _getTranslateNamespace(scope);

				if (scope.translateNamespace && iAttrs.translateNamespace.charAt(0) === '.') {
					scope.translateNamespace += iAttrs.translateNamespace;
				} else {
					scope.translateNamespace = iAttrs.translateNamespace;
				}
			}
		};
	}

	return {
		restrict: 'A',
		scope: true,
		compile: compileFn
	};
});


/**
@ngdoc directive
@name mb-translate-language
@restrict A

@description
Forces the language to the directives in the underlying scope.

@param {string=} translate language that will be negotiated.

@example
   <example module="ngView">
    <file name="index.html">
      <div>

        <div>
            <h1 translate>HELLO</h1>
        </div>

        <div mb-translate-language="de">
            <h1 translate>HELLO</h1>
        </div>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($mbTranslateProvider) {

        $mbTranslateProvider
          .translations('en',{
            'HELLO': 'Hello world!'
          })
          .translations('de',{
            'HELLO': 'Hallo Welt!'
          })
          .preferredLanguage('en');

      });

    </file>
   </example>
 */
mblowfish.directive('mbTranslateLanguage', function() {

	function compileFn() {
		return function linkFn(scope, iElement, iAttrs) {

			iAttrs.$observe('mbTranslateLanguage', function(newTranslateLanguage) {
				scope.translateLanguage = newTranslateLanguage;
			});

			scope.$watch('mbTranslateLanguage', function() {
				scope.$broadcast('mbTranslateLanguageChanged');
			});
		};
	}

	return {
		restrict: 'A',
		scope: true,
		compile: compileFn
	};
});




/**
@ngdoc directive
@name pascalprecht.translate.directive:translate
@requires $interpolate,
@requires $compile,
@requires $parse,
@requires $rootScope
@restrict AE

@description
Translates given translation id either through attribute or DOM content.
Internally it uses $mbTranslate service to translate the translation id. It possible to
pass an optional `mb-translate-values` object literal as string into translation id.

@param {string=} mb-translate Translation id which could be either string or interpolated string.
@param {string=} mb-translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
@param {string=} mb-mb-translate-attr-ATTR translate Translation id and put it into ATTR attribute.
@param {string=} mb-translate-default will be used unless translation was successful
@param {string=} mb-translate-sanitize-strategy defines locally sanitize strategy
@param {boolean=} mb-translate-compile (default true if present) defines locally activation of {@link pascalprecht.translate.$mbTranslateProvider#methods_usePostCompiling}
@param {boolean=} mb-translate-keep-content (default true if present) defines that in case a KEY could not be translated, that the existing content is left in the innerHTML}

@example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre mb-translate="TRANSLATION_ID"></pre>
        <pre mb-translate>TRANSLATION_ID</pre>
        <pre mb-translate mb-mb-translate-attr-title="TRANSLATION_ID"></pre>
        <pre mb-translate="{{translationId}}"></pre>
        <pre mb-translate>{{translationId}}</pre>
        <pre mb-translate="WITH_VALUES" mb-translate-values="{value: 5}"></pre>
        <pre mb-translate mb-translate-values="{value: 5}">WITH_VALUES</pre>
        <pre mb-translate="WITH_VALUES" mb-translate-values="{{values}}"></pre>
        <pre mb-translate mb-translate-values="{{values}}">WITH_VALUES</pre>
        <pre mb-translate mb-mb-translate-attr-title="WITH_VALUES" mb-translate-values="{{values}}"></pre>
        <pre mb-translate="WITH_CAMEL_CASE_KEY" mb-translate-value-camel-case-key="Hi"></pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($mbTranslateProvider) {

        $mbTranslateProvider.translations('en',{
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}',
          'WITH_CAMEL_CASE_KEY': 'The interpolation key is camel cased: {{camelCaseKey}}'
        }).preferredLanguage('en');

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
    <file name="scenario.js">
      it('should translate', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';

          element = $compile('<p mb-translate="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate="{{translationId}}"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate>TRANSLATION_ID</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate>{{translationId}}</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate mb-mb-translate-attr-title="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.attr('title')).toBe('Hello there!');

          element = $compile('<p mb-translate="WITH_CAMEL_CASE_KEY" mb-translate-value-camel-case-key="Hello"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('The interpolation key is camel cased: Hello');
        });
      });
    </file>
   </example>
 */
mblowfish.directive('mbTranslate', function($mbTranslate, $interpolate, $compile, $parse, $rootScope) {

	/**
	@name trim
	@private
	
	@description
	trim polyfill
	
	@returns {string} The string stripped of whitespace from both ends
	 */
	function trim() {
		return this.toString().replace(/^\s+|\s+$/g, '');
	};

	/**
	@name lowercase
	@private
	
	@description
	Return the lowercase string only if the type is string
	
	@returns {string} The string all in lowercase
	 */
	var lowercase = function(string) {
		return angular.isString(string) ? string.toLowerCase() : string;
	};

	function compileFn(tElement, tAttr) {

		var translateValuesExist = (tAttr.translateValues) ?
			tAttr.translateValues : undefined;

		var translateInterpolation = (tAttr.translateInterpolation) ?
			tAttr.translateInterpolation : undefined;

		var translateSanitizeStrategyExist = (tAttr.translateSanitizeStrategy) ?
			tAttr.translateSanitizeStrategy : undefined;

		var translateValueExist = tElement[0].outerHTML.match(/mb-translate-value-+/i);

		var interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)',
			watcherRegExp = '^(.*)' + $interpolate.startSymbol() + '(.*)' + $interpolate.endSymbol() + '(.*)';

		return function linkFn(scope, iElement, iAttr) {

			scope.interpolateParams = {};
			scope.preText = '';
			scope.postText = '';
			scope.translateNamespace = getTranslateNamespace(scope);
			var translationIds = {};

			function initInterpolationParams(interpolateParams, iAttr, tAttr) {
				// initial setup
				if (iAttr.translateValues) {
					angular.extend(interpolateParams, $parse(iAttr.translateValues)(scope.$parent));
				}
				// initially fetch all attributes if existing and fill the params
				if (translateValueExist) {
					for (var attr in tAttr) {
						if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
							var attributeName = lowercase(attr.substr(14, 1)) + attr.substr(15);
							interpolateParams[attributeName] = tAttr[attr];
						}
					}
				}
			}

			// Ensures any change of the attribute "translate" containing the id will
			// be re-stored to the scope's "translationId".
			// If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
			var observeElementTranslation = function(translationId) {

				// Remove any old watcher
				if (angular.isFunction(observeElementTranslation._unwatchOld)) {
					observeElementTranslation._unwatchOld();
					observeElementTranslation._unwatchOld = undefined;
				}

				if (angular.equals(translationId, '') || !angular.isDefined(translationId)) {
					var iElementText = trim.apply(iElement.text());

					// Resolve translation id by inner html if required
					var interpolateMatches = iElementText.match(interpolateRegExp);
					// Interpolate translation id if required
					if (angular.isArray(interpolateMatches)) {
						scope.preText = interpolateMatches[1];
						scope.postText = interpolateMatches[3];
						translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
						var watcherMatches = iElementText.match(watcherRegExp);
						if (angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
							observeElementTranslation._unwatchOld = scope.$watch(watcherMatches[2], function(newValue) {
								translationIds.translate = newValue;
								updateTranslations();
							});
						}
					} else {
						// do not assigne the translation id if it is empty.
						translationIds.translate = !iElementText ? undefined : iElementText;
					}
				} else {
					translationIds.translate = translationId;
				}
				updateTranslations();
			};

			function observeAttributeTranslation(translateAttr) {
				iAttr.$observe(translateAttr, function(translationId) {
					translationIds[translateAttr] = translationId;
					updateTranslations();
				});
			};

			// initial setup with values
			initInterpolationParams(scope.interpolateParams, iAttr, tAttr);

			var firstAttributeChangedEvent = true;
			iAttr.$observe('translate', function(translationId) {
				if (typeof translationId === 'undefined') {
					// case of element "<translate>xyz</translate>"
					observeElementTranslation('');
				} else {
					// case of regular attribute
					if (translationId !== '' || !firstAttributeChangedEvent) {
						translationIds.translate = translationId;
						updateTranslations();
					}
				}
				firstAttributeChangedEvent = false;
			});

			for (var translateAttr in iAttr) {
				if (iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr' && translateAttr.length > 13) {
					observeAttributeTranslation(translateAttr);
				}
			}

			iAttr.$observe('translateDefault', function(value) {
				scope.defaultText = value;
				updateTranslations();
			});

			if (translateSanitizeStrategyExist) {
				iAttr.$observe('translateSanitizeStrategy', function(value) {
					scope.sanitizeStrategy = $parse(value)(scope.$parent);
					updateTranslations();
				});
			}

			if (translateValuesExist) {
				iAttr.$observe('translateValues', function(interpolateParams) {
					if (interpolateParams) {
						scope.$parent.$watch(function() {
							angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
						});
					}
				});
			}

			if (translateValueExist) {
				var observeValueAttribute = function(attrName) {
					iAttr.$observe(attrName, function(value) {
						var attributeName = lowercase(attrName.substr(14, 1)) + attrName.substr(15);
						scope.interpolateParams[attributeName] = value;
					});
				};
				for (var attr in iAttr) {
					if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
						observeValueAttribute(attr);
					}
				}
			}

			// Master update function
			var updateTranslations = function() {
				for (var key in translationIds) {
					if (translationIds.hasOwnProperty(key) && translationIds[key] !== undefined) {
						updateTranslation(key, translationIds[key], scope, scope.interpolateParams, scope.defaultText, scope.translateNamespace);
					}
				}
			};

			// Put translation processing function outside loop
			var updateTranslation = function(translateAttr, translationId, scope, interpolateParams, defaultTranslationText, translateNamespace) {
				if (translationId) {
					// if translation id starts with '.' and translateNamespace given, prepend namespace
					if (translateNamespace && translationId.charAt(0) === '.') {
						translationId = translateNamespace + translationId;
					}

					$mbTranslate(translationId, interpolateParams, translateInterpolation, defaultTranslationText, scope.translateLanguage, scope.sanitizeStrategy)
						.then(function(translation) {
							applyTranslation(translation, scope, true, translateAttr);
						}, function(translationId) {
							applyTranslation(translationId, scope, false, translateAttr);
						});
				} else {
					// as an empty string cannot be translated, we can solve this using successful=false
					applyTranslation(translationId, scope, false, translateAttr);
				}
			};

			var applyTranslation = function(value, scope, successful, translateAttr) {
				if (!successful) {
					if (typeof scope.defaultText !== 'undefined') {
						value = scope.defaultText;
					}
				}
				if (translateAttr === 'translate') {
					// default translate into innerHTML
					if (successful || (!successful && !$mbTranslate.isKeepContent() && typeof iAttr.translateKeepContent === 'undefined')) {
						iElement.empty().append(scope.preText + value + scope.postText);
					}
					var globallyEnabled = $mbTranslate.isPostCompilingEnabled();
					var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
					var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
					if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
						$compile(iElement.contents())(scope);
					}
				} else {
					// translate attribute
					var attributeName = iAttr.$attr[translateAttr];
					if (attributeName.substr(0, 5) === 'data-') {
						// ensure html5 data prefix is stripped
						attributeName = attributeName.substr(5);
					}
					attributeName = attributeName.substr(15);
					iElement.attr(attributeName, value);
				}
			};

			if (translateValuesExist || translateValueExist || iAttr.translateDefault) {
				scope.$watch('interpolateParams', updateTranslations, true);
			}

			// Replaced watcher on translateLanguage with event listener
			scope.$on('translateLanguageChanged', updateTranslations);

			// Ensures the text will be refreshed after the current language was changed
			// w/ $mbTranslate.use(...)
			var unbind = $rootScope.$on('$mbTranslateChangeSuccess', updateTranslations);

			// ensure translation will be looked up at least one
			if (iElement.text().length) {
				if (iAttr.translate) {
					observeElementTranslation(iAttr.translate);
				} else {
					observeElementTranslation('');
				}
			} else if (iAttr.translate) {
				// ensure attribute will be not skipped
				observeElementTranslation(iAttr.translate);
			}
			updateTranslations();
			scope.$on('$destroy', unbind);
		};
	}

	return {
		restrict: 'AE',
		scope: true,
		priority: $mbTranslate.getDirectivePriority(),
		compile: compileFn
	};
});


// TODO: maso, 2020: create a language editor
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.factory('MbLanguageLoader', function($q) {
	return function(option) {
		var deferred = $q.defer();
		deferred.resolve({});
		return deferred.promise;
	};
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.factory('MbMissingTranslationHandler', function() {
	return function(translationID) {
		//		$mbTranslationDb.addTranslationId(translationID);
	};
});

/**
@ngdoc object
@name $mbTranslateDefaultInterpolation
@requires $interpolate

@description
Uses angular's `$interpolate` services to interpolate strings against some values.

Be aware to configure a proper sanitization strategy.

See also:
* {@link $mbTranslateSanitization}

@return {object} $mbTranslateDefaultInterpolation Interpolator service
 */
mblowfish.factory('$mbTranslateDefaultInterpolation', function($interpolate, $mbTranslateSanitization) {

	var $mbTranslateInterpolator = {};
	var $locale;
	var $identifier = 'default';

	/**
	 @ngdoc function
	 @name pascalprecht.translate.$mbTranslateDefaultInterpolation#setLocale
	 @methodOf pascalprecht.translate.$mbTranslateDefaultInterpolation
	 
	 @description
	 Sets current locale (this is currently not use in this interpolation).
	 
	 @param {string} locale Language key or locale.
	 */
	$mbTranslateInterpolator.setLocale = function(locale) {
		$locale = locale;
	};

	/**
	 @ngdoc function
	 @name pascalprecht.translate.$mbTranslateDefaultInterpolation#getInterpolationIdentifier
	 @methodOf pascalprecht.translate.$mbTranslateDefaultInterpolation
	 
	 @description
	 Returns an identifier for this interpolation service.
	 
	 @returns {string} $identifier
	 */
	$mbTranslateInterpolator.getInterpolationIdentifier = function() {
		return $identifier;
	};

	/**
	 * @deprecated will be removed in 3.0
	 * @see {@link pascalprecht.translate.$mbTranslateSanitization}
	 */
	$mbTranslateInterpolator.useSanitizeValueStrategy = function(value) {
		$mbTranslateSanitization.useStrategy(value);
		return this;
	};

	/**
	 @ngdoc function
	 @name pascalprecht.translate.$mbTranslateDefaultInterpolation#interpolate
	 @methodOf pascalprecht.translate.$mbTranslateDefaultInterpolation
	
	 @description
	 Interpolates given value agains given interpolate params using angulars
	 `$interpolate` service.
	
	 Since AngularJS 1.5, `value` must not be a string but can be anything input.
	
	 @param {string} value translation
	 @param {object} [interpolationParams={}] interpolation params
	 @param {string} [context=undefined] current context (filter, directive, service)
	 @param {string} [sanitizeStrategy=undefined] sanitize strategy (use default unless set)
	 @param {string} translationId current translationId
	
	 @returns {string} interpolated string
	 */
	$mbTranslateInterpolator.interpolate = function(value, interpolationParams, context, sanitizeStrategy, translationId) { // jshint ignore:line
		interpolationParams = interpolationParams || {};
		interpolationParams = $mbTranslateSanitization.sanitize(interpolationParams, 'params', sanitizeStrategy, context);

		var interpolatedText;
		if (angular.isNumber(value)) {
			// numbers are safe
			interpolatedText = '' + value;
		} else if (angular.isString(value)) {
			// strings must be interpolated (that's the job here)
			interpolatedText = $interpolate(value)(interpolationParams);
			interpolatedText = $mbTranslateSanitization.sanitize(interpolatedText, 'text', sanitizeStrategy, context);
		} else {
			// neither a number or a string, cant interpolate => empty string
			interpolatedText = '';
		}

		return interpolatedText;
	};

	return $mbTranslateInterpolator;
});


/**
@ngdoc object
@name pascalprecht.translate.$translationCache
@requires $cacheFactory

@description
The first time a translation table is used, it is loaded in the translation cache for quick retrieval. You
can load translation tables directly into the cache by consuming the
`$translationCache` service directly.

@return {object} $cacheFactory object.
 */
mblowfish.factory('$translationCache', function $translationCache($cacheFactory) {
	return $cacheFactory('translations');
});


/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/*
 * TODO: maso, 2019: add filter document
 */
mblowfish.filter('currencyFilter', function(numberFilter, translateFilter) {

	return function(price, unit) {

		if (!price) {
			return translateFilter('free');
		}
		// TODO: maso, 2019: set unit with system default currency if is null
		if (unit === 'iran-rial' || unit === 'iran-tooman') {
			return numberFilter(price) + ' '
				+ translateFilter(unit);
		} else if (unit === 'bahrain-dinar') {
			return numberFilter(price) + ' '
				+ translateFilter('bahrain-dinar');
		} else if (unit === 'euro') {
			return numberFilter(price) + ' '
				+ translateFilter('euro');
		} else if (unit === 'dollar') {
			return translateFilter('dollar') + ' '
				+ numberFilter(price);
		} else if (unit === 'pound') {
			return translateFilter('pound') + ' '
				+ numberFilter(price);
		} else if (unit === 'iraq-dinar') {
			return numberFilter(price) + ' '
				+ translateFilter('iraq-dinar');
		} else if (unit === 'kuwait-dinar') {
			return numberFilter(price) + ' '
				+ translateFilter('kuwait-dinar');
		} else if (unit === 'oman-rial') {
			return numberFilter(price) + ' '
				+ translateFilter('oman-rial');
		} else if (unit === 'turkish-lira') {
			return numberFilter(price) + ' '
				+ translateFilter('turkish-lira');
		} else if (unit === 'uae-dirham') {
			return numberFilter(price) + ' '
				+ translateFilter('uae-dirham');
		} else {
			return numberFilter(price) + ' ?';
		}
	};
});




/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



mblowfish

	/**
	 * @ngdoc Filters
	 * @name mbDate
	 * @description # Format date
	 */
	.filter('mbDate', function($mbLocal) {
		return function(inputDate, format) {
			return $mbLocal.formatDate(inputDate, format);
		};
	})

	/**
	 * @ngdoc Filters
	 * @name mbDateTime
	 * @description # Format date time
	 */
	.filter('mbDateTime', function($mbLocal) {
		return function(inputDate, format) {
			return $mbLocal.formatDateTime(inputDate, format);
		};
	});

/**
@ngdoc filter
@name pascalprecht.translate.filter:translate
@requires $parse
@requires pascalprecht.translate.$mbTranslate
@function

@description
Uses `$mbTranslate` service to translate contents. Accepts interpolate parameters
to pass dynamized values though translation.

@param {string} translationId A translation id to be translated.
@param {*=} interpolateParams Optional object literal (as hash or string) to pass values into translation.

@returns {string} Translated text.

@example
<example module="ngView">
 <file name="index.html">
   <div ng-controller="TranslateCtrl">

     <pre>{{ 'TRANSLATION_ID' | translate }}</pre>
     <pre>{{ translationId | translate }}</pre>
     <pre>{{ 'WITH_VALUES' | translate:'{value: 5}' }}</pre>
     <pre>{{ 'WITH_VALUES' | translate:values }}</pre>

   </div>
 </file>
 <file name="script.js">
   angular.module('ngView', ['pascalprecht.translate'])

   .config(function ($mbTranslateProvider) {

     $mbTranslateProvider.translations('en', {
       'TRANSLATION_ID': 'Hello there!',
       'WITH_VALUES': 'The following value is dynamic: {{value}}'
     });
     $mbTranslateProvider.preferredLanguage('en');

   });

   angular.module('ngView').controller('TranslateCtrl', function ($scope) {
     $scope.translationId = 'TRANSLATION_ID';

     $scope.values = {
       value: 78
     };
   });
 </file>
</example>
 */
mblowfish.filter('translate', function($parse, $mbTranslate) {

	var translateFilter = function(translationId, interpolateParams, interpolation, forceLanguage) {
		if (!angular.isObject(interpolateParams)) {
			var ctx = this || {
				'__SCOPE_IS_NOT_AVAILABLE': 'More info at https://github.com/angular/angular.js/commit/8863b9d04c722b278fa93c5d66ad1e578ad6eb1f'
			};
			interpolateParams = $parse(interpolateParams)(ctx);
		}

		return $mbTranslate.instant(translationId, interpolateParams, interpolation, forceLanguage);
	};

	if ($mbTranslate.statefulFilter()) {
		translateFilter.$stateful = true;
	}

	return translateFilter;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish
	.config(function($mbPreferencesProvider, $mdDateLocaleProvider, $mbResourceProvider) {
		// Format and parse dates based on moment's 'L'-format
		// 'L'-format may later be changed
		$mdDateLocaleProvider.parseDate = function(dateString) {
			var m = moment(dateString, 'L', true);
			return m.isValid() ? m.toDate() : new Date(NaN);
		};

		$mdDateLocaleProvider.formatDate = function(date) {
			var m = moment(date);
			return m.isValid() ? m.format('L') : '';
		};

		// Pages
		$mbPreferencesProvider
			.addPage('local', {
				title: 'local',
				icon: 'language',
				templateUrl: 'views/preferences/mb-local.html',
				controller: 'MbLocalCtrl',
				controllerAs: 'ctrl'
			})
			.addPage('brand', {
				title: 'Branding',
				icon: 'copyright',
				templateUrl: 'views/preferences/mb-brand.html',
				// controller : 'settingsBrandCtrl',
				controllerAs: 'ctrl'
			});


		$mbResourceProvider
			.addPage('language', {
				label: 'Custom',
				templateUrl: 'views/resources/mb-language-custome.html',
				controller: 'MbLocalResourceLanguageCustomCtrl',
				controllerAs: 'resourceCtrl',
				tags: ['/app/languages', 'language']
			})
			.addPage('language.viraweb123', {
				label: 'Common',
				templateUrl: 'views/resources/mb-language-list.html',
				controller: 'MbLocalResourceLanguageCommonCtrl',
				controllerAs: 'resourceCtrl',
				tags: ['/app/languages', 'language']
			})
			.addPage('language.upload', {
				label: 'Upload',
				templateUrl: 'views/resources/mb-language-upload.html',
				controller: 'MbLocalResourceLanguageUploadCtrl',
				controllerAs: 'resourceCtrl',
				tags: ['/app/languages', 'language']
			});
	})
	.run(function runTranslate($mbTranslate) {

		var key = $mbTranslate.storageKey(),
			storage = $mbTranslate.storage();

		var fallbackFromIncorrectStorageValue = function() {
			var preferred = $mbTranslate.preferredLanguage();
			if (angular.isString(preferred)) {
				$mbTranslate.use(preferred);
				// $mbTranslate.use() will also remember the language.
				// So, we don't need to call storage.put() here.
			} else {
				storage.put(key, $mbTranslate.use());
			}
		};

		fallbackFromIncorrectStorageValue.displayName = 'fallbackFromIncorrectStorageValue';

		if (storage) {
			if (!storage.get(key)) {
				fallbackFromIncorrectStorageValue();
			} else {
				$mbTranslate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
			}
		} else if (angular.isString($mbTranslate.preferredLanguage())) {
			$mbTranslate.use($mbTranslate.preferredLanguage());
		}
	});



/**
 * Returns the scope's namespace.
 * @private
 * @param scope
 * @returns {string}
 */
function getTranslateNamespace(scope) {
	'use strict';
	if (scope.translateNamespace) {
		return scope.translateNamespace;
	}
	if (scope.$parent) {
		return getTranslateNamespace(scope.$parent);
	}
}

function watchAttribute(scope, attribute, valueCallback, changeCallback) {
	'use strict';
	if (!attribute) {
		return;
	}
	if (attribute.substr(0, 2) === '::') {
		attribute = attribute.substr(2);
	} else {
		scope.$watch(attribute, function(newValue) {
			valueCallback(newValue);
			changeCallback();
		}, true);
	}
	valueCallback(scope.$eval(attribute));
}
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.controller('MbLocalResourceCountryCtrl', function($scope, $http) {
	var countires;

	function loadResources() {
		$http
			.get('resources/countries-iso3166.json')
			.then(function(res) {
				$scope.languages = res.data;
			}, function() {
				// XXX: maso, 2020: handlef file not found
			});
	}

	//
	//	/**
	//	 * Create filter function for a query string
	//	 */
	//	function createFilterFor(query) {
	//		var lowercaseQuery = query.toLowerCase();
	//
	//		return function filterFn(language) {
	//			return (language.title.indexOf(lowercaseQuery) >= 0) ||
	//			(language.key.indexOf(lowercaseQuery) >= 0);
	//		};
	//
	//	}
	
	this.countires = countires;
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.controller('MbLocalResourceLanguageCommonCtrl', function($scope, $http) {
	$http.get('resources/languages.json')
		.then(function(res) {
			$scope.languages = res.data;
		});

	this.setLanguage = function(lang) {
		$scope.$parent.setValue(lang);
	};


	//
	//	/**
	//	 * Create filter function for a query string
	//	 */
	//	function createFilterFor(query) {
	//		var lowercaseQuery = query.toLowerCase();
	//
	//		return function filterFn(language) {
	//			return (language.title.indexOf(lowercaseQuery) >= 0) ||
	//			(language.key.indexOf(lowercaseQuery) >= 0);
	//		};
	//
	//	}
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.controller('MbLocalResourceLanguageCustomCtrl', function($scope) {
	$scope.language = $scope.value;

	this.querySearch = function(query) {
		var results = query ? languages.filter(createFilterFor(query)) : languages;
		var deferred = $q.defer();
		$timeout(function() {
			deferred.resolve(results);
		}, Math.random() * 100, false);
		return deferred.promise;
	};

	$scope.$watch('language', function(lang) {
		$scope.$parent.setValue(lang);
	});
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.controller('MbLocalResourceLanguageUploadCtrl', function($scope, $http) {
	$http.get('resources/common-languages.json')
		.then(function(res) {
			$scope.languages = res.data;
		});

	this.setLanguage = function(lang) {
		$scope.$parent.setValue(lang);
	};

	var ctrl = this;
	$scope.$watch('files.length', function(files) {
		if (!$scope.files || $scope.files.length <= 0) {
			return;
		}
		var reader = new FileReader();
		reader.onload = function(event) {
			var lang = JSON.parse(event.target.result);
			ctrl.setLanguage(lang);
		};
		reader.readAsText($scope.files[0].lfFile);
	});

});




/**
 @ngdoc object
 @name $mbTranslateSanitization
 @requires $injector
 @requires $log
	
 @description
 Sanitizes interpolation parameters and translated texts.
	
	
	
 There are many sanitization method and you are free to add a new one. 
Following strategies are built-in:

 <dl>
   <dt>sanitize</dt><dd>Sanitizes HTML in the translation text using $sanitize</dd>
   <dt>escape</dt><dd>Escapes HTML in the translation</dd>
   <dt>sanitizeParameters</dt><dd>Sanitizes HTML in the values of the interpolation parameters using $sanitize</dd>
   <dt>escapeParameters</dt><dd>Escapes HTML in the values of the interpolation parameters</dd>
   <dt>escaped</dt><dd>Support legacy strategy name 'escaped' for backwards compatibility (will be removed in 3.0)</dd>
 </dl>
 */

/**
 Definition of a sanitization strategy function
 @callback StrategyFunction
 @param {string|object} value - value to be sanitized (either a string or an interpolated value map)
 @param {string} mode - either 'text' for a string (translation) or 'params' for the interpolated params
 @return {string|object}
 */

mblowfish.provider('$mbTranslateSanitization', function() {

	//-------------------------------------------------------------------------
	// Services and factories
	//-------------------------------------------------------------------------
	var provider;
	var service;

	var $sanitize;
	var $sce;
	var $log;


	//-------------------------------------------------------------------------
	// Services and factories
	//-------------------------------------------------------------------------
	// TODO: change to either 'sanitize', 'escape' or ['sanitize', 'escapeParameters'] in 3.0.
	var currentStrategy = null;
	var strategies;
	var cachedStrategyMap = {};



	//-------------------------------------------------------------------------
	// Functions
	//-------------------------------------------------------------------------
	strategies = {
		sanitize: function(value, mode/*, context*/) {
			if (mode === 'text') {
				value = htmlSanitizeValue(value);
			}
			return value;
		},
		escape: function(value, mode/*, context*/) {
			if (mode === 'text') {
				value = htmlEscapeValue(value);
			}
			return value;
		},
		sanitizeParameters: function(value, mode/*, context*/) {
			if (mode === 'params') {
				value = mapInterpolationParameters(value, htmlSanitizeValue);
			}
			return value;
		},
		escapeParameters: function(value, mode/*, context*/) {
			if (mode === 'params') {
				value = mapInterpolationParameters(value, htmlEscapeValue);
			}
			return value;
		},
		sce: function(value, mode, context) {
			if (mode === 'text') {
				value = htmlTrustValue(value);
			} else if (mode === 'params') {
				if (context !== 'filter') {
					// do html escape in filter context #1101
					value = mapInterpolationParameters(value, htmlEscapeValue);
				}
			}
			return value;
		},
		sceParameters: function(value, mode/*, context*/) {
			if (mode === 'params') {
				value = mapInterpolationParameters(value, htmlTrustValue);
			}
			return value;
		}
	};

	/*
	Converts a value to map of values
	*/
	function mapInterpolationParameters(value, iteratee, stack) {
		if (angular.isDate(value)) {
			return value;
		} else if (angular.isObject(value)) {
			var result = angular.isArray(value) ? [] : {};

			if (!stack) {
				stack = [];
			} else {
				if (stack.indexOf(value) > -1) {
					throw new Error('$mbTranslateSanitization: Error cannot interpolate parameter due recursive object');
				}
			}

			stack.push(value);
			angular.forEach(value, function(propertyValue, propertyKey) {

				/* Skipping function properties. */
				if (angular.isFunction(propertyValue)) {
					return;
				}

				result[propertyKey] = mapInterpolationParameters(propertyValue, iteratee, stack);
			});
			stack.splice(-1, 1); // remove last

			return result;
		} else if (angular.isNumber(value)) {
			return value;
		} else if (value === true || value === false) {
			return value;
		} else if (!angular.isUndefined(value) && value !== null) {
			return iteratee(value);
		} else {
			return value;
		}
	};

	function htmlEscapeValue(value) {
		var element = angular.element('<div></div>');
		element.text(value); // not chainable, see #1044
		return element.html();
	}

	function htmlSanitizeValue(value) {
		if (!$sanitize) {
			throw new Error('Cannot find $sanitize service.');
		}
		return $sanitize(value);
	}

	function htmlTrustValue(value) {
		if (!$sce) {
			throw new Error('Cannot find $sce service.');
		}
		return $sce.trustAsHtml(value);
	}

	/**
	 @ngdoc function
	 @name addStrategy
	 @methodOf $mbTranslateSanitizationProvider
	
	 @description
	 Adds a sanitization strategy to the list of known strategies.
	
	 @param {string} strategyName - unique key for a strategy
	 @param {StrategyFunction} strategyFunction - strategy function
	 @returns {object} this
	 */
	function addStrategy(strategyName, strategyFunction) {
		strategies[strategyName] = strategyFunction;
		return provider;
	}

	/**
	 @ngdoc function
	 @name $mbTranslateSanitizationProvider#removeStrategy
	 @methodOf $mbTranslateSanitizationProvider
	
	 @description
	 Removes a sanitization strategy from the list of known strategies.
	
	 @param {string} strategyName - unique key for a strategy
	 @returns {object} this
	 */
	function removeStrategy(strategyName) {
		delete strategies[strategyName];
		return provider;
	}

	function useStrategy(strategy) {
		hasConfiguredStrategy = true;
		currentStrategy = strategy;
	}


	/**
	 @ngdoc function
	 @name sanitize
	 @methodOf $mbTranslateSanitization
	
	 @description
	 Sanitizes a value.
	
	 @param {string|object} value The value which should be sanitized.
	 @param {string} mode The current sanitization mode, either 'params' or 'text'.
	 @param {string|StrategyFunction|array} [strategy] Optional custom strategy which should be used instead of the currently selected strategy.
	 @param {string} [context] The context of this call: filter, service. Default is service
	 @returns {string|object} sanitized value
	 */
	function sanitize(value, mode, strategy, context) {
		if (!currentStrategy) {
			$log.warn('No sanitization strategy has been configured.');
			hasShownNoStrategyConfiguredWarning = true;
		}

		if (!strategy && strategy !== null) {
			strategy = currentStrategy;
		}

		if (!strategy) {
			return value;
		}

		if (!context) {
			context = 'service';
		}

		var selectedStrategies = angular.isArray(strategy) ? strategy : [strategy];
		return applyStrategies(value, mode, context, selectedStrategies);
	}


	function applyStrategies(value, mode, context, selectedStrategies) {
		angular.forEach(selectedStrategies, function(selectedStrategy) {
			if (angular.isFunction(selectedStrategy)) {
				value = selectedStrategy(value, mode, context);
			} else if (angular.isFunction(strategies[selectedStrategy])) {
				value = strategies[selectedStrategy](value, mode, context);
			} else if (angular.isString(strategies[selectedStrategy])) {
				if (!cachedStrategyMap[strategies[selectedStrategy]]) {
					try {
						cachedStrategyMap[strategies[selectedStrategy]] = $injector.get(strategies[selectedStrategy]);
					} catch (e) {
						cachedStrategyMap[strategies[selectedStrategy]] = function() { };
						throw new Error('$mbTranslateSanitization: Unknown sanitization strategy: \'' + selectedStrategy + '\'');
					}
				}
				value = cachedStrategyMap[strategies[selectedStrategy]](value, mode, context);
			} else {
				throw new Error('Unknown sanitization strategy: \'' + selectedStrategy + '\'');
			}
		});
		return value;
	}

	//-------------------------------------------------------------------------------------------
	// End
	//-------------------------------------------------------------------------------------------
	service = {
		/**
		@ngdoc function
		@name useStrategy
		@methodOf $mbTranslateSanitization
		
		@description
		Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
		
		@param {string|StrategyFunction|array} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
		 */
		useStrategy: function() {
			useStrategy(strategy);
			return service;
		},
		sanitize: sanitize,
	};
	provider = {
		$get: function($injector) {
			if ($injector.has('$sanitize')) {
				$sanitize = $injector.get('$sanitize');
			}
			if ($injector.has('$sce')) {
				$sce = $injector.get('$sce');
			}
			if ($injector.has('$log')) {
				$log = $injector.get('$log');
			}
			return service;
		},
		addStrategy: addStrategy,
		removeStrategy: removeStrategy,

		/**
		 @ngdoc function
		 @name useStrategy
		 @methodOf $mbTranslateSanitizationProvider
		
		 @description
		 Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
		
		 @param {string|StrategyFunction|array} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
		 @returns {object} this
		 */
		useStrategy: function(strategy) {
			useStrategy(strategy);
			return provider;
		}
	};
	return provider;
});



/**
 * @ngdoc object
 * @name $mbTranslate
 * @requires $interpolate
 * @requires $log
 * @requires $rootScope
 * @requires $q
 *
 * @description
 * The `$mbTranslate` service is the actual core of angular-translate. It expects a translation id
 * and optional interpolate parameters to translate contents.
 *
 * <pre>
 *  $mbTranslate('HEADLINE_TEXT').then(function (translation) {
 *    $scope.translatedText = translation;
 *  });
 * </pre>
 *
 * @param {string|array} translationId A token which represents a translation id
 *                                     This can be optionally an array of translation ids which
 *                                     results that the function returns an object where each key
 *                                     is the translation id and the value the translation.
 * @param {object=} [interpolateParams={}] An object hash for dynamic values
 * @param {string=} [interpolationId=undefined] The id of the interpolation to use (use default unless set via useInterpolation())
 * @param {string=} [defaultTranslationText=undefined] the optional default translation text that is written as
 *                                        as default text in case it is not found in any configured language
 * @param {string=} [forceLanguage=false] A language to be used instead of the current language
 * @param {string=} [sanitizeStrategy=undefined] force sanitize strategy for this call instead of using the configured one (use default unless set)
 * @returns {object} promise
 */

mblowfish.provider('$mbTranslate', function() {
	//----------------------------------------------------------------
	// Services
	//----------------------------------------------------------------

	var provider;
	var service;

	var $rootScope;
	var $q;
	var injector;

	var indexOf = _.indexOf;
	var trim = _.trim;
	var toLowerCase = _.lowerCase;


	//----------------------------------------------------------------
	// Variables
	//----------------------------------------------------------------

	var $translationTable = {},
		$preferredLanguage,
		$availableLanguageKeys = [],
		$languageKeyAliases,
		$fallbackLanguage,
		$fallbackWasString,
		$uses,
		$nextLang,
		$storageFactory,
		$storageKey = 'NG_TRANSLATE_LANG_KEY',
		$storagePrefix,
		$missingTranslationHandlerFactory,
		$interpolationFactory,
		$interpolatorFactories = [],
		$loaderFactory,
		$cloakClassName = 'mb-translate-cloak',
		$loaderOptions,
		$notFoundIndicatorLeft,
		$notFoundIndicatorRight,
		$postCompilingEnabled = false,
		$forceAsyncReloadEnabled = false,
		$nestedObjectDelimeter = '.',
		$isReady = false,
		$keepContent = false,
		loaderCache,
		directivePriority = 0,
		statefulFilter = true,
		postProcessFn,
		uniformLanguageTagResolver = 'default';



	var Storage,
		defaultInterpolator,
		pendingLoader = false,
		interpolatorHashMap = {},
		langPromises = {},
		fallbackIndex,
		startFallbackIteration;

	var $onReadyDeferred;


	var languageTagResolver = {
		'default': function(tag) {
			return (tag || '').split('-').join('_');
		},
		java: function(tag) {
			var temp = (tag || '').split('-').join('_');
			var parts = temp.split('_');
			return parts.length > 1 ? (parts[0].toLowerCase() + '_' + parts[1].toUpperCase()) : temp;
		},
		bcp47: function(tag) {
			var temp = (tag || '').split('_').join('-');
			var parts = temp.split('-');
			switch (parts.length) {
				case 1: // language only
					parts[0] = parts[0].toLowerCase();
					break;
				case 2: // language-script or language-region
					parts[0] = parts[0].toLowerCase();
					if (parts[1].length === 4) { // parts[1] is script
						parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
					} else { // parts[1] is region
						parts[1] = parts[1].toUpperCase();
					}
					break;
				case 3: // language-script-region
					parts[0] = parts[0].toLowerCase();
					parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
					parts[2] = parts[2].toUpperCase();
					break;
				default:
					return temp;
			}

			return parts.join('-');
		},
		'iso639-1': function(tag) {
			var temp = (tag || '').split('_').join('-');
			var parts = temp.split('-');
			return parts[0].toLowerCase();
		}
	};

	//----------------------------------------------------------------
	// functions
	//----------------------------------------------------------------

	// tries to determine the browsers language
	function getFirstBrowserLanguage() {

		// internal purpose only
		if (angular.isFunction(pascalprechtTranslateOverrider.getLocale)) {
			return pascalprechtTranslateOverrider.getLocale();
		}

		var nav = $windowProvider.$get().navigator,
			browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
			i,
			language;

		// support for HTML 5.1 "navigator.languages"
		if (angular.isArray(nav.languages)) {
			for (i = 0; i < nav.languages.length; i++) {
				language = nav.languages[i];
				if (language && language.length) {
					return language;
				}
			}
		}

		// support for other well known properties in browsers
		for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
			language = nav[browserLanguagePropertyKeys[i]];
			if (language && language.length) {
				return language;
			}
		}

		return null;
	}


	// tries to determine the browsers locale
	function getLocale() {
		var locale = getFirstBrowserLanguage() || '';
		if (languageTagResolver[uniformLanguageTagResolver]) {
			locale = languageTagResolver[uniformLanguageTagResolver](locale);
		}
		return locale;
	}

	function negotiateLocale(preferred) {
		if (!preferred) {
			return;
		}

		var avail = [],
			locale = toLowerCase(preferred),
			i = 0,
			n = $availableLanguageKeys.length;

		for (; i < n; i++) {
			avail.push(toLowerCase($availableLanguageKeys[i]));
		}

		// Check for an exact match in our list of available keys
		i = indexOf(avail, locale);
		if (i > -1) {
			return $availableLanguageKeys[i];
		}

		if ($languageKeyAliases) {
			var alias;
			for (var langKeyAlias in $languageKeyAliases) {
				if ($languageKeyAliases.hasOwnProperty(langKeyAlias)) {
					var hasWildcardKey = false;
					var hasExactKey = Object.prototype.hasOwnProperty.call($languageKeyAliases, langKeyAlias) &&
						toLowerCase(langKeyAlias) === toLowerCase(preferred);

					if (langKeyAlias.slice(-1) === '*') {
						hasWildcardKey = toLowerCase(langKeyAlias.slice(0, -1)) === toLowerCase(preferred.slice(0, langKeyAlias.length - 1));
					}
					if (hasExactKey || hasWildcardKey) {
						alias = $languageKeyAliases[langKeyAlias];
						if (indexOf(avail, toLowerCase(alias)) > -1) {
							return alias;
						}
					}
				}
			}
		}

		// Check for a language code without region
		var parts = preferred.split('_');

		if (parts.length > 1 && indexOf(avail, toLowerCase(parts[0])) > -1) {
			return parts[0];
		}

		// If everything fails, return undefined.
		//		return;
	}

	/**
	 * @ngdoc function
	 * @name translations
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Registers a new translation table for specific language key.
	 *
	 * To register a translation table for specific language, pass a defined language
	 * key as first parameter.
	 *
	 * <pre>
	 *  // register translation table for language: 'de_DE'
	 *  $mbTranslateProvider.translations('de_DE', {
	 *    'GREETING': 'Hallo Welt!'
	 *  });
	 *
	 *  // register another one
	 *  $mbTranslateProvider.translations('en_US', {
	 *    'GREETING': 'Hello world!'
	 *  });
	 * </pre>
	 *
	 * When registering multiple translation tables for for the same language key,
	 * the actual translation table gets extended. This allows you to define module
	 * specific translation which only get added, once a specific module is loaded in
	 * your app.
	 *
	 * Invoking this method with no arguments returns the translation table which was
	 * registered with no language key. Invoking it with a language key returns the
	 * related translation table.
	 *
	 * @param {string} langKey A language key.
	 * @param {object} translationTable A plain old JavaScript object that represents a translation table.
	 *
	 */
	function translations(langKey, translationTable) {
		if (!langKey && !translationTable) {
			return $translationTable;
		}

		if (langKey && !translationTable) {
			if (angular.isString(langKey)) {
				return $translationTable[langKey];
			}
		} else {
			if (!angular.isObject($translationTable[langKey])) {
				$translationTable[langKey] = {};
			}
			angular.extend($translationTable[langKey], flatObject(translationTable));
		}
		return provider;
	};


	/**
	 @ngdoc function
	 @name cloakClassName
	 @methodOf $mbTranslateProvider
	 
	 @description
	 
	 Let's you change the class name for `mb-translate-cloak` directive.
	 Default class name is `mb-translate-cloak`.
	 
	 @param {string} name mb-translate-cloak class name
	 */

	/**
	@ngdoc function
	@name nestedObjectDelimeter
	@methodOf $mbTranslateProvider
	
	@description
	
	Let's you change the delimiter for namespaced translations.
	Default delimiter is `.`.
	
	@param {string} delimiter namespace separator
	 */

	/**
	 * @name flatObject
	 * @private
	 *
	 * @description
	 * Flats an object. This function is used to flatten given translation data with
	 * namespaces, so they are later accessible via dot notation.
	 */
	function flatObject(data, path, result, prevKey) {
		var key, keyWithPath, keyWithShortPath, val;

		if (!path) {
			path = [];
		}
		if (!result) {
			result = {};
		}
		for (key in data) {
			if (!Object.prototype.hasOwnProperty.call(data, key)) {
				continue;
			}
			val = data[key];
			if (angular.isObject(val)) {
				flatObject(val, path.concat(key), result, key);
			} else {
				keyWithPath = path.length ? ('' + path.join($nestedObjectDelimeter) + $nestedObjectDelimeter + key) : key;
				if (path.length && key === prevKey) {
					// Create shortcut path (foo.bar == foo.bar.bar)
					keyWithShortPath = '' + path.join($nestedObjectDelimeter);
					// Link it to original path
					result[keyWithShortPath] = '@:' + keyWithPath;
				}
				result[keyWithPath] = val;
			}
		}
		return result;
	}

	/**
	@ngdoc function
	@name addInterpolation
	@methodOf $mbTranslateProvider
	
	@description
	Adds interpolation services to angular-translate, so it can manage them.
	
	@param {object} factory Interpolation service factory
	 */
	function addInterpolation(factory) {
		$interpolatorFactories.push(factory);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useMessageFormatInterpolation
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use interpolation functionality of messageformat.js.
	 * This is useful when having high level pluralization and gender selection.
	 */
	function useMessageFormatInterpolation() {
		return this.useInterpolation('$mbTranslateMessageFormatInterpolation');
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useInterpolation
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate which interpolation style to use as default, application-wide.
	 * Simply pass a factory/service name. The interpolation service has to implement
	 * the correct interface.
	 *
	 * @param {string} factory Interpolation service name.
	 */
	function useInterpolation(factory) {
		$interpolationFactory = factory;
		return provider;
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useSanitizeStrategy
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Simply sets a sanitation strategy type.
	 *
	 * @param {string} value Strategy type.
	 */
	function useSanitizeValueStrategy(value) {
		$mbTranslateSanitizationProvider.useStrategy(value);
		return provider;
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#preferredLanguage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells the module which of the registered translation tables to use for translation
	 * at initial startup by passing a language key. Similar to `$mbTranslateProvider#use`
	 * only that it says which language to **prefer**.
	 * It is recommended to call this after {@link $mbTranslate#fallbackLanguage fallbackLanguage()}.
	 *
	 * @param {string} langKey A language key.
	 */
	function preferredLanguage(langKey) {
		if (langKey) {
			setupPreferredLanguage(langKey);
			return provider;
		}
		return $preferredLanguage;
	}

	function setupPreferredLanguage(langKey) {
		if (langKey) {
			$preferredLanguage = langKey;
		}
		return $preferredLanguage;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#translationNotFoundIndicator
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets an indicator which is used when a translation isn't found. E.g. when
	 * setting the indicator as 'X' and one tries to translate a translation id
	 * called `NOT_FOUND`, this will result in `X NOT_FOUND X`.
	 *
	 * Internally this methods sets a left indicator and a right indicator using
	 * `$mbTranslateProvider.translationNotFoundIndicatorLeft()` and
	 * `$mbTranslateProvider.translationNotFoundIndicatorRight()`.
	 *
	 * **Note**: These methods automatically add a whitespace between the indicators
	 * and the translation id.
	 *
	 * @param {string} indicator An indicator, could be any string.
	 */
	function translationNotFoundIndicator(indicator) {
		this.translationNotFoundIndicatorLeft(indicator);
		this.translationNotFoundIndicatorRight(indicator);
		return this;
	}

	/**
	 * ngdoc function
	 * @name $mbTranslateProvider#translationNotFoundIndicatorLeft
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets an indicator which is used when a translation isn't found left to the
	 * translation id.
	 *
	 * @param {string} indicator An indicator.
	 */
	function translationNotFoundIndicatorLeft(indicator) {
		if (!indicator) {
			return $notFoundIndicatorLeft;
		}
		$notFoundIndicatorLeft = indicator;
		return provider;
	}

	/**
	 * ngdoc function
	 * @name $mbTranslateProvider#translationNotFoundIndicatorLeft
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets an indicator which is used when a translation isn't found right to the
	 * translation id.
	 *
	 * @param {string} indicator An indicator.
	 */
	function translationNotFoundIndicatorRight(indicator) {
		if (!indicator) {
			return $notFoundIndicatorRight;
		}
		$notFoundIndicatorRight = indicator;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name fallbackLanguage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells the module which of the registered translation tables to use when missing translations
	 * at initial startup by passing a language key. Similar to `$mbTranslateProvider#use`
	 * only that it says which language to **fallback**.
	 *
	 * @param {string||array} langKey A language key.
	 *
	 */


	function fallbackStack(langKey) {
		if (langKey) {
			if (angular.isString(langKey)) {
				$fallbackWasString = true;
				$fallbackLanguage = [langKey];
			} else if (angular.isArray(langKey)) {
				$fallbackWasString = false;
				$fallbackLanguage = langKey;
			}
			if (angular.isString($preferredLanguage) && indexOf($fallbackLanguage, $preferredLanguage) < 0) {
				$fallbackLanguage.push($preferredLanguage);
			}

			return provider;
		} else {
			if ($fallbackWasString) {
				return $fallbackLanguage[0];
			} else {
				return $fallbackLanguage;
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#use
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Set which translation table to use for translation by given language key. When
	 * trying to 'use' a language which isn't provided, it'll throw an error.
	 *
	 * You actually don't have to use this method since `$mbTranslateProvider#preferredLanguage`
	 * does the job too.
	 *
	 * @param {string} langKey A language key.
	 */

	/**
	 * @ngdoc function
	 * @name resolveClientLocale
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	 *
	 * @returns {string} the current client/browser language key
	 */
	/**
	 * @ngdoc function
	 * @name resolveClientLocale
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	 *
	 * @returns {string} the current client/browser language key
	 */
	function resolveClientLocale() {
		return getLocale();
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#storageKey
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells the module which key must represent the choosed language by a user in the storage.
	 *
	 * @param {string} key A key for the storage.
	 */


	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useUrlLoader
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateUrlLoader` extension service as loader.
	 *
	 * @param {string} url Url
	 * @param {Object=} options Optional configuration object
	 */
	function useUrlLoader(urlPath, options) {
		this.useLoader('$mbTranslateUrlLoader', angular.extend({
			url: urlPath
		}, options));
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useStaticFilesLoader
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateStaticFilesLoader` extension service as loader.
	 *
	 * @param {Object=} options Optional configuration object
	 */
	function useStaticFilesLoader(options) {
		useLoader('$mbTranslateStaticFilesLoader', options);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useLoader
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use any other service as loader.
	 *
	 * @param {string} loaderFactory Factory name to use
	 * @param {Object=} options Optional configuration object
	 */
	function useLoader(loaderFactory, options) {
		$loaderFactory = loaderFactory;
		$loaderOptions = options || {};
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useLocalStorage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateLocalStorage` service as storage layer.
	 *
	 */
	function useLocalStorage() {
		useStorage('$mbTranslateLocalStorage');
		return provider
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useCookieStorage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateCookieStorage` service as storage layer.
	 */
	function useCookieStorage() {
		useStorage('$mbTranslateCookieStorage');
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useStorage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use custom service as storage layer.
	 */
	function useStorage(storageFactory) {
		$storageFactory = storageFactory;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#storagePrefix
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets prefix for storage key.
	 *
	 * @param {string} prefix Storage key prefix
	 */
	function storagePrefix(prefix) {
		if (!prefix) {
			return prefix;
		}
		$storagePrefix = prefix;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useMissingTranslationHandlerLog
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use built-in log handler when trying to translate
	 * a translation Id which doesn't exist.
	 *
	 * This is actually a shortcut method for `useMissingTranslationHandler()`.
	 *
	 */
	function useMissingTranslationHandlerLog() {
		return this.useMissingTranslationHandler('$mbTranslateMissingTranslationHandlerLog');
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useMissingTranslationHandler
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Expects a factory name which later gets instantiated with `injector`.
	 * This method can be used to tell angular-translate to use a custom
	 * missingTranslationHandler. Just build a factory which returns a function
	 * and expects a translation id as argument.
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.useMissingTranslationHandler('customHandler');
	 *  });
	 *
	 *  app.factory('customHandler', function (dep1, dep2) {
	 *    return function (translationId) {
	 *      // something with translationId and dep1 and dep2
	 *    };
	 *  });
	 * </pre>
	 *
	 * @param {string} factory Factory name
	 */
	function useMissingTranslationHandler(factory) {
		$missingTranslationHandlerFactory = factory;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#usePostCompiling
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * If post compiling is enabled, all translated values will be processed
	 * again with AngularJS' $compile.
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.usePostCompiling(true);
	 *  });
	 * </pre>
	 *
	 * @param {string} factory Factory name
	 */
	function usePostCompiling(value) {
		$postCompilingEnabled = !(!value);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#forceAsyncReload
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * If force async reload is enabled, async loader will always be called
	 * even if $translationTable already contains the language key, adding
	 * possible new entries to the $translationTable.
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.forceAsyncReload(true);
	 *  });
	 * </pre>
	 *
	 * @param {boolean} value - valid values are true or false
	 */
	function forceAsyncReload(value) {
		$forceAsyncReloadEnabled = !(!value);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#uniformLanguageTag
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate which language tag should be used as a result when determining
	 * the current browser language.
	 *
	 * This setting must be set before invoking {@link $mbTranslateProvider#methods_determinePreferredLanguage determinePreferredLanguage()}.
	 *
	 * <pre>
	 * $mbTranslateProvider
	 *   .uniformLanguageTag('bcp47')
	 *   .determinePreferredLanguage()
	 * </pre>
	 *
	 * The resolver currently supports:
	 * * default
	 *     (traditionally: hyphens will be converted into underscores, i.e. en-US => en_US)
	 *     en-US => en_US
	 *     en_US => en_US
	 *     en-us => en_us
	 * * java
	 *     like default, but the second part will be always in uppercase
	 *     en-US => en_US
	 *     en_US => en_US
	 *     en-us => en_US
	 * * BCP 47 (RFC 4646 & 4647)
	 *     EN => en
	 *     en-US => en-US
	 *     en_US => en-US
	 *     en-us => en-US
	 *     sr-latn => sr-Latn
	 *     sr-latn-rs => sr-Latn-RS
	 *
	 * See also:
	 * * http://en.wikipedia.org/wiki/IETF_language_tag
	 * * http://www.w3.org/International/core/langtags/
	 * * http://tools.ietf.org/html/bcp47
	 *
	 * @param {string|object} options - options (or standard)
	 * @param {string} options.standard - valid values are 'default', 'bcp47', 'java'
	 */
	function uniformLanguageTag(options) {

		if (!options) {
			options = {};
		} else if (angular.isString(options)) {
			options = {
				standard: options
			};
		}

		uniformLanguageTagResolver = options.standard;

		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#determinePreferredLanguage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to try to determine on its own which language key
	 * to set as preferred language. When `fn` is given, angular-translate uses it
	 * to determine a language key, otherwise it uses the built-in `getLocale()`
	 * method.
	 *
	 * The `getLocale()` returns a language key in the format `[lang]_[country]` or
	 * `[lang]` depending on what the browser provides.
	 *
	 * Use this method at your own risk, since not all browsers return a valid
	 * locale (see {@link $mbTranslateProvider#methods_uniformLanguageTag uniformLanguageTag()}).
	 *
	 * @param {Function=} fn Function to determine a browser's locale
	 */
	function determinePreferredLanguage(fn) {

		var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();

		if (!$availableLanguageKeys.length) {
			$preferredLanguage = locale;
		} else {
			$preferredLanguage = negotiateLocale(locale) || locale;
		}

		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#registerAvailableLanguageKeys
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Registers a set of language keys the app will work with. Use this method in
	 * combination with
	 * {@link $mbTranslateProvider#determinePreferredLanguage determinePreferredLanguage}.
	 * When available languages keys are registered, angular-translate
	 * tries to find the best fitting language key depending on the browsers locale,
	 * considering your language key convention.
	 *
	 * @param {object} languageKeys Array of language keys the your app will use
	 * @param {object=} aliases Alias map.
	 */
	function registerAvailableLanguageKeys(languageKeys, aliases) {
		$availableLanguageKeys = languageKeys;
		if (aliases) {
			$languageKeyAliases = aliases;
		}
		provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useLoaderCache
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Registers a cache for internal $http based loaders.
	 * {@link $translationCache $translationCache}.
	 * When false the cache will be disabled (default). When true or undefined
	 * the cache will be a default (see $cacheFactory). When an object it will
	 * be treat as a cache object itself: the usage is $http({cache: cache})
	 *
	 * @param {object} cache boolean, string or cache-object
	 */
	function useLoaderCache(flag) {
		if (flag === false) {
			// disable cache
			loaderCache = undefined;
		} else if (flag === true) {
			// enable cache using AJS defaults
			loaderCache = true;
		} else if (typeof (flag) === 'undefined') {
			// enable cache using default
			loaderCache = '$translationCache';
		} else if (flag) {
			// enable cache using given one (see $cacheFactory)
			loaderCache = flag;
		}
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name directivePriority
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets the default priority of the translate directive. The standard value is `0`.
	 * Calling this function without an argument will return the current value.
	 *
	 * @param {number} priority for the translate-directive
	 */
	function setDirectivePriority(priority) {
		// setter with chaining
		directivePriority = priority;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name statefulFilter
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Since AngularJS 1.3, filters which are not stateless (depending at the scope)
	 * have to explicit define this behavior.
	 * Sets whether the translate filter should be stateful or stateless. The standard value is `true`
	 * meaning being stateful.
	 * Calling this function without an argument will return the current value.
	 *
	 * @param {boolean} state - defines the state of the filter
	 */
	function setStatefulFilter(state) {
		if (state === undefined) {
			// getter
			return statefulFilter;
		} else {
			// setter with chaining
			statefulFilter = state;
			return service;
		}
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#postProcess
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * The post processor will be intercept right after the translation result. It can modify the result.
	 *
	 * @param {object} fn Function or service name (string) to be called after the translation value has been set / resolved. The function itself will enrich every value being processed and then continue the normal resolver process
	 */
	function postProcess(fn) {
		if (fn) {
			postProcessFn = fn;
		} else {
			postProcessFn = undefined;
		}
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#keepContent
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * If keepContent is set to true than translate directive will always use innerHTML
	 * as a default translation
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.keepContent(true);
	 *  });
	 * </pre>
	 *
	 * @param {boolean} value - valid values are true or false
	 */
	function keepContent(value) {
		$keepContent = !(!value);
		return provider;
	}



	/**
	 * @name applyNotFoundIndicators
	 * @private
	 *
	 * @description
	 * Applies not fount indicators to given translation id, if needed.
	 * This function gets only executed, if a translation id doesn't exist,
	 * which is why a translation id is expected as argument.
	 *
	 * @param {string} translationId Translation id.
	 * @returns {string} Same as given translation id but applied with not found
	 * indicators.
	 */
	function applyNotFoundIndicators(translationId) {
		// applying notFoundIndicators
		if ($notFoundIndicatorLeft) {
			translationId = [$notFoundIndicatorLeft, translationId].join(' ');
		}
		if ($notFoundIndicatorRight) {
			translationId = [translationId, $notFoundIndicatorRight].join(' ');
		}
		return translationId;
	}

	/**
	 * @name useLanguage
	 * @private
	 *
	 * @description
	 * Makes actual use of a language by setting a given language key as used
	 * language and informs registered interpolators to also use the given
	 * key as locale.
	 *
	 * @param {string} key Locale key.
	 */
	function useLanguage(key) {
		$uses = key;

		// make sure to store new language key before triggering success event
		if ($storageFactory) {
			Storage.put($mbTranslate.storageKey(), $uses);
		}

		$rootScope.$emit('$mbTranslateChangeSuccess', { language: key });

		// inform default interpolator
		defaultInterpolator.setLocale($uses);

		// inform all others too!
		angular.forEach(interpolatorHashMap, function(interpolator, id) {
			interpolatorHashMap[id].setLocale($uses);
		});
		$rootScope.$emit('$mbTranslateChangeEnd', { language: key });
	}

	/**
	 * @name loadAsync
	 * @private
	 *
	 * @description
	 * Kicks off registered async loader using `injector` and applies existing
	 * loader options. When resolved, it updates translation tables accordingly
	 * or rejects with given language key.
	 *
	 * @param {string} key Language key.
	 * @return {Promise} A promise.
	 */
	function loadAsync(key) {
		if (!key) {
			throw 'No language key specified for loading.';
		}

		var deferred = $q.defer();

		$rootScope.$emit('$mbTranslateLoadingStart', { language: key });
		pendingLoader = true;

		var cache = loaderCache;
		if (typeof (cache) === 'string') {
			// getting on-demand instance of loader
			cache = injector.get(cache);
		}

		var loaderOptions = angular.extend({}, $loaderOptions, {
			key: key,
			$http: angular.extend({}, {
				cache: cache
			}, $loaderOptions.$http)
		});

		var onLoaderSuccess = function(data) {
			var translationTable = {};
			$rootScope.$emit('$mbTranslateLoadingSuccess', { language: key });

			if (angular.isArray(data)) {
				angular.forEach(data, function(table) {
					angular.extend(translationTable, flatObject(table));
				});
			} else {
				angular.extend(translationTable, flatObject(data));
			}
			pendingLoader = false;
			deferred.resolve({
				key: key,
				table: translationTable
			});
			$rootScope.$emit('$mbTranslateLoadingEnd', { language: key });
		};

		var onLoaderError = function(key) {
			$rootScope.$emit('$mbTranslateLoadingError', { language: key });
			deferred.reject(key);
			$rootScope.$emit('$mbTranslateLoadingEnd', { language: key });
		};

		injector.get($loaderFactory)(loaderOptions)
			.then(onLoaderSuccess, onLoaderError);

		return deferred.promise;
	}

	/**
	 * @name getTranslationTable
	 * @private
	 *
	 * @description
	 * Returns a promise that resolves to the translation table
	 * or is rejected if an error occurred.
	 *
	 * @param langKey
	 * @returns {Q.promise}
	 */
	function getTranslationTable(langKey) {
		var deferred = $q.defer();
		if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
			deferred.resolve($translationTable[langKey]);
		} else if (langPromises[langKey]) {
			langPromises[langKey].then(function(data) {
				translations(data.key, data.table);
				deferred.resolve(data.table);
			}, deferred.reject);
		} else {
			deferred.reject();
		}
		return deferred.promise;
	}

	/**
	 * @name getFallbackTranslation
	 * @private
	 *
	 * @description
	 * Returns a promise that will resolve to the translation
	 * or be rejected if no translation was found for the language.
	 * This function is currently only used for fallback language translation.
	 *
	 * @param langKey The language to translate to.
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy
	 * @returns {Q.promise}
	 */
	function getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		var deferred = $q.defer();
		getTranslationTable(langKey).then(function(translationTable) {
			if (Object.prototype.hasOwnProperty.call(translationTable, translationId) && translationTable[translationId] !== null) {
				Interpolator.setLocale(langKey);
				var translation = translationTable[translationId];
				if (translation.substr(0, 2) === '@:') {
					getFallbackTranslation(langKey, translation.substr(2), interpolateParams, Interpolator, sanitizeStrategy)
						.then(deferred.resolve, deferred.reject);
				} else {
					var interpolatedValue = Interpolator.interpolate(translationTable[translationId], interpolateParams, 'service', sanitizeStrategy, translationId);
					interpolatedValue = applyPostProcessing(translationId, translationTable[translationId], interpolatedValue, interpolateParams, langKey);

					deferred.resolve(interpolatedValue);

				}
				Interpolator.setLocale($uses);
			} else {
				deferred.reject();
			}
		}, deferred.reject);

		return deferred.promise;
	}

	/**
	 * @name getFallbackTranslationInstant
	 * @private
	 *
	 * @description
	 * Returns a translation
	 * This function is currently only used for fallback language translation.
	 *
	 * @param langKey The language to translate to.
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy sanitize strategy override
	 *
	 * @returns {string} translation
	 */
	function getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		var result, translationTable = $translationTable[langKey];

		if (translationTable && Object.prototype.hasOwnProperty.call(translationTable, translationId) && translationTable[translationId] !== null) {
			Interpolator.setLocale(langKey);
			result = Interpolator.interpolate(translationTable[translationId], interpolateParams, 'filter', sanitizeStrategy, translationId);
			result = applyPostProcessing(translationId, translationTable[translationId], result, interpolateParams, langKey, sanitizeStrategy);
			// workaround for TrustedValueHolderType
			if (!angular.isString(result) && angular.isFunction(result.$$unwrapTrustedValue)) {
				var result2 = result.$$unwrapTrustedValue();
				if (result2.substr(0, 2) === '@:') {
					return getFallbackTranslationInstant(langKey, result2.substr(2), interpolateParams, Interpolator, sanitizeStrategy);
				}
			} else if (result.substr(0, 2) === '@:') {
				return getFallbackTranslationInstant(langKey, result.substr(2), interpolateParams, Interpolator, sanitizeStrategy);
			}
			Interpolator.setLocale($uses);
		}

		return result;
	}


	/**
	 * @name translateByHandler
	 * @private
	 *
	 * Translate by missing translation handler.
	 *
	 * @param translationId
	 * @param interpolateParams
	 * @param defaultTranslationText
	 * @param sanitizeStrategy sanitize strategy override
	 *
	 * @returns translation created by $missingTranslationHandler or translationId is $missingTranslationHandler is
	 * absent
	 */
	function translateByHandler(translationId, interpolateParams, defaultTranslationText, sanitizeStrategy) {
		// If we have a handler factory - we might also call it here to determine if it provides
		// a default text for a translationid that can't be found anywhere in our tables
		if ($missingTranslationHandlerFactory) {
			return injector.get($missingTranslationHandlerFactory)(translationId, $uses, interpolateParams, defaultTranslationText, sanitizeStrategy);
		} else {
			return translationId;
		}
	}

	/**
	 * @name resolveForFallbackLanguage
	 * @private
	 *
	 * Recursive helper function for fallbackTranslation that will sequentially look
	 * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
	 *
	 * @param fallbackLanguageIndex
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param defaultTranslationText
	 * @param sanitizeStrategy
	 * @returns {Q.promise} Promise that will resolve to the translation.
	 */
	function resolveForFallbackLanguage(fallbackLanguageIndex, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
		var deferred = $q.defer();

		if (fallbackLanguageIndex < $fallbackLanguage.length) {
			var langKey = $fallbackLanguage[fallbackLanguageIndex];
			getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy).then(
				function(data) {
					deferred.resolve(data);
				},
				function() {
					// Look in the next fallback language for a translation.
					// It delays the resolving by passing another promise to resolve.
					return resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy).then(deferred.resolve, deferred.reject);
				}
			);
		} else {
			// No translation found in any fallback language
			// if a default translation text is set in the directive, then return this as a result
			if (defaultTranslationText) {
				deferred.resolve(defaultTranslationText);
			} else {
				var missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);

				// if no default translation is set and an error handler is defined, send it to the handler
				// and then return the result if it isn't undefined
				if ($missingTranslationHandlerFactory && missingTranslationHandlerTranslation) {
					deferred.resolve(missingTranslationHandlerTranslation);
				} else {
					deferred.reject(applyNotFoundIndicators(translationId));
				}
			}
		}
		return deferred.promise;
	}

	/**
	 * @name resolveForFallbackLanguageInstant
	 * @private
	 *
	 * Recursive helper function for fallbackTranslation that will sequentially look
	 * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
	 *
	 * @param fallbackLanguageIndex
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy
	 * @returns {string} translation
	 */
	function resolveForFallbackLanguageInstant(fallbackLanguageIndex, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		var result;

		if (fallbackLanguageIndex < $fallbackLanguage.length) {
			var langKey = $fallbackLanguage[fallbackLanguageIndex];
			result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy);
			if (!result && result !== '') {
				result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
			}
		}
		return result;
	}

	/**
	 * Translates with the usage of the fallback languages.
	 *
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param defaultTranslationText
	 * @param sanitizeStrategy
	 * @returns {Q.promise} Promise, that resolves to the translation.
	 */
	function fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
		// Start with the fallbackLanguage with index 0
		return resolveForFallbackLanguage((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy);
	}

	/**
	 * Translates with the usage of the fallback languages.
	 *
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy
	 * @returns {String} translation
	 */
	function fallbackTranslationInstant(translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		// Start with the fallbackLanguage with index 0
		return resolveForFallbackLanguageInstant((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, sanitizeStrategy);
	};

	function determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy) {

		var deferred = $q.defer();

		var table = uses ? $translationTable[uses] : $translationTable,
			Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

		// if the translation id exists, we can just interpolate it
		if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
			var translation = table[translationId];

			// If using link, rerun $mbTranslate with linked translationId and return it
			if (translation.substr(0, 2) === '@:') {

				$mbTranslate(translation.substr(2), interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy)
					.then(deferred.resolve, deferred.reject);
			} else {
				//
				var resolvedTranslation = Interpolator.interpolate(translation, interpolateParams, 'service', sanitizeStrategy, translationId);
				resolvedTranslation = applyPostProcessing(translationId, translation, resolvedTranslation, interpolateParams, uses);
				deferred.resolve(resolvedTranslation);
			}
		} else {
			var missingTranslationHandlerTranslation;
			// for logging purposes only (as in $mbTranslateMissingTranslationHandlerLog), value is not returned to promise
			if ($missingTranslationHandlerFactory && !pendingLoader) {
				missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);
			}

			// since we couldn't translate the inital requested translation id,
			// we try it now with one or more fallback languages, if fallback language(s) is
			// configured.
			if (uses && $fallbackLanguage && $fallbackLanguage.length) {
				fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy)
					.then(function(translation) {
						deferred.resolve(translation);
					}, function(_translationId) {
						deferred.reject(applyNotFoundIndicators(_translationId));
					});
			} else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
				// looks like the requested translation id doesn't exists.
				// Now, if there is a registered handler for missing translations and no
				// asyncLoader is pending, we execute the handler
				if (defaultTranslationText) {
					deferred.resolve(defaultTranslationText);
				} else {
					deferred.resolve(missingTranslationHandlerTranslation);
				}
			} else {
				if (defaultTranslationText) {
					deferred.resolve(defaultTranslationText);
				} else {
					deferred.reject(applyNotFoundIndicators(translationId));
				}
			}
		}
		return deferred.promise;
	}

	function determineTranslationInstant(translationId, interpolateParams, interpolationId, uses, sanitizeStrategy) {

		var result, table = uses ? $translationTable[uses] : $translationTable,
			Interpolator = defaultInterpolator;

		// if the interpolation id exists use custom interpolator
		if (interpolatorHashMap && Object.prototype.hasOwnProperty.call(interpolatorHashMap, interpolationId)) {
			Interpolator = interpolatorHashMap[interpolationId];
		}

		// if the translation id exists, we can just interpolate it
		if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
			var translation = table[translationId];

			// If using link, rerun $mbTranslate with linked translationId and return it
			if (translation.substr(0, 2) === '@:') {
				result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId, uses, sanitizeStrategy);
			} else {
				result = Interpolator.interpolate(translation, interpolateParams, 'filter', sanitizeStrategy, translationId);
				result = applyPostProcessing(translationId, translation, result, interpolateParams, uses, sanitizeStrategy);
			}
		} else {
			var missingTranslationHandlerTranslation;
			// for logging purposes only (as in $mbTranslateMissingTranslationHandlerLog), value is not returned to promise
			if ($missingTranslationHandlerFactory && !pendingLoader) {
				missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
			}

			// since we couldn't translate the inital requested translation id,
			// we try it now with one or more fallback languages, if fallback language(s) is
			// configured.
			if (uses && $fallbackLanguage && $fallbackLanguage.length) {
				fallbackIndex = 0;
				result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator, sanitizeStrategy);
			} else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
				// looks like the requested translation id doesn't exists.
				// Now, if there is a registered handler for missing translations and no
				// asyncLoader is pending, we execute the handler
				result = missingTranslationHandlerTranslation;
			} else {
				result = applyNotFoundIndicators(translationId);
			}
		}

		return result;
	}

	function clearNextLangAndPromise(key) {
		if ($nextLang === key) {
			$nextLang = undefined;
		}
		langPromises[key] = undefined;
	}

	function applyPostProcessing(translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy) {
		var fn = postProcessFn;

		if (fn) {

			if (typeof (fn) === 'string') {
				// getting on-demand instance
				fn = injector.get(fn);
			}
			if (fn) {
				return fn(translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy);
			}
		}

		return resolvedTranslation;
	}

	function loadTranslationsIfMissing(key) {
		if (!$translationTable[key] && $loaderFactory && !langPromises[key]) {
			langPromises[key] = loadAsync(key).then(function(translation) {
				translations(translation.key, translation.table);
				return translation;
			});
		}
	}


	/**
	 * @ngdoc function
	 * @name $mbTranslate#getAvailableLanguageKeys
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * This function simply returns the registered language keys being defined before in the config phase
	 * With this, an application can use the array to provide a language selection dropdown or similar
	 * without any additional effort
	 *
	 * @returns {object} returns the list of possibly registered language keys and mapping or null if not defined
	 */
	function getAvailableLanguageKeys() {
		if ($availableLanguageKeys.length > 0) {
			return $availableLanguageKeys;
		}
		return null;
	}



	/**
	 * @ngdoc function
	 * @name getTranslationTable
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns translation table by the given language key.
	 *
	 * Unless a language is provided it returns a translation table of the current one.
	 * Note: If translation dictionary is currently downloading or in progress
	 * it will return null.
	 *
	 * @param {string} langKey A token which represents a translation id
	 *
	 * @return {object} a copy of angular-translate $translationTable
	 */
	function getTranslationTable(langKey) {
		langKey = langKey || use();
		if (langKey && $translationTable[langKey]) {
			return angular.copy($translationTable[langKey]);
		}
		//			return null;
	}



	/**
	 * @ngdoc function
	 * @name preferredLanguage
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the language key for the preferred language.
	 *
	 * @param {string} langKey language String or Array to be used as preferredLanguage (changing at runtime)
	 *
	 * @return {string} preferred language key
	 */

	/**
	 * @ngdoc function
	 * @name loakClassName
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the configured class name for `mb-translate-cloak` directive.
	 *
	 * @return {string} cloakClassName
	 */
	function cloakClassName() {
		return $cloakClassName;
	}

	/**
	 * @ngdoc function
	 * @name nestedObjectDelimeter
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the configured delimiter for nested namespaces.
	 *
	 * @return {string} nestedObjectDelimeter
	 */
	function nestedObjectDelimeter() {
		return $nestedObjectDelimeter;
	}

	/**
	 @ngdoc function
	 @name fallbackLanguage
	 @methodOf $mbTranslate
	 
	 @description
	 Returns the language key for the fallback languages or sets a new fallback stack.
	 It is recommended to call this before {@link $mbTranslateProvider#preferredLanguage preferredLanguage()}.
	 
	 @param {string=} langKey language String or Array of fallback languages to be used (to change stack at runtime)
	 
	 @return {string||array} fallback language key
	 */
	function fallbackLanguage(langKey) {
		if (langKey !== undefined && langKey !== null) {
			fallbackStack(langKey);

			// as we might have an async loader initiated and a new translation language might have been defined
			// we need to add the promise to the stack also. So - iterate.
			if ($loaderFactory) {
				if ($fallbackLanguage && $fallbackLanguage.length) {
					for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
						if (!langPromises[$fallbackLanguage[i]]) {
							langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
						}
					}
				}
			}
			$mbTranslate.use($mbTranslate.use());
		}
		if ($fallbackWasString) {
			return $fallbackLanguage[0];
		} else {
			return $fallbackLanguage;
		}
	}

	/**
	 @ngdoc function
	 @name useFallbackLanguage
	 @methodOf $mbTranslate
	 
	 @description
	 Sets the first key of the fallback language stack to be used for translation.
	 Therefore all languages in the fallback array BEFORE this key will be skipped!
	 
	 @param {string=} langKey Contains the langKey the iteration shall start with. Set to false if you want to
	 get back to the whole stack
	 */
	function useFallbackLanguage(langKey) {
		if (langKey !== undefined && langKey !== null) {
			if (!langKey) {
				startFallbackIteration = 0;
			} else {
				var langKeyPosition = indexOf($fallbackLanguage, langKey);
				if (langKeyPosition > -1) {
					startFallbackIteration = langKeyPosition;
				}
			}
		}
	}

	/**
	@ngdoc function
	@name $mbTranslate#proposedLanguage
	@methodOf $mbTranslate
	
	@description
	Returns the language key of language that is currently loaded asynchronously.
	
	@return {string} language key
	 */
	function proposedLanguage() {
		return $nextLang;
	}

	/**
	@ngdoc function
	@name $mbTranslate#storage
	@methodOf $mbTranslate
	
	@description
	Returns registered storage.
	
	@return {object} Storage
	 */
	function storage() {
		return Storage;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#negotiateLocale
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns a language key based on available languages and language aliases. If a
	 * language key cannot be resolved, returns undefined.
	 *
	 * If no or a falsy key is given, returns undefined.
	 *
	 * @param {string} [key] Language key
	 * @return {string|undefined} Language key or undefined if no language key is found.
	 */

	/**
	@ngdoc function
	@name use
	@methodOf $mbTranslate
	
	@description
	Tells angular-translate which language to use by given language key. This method is
	used to change language at runtime. It also takes care of storing the language
	key in a configured store to let your app remember the choosed language.
	
	When trying to 'use' a language which isn't available it tries to load it
	asynchronously with registered loaders.
	
	Returns promise object with loaded language file data or string of the currently used language.
	
	If no or a falsy key is given it returns the currently used language key.
	The returned string will be ```undefined``` if setting up $mbTranslate hasn't finished.
	
	@example
	$mbTranslate.use("en_US").then(function(data){
	  $scope.text = $mbTranslate("HELLO");
	});
	
	@param {string=} key Language key
	@return {object|string} Promise with loaded language data or the language key if a falsy param was given.
	 */
	function use(key) {
		if (!key) {
			return $uses;
		}

		var deferred = $q.defer();
		deferred.promise.then(null, angular.noop); // AJS "Possibly unhandled rejection"

		$rootScope.$emit('$mbTranslateChangeStart', { language: key });

		// Try to get the aliased language key
		var aliasedKey = negotiateLocale(key);
		// Ensure only registered language keys will be loaded
		if ($availableLanguageKeys.length > 0 && !aliasedKey) {
			return $q.reject(key);
		}

		if (aliasedKey) {
			key = aliasedKey;
		}

		// if there isn't a translation table for the language we've requested,
		// we load it asynchronously
		$nextLang = key;
		if (($forceAsyncReloadEnabled || !$translationTable[key]) && $loaderFactory && !langPromises[key]) {
			langPromises[key] = loadAsync(key).then(function(translation) {
				translations(translation.key, translation.table);
				deferred.resolve(translation.key);
				if ($nextLang === key) {
					useLanguage(translation.key);
				}
				return translation;
			}, function(key) {
				$rootScope.$emit('$mbTranslateChangeError', { language: key });
				deferred.reject(key);
				$rootScope.$emit('$mbTranslateChangeEnd', { language: key });
				return $q.reject(key);
			});
			langPromises[key]['finally'](function() {
				clearNextLangAndPromise(key);
			})['catch'](angular.noop); // we don't care about errors (clearing)
		} else if (langPromises[key]) {
			// we are already loading this asynchronously
			// resolve our new deferred when the old langPromise is resolved
			langPromises[key].then(function(translation) {
				if ($nextLang === translation.key) {
					useLanguage(translation.key);
				}
				deferred.resolve(translation.key);
				return translation;
			}, function(key) {
				// find first available fallback language if that request has failed
				if (!$uses && $fallbackLanguage && $fallbackLanguage.length > 0 && $fallbackLanguage[0] !== key) {
					return $mbTranslate.use($fallbackLanguage[0]).then(deferred.resolve, deferred.reject);
				} else {
					return deferred.reject(key);
				}
			});
		} else {
			deferred.resolve(key);
			useLanguage(key);
		}

		return deferred.promise;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#resolveClientLocale
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	 *
	 * @returns {string} the current client/browser language key
	 */
	//	function resolveClientLocale() {
	//		return getLocale();
	//	}

	/**
	 * @ngdoc function
	 * @name storageKey
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the key for the storage.
	 *
	 * @return {string} storage key
	 */
	//		function storageKey() {
	//			return storageKey();
	//		}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isPostCompilingEnabled
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether post compiling is enabled or not
	 *
	 * @return {bool} storage key
	 */
	function isPostCompilingEnabled() {
		return $postCompilingEnabled;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isForceAsyncReloadEnabled
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether force async reload is enabled or not
	 *
	 * @return {boolean} forceAsyncReload value
	 */
	function isForceAsyncReloadEnabled() {
		return $forceAsyncReloadEnabled;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isKeepContent
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether keepContent or not
	 *
	 * @return {boolean} keepContent value
	 */
	function isKeepContent() {
		return $keepContent;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#refresh
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Refreshes a translation table pointed by the given langKey. If langKey is not specified,
	 * the module will drop all existent translation tables and load new version of those which
	 * are currently in use.
	 *
	 * Refresh means that the module will drop target translation table and try to load it again.
	 *
	 * In case there are no loaders registered the refresh() method will throw an Error.
	 *
	 * If the module is able to refresh translation tables refresh() method will broadcast
	 * $mbTranslateRefreshStart and $mbTranslateRefreshEnd events.
	 *
	 * @example
	 * // this will drop all currently existent translation tables and reload those which are
	 * // currently in use
	 * $mbTranslate.refresh();
	 * // this will refresh a translation table for the en_US language
	 * $mbTranslate.refresh('en_US');
	 *
	 * @param {string} langKey A language key of the table, which has to be refreshed
	 *
	 * @return {promise} Promise, which will be resolved in case a translation tables refreshing
	 * process is finished successfully, and reject if not.
	 */
	function refresh(langKey) {
		if (!$loaderFactory) {
			throw new Error('Couldn\'t refresh translation table, no loader registered!');
		}

		$rootScope.$emit('$mbTranslateRefreshStart', { language: langKey });

		var deferred = $q.defer(), updatedLanguages = {};

		//private helper
		function loadNewData(languageKey) {
			var promise = loadAsync(languageKey);
			//update the load promise cache for this language
			langPromises[languageKey] = promise;
			//register a data handler for the promise
			promise.then(function(data) {
				//clear the cache for this language
				$translationTable[languageKey] = {};
				//add the new data for this language
				translations(languageKey, data.table);
				//track that we updated this language
				updatedLanguages[languageKey] = true;
			},
				//handle rejection to appease the $q validation
				angular.noop);
			return promise;
		}

		//set up post-processing
		deferred.promise.then(
			function() {
				for (var key in $translationTable) {
					if ($translationTable.hasOwnProperty(key)) {
						//delete cache entries that were not updated
						if (!(key in updatedLanguages)) {
							delete $translationTable[key];
						}
					}
				}
				if ($uses) {
					useLanguage($uses);
				}
			},
			//handle rejection to appease the $q validation
			angular.noop
		)['finally'](
			function() {
				$rootScope.$emit('$mbTranslateRefreshEnd', { language: langKey });
			}
		);

		if (!langKey) {
			// if there's no language key specified we refresh ALL THE THINGS!
			var languagesToReload = $fallbackLanguage && $fallbackLanguage.slice() || [];
			if ($uses && languagesToReload.indexOf($uses) === -1) {
				languagesToReload.push($uses);
			}
			$q.all(languagesToReload.map(loadNewData)).then(deferred.resolve, deferred.reject);

		} else if ($translationTable[langKey]) {
			//just refresh the specified language cache
			loadNewData(langKey).then(deferred.resolve, deferred.reject);

		} else {
			deferred.reject();
		}

		return deferred.promise;
	};

	/**
	 * @ngdoc function
	 * @name instant
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns a translation instantly from the internal state of loaded translation. All rules
	 * regarding the current language, the preferred language of even fallback languages will be
	 * used except any promise handling. If a language was not found, an asynchronous loading
	 * will be invoked in the background.
	 *
	 * @param {string|array} translationId A token which represents a translation id
	 *                                     This can be optionally an array of translation ids which
	 *                                     results that the function's promise returns an object where
	 *                                     each key is the translation id and the value the translation.
	 * @param {object=} [interpolateParams={}] Params
	 * @param {string=} [interpolationId=undefined] The id of the interpolation to use (use default unless set via useInterpolation())
	 * @param {string=} [forceLanguage=false] A language to be used instead of the current language
	 * @param {string=} [sanitizeStrategy=undefined] force sanitize strategy for this call instead of using the configured one (use default unless set)
	 *
	 * @return {string|object} translation
	 */
	function instant(translationId, interpolateParams, interpolationId, forceLanguage, sanitizeStrategy) {

		// we don't want to re-negotiate $uses
		var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
			(negotiateLocale(forceLanguage) || forceLanguage) : $uses;

		// Detect undefined and null values to shorten the execution and prevent exceptions
		if (translationId === null || angular.isUndefined(translationId)) {
			return translationId;
		}

		// Check forceLanguage is present
		if (forceLanguage) {
			loadTranslationsIfMissing(forceLanguage);
		}

		// Duck detection: If the first argument is an array, a bunch of translations was requested.
		// The result is an object.
		if (angular.isArray(translationId)) {
			var results = {};
			for (var i = 0, c = translationId.length; i < c; i++) {
				results[translationId[i]] = $mbTranslate.instant(translationId[i], interpolateParams, interpolationId, forceLanguage, sanitizeStrategy);
			}
			return results;
		}

		// We discarded unacceptable values. So we just need to verify if translationId is empty String
		if (angular.isString(translationId) && translationId.length < 1) {
			return translationId;
		}

		// trim off any whitespace
		if (translationId) {
			translationId = trim(translationId);
		}

		var result, possibleLangKeys = [];
		if ($preferredLanguage) {
			possibleLangKeys.push($preferredLanguage);
		}
		if (uses) {
			possibleLangKeys.push(uses);
		}
		if ($fallbackLanguage && $fallbackLanguage.length) {
			possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
		}
		for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
			var possibleLangKey = possibleLangKeys[j];
			if ($translationTable[possibleLangKey]) {
				if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
					result = determineTranslationInstant(translationId, interpolateParams, interpolationId, uses, sanitizeStrategy);
				}
			}
			if (typeof result !== 'undefined') {
				break;
			}
		}

		if (!result && result !== '') {
			if ($notFoundIndicatorLeft || $notFoundIndicatorRight) {
				result = applyNotFoundIndicators(translationId);
			} else {
				// Return translation of default interpolator if not found anything.
				result = defaultInterpolator.interpolate(translationId, interpolateParams, 'filter', sanitizeStrategy);

				// looks like the requested translation id doesn't exists.
				// Now, if there is a registered handler for missing translations and no
				// asyncLoader is pending, we execute the handler
				var missingTranslationHandlerTranslation;
				if ($missingTranslationHandlerFactory && !pendingLoader) {
					missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
				}

				if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
					result = missingTranslationHandlerTranslation;
				}
			}
		}

		return result;
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslate#loaderCache
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the defined loaderCache.
	 *
	 * @return {boolean|string|object} current value of loaderCache
	 */
	function loaderCache() {
		return loaderCache;
	}

	// internal purpose only
	function getDirectivePriority() {
		return directivePriority;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isReady
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether the service is "ready" to translate (i.e. loading 1st language).
	 *
	 * See also {@link $mbTranslate#methods_onReady onReady()}.
	 *
	 * @return {boolean} current value of ready
	 */
	function isReady() {
		return $isReady;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#onReady
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Calls the function provided or resolved the returned promise after the service is "ready" to translate (i.e. loading 1st language).
	 *
	 * See also {@link $mbTranslate#methods_isReady isReady()}.
	 *
	 * @param {Function=} fn Function to invoke when service is ready
	 * @return {object} Promise resolved when service is ready
	 */
	function onReady(fn) {
		var deferred = $q.defer();
		if (angular.isFunction(fn)) {
			deferred.promise.then(fn);
		}
		if ($isReady) {
			deferred.resolve();
		} else {
			$onReadyDeferred.promise.then(deferred.resolve);
		}
		return deferred.promise;
	}


	//-----------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------

	service = function(translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy) {
		if (!$uses && $preferredLanguage) {
			$uses = $preferredLanguage;
		}
		var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
			(negotiateLocale(forceLanguage) || forceLanguage) : $uses;

		// Check forceLanguage is present
		if (forceLanguage) {
			loadTranslationsIfMissing(forceLanguage);
		}

		// Duck detection: If the first argument is an array, a bunch of translations was requested.
		// The result is an object.
		if (angular.isArray(translationId)) {
			// Inspired by Q.allSettled by Kris Kowal
			// https://github.com/kriskowal/q/blob/b0fa72980717dc202ffc3cbf03b936e10ebbb9d7/q.js#L1553-1563
			// This transforms all promises regardless resolved or rejected
			var translateAll = function(translationIds) {
				var results = {}; // storing the actual results
				var promises = []; // promises to wait for
				// Wraps the promise a) being always resolved and b) storing the link id->value
				var translate = function(translationId) {
					var deferred = $q.defer();
					var regardless = function(value) {
						results[translationId] = value;
						deferred.resolve([translationId, value]);
					};
					// we don't care whether the promise was resolved or rejected; just store the values
					$mbTranslate(translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy).then(regardless, regardless);
					return deferred.promise;
				};
				for (var i = 0, c = translationIds.length; i < c; i++) {
					promises.push(translate(translationIds[i]));
				}
				// wait for all (including storing to results)
				return $q.all(promises).then(function() {
					// return the results
					return results;
				});
			};
			return translateAll(translationId);
		}

		var deferred = $q.defer();

		// trim off any whitespace
		if (translationId) {
			translationId = trim(translationId);
		}

		var promiseToWaitFor = (function() {
			var promise = langPromises[uses] || langPromises[$preferredLanguage];

			fallbackIndex = 0;

			if ($storageFactory && !promise) {
				// looks like there's no pending promise for $preferredLanguage or
				// $uses. Maybe there's one pending for a language that comes from
				// storage.
				var langKey = Storage.get($storageKey);
				promise = langPromises[langKey];

				if ($fallbackLanguage && $fallbackLanguage.length) {
					var index = indexOf($fallbackLanguage, langKey);
					// maybe the language from storage is also defined as fallback language
					// we increase the fallback language index to not search in that language
					// as fallback, since it's probably the first used language
					// in that case the index starts after the first element
					fallbackIndex = (index === 0) ? 1 : 0;

					// but we can make sure to ALWAYS fallback to preferred language at least
					if (indexOf($fallbackLanguage, $preferredLanguage) < 0) {
						$fallbackLanguage.push($preferredLanguage);
					}
				}
			}
			return promise;
		}());

		if (!promiseToWaitFor) {
			// no promise to wait for? okay. Then there's no loader registered
			// nor is a one pending for language that comes from storage.
			// We can just translate.
			determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
		} else {
			var promiseResolved = function() {
				// $uses may have changed while waiting
				if (!forceLanguage) {
					uses = $uses;
				}
				determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
			};
			promiseToWaitFor['finally'](promiseResolved)['catch'](angular.noop); // we don't care about errors here, already handled
		}
		return deferred.promise;
	};

	service = _.assign(service, {
		setupPreferredLanguage: setupPreferredLanguage,
		preferredLanguage: function() {
			return $preferredLanguage;
		},
		cloakClassName: cloakClassName,
		nestedObjectDelimeter: nestedObjectDelimeter,
		fallbackLanguage: fallbackLanguage,
		useFallbackLanguage: useFallbackLanguage,
		proposedLanguage: proposedLanguage,
		storage: storage,
		negotiateLocale: negotiateLocale,
		use: use,
		storageKey: function() {
			if ($storagePrefix) {
				return $storagePrefix + $storageKey;
			}
			return $storageKey;
		},
		resolveClientLocale: resolveClientLocale,
		isPostCompilingEnabled: isPostCompilingEnabled,
		isForceAsyncReloadEnabled: isForceAsyncReloadEnabled,
		isKeepContent: isKeepContent,
		refresh: refresh,
		instant: instant,
		loaderCache: loaderCache,
		statefulFilter: setStatefulFilter,
		getDirectivePriority: getDirectivePriority,
		isReady: isReady,
		onReady: onReady,
		getAvailableLanguageKeys: getAvailableLanguageKeys,
		getTranslationTable: getTranslationTable,
	});
	provider = {
		$get: function($injector) {
			injector = $injector;
			defaultInterpolator = injector.get($interpolationFactory || '$mbTranslateDefaultInterpolation');
			$q = injector.get('$q');
			$rootScope = injector.get('$rootScope');


			$onReadyDeferred = $q.defer();
			$onReadyDeferred.promise.then(function() {
				$isReady = true;
			});
			if ($storageFactory) {
				Storage = injector.get($storageFactory);

				if (!Storage.get || !Storage.put) {
					throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or put() method!');
				}
			}

			// if we have additional interpolations that were added via
			// $mbTranslateProvider.addInterpolation(), we have to map'em
			if ($interpolatorFactories.length) {
				angular.forEach($interpolatorFactories, function(interpolatorFactory) {
					var interpolator = injector.get(interpolatorFactory);
					// setting initial locale for each interpolation service
					interpolator.setLocale($preferredLanguage || $uses);
					// make'em recognizable through id
					interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
				});
			}

			// Whenever $mbTranslateReady is being fired, this will ensure the state of $isReady
			var globalOnReadyListener = $rootScope.$on('$mbTranslateReady', function() {
				$onReadyDeferred.resolve();
				globalOnReadyListener(); // one time only
				globalOnReadyListener = null;
			});
			var globalOnChangeListener = $rootScope.$on('$mbTranslateChangeEnd', function() {
				$onReadyDeferred.resolve();
				globalOnChangeListener(); // one time only
				globalOnChangeListener = null;
			});

			if ($loaderFactory) {
				// If at least one async loader is defined and there are no
				// (default) translations available we should try to load them.
				if (angular.equals($translationTable, {})) {
					if (service.use()) {
						service.use(service.use());
					}
				}
				// Also, if there are any fallback language registered, we start
				// loading them asynchronously as soon as we can.
				if ($fallbackLanguage && $fallbackLanguage.length) {
					var processAsyncResult = function(translation) {
						translations(translation.key, translation.table);
						$rootScope.$emit('$mbTranslateChangeEnd', { language: translation.key });
						return translation;
					};
					for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
						var fallbackLanguageId = $fallbackLanguage[i];
						if ($forceAsyncReloadEnabled || !$translationTable[fallbackLanguageId]) {
							langPromises[fallbackLanguageId] = loadAsync(fallbackLanguageId).then(processAsyncResult);
						}
					}
				}
			} else {
				$rootScope.$emit('$mbTranslateReady', { language: service.use() });
			}
			return service;
		},
		translations: translations,
		cloakClassName: function(name) {
			$cloakClassName = name;
			return provider;
		},
		nestedObjectDelimeter: function(delimiter) {
			$nestedObjectDelimeter = delimiter;
			return provider;
		},
		addInterpolation: addInterpolation,
		useMessageFormatInterpolation: useMessageFormatInterpolation,
		useInterpolation: useInterpolation,
		useSanitizeValueStrategy: useSanitizeValueStrategy,
		preferredLanguage: preferredLanguage,
		translationNotFoundIndicator: translationNotFoundIndicator,
		translationNotFoundIndicatorLeft: translationNotFoundIndicatorLeft,
		translationNotFoundIndicatorRight: translationNotFoundIndicatorRight,
		resolveClientLocale: resolveClientLocale,
		fallbackLanguage: function(langKey) {
			fallbackStack(langKey);
			return provider;
		},
		fallbackStack: fallbackStack,
		use: function(langKey) {
			if (!$translationTable[langKey] && (!$loaderFactory)) {
				// only throw an error, when not loading translation data asynchronously
				throw new Error('$mbTranslateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
			}
			$uses = langKey;
			return provider;
		},
		storageKey: function(key) {
			$storageKey = key;
			return provider;
		},
		useLoader: useLoader,
		useUrlLoader: useUrlLoader,
		useStaticFilesLoader: useStaticFilesLoader,
		useLocalStorage: useLocalStorage,
		useCookieStorage: useCookieStorage,
		useStorage: useStorage,
		storagePrefix: storagePrefix,
		useMissingTranslationHandlerLog: useMissingTranslationHandlerLog,
		useMissingTranslationHandler: useMissingTranslationHandler,
		usePostCompiling: usePostCompiling,
		forceAsyncReload: forceAsyncReload,
		uniformLanguageTag: uniformLanguageTag,
		determinePreferredLanguage: determinePreferredLanguage,
		registerAvailableLanguageKeys: registerAvailableLanguageKeys,
		useLoaderCache: useLoaderCache,
		setDirectivePriority: setDirectivePriority,
		statefulFilter: function(state) {
			// setter with chaining
			statefulFilter = state;
			return provider;
		},
		postProcess: postProcess,
		keepContent: keepContent
	};
	return provider;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc controller
 * @name MbLanguagesCtrl
 * @description Mange list of languages
 * 
 * Manages list of languages
 * 
 */
mblowfish.controller('MbLanguagesCtrl', function(
	$rootScope, $language, $navigator, FileSaver,
		/* AngularJS */ $window,
		/* am-wb     */ $mbResource) {

	this.selectedLanguage = null;

	/**
	 * Set current language of app
	 * 
	 * @memberof MbLanguagesCtrl
	 * @param {object} lang - Key of the language
	 * @return {promise} to change language
	 */
	this.setLanguage = function(lang) {
		this.selectedLanguage = lang;
		this.selectedLanguage.map = this.selectedLanguage.map || {};
		this.addMissedWord();
	};

	/**
	 * Adds new language to app configuration
	 * 
	 * @memberof MbLanguagesCtrl
	 * @return {promise} to add language
	 */
	this.addLanguage = function() {
		$mbResource.get('/app/languages', {
			// TODO:
		}).then(function(language) {
			language.map = language.map || {};
			return $language.newLanguage(language);
		});
	};

	/**
	 * Remove language form application
	 * 
	 * @memberof MbLanguagesCtrl
	 * @param {object} lang - The Language
	 * @return {promise} to delete language
	 */
	this.deleteLanguage = function(lang) {
		var ctrl = this;
		$window.confirm('Delete the language?').then(function() {
			return $language.deleteLanguage(lang);
		}).then(function() {
			if (angular.equals(ctrl.selectedLanguage, lang)) {
				ctrl.selectedLanguage = null;
			}
		});
	};

	/**
	 * Adds a word to the current language map
	 * 
	 * @memberof MbLanguagesCtrl
	 */
	this.addWord = function() {
		var ctrl = this;
		return $navigator.openDialog({
			templateUrl: 'views/dialogs/mbl-add-word.html',

		})//
			.then(function(word) {
				ctrl.selectedLanguage.map[word.key] = ctrl.selectedLanguage.map[word.key] || word.translate || word.key;
			});
	};

	/**
	 * Remove the key from current language map
	 * 
	 * @memberof MbLanguagesCtrl
	 */
	this.deleteWord = function(key) {
		delete this.selectedLanguage.map[key];
	};


	/**
	 * Adds all missed keywords to the current language
	 * 
	 * @memberof MbLanguagesCtrl
	 */
	this.addMissedWord = function() {
		var mids = $rootScope.__app.settings.languageMissIds;
		var ctrl = this;
		_.forEach(mids, function(id) {
			ctrl.selectedLanguage.map[id] = ctrl.selectedLanguage.map[id] || id;
		});
	}

	/**
	 * Download the language
	 * 
	 * @memberof MbLanguagesCtrl
	 * @param {object} lang - The Language
	 */
	this.saveAs = function(lang) {
		var MIME_WB = 'application/weburger+json;charset=utf-8';

		// save  result
		var dataString = JSON.stringify(lang);
		var data = new Blob([dataString], {
			type: MIME_WB
		});
		return FileSaver.saveAs(data, 'language.json');
	};

});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc Controllers
@name MbHelpCtrl
@description Help page controller

Watches total system and update help data.

 */
mblowfish.controller('MbModulesCtrl', function(
	/* angularjs */ $scope, $controller,
	/* Mblowfish */ $mbModules, $mbActions
) {
	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbAbstractCtrl', {
		$scope: $scope
	}));

	this.loadModules = function() {
		this.modules = $mbModules.getModules();
	}

	this.addModule = function($event) {
		$mbActions.exec('mb.modules.create', $event);
	};

	this.deleteModule = function(item, $event) {
		$event.modules = [item];
		$mbActions.exec('mb.modules.delete', $event);
	};

	var ctrl = this;
	this.addEventHandler(MODULE_STORE_PATH, function() {
		ctrl.loadModules();
	});

	ctrl.loadModules();
});



/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Manages system moduels
 */
mblowfish.config(function($mbPreferencesProvider, $mbActionsProvider, $mbResourceProvider) {

	//-------------------------------------------------------------
	// Preferences:
	// Pages: modules, application,
	//-------------------------------------------------------------
	$mbPreferencesProvider
		.addPage('modules', {
			title: 'Modules',
			icon: 'language',
			description: 'Manage global modules to enable for all users.',
			templateUrl: 'views/modules/mb-preference.html',
			controller: 'MbModulesCtrl',
			controllerAs: 'ctrl',
		});
	//	$preferences.newPage({
	//		id: 'update',
	//		templateUrl: 'views/preferences/mb-update.html',
	//		title: 'Update application',
	//		description: 'Settings of updating process and how to update the application.',
	//		icon: 'autorenew'
	//	});
	//	$options.newPage({
	//		title: 'modules',
	//		description: 'Manage user modules to enable for all current device.',
	//		templateUrl: 'views/modules/mb-option.html',
	//		tags: ['modules']
	//	});


	//-------------------------------------------------------------
	// Actions:
	//-------------------------------------------------------------
	$mbActionsProvider
		.addAction('mb.modules.create', {
			title: 'Add local module',
			/* @ngInject*/
			action: function($mbResource, $mbModules) {
				return $mbResource
					.get('/app/modules', {
						style: {},
					})
					.then(function(modules) {
						_.forEach(modules, function(m) {
							$mbModules.addModule(m);
						});
					});
			}
		})
		.addAction('mb.modules.delete', {
			title: 'Delete local module',
			icon: 'view_module',
			/* @ngInject */
			action: function($window, $mbModules, $event) {
				return $window
					.confirm('Delete modules?')
					.then(function() {
						_.forEach($event.modules, function(m) {
							$mbModules.removeModule(m);
						});
					});
			}
		});



	//-------------------------------------------------------------
	// Resources:
	//-------------------------------------------------------------
	$mbResourceProvider
		.addPage('mb-module-manual', {
			label: 'Manual',
			templateUrl: 'views/modules/mb-resources-manual.html',
			/*@ngInject*/
			controller: function($scope) {
				$scope.$watch('module', function(value) {
					$scope.$parent.setValue([value]);
				}, true);
				$scope.module = _.isArray($scope.value) ? $scope.value[0] : $scope.value;
			},
			controllerAs: 'resourceCtrl',
			tags: ['/app/modules']
		});
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
angular.module('mblowfish-core').run(function($mbView) {
	$mbView.add('/mb/ui/views/navigator/', {
		title: 'Navigator',
		description: 'Navigate all path and routs of the pandel',
		controller: 'MbNavigatorContainerCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'views/mb-navigator.html',
		groups: ['Utilities']
	});//
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */




/**
 @ngdoc Controllers
 @name MbNavigatorContainerCtrl
 @description Navigator controller
 
 */
angular.module('mblowfish-core').controller('MbNavigatorContainerCtrl', function($scope, $mbView) {
	var groups = {
		'others': {
			title: 'Others',
			items: {}
		}
	};

	var items = $mbView.getViews();
	_.forEach(items, function(item, url) {
		var itmeGroups = item.groups || ['others'];
		_.forEach(itmeGroups, function(groupId) {
			if (_.isUndefined(groups[groupId])) {
				groups[groupId] = {
					title: groupId,
					items: {}
				};
			}
			groups[groupId].items[url] = item;
		});
	});

	$scope.groups = groups
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
mblowfish.config(function($mbActionsProvider, $mbViewProvider, $mbEditorProvider) {
	$mbActionsProvider
		.addAction('mb.preferences', {
			title: 'Preferences',
			icon: 'settings',
			/* @ngInject */
			action: function($location) {
				return $location.url('preferences');
			}
		});//

	$mbViewProvider
		.addView('/preferences', {
			title: 'Preferences',
			templateUrl: 'views/mb-preferences.html',
			aunchor: 'editors',
			controller: 'MbPreferencesCtrl',
			controllerAs: 'ctrl',
			groups: ['Utilities']
		});

	$mbEditorProvider
		.addEditor('/preferences/:preferenceId', {
			title: 'Preference',
			templateUrl: 'views/mb-preference.html',
			controller: 'MbPreferenceEditorCtrl',
			controllerAs: 'ctrl',
		});
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.controller('MbPreferenceEditorCtrl', function($scope, $element, $mbPreferences, $state, MbComponent, $editor) {
	//------------------------------------------------
	// variables
	//------------------------------------------------
	var preferenceId = $state.params.preferenceId;
	var pageConfig = $mbPreferences.getPage(preferenceId);
	var pageComponent = new MbComponent(pageConfig);
	var anchor = $element.find('#page-panel');
	
	
	//------------------------------------------------
	// functions
	//------------------------------------------------
	function renderPage(){
		return pageComponent.render({
			$element: anchor,
			$scope: $scope,
			$editor: $editor
		});
	}


	//------------------------------------------------
	// end
	//------------------------------------------------
	renderPage();
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc Controllers
 * @name MbPreferencesCtrl
 * @description Manages preferences page
 * 
 * In the preferences page, all configs of the system are displayed and
 * users are able to change them. These preferences pages are related to
 * the current SPA usually.
 * 
 */
mblowfish.controller('MbPreferencesCtrl', function($scope, $mbPreferences) {
	// Load settings
	$scope.pages = $mbPreferences.getPages()//
});



mblowfish.controller('MbApplicationPreloadingContainerCtrl', function() {

});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc Controllers
@name MbAbstractCtrl
@description Generic controller which is used as base in the platform

 */
mblowfish.controller('MbAbstractCtrl', function($scope, $mbDispatcher, MbEvent) {

	//--------------------------------------------------------
	// --Events--
	//--------------------------------------------------------
	var EventHandlerId = function(type, id, callback) {
		this.type = type;
		this.id = id;
		this.callback = callback;
	};

	/**
	 * Add a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.addEventHandler = function(type, callback) {
		var callbackId = $mbDispatcher.on(type, callback);
		this._hids.push(new EventHandlerId(type, callbackId, callback));
	};

	/**
	 * Remove a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.removeEventHandler = function(type, callback) {
		// XXX: maso, 2019: remove handler
	};

	/**
	 * Fire an action is performed on items
	 * 
	 * Here is common list of action to dils with objects:
	 * 
	 * - created
	 * - read
	 * - updated
	 * - deleted
	 * 
	 * to fire an item is created:
	 * 
	 * this.fireEvent(type, 'created', item);
	 * 
	 * to fire items created:
	 * 
	 * this.fireEvent(type, 'created', item_1, item_2, .. , item_n);
	 * 
	 * to fire list of items created
	 * 
	 * var items = [];
	 * ...
	 * this.fireEvent(type, 'created', items);
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.fireEvent = function(type, action, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 2);
		var source = this;
		return $mbDispatcher.dispatch(type, new MbEvent({
			source: source,
			type: type,
			key: action,
			values: values
		}));
	};

	/**
	 * Fires items created
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireCreated = function(type, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'create', values);
	};

	/**
	 * Fires items read
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireRead = function(type, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'read', values);
	};

	/**
	 * Fires items updated
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireUpdated = function(type, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'update', values);
	};

	/**
	 * Fires items deleted
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireDeleted = function(type, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'delete', values);
	};
	
	/**
	 * Fires items created
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireCreated = function(type, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'create', values);
	};


	this.destroy = function(){
		for (var i = 0; i < ctrl._hids.length; i++) {
			var handlerId = ctrl._hids[i];
			$mbDispatcher.off(handlerId.type, handlerId.id);
		}
		ctrl._hids = [];
	};

	//--------------------------------------------------------
	// --View--
	//--------------------------------------------------------
	/*
	 * Remove all resources
	 */
	var ctrl = this;
	ctrl._hids = [];
	$scope.$on('$destroy', function() {
		ctrl.destroy();
	});

});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
@ngdoc Controllers
@name MbSeenAbstractBinaryItemCtrl
@description Generic controller of model binary of seen

There are three categories of actions;

- view
- model
- controller

 */
mblowfish.controller('MbSeenAbstractBinaryItemCtrl', function($scope, $controller, $q, $window) {


	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbSeenAbstractItemCtrl', {
		$scope: $scope
	}));

	// Messages
	var DELETE_MODEL_BINARY_MESSAGE = 'Delete binary content?';
	var IMPLEMENT_BY_CHILDREN_ERROR = 'This method must be override in clild class';

	// -------------------------------------------------------------------------
	// Model
	//
	// We suppose that all model action be override by the new controllers.
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	/**
	 * Deletes model binary
	 * 
	 * @param item
	 * @return promise to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.deleteModelBinary = function(item) {
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Upload model binary
	 * 
	 * @param item
	 * @return promise to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.uploadModelBinary = function(item) {
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Get model binary path
	 * 
	 * @param item
	 * @return promise to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModelBinaryUrl = function(item) {
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};



	// -------------------------------------------------------------------------
	// View
	//
	//
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	this.itemUrl;

	/**
	 * Sets itemUrl to view
	 * 
	 * @memberof SeenAbstractBinaryItemCtrl
	 */
	this.setItemUrl = function(itemUrl) {
		this.itemUrl = itemUrl;
	};

	/**
	 * Get view itemUrl
	 * 
	 * @memberof SeenAbstractBinaryItemCtrl
	 */
	this.getItemUrl = function() {
		return this.itemUrl;
	};

	/**
	 * Deletes item binary file
	 * 
	 * @memberof SeenAbstractBinaryItemCtrl
	 */
	this.deleteItemBinary = function() {
		// prevent default event
		if ($event) {
			$event.preventDefault();
			$event.stopPropagation();
		}

		// update state
		var ctrl = this;
		var item = this.getItem();
		function _deleteInternal() {
			ctrl.busy = true;
			return ctrl.getModelBinaryUrl(item)
				.then(function() {
					ctrl.fireDeleted(ctrl.getModelBinaryUrl(item), item);
				}, function() {
					// XXX: maso, 2019: handle error
				})
				.finally(function() {
					ctrl.busy = false;
				});
		}

		// TODO: maso, 2018: get current promise
		// delete the item
		if (this.isConfirmationRequired()) {
			$window.confirm(DELETE_MODEL_BINARY_MESSAGE)
				.then(function() {
					return _deleteInternal();
				});
		} else {
			return _deleteInternal();
		}
	};

	/*
	 * Extends init method
	 */
	this.supperInit = this.init;
	this.init = function(config) {
		var ctrl = this;
		if (!angular.isDefined(configs)) {
			return;
		}
		this.setItemUrl(config.url);
		this.supperInit(config);
	};

});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Controllers
@name MbSeenAbstractCollectionCtrl
@description Generic controller of model collection of seen

This controller is used manages a collection of a virtual items. it is the
base of all other collection controllers such as accounts, groups, etc.

There are two types of function in the controller: view and data related. All
data functions are considered to be override by extensions.

There are three categories of actions;

- view
- model
- controller

view actions are about to update view. For example adding an item into the view
or remove deleted item.

Model actions deal with model in the repository. These are equivalent to the view
actions but removes items from the storage.

However, controller function provide an interactive action to the user to performs
an action.

## Add

- addItem: controller
- addModel: model
- addViewItem: view
 */
mblowfish.controller('MbSeenAbstractCollectionCtrl', function($scope, $controller, $q, $navigator,
	$log,
	$window, QueryParameter, MbAction) {


    /*
     * Extends collection controller from MbAbstractCtrl 
     */
	angular.extend(this, $controller('MbSeenGeneralAbstractCollectionCtrl', {
		$scope: $scope
	}));

    /*
     * util function
     */
	function differenceBy(source, filters, key) {
		for (var i = 0; i < filters.length; i++) {
			_.remove(source, function(item) {
				return item[key] === filters[i][key];
			});
		}
	};

	var STATE_INIT = 'init';
	var STATE_BUSY = 'busy';
	var STATE_IDEAL = 'ideal';
	this.state = STATE_IDEAL;


	// Messages
	var ADD_ACTION_FAIL_MESSAGE = 'Fail to add new item';
	var DELETE_MODEL_MESSAGE = 'Delete item?';

	this.actions = [];


    /**
     * State of the controller
     * 
     * Controller may be in several state in the lifecycle. The state of the
     * controller will be stored in this variable.
     * 
     * <ul>
     * <li>init: the controller is not ready</li>
     * <li>busy: controller is busy to do something (e. loading list of data)</li>
     * <li>ideal: controller is ideal and wait for user </li>
     * </ul>
     * 
     * @type string
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.state = STATE_INIT;

    /**
     * Store last paginated response
     * 
     * This is a collection controller and suppose the result of query to be a
     * valid paginated collection. The last response from data layer will be
     * stored in this variable.
     * 
     * @type PaginatedCollection
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.lastResponse = null;

    /**
     * Query parameter
     * 
     * This is the query parameter which is used to query items from the data
     * layer.
     * 
     * @type QueryParameter
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.queryParameter = new QueryParameter();
	this.queryParameter.setOrder('id', 'd');

	// -------------------------------------------------------------------------
	// View
	//
	//
	//
	//
	//
	//
	// -------------------------------------------------------------------------
    /**
     * List of all loaded items
     * 
     * All loaded items will be stored into this variable for later usage. This
     * is related to view.
     * 
     * @type array
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.items = [];

    /**
     * Adds items to view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.pushViewItems = function(items) {
		if (!angular.isDefined(items)) {
			return;
		}
		// Push new items
		differenceBy(items, this.items, 'id');
		// TODO: maso, 2019: The current version (V3.x) of lodash dose not support concat
		// update the following part in the next version.
		// this.items = _.concat(items, deff);
		var ctrl = this;
		_.forEach(items, function(item) {
			ctrl.items.push(item);
		});
		if (this.id) {
			this.fireEvent(this.id, 'update', this.items);
		}
	};

    /**
     * Adds items to view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.addViewItems = this.pushViewItems;

    /**
     * remove item from view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.removeViewItems = function(items) {
		differenceBy(this.items, items, 'id');
		if (this.id) {
			this.fireEvent(this.id, 'update', this.items);
		}
	};

    /**
     * Updates an item in the view with the given one
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.updateViewItems = function(items) {
		// XXX: maso, 2019: update view items
	};

    /**
     * Returns list of all items in the view
     * 
     * NOTE: this is the main storage of the controller.
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.getViewItems = function() {
		return this.items;
	};

    /**
     * Removes all items from view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
	this.clearViewItems = function() {
		this.items = [];
		if (this.id) {
			this.fireEvent(this.id, 'update', this.items);
		}
	};


	// -------------------------------------------------------------------------
	// Model
	//
	// We suppose that all model action be overid by the new controllers.
	//
	//
	//
	//
	// -------------------------------------------------------------------------
    /**
     * Deletes model
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param item
     * @return promiss to delete item
     */
	//  this.deleteModel = function(item){};

    /**
     * Gets object schema
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promise to get schema
     */
	//  this.getModelSchema = function(){};

    /**
     * Query and get items
     * 
     * @param queryParameter to apply search
     * @return promiss to get items
     */
	//  this.getModels = function(queryParameter){};

    /**
     * Get item with id
     * 
     * @param id of the item
     * @return promiss to get item
     */
	//  this.getModel = function(id){};

    /**
     * Adds new item
     * 
     * This is default implementation of the data access function. Controllers
     * are supposed to override the function
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promiss to add and return an item
     */
	//  this.addModel = function(model){};



	// -------------------------------------------------------------------------
	// Controller
	//
	//
	//
	//
	//
	//
	//
	// -------------------------------------------------------------------------

    /**
     * Creates new item with the createItemDialog
     * 
     * XXX: maso, 2019: handle state machine
     */
	this.addItem = function() {
		var ctrl = this;
		$navigator.openDialog({
			templateUrl: this._addDialog,
			config: {
				model: {}
			}
		}).then(function(model) {
			return ctrl.addModel(model);
		}).then(function(item) {
			ctrl.fireCreated(ctrl.eventType, item);
		}, function() {
			$window.alert(ADD_ACTION_FAIL_MESSAGE);
		});
	};

    /**
     * Creates new item with the createItemDialog
     */
	this.deleteItem = function(item, $event) {
		// prevent default evetn
		if ($event) {
			$event.preventDefault();
			$event.stopPropagation();
		}
		// XXX: maso, 2019: update state
		var ctrl = this;
		var tempItem = _.clone(item);
		function _deleteInternal() {
			return ctrl.deleteModel(item)
				.then(function() {
					ctrl.fireDeleted(ctrl.eventType, tempItem);
				}, function(ex) {
					$log.error(ex);
					$window.alert('Fail to delete item.')
				});
		}
		// delete the item
		if (this.deleteConfirm) {
			$window.confirm(DELETE_MODEL_MESSAGE)
				.then(function() {
					return _deleteInternal();
				});
		} else {
			return _deleteInternal();
		}
	};

    /**
     * Reload the controller
     * 
     * Remove all old items and reload the controller state. If the controller
     * is in progress, then cancel the old promiss and start the new job.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns promiss to reload
     */
	this.reload = function() {
		// safe reload
		var ctrl = this;
		function safeReload() {
			delete ctrl.lastResponse;
			ctrl.clearViewItems();
			ctrl.queryParameter.setPage(1);
			return ctrl.loadNextPage();
		}

		// check states
		if (this.isBusy()) {
			return this.getLastQeury()
				.then(safeReload);
		}
		return safeReload();
	};



    /**
     * Loads next page
     * 
     * Load next page and add to the current items.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns promiss to load next page
     */
	this.loadNextPage = function() {
		// Check functions
		if (!angular.isFunction(this.getModels)) {
			throw 'The controller does not implement getModels function';
		}

		if (this.state === STATE_INIT) {
			throw 'this.init() function is not called in the controller';
		}

		// check state
		if (this.state !== STATE_IDEAL) {
			if (this.lastQuery) {
				return this.lastQuery;
			}
			throw 'Models controller is not in ideal state';
		}

		// set next page
		if (this.lastResponse) {
			if (!this.lastResponse.hasMore()) {
				return $q.resolve();
			}
			this.queryParameter.setPage(this.lastResponse.getNextPageIndex());
		}

		// Get new items
		this.state = STATE_BUSY;
		var ctrl = this;
		this.lastQuery = this.getModels(this.queryParameter)//
			.then(function(response) {
				ctrl.lastResponse = response;
				ctrl.addViewItems(response.items);
				// XXX: maso, 2019: handle error
				ctrl.error = null;
			}, function(error) {
				ctrl.error = error;
			})//
			.finally(function() {
				ctrl.state = STATE_IDEAL;
				delete ctrl.lastQuery;
			});
		return this.lastQuery;
	};



	this.seen_abstract_collection_superInit = this.init;

    /**
     * Loads and init the controller
     * 
     * All children must call this function at the end of the cycle
     */
	this.init = function(configs) {
		configs = configs || {};
		if (angular.isFunction(this.seen_abstract_collection_superInit)) {
			this.seen_abstract_collection_superInit(configs);
		}
		var ctrl = this;
		this.id = configs.id;
		this.state = STATE_IDEAL;
		if (!angular.isDefined(configs)) {
			return;
		}

		// add actions
		if (angular.isArray(configs.actions)) {
			this.addActions(configs.actions)
		}

		// DEPRECATED: enable create action
		if (configs.addAction && angular.isFunction(this.addItem)) {
			var temp = configs.addAction;
			var createAction = {
				title: temp.title || 'New item',
				icon: temp.icocn || 'add',
				action: temp.action,
			};
			if (!angular.isFunction(temp.action) && temp.dialog) {
				this._addDialog = temp.dialog;
				createAction.action = function() {
					ctrl.addItem();
				};
			}
			if (angular.isFunction(createAction.action)) {
				this.addAction(createAction);
			}
		}

		// add path
		this._setEventType(configs.eventType);

		// confirm delete
		this.deleteConfirm = !angular.isDefined(configs.deleteConfirm) || configs.deleteConfirm;
	};

    /**
     * Returns last executed query
     */
	this.getLastQeury = function() {
		return this.lastQuery;
	};


    /**
     * Set a GraphQl format of data
     * 
     * By setting this the controller is not sync and you have to reload the
     * controller. It is better to set the data query at the start time.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param graphql
     */
	this.setDataQuery = function(grqphql) {
		this.queryParameter.put('graphql', '{page_number, current_page, items' + grqphql + '}');
		// TODO: maso, 2018: check if refresh is required
	};

    /**
     * Adding custom filter
     * 
     * Filters are used to select special types of the items.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param key of the filter
     * @param value of the filter
     */
	this.addFilter = function(key, value) {
		this.queryParameter.setFilter(key, value);
	};

    /**
     * Load controller actions
     * 
     * @return list of actions
     */
	this.getActions = function() {
		return this.actions;
	};

    /**
     * Adds new action into the controller
     * 
     * @param action to add to list
     */
	this.addAction = function(action) {
		if (_.isUndefined(this.actions)) {
			this.actions = [];
		}
		// TODO: maso, 2018: assert the action is MbAction
		if (!(action instanceof MbAction)) {
			action = new MbAction(action);
		}
		this.actions.push(action);
		return this;
	};

    /**
     * Adds list of actions to the controller
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @params array of actions
     */
	this.addActions = function(actions) {
		for (var i = 0; i < actions.length; i++) {
			this.addAction(actions[i]);
		}
	};

    /**
     * Gets the query parameter
     * 
     * NOTE: if you change the query parameter then you are responsible to
     * call reload the controller too.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns QueryParameter
     */
	this.getQueryParameter = function() {
		return this.queryParameter;
	};

    /**
     * Checks if the state is busy
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns true if the state is ideal
     */
	this.isBusy = function() {
		return this.state === STATE_BUSY;
	};

    /**
     * Checks if the state is ideal
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns true if the state is ideal
     */
	this.isIdeal = function() {
		return this.state === STATE_IDEAL;
	};

    /**
     * Generate default event handler
     * 
     * If you are about to handle event with a custom function, please
     * overrid this function.
     * 
     * @memberof SeenAbstractCollectionCtrl
     */
	this.eventHandlerCallBack = function() {
		if (this._eventHandlerCallBack) {
			return this._eventHandlerCallBack;
		}
		var ctrl = this;
		this._eventHandlerCallBack = function($event) {
			switch ($event.key) {
				case 'create':
					ctrl.pushViewItems($event.values);
					break;
				case 'update':
					ctrl.updateViewItems($event.values);
					break;
				case 'delete':
					ctrl.removeViewItems($event.values);
					break;
				default:
					break;
			}
		};
		return this._eventHandlerCallBack;
	};

    /*
     * Listen to dispatcher for new event
     */
	this._setEventType = function(eventType) {
		if (this.eventType === eventType) {
			return;
		}
		var callback = this.eventHandlerCallBack();
		if (this.eventType) {
			this.removeEventHandler(callback);
		}
		this.eventType = eventType;
		this.addEventHandler(this.eventType, callback);
	};

});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
@ngdoc Controllers
@name MbSeenAbstractItemCtrl
@description Generic controller of item of seen

There are three categories of actions;

- view
- model
- controller

 */
mblowfish.controller('MbSeenAbstractItemCtrl', function(
	/* AngularJS  */ $scope, $controller, $q, $window,
	/* MBlowfish  */ 
	/* ngRoute    */ $mbRouteParams) {


	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbSeenGeneralAbstractCollectionCtrl', {
		$scope: $scope
	}));


	// Messages
	var DELETE_MODEL_MESSAGE = 'Delete the item?';
	var LOAD_ACTION_FAIL_MESSAGE = 'Fail to load item';
	var IMPLEMENT_BY_CHILDREN_ERROR = 'This method must be override in clild class';

	/*
	 * Extra actions
	 */
	this.actions = [];

	/**
	 * Is true if the controller is busy
	 * 
	 * @type boolean
	 * @memberof SeenAbstractItemCtrl
	 */
	this.busy = false;

	/**
	 * Is true if the controller is dirty
	 * 
	 * The controller is dirty if and only if a property of the item is changed by 
	 * the view.
	 * 
	 * @type boolean
	 * @memberof SeenAbstractItemCtrl
	 */
	this.dirty = false;

	// -------------------------------------------------------------------------
	// Model
	//
	// We suppose that all model action be override by the new controllers.
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	/**
	 * Deletes model
	 * 
	 * @param item
	 * @return promiss to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.deleteModel = function(item) {
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Gets item schema
	 * 
	 * @return promise to get schema
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModelSchema = function() {
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Query and get items
	 * 
	 * @param queryParameter to apply search
	 * @return promiss to get items
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModel = function(id) {
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Update current model
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @return promiss to add and return an item
	 */
	this.updateModel = function(model) {
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};


	// -------------------------------------------------------------------------
	// View
	//
	//  Actions used in item view and manage the loaded item. To desinge a page 
	// you must use following API.
	//
	// -------------------------------------------------------------------------
	/**
	 * Current manged item 
	 * 
	 * @type Object
	 * @memberof SeenAbstractItemCtrl
	 */
	this.item;
	this.itemId;

	/**
	 * Sets item to view
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setItem = function(item) {
		this.item = item;
	};

	/**
	 * Get view item
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getItem = function() {
		return this.item;
	}

	/**
	 * Gets id of the view item
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getItemId = function() {
		return this.itemId;
	}

	/**
	 * Sets id of the view item
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setItemId = function(itemId) {
		this.itemId = itemId;
	}

	/**
	 * Reload item by its ID
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.loadItem = function() {
		var ctrl = this;
		var job = this.getModel(this.itemId)
			.then(function(item) {
				ctrl.setItem(item);
			}, function(error) {
				$window.alert('Fail to load the item ' + ctrl.itemId);
			});
		// TODO: maso, 2020: add application job
		return job;
	}

	this.setLastPromis = function(p) {
		this.__lastPromis = p;
	}

	this.getLastPromis = function() {
		return this.__lastPromis;
	}

	/**
	 * Checks if the state of the controller is busy
	 * 
	 * @return {boolean} true if the controller is busy
	 * @memberof SeenAbstractItemCtrl
	 */
	this.isBusy = function() {
		return this.busy;
	}

	/**
	 * Checks if the state of the controller is dirty
	 * 
	 * @return {boolean} true if the controller is dirty
	 * @memberof SeenAbstractItemCtrl
	 */
	this.isDirty = function() {
		return this.dirty;
	};

	/**
	 * Check if confirmation is required for critical tasks
	 * 
	 * @return {boolean} true if the confirmation is required
	 * @memberof SeenAbstractItemCtrl
	 */
	this.isConfirmationRequired = function() {
		return this.confirmationRequired;
	}

	/**
	 * Set confirmation
	 * 
	 * @params confirmationRequired {boolean}
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setConfirmationRequired = function(confirmationRequired) {
		this.confirmationRequired = confirmationRequired;
	}

	this.updateItem = function($event) {
		// prevent default event
		if ($event) {
			$event.preventDefault();
			$event.stopPropagation();
		}

		// XXX: maso, 2019: update state
		var ctrl = this;

		var job = this.updateModel(ctrl.item);
		// TODO: maso, 2020: add job tos list
		return job;
	}

	/**
	 * Creates new item with the createItemDialog
	 */
	this.deleteItem = function($event) {
		// prevent default event
		if ($event) {
			$event.preventDefault();
			$event.stopPropagation();
		}

		// XXX: maso, 2019: update state
		var ctrl = this;
		// var tempItem = _.clone(item);
		function _deleteInternal() {
			ctrl.busy = true;
			return ctrl.deleteModel(ctrl.item)
				.then(function() {
					ctrl.fireDeleted(ctrl.eventType, tempItem);
				}, function() {
					// XXX: maso, 2019: handle error
				})
				.finally(function() {
					ctrl.busy = false;
				});
		}
		// delete the item
		if (this.isConfirmationRequired()) {
			$window.confirm(DELETE_MODEL_MESSAGE)
				.then(function() {
					return _deleteInternal();
				});
		} else {
			return _deleteInternal();
		}
	};

	/**
	 * Reload the controller
	 * 
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @returns promise to reload
	 */
	this.reload = function() {
		// safe reload
		var ctrl = this;
		function safeReload() {
			ctrl.setItem(null);
			return ctrl.loadItem(ctrl.getItemId());
		}

		// attache to old promise
		if (this.isBusy()) {
			return this.getLastPromis()
				.then(safeReload);
		}

		// create new promise
		var promise = safeReload();
		this.setLastPromis(promise);
		return promise;
	};

	/**
	 * Set a GraphQl format of data
	 * 
	 * By setting this the controller is not sync and you have to reload the
	 * controller. It is better to set the data query at the start time.
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @param graphql
	 */
	this.setDataQuery = function(grqphql) {
		this.queryParameter.put('graphql', grqphql);
		// TODO: maso, 2018: check if refresh is required
	};

	/**
	 * Generate default event handler
	 * 
	 * If you are about to handle event with a custom function, please
	 * override this function.
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.eventHandlerCallBack = function() {
		if (this._eventHandlerCallBack) {
			return this._eventHandlerCallBack;
		}
		var ctrl = this;
		this._eventHandlerCallBack = function($event) {
			switch ($event.key) {
				case 'updated':
					ctrl.updateViewItems($event.values);
					break;
				case 'removed':
					ctrl.removeViewItems($event.values);
					break;
				default:
					break;
			}
		};
		return this._eventHandlerCallBack;
	};

	/**
	 * Sets controller event type
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setEventType = function(eventType) {
		if (this.eventType === eventType) {
			return;
		}
		var callback = this.eventHandlerCallBack();
		if (this.eventType) {
			this.removeEventHandler(callback);
		}
		this.eventType = eventType;
		this.addEventHandler(this.eventType, callback);
	};


	this.seen_abstract_item_supperInit = this.init;
	/**
	 * Loads and init the controller
	 * 
	 * NOTE: All children must call this function at the end of the cycle
	 * 
	 * Properties:
	 * 
	 * - confirmation: show confirmation dialog
	 * - eventType: type of the events
	 * - dataQuery: a query to data
	 * - modelId:
	 * - model
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.init = function(configs) {
		if (this.seen_abstract_item_supperInit) {
			this.seen_abstract_item_supperInit(configs);
		}
		var ctrl = this;
		if (!angular.isDefined(configs)) {
			return;
		}

		// add path
		this.setEventType(configs.eventType);

		// confirm delete
		this.setConfirmationRequired(!angular.isDefined(configs.confirmation) || configs.confirmation);

		// data query
		if (configs.dataQuery) {
			this.setDataQuery(config.dataQuery);
		}

		// model id
		this.setItemId(configs.modelId || $mbRouteParams.itemId);

		// Modl
		if (configs.model) {
			// TODO: load model
		}

		this.reload();
	};

});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc Controllers
@name MbSeenAbstractCollectionCtrl
@description Generic controller of model collection of seen

This controller is used manages a collection of a virtual items. it is the
base of all other collection controllers such as accounts, groups, etc.

There are two types of function in the controller: view and data related. All
data functions are considered to be override by extensions.

There are three categories of actions;

- view
- model
- controller

view actions are about to update view. For example adding an item into the view
or remove deleted item.

Model actions deal with model in the repository. These are equivalent to the view
actions but removes items from the storage.

However, controller function provide an interactive action to the user to performs
an action.

## Add

- addItem: controller
- addModel: model
- addViewItem: view
 */
mblowfish.controller('MbSeenGeneralAbstractCollectionCtrl', function ($scope, $controller, $q) {
	

	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbAbstractCtrl', {
		$scope: $scope
	}));

	this.getSchema = function () {
		if (!angular.isDefined(this.getModelSchema)) {
			return;
		}
		return this.getModelSchema()
		.then(function (schema) {
			return schema;
		});
	};

	//properties is the children of schema.
	this.getProperties = function () {
		if (angular.isDefined(this.properties)) {
			$q.resolve(this.properties);
		}
		var ctrl = this;
		if (angular.isDefined(ctrl.getModelSchema)) {
			return this.getSchema()
			.then(function (schema) {
				ctrl.properties = schema.children;
			});
		}
	};

	this.init = function () {
		this.getProperties();
	};
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserAccountCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbSeenUserAccountCtrl', function ($scope, $usr, $controller) {
	angular.extend(this, $controller('MbSeenAbstractItemCtrl', {
		$scope: $scope
	}));

	// Override the function
	this.getModelSchema = function(){
		return $usr.accountSchema();
	};
	
	// get an account
	this.getModel = function(id){
		return $usr.getAccount(id);
	};
	
	// delete account
	this.deleteModel = function(model){
	    return $usr.deleteAccount(model.id);
	};

	// update account
	this.updateModel = function(model){
		return model.update();
	};

	this.init({
		eventType: '/user/accounts'
	});
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserAccountsCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbSeenUserAccountsCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getModelSchema = function () {
        return $usr.accountSchema();
    };
    
    // get accounts
    this.getModels = function (parameterQuery) {
        return $usr.getAccounts(parameterQuery);
    };
    
    // get an account
    this.getModel = function (id) {
        return $usr.getAccount(id);
    };
    
    // add account
    this.addModel = function (model) {
        return $usr.putAccount(model);
    };
    
    // delete account
    this.deleteModel = function (model) {
        return $usr.deleteAccount(model.id);
    };

    this.init({
        eventType: '/user/account'
    });
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserGroupsCtrl
 * @description Manages list of groups
 * 
 */
.controller('MbSeenUserGroupsCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getModelSchema = function () {
        return $usr.groupSchema();
    };
    
    // get groups
    this.getModels = function (parameterQuery) {
        return $usr.getGroups(parameterQuery);
    };
    
    // get a group
    this.getModel = function (id) {
        return $usr.getGroup(id);
    };
    
    // Add group
    this.addModel = function (model) {
        return $usr.putGroup(model);
    };
    
    // delete group
    this.deleteModel = function (model) {
        return $usr.deleteGroup(model.id);
    };

    this.init({
        eventType: '/user/groups'
    });
});


/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
angular.module('mblowfish-core')


/**
 * @ngdoc Controllers
 * @name MbSeenUserMessagesCtrl
 * @description Manages list of controllers
 * 
 */
.controller('MbSeenUserMessagesCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getModelSchema = function () {
        return $usr.messageSchema();
    };

    // get accounts
    this.getModels = function (parameterQuery) {
        return $usr.getMessages(parameterQuery);
    };

    // get an account
    this.getModel = function (id) {
        return $usr.getMessage(id);
    };

    // delete account
    this.deleteModel = function (item) {
        return item.delete();
    };

    this.init({
        eventType: '/user/messages',
        // do not show dialog on delete
        deleteConfirm: false,
    });
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name AmdAccountsCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbSeenUserProfilesCtrl', function ($scope, $usr, $controller) {
	angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
		$scope: $scope
	}));

	// Override the function
	this.getModelSchema = function(){
		return $usr.profileSchema();
	};
	
	// get accounts
	this.getModels = function(parameterQuery){
		return $usr.getProfiles(parameterQuery);
	};
	
	// get an account
	this.getModel = function(id){
		return $usr.getProfile(id);
	};
	
	// add account profile
	this.addModel = function(model){
		return $usr.putProfile(model);
	};
	
	// delete account
	this.deleteModel = function(model){
	    return $usr.deleteProfile(model.id);
	};
    
    this.init();
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserRolesCtrl
 * @description Manages list of roles
 * 
 * 
 */
.controller('MbSeenUserRolesCtrl', function ($scope, $usr, $q, $controller) {

    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Override the function
    this.getModelSchema = function () {
        return $usr.roleSchema();
    };

    // get accounts
    this.getModels = function (parameterQuery) {
        return $usr.getRoles(parameterQuery);
    };

    // get an account
    this.getModel = function (id) {
        return $usr.getRole(id);
    };

    // delete account
    this.deleteModel = function (model) {
        return $usr.deleteRole(model.id);
    };

    this.init();
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish.run(function(appcache, $window, $rootScope) {

	var oldWatch;

	/*
	 * Reload the page
	 * 
	 * @deprecated use page service
	 */
	function reload() {
		$window.location.reload();
	}

	/*
	 * Reload the application
	 */
	function updateApplication() {
		var setting = $rootScope.app.config.update || {};
		if (setting.showMessage) {
			if (setting.autoReload) {
				alert('Application is update. Page will be reload automatically.')//
					.then(reload);
			} else {
				confirm('Application is update. Reload the page for new version?')//
					.then(reload);
			}
		} else {
			toast('Application is updated.');
		}
	}

	// Check update
	function doUpdate() {
		appcache.swapCache()//
			.then(updateApplication());
	}

	oldWatch = $rootScope.$watch('__app.state', function(status) {
		if (status && status.startsWith('ready')) {
			// Remove the watch
			oldWatch();
			// check for update
			return appcache//
				.checkUpdate()//
				.then(doUpdate);
		}
	});
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core').run(function($notification, $help) {


    /*
     * Display help for an item
     */
	window.openHelp = function(item) {
		return $help.openHelp(item);
	};

	// Hadi 1396-12-22: update alerts
	window.alert = $notification.alert;
	window.confirm = $notification.confirm;
	window.prompt = $notification.prompt;
	window.toast = $notification.toast;

});
///*
// * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
// *
// * Permission is hereby granted, free of charge, to any person obtaining a copy
// * of this software and associated documentation files (the "Software"), to deal
// * in the Software without restriction, including without limitation the rights
// * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// * copies of the Software, and to permit persons to whom the Software is
// * furnished to do so, subject to the following conditions:
// *
// * The above copyright notice and this permission notice shall be included in all
// * copies or substantial portions of the Software.
// *
// * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// * SOFTWARE.
// */
//
//
//angular.module('mblowfish-core')
//	/*
//	 * Init application resources
//	 */
//	.run(function($mbResource, $location, $controller) {
//
//		$mbResource.addPage({
//			type: 'wb-url',
//			icon: 'link',
//			label: 'URL',
//			templateUrl: 'views/resources/wb-url.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//				$scope.$watch('value', function(value) {
//					$scope.$parent.setValue(value);
//				});
//			},
//			controllerAs: 'ctrl',
//			tags: ['file', 'image', 'vedio', 'audio', 'page', 'url', 'link',
//				'avatar', 'thumbnail',
//				// new models
//				'image-url', 'vedio-url', 'audio-url', 'page-url']
//		});
//
//		$mbResource.addPage({
//			type: 'script',
//			icon: 'script',
//			label: 'Script',
//			templateUrl: 'views/resources/wb-event-code-editor.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope, $window, $element) {
//				var ctrl = this;
//				this.value = $scope.value || {
//					code: '',
//					language: 'javascript',
//					languages: [{
//						text: 'HTML/XML',
//						value: 'markup'
//					},
//					{
//						text: 'JavaScript',
//						value: 'javascript'
//					},
//					{
//						text: 'CSS',
//						value: 'css'
//					}]
//				};
//				this.setCode = function(code) {
//					this.value.code = code;
//					$scope.$parent.setValue(this.value);
//				};
//
//				this.setLanguage = function(language) {
//					this.value.code = language;
//					$scope.$parent.setValue(this.value);
//				};
//
//				this.setEditor = function(editor) {
//					this.editor = editor;
//					editor.setOptions({
//						enableBasicAutocompletion: true,
//						enableLiveAutocompletion: true,
//						showPrintMargin: false,
//						maxLines: Infinity,
//						fontSize: '100%'
//					});
//					$scope.editor = editor;
//					//              editor.setTheme('resources/libs/ace/theme/chrome');
//					//              editor.session.setMode('resources/libs/ace/mode/javascript');
//					editor.setValue(ctrl.value.code || '');
//					editor.on('change', function() {
//						ctrl.setCode(editor.getValue());
//					});
//				};
//
//				//          var ctrl = this;
//				$window.loadLibrary('//cdn.viraweb123.ir/api/v2/cdn/libs/ace@1.4.8/src-min/ace.js')
//					.then(function() {
//						ctrl.setEditor(ace.edit($element.find('div#am-wb-resources-script-editor')[0]));
//					});
//			},
//			controllerAs: 'ctrl',
//			tags: ['code', 'script']
//		});
//
//		function getDomain() {
//			return $location.protocol() + //
//				'://' + //
//				$location.host() + //
//				(($location.port() ? ':' + $location.port() : ''));
//		}
//
//		//  TODO: maso, 2018: replace with class
//		function getSelection() {
//			if (!this.__selections) {
//				this.__selections = angular.isArray(this.value) ? this.value : [];
//			}
//			return this.__selections;
//		}
//
//		function getIndexOf(list, item) {
//			if (!angular.isDefined(item.id)) {
//				return list.indexOf(item);
//			}
//			for (var i = 0; i < list.length; i++) {
//				if (list[i].id === item.id) {
//					return i;
//				}
//			}
//		}
//
//		function setSelected(item, selected) {
//			var selectionList = this.getSelection();
//			var index = getIndexOf(selectionList, item);
//			if (selected) {
//				// add to selection
//				if (index >= 0) {
//					return;
//				}
//				selectionList.push(item);
//			} else {
//				// remove from selection
//				if (index > -1) {
//					selectionList.splice(index, 1);
//				}
//			}
//		}
//
//		function isSelected(item) {
//			var selectionList = this.getSelection();
//			return getIndexOf(selectionList, item) >= 0;
//		}
//
//
//		/**
//		 * @ngdoc Resources
//		 * @name Account
//		 * @description Get an account from resource
//		 *
//		 * Enable user to select an account
//		 */
//		$mbResource.addPage({
//			label: 'Account',
//			type: 'account',
//			templateUrl: 'views/resources/mb-accounts.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//				// TODO: maso, 2018: load selected item
//				$scope.multi = false;
//				this.value = $scope.value;
//				this.setSelected = function(item) {
//					$scope.$parent.setValue(item);
//					$scope.$parent.answer();
//				};
//				this.isSelected = function(item) {
//					return item === this.value || item.id === this.value.id;
//				};
//			},
//			controllerAs: 'resourceCtrl',
//			priority: 8,
//			tags: ['account']
//		});
//
//		$mbResource.addPage({
//			label: 'Account',
//			type: 'account id',
//			templateUrl: 'views/resources/mb-accounts.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//				// TODO: maso, 2018: load selected item
//				$scope.multi = false;
//				this.value = $scope.value;
//				this.setSelected = function(item) {
//					$scope.$parent.setValue(item.id);
//					$scope.$parent.answer();
//				};
//				this.isSelected = function(item) {
//					return item.id === this.value;
//				};
//			},
//			controllerAs: 'resourceCtrl',
//			priority: 8,
//			tags: ['account_id', 'owner_id']
//		});
//
//		/**
//		 * @ngdoc Resources
//		 * @name Accounts
//		 * @description Gets list of accounts
//		 *
//		 * Display a list of accounts and allow user to select them.
//		 */
//		$mbResource.addPage({
//			label: 'Accounts',
//			type: 'account-list',
//			templateUrl: 'views/resources/mb-accounts.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//				// TODO: maso, 2018: load selected item
//				$scope.multi = true;
//				this.value = $scope.value;
//				this.setSelected = function(item, selected) {
//					this._setSelected(item, selected);
//					$scope.$parent.setValue(this.getSelection());
//				};
//				this._setSelected = setSelected;
//				this.isSelected = isSelected;
//				this.getSelection = getSelection;
//			},
//			controllerAs: 'resourceCtrl',
//			priority: 8,
//			tags: ['accounts', '/user/accounts']
//		});
//
//		// Resource for role-list
//		$mbResource.addPage({
//			label: 'Role List',
//			type: 'role-list',
//			templateUrl: 'views/resources/mb-roles.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//				// TODO: maso, 2018: load selected item
//				$scope.multi = true;
//				this.value = $scope.value;
//				this.setSelected = function(item, selected) {
//					this._setSelected(item, selected);
//					$scope.$parent.setValue(this.getSelection());
//				};
//				this._setSelected = setSelected;
//				this.isSelected = isSelected;
//				this.getSelection = getSelection;
//			},
//			controllerAs: 'resourceCtrl',
//			priority: 8,
//			tags: ['roles', '/user/roles']
//		});
//
//
//		// Resource for group-list
//		$mbResource.addPage({
//			label: 'Group List',
//			type: 'group-list',
//			templateUrl: 'views/resources/mb-groups.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//				// TODO: maso, 2018: load selected item
//				$scope.multi = true;
//				this.value = $scope.value;
//				this.setSelected = function(item, selected) {
//					this._setSelected(item, selected);
//					$scope.$parent.setValue(this.getSelection());
//				};
//				this._setSelected = setSelected;
//				this.isSelected = isSelected;
//				this.getSelection = getSelection;
//			},
//			controllerAs: 'resourceCtrl',
//			priority: 8,
//			tags: ['groups']
//		});
//
//
//		/**
//		 * @ngdoc WB Resources
//		 * @name cms-content-image
//		 * @description Load an Image URL from contents
//		 */
//		$mbResource.addPage({
//			type: 'cms-content-image',
//			icon: 'image',
//			label: 'Images',
//			templateUrl: 'views/resources/mb-cms-images.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//
//				/*
//				 * Extends collection controller
//				 */
//				angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
//					$scope: $scope
//				}));
//
//				/**
//				 * Sets the absolute mode
//				 *
//				 * @param {boolean}
//				 *            absolute mode of the controler
//				 */
//				this.setAbsolute = function(absolute) {
//					this.absolute = absolute;
//				}
//
//				/**
//				 * Checks if the mode is absolute
//				 *
//				 * @return absolute mode of the controller
//				 */
//				this.isAbsolute = function() {
//					return this.absolute;
//				}
//
//				/*
//				 * Sets value
//				 */
//				this.setSelected = function(content) {
//					var path = '/api/v2/cms/contents/' + content.id + '/content';
//					if (this.isAbsolute()) {
//						path = getDomain() + path;
//					}
//					this.value = path;
//					$scope.$parent.setValue(path);
//				}
//
//				// init the controller
//				this.init()
//			},
//			controllerAs: 'ctrl',
//			priority: 10,
//			tags: ['image', 'url', 'image-url', 'avatar', 'thumbnail']
//		});
//		// TODO: maso, 2018: Add video resource
//		// TODO: maso, 2018: Add audio resource
//
//		/**
//		 * @ngdoc WB Resources
//		 * @name content-upload
//		 * @description Upload a content and returns its URL
//		 */
//		$mbResource.addPage({
//			type: 'content-upload',
//			icon: 'file_upload',
//			label: 'Upload',
//			templateUrl: 'views/resources/mb-cms-content-upload.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope, $cms, $mbTranslate, $mbCrypto) {
//
//				/*
//				 * Extends collection controller
//				 */
//				angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
//					$scope: $scope
//				}));
//
//				this.absolute = false;
//				this.files = [];
//
//				/**
//				 * Sets the absolute mode
//				 *
//				 * @param {boolean}
//				 *            absolute mode of the controler
//				 */
//				this.setAbsolute = function(absolute) {
//					this.absolute = absolute;
//				}
//
//				/**
//				 * Checks if the mode is absolute
//				 *
//				 * @return absolute mode of the controller
//				 */
//				this.isAbsolute = function() {
//					return this.absolute;
//				}
//
//				/*
//				 * Add answer to controller
//				 */
//				var ctrl = this;
//				$scope.answer = function() {
//					// create data
//					var data = {};
//					data.name = this.name || $mbCrypto.uuid();
//					data.description = this.description || 'Auto loaded content';
//					var file = null;
//					if (angular.isArray(ctrl.files) && ctrl.files.length) {
//						file = ctrl.files[0].lfFile;
//						data.title = file.name;
//					}
//					// upload data to server
//					return ctrl.uploadFile(data, file)//
//						.then(function(content) {
//							var value = '/api/v2/cms/contents/' + content.id + '/content';
//							if (ctrl.isAbsolute()) {
//								value = getDomain() + value;
//							}
//							return value;
//						})//
//						.catch(function() {
//							alert('Failed to create or upload content');
//						});
//				};
//				// init the controller
//				this.init();
//
//				// re-labeling lf-ng-md-file component for multi languages support
//				angular.element(function() {
//					var elm = angular.element('.lf-ng-md-file-input-drag-text');
//					if (elm[0]) {
//						elm.text($mbTranslate.instant('Drag & Drop File Here'));
//					}
//
//					elm = angular.element('.lf-ng-md-file-input-button-brower');
//					if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
//						elm[0].childNodes[1].data = ' ' + $mbTranslate.instant('Browse');
//					}
//
//					elm = angular.element('.lf-ng-md-file-input-button-remove');
//					if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
//						elm[0].childNodes[1].data = $mbTranslate.instant('Remove');
//					}
//
//					elm = angular.element('.lf-ng-md-file-input-caption-text-default');
//					if (elm[0]) {
//						elm.text($mbTranslate.instant('Select File'));
//					}
//				});
//			},
//			controllerAs: 'ctrl',
//			priority: 1,
//			tags: ['image', 'audio', 'vedio', 'file', 'url', 'image-url', 'avatar', 'thumbnail']
//		});
//
//
//
//
//		/**
//		 * @ngdoc WB Resources
//		 * @name file-local
//		 * @description Select a local file and return the object
//		 * 
//		 * This is used to select local file. It may be used in any part of the system. For example,
//		 * to upload as content.
//		 */
//		$mbResource.addPage({
//			type: 'local-file',
//			icon: 'file_upload',
//			label: 'Local file',
//			templateUrl: 'views/resources/mb-local-file.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope, $q, style) {
//				var ctrl = this;
//				$scope.style = style;
//				$scope.answer = function() {
//					if (angular.isArray(ctrl.files) && ctrl.files.length) {
//						return $q.resolve(ctrl.files[0].lfFile);
//					}
//					return $q.reject('No file selected');
//				};
//			},
//			controllerAs: 'resourceCtrl',
//			priority: 1,
//			tags: ['local-file']
//		});
//
//
//
//		//-------------------------------------------------------------//
//		// CMS:
//		//
//		// - Term Taxonomies
//		//-------------------------------------------------------------//
//		$mbResource.addPage({
//			label: 'Term Taxonomies',
//			type: '/cms/term-taxonomies',
//			templateUrl: 'views/resources/mb-term-taxonomies.html',
//			/*
//			 * @ngInject
//			 */
//			controller: function($scope) {
//				$scope.multi = true;
//				this.value = $scope.value;
//				this.setSelected = function(item, selected) {
//					this._setSelected(item, selected);
//					$scope.$parent.setValue(this.getSelection());
//				};
//				this._setSelected = setSelected;
//				this.isSelected = isSelected;
//				this.getSelection = getSelection;
//			},
//			controllerAs: 'resourceCtrl',
//			priority: 8,
//			tags: ['/cms/term-taxonomies']
//		});
//	});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//
///**
// * @ngdoc Services
// * @name $metrics
// * @description collects and manages metrics from application and server
// * 
// * Metrics are stored in application space:
// * 
// * In view:
// * 
// * <code><pre>
// * 	<span>{{app.metrics['message.count']}}</span>
// * </pre></code>
// * 
// * In code:
// * 
// * <code><pre>
// * 	var messageCount = $rootScope.app.metrics['message.count'];
// * </pre></code>
// * 
// * Metrics must be tracked by the following 
// */
//angular.module('mblowfish-core').service('$metrics', function($q/*, $timeout, $monitor*/) {
//	/*
//	 * store list of metrics
//	 */
////	var metrics = [];
////	
////	var remoteMetrics = []
////	var localMetrics = []
//
//	// XXX: maso, 1395: metric interval
////	var defaultInterval = 60000;
//
//
//	/**
//	 * Add a monitor in track list
//	 * 
//	 * با این فراخوانی مانیتور معادل ایجاد شده و به عنوان نتیجه برگردانده
//	 * می‌شود.
//	 * 
//	 * <pre><code>
//	 * $metrics.trackMetric('message.count')//
//	 * 		.then(function() {
//	 * 				// Success
//	 * 			}, function(){
//	 * 				// error
//	 * 			});
//	 * </code></pre>
//	 * 
//	 * @memberof $monitor
//	 * @param {string}
//	 *            key to track
//	 * @param {string}
//	 *            $scope which is follower (may be null)
//	 *            
//	 * @return {promise(PMonitor)}
//	 */
//	function trackMetric(/*key, $scope*/) {
//		// track metric with key
//		return $q.resolve('hi');
//	}
//
//
//	/**
//	 * Break a monitor
//	 * 
//	 * @param {Object}
//	 *            monitor
//	 */
//	function breakMonitor(/*key*/) {
////		var def = $q.defer();
////		$timeout(function() {
////			// XXX: maso, 1395: remove monitor
////			def.resolve(monitor);
////		}, 1);
////		return def.promise;
//	}
//
//
//	this.breakMonitor = breakMonitor;
//	this.trackMetric = trackMetric;
//});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc Services
 * @name $navigator
 * @description A default system navigator
 *
 * # Item
 *
 * An item is a single navigation part which may be a page, link, action, and etc.
 *
 */
angular.module('mblowfish-core').service('$navigator', function($q, $mbRoute, $mdDialog, $location, $window) {

	var _items = [];
	var _groups = [];

    /**
     * Gets list of all items in the navigation
     *
     * Returns all items added into the navigation list.
     *
     * Note: this is an unsynchronized function and the return value is a promiss
     */
	function items(pagination) {
		var items = _items;
		if (pagination) {
			// Filter items
			if (pagination.param._px_fk) {
				items = [];
				// group
				if (pagination.param._px_fk === 'group') {
					angular.forEach(_items, function(item) {
						if (item.groups &&
							angular.isArray(item.groups) &&
							item.groups.indexOf(pagination.param._px_fv) > -1) {
							items.push(item);
						}
					});
				}
				// TODO: maso, support others
			}
			// TODO: maso, support sort
		}
		return items;
	}

    /**
     * Adding the item into the navigation list
     *
     * Note: this is an unsynchronized function and the return value is a promiss
     */
	function newItem(item) {
		item.priority = item.priority || 100;
		_items.push(item);
		return this;
	}

    /**
     * Remove the item from navigation list
     *
     * Note: this is an unsynchronized function and the return value is a promiss
     */
	function removeItem(item) {
		var index = _items.indexOf(item);
		if (index > -1) {
			_items.splice(index, 1);
		}
		return this;
	}

    /**
     * List all groups
     */
	function groups(/*paginationParam*/) {
		return _groups;
	}

    /**
     * Create new group
     *
     * Note: if group with the same id exist, it will bet updated
     */
	function newGroup(group) {
		if (!(group.id in _groups)) {
			_groups[group.id] = {
				id: group.id
			};
		}
		angular.merge(_groups[group.id], group);
	}

    /**
     * Getting the group
     *
     * If the group is not register before, new empty will be created.
     */
	function group(groupId) {
		if (!(groupId in _groups)) {
			_groups[groupId] = {
				id: groupId
			};
		}
		return _groups[groupId];
	}


    /**
     * Open an dialog view
     *
     * A dialogs needs:
     *
     * <ul>
     * <li>templateUrl</li>
     * <li>config (optinal)</li>
     * </ul>
     *
     * templateUrl is an html template.
     *
     * the config element is bind into the scope of the template automatically.
     *
     * @param dialog
     * @returns promiss
     */
	function openDialog(dialog) {
		var dialogCnf = {};
		angular.extend(dialogCnf, {
			controller: dialog.controller || 'AmdNavigatorDialogCtrl',
			controllerAs: dialog.ctrl || 'ctrl',
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			fullscreen: true,
			multiple: true
		}, dialog);
		if (!dialogCnf.config) {
			dialogCnf.config = {};
		}
		if (!dialogCnf.locals) {
			dialogCnf.locals = {};
		}
		dialogCnf.locals.config = dialogCnf.config;
		return $mdDialog.show(dialogCnf);
	}

    /**
     * Open a page
     *
     * @param page
     */
	function openPage(page, params) {
		//TODO: support page parameters
		if (page && page.toLowerCase().startsWith('http')) {
			$window.open(page);
		}
		if (params) {
			$location.path(page).search(params);
		} else {
			$location.path(page);
		}
	}

    /**
     * Check page is the current one
     *
     * If the input page is selected and loaded before return true;
     *
     * @param page String the page path
     * @return boolean true if page is selected.
     */
	function isPageSelected(/*page*/) {
		// XXX: maso, 2017: check if page is the current one
		return false;
	}

	function loadAllItems(pagination) {
		$q.resolve(items(pagination));
	}

	return {
		loadAllItems: loadAllItems,
		openDialog: openDialog,
		openPage: openPage,
		isPageSelected: isPageSelected,
		// Itmes
		items: items,
		newItem: newItem,
		deleteItem: removeItem,
		// Group
		groups: groups,
		newGroup: newGroup,
		group: group
	};
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc Services
 * @name $notification
 * @description A default system navigator
 * 
 * 
 * 
 */
angular.module('mblowfish-core').service('$notification', function($navigator, $mdToast) {

	/**
	 * The alert() method displays an alert box with a specified message and an
	 * OK button.
	 * 
	 * An alert box is often used if you want to make sure information comes
	 * through to the user.
	 * 
	 * Note: The alert box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                alert box, or an object converted into a string and
	 *                displayed
	 */
	function alert(message) {
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/mb-alert.html',
			config : {
				message : message
			}
		})
		// return true even it the page is canceled
		.then(function(){
			return true;
		}, function(){
			return true;
		});
	}

	/**
	 * The confirm() method displays a dialog box with a specified message,
	 * along with an OK and a Cancel button.
	 * 
	 * A confirm box is often used if you want the user to verify or accept
	 * something.
	 * 
	 * Note: The confirm box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * The confirm() method returns true if the user clicked "OK", and false
	 * otherwise.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                confirm box
	 */
	function confirm(message) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/mb-confirm.html',
			config : {
				message : message
			}
		});
	}

	/**
	 * The prompt() method displays a dialog box that prompts the visitor for
	 * input.
	 * 
	 * A prompt box is often used if you want the user to input a value before
	 * entering a page.
	 * 
	 * Note: When a prompt box pops up, the user will have to click either "OK"
	 * or "Cancel" to proceed after entering an input value. Do not overuse this
	 * method, as it prevent the user from accessing other parts of the page
	 * until the box is closed.
	 * 
	 * The prompt() method returns the input value if the user clicks "OK". If
	 * the user clicks "cancel" the method returns null.
	 * 
	 * @param String
	 *                text Required. The text to display in the dialog box
	 * @param String
	 *                defaultText Optional. The default input text
	 */
	function prompt(text, defaultText) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/mb-prompt.html',
			config : {
				message : text,
				model : defaultText
			}
		});
	}

	/**
	 * TODO: maso, 2017: document
	 * @param text
	 * @returns
	 */
	function toast(text) {
		return $mdToast.show(
				$mdToast.simple()
				.textContent(text)
				.hideDelay(3000)
		);
	}


	return {
		toast: toast,
		alert: alert,
		prompt: prompt,
		confirm: confirm
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Filters
 * @name wbunsafe
 * @description # unsafe Filter
 */
.filter('wbunsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});



/**
 * @ngdoc Controllers
 * @name AmdNavigatorDialogCtrl
 * @description # AccountCtrl Controller of the mblowfish-core
 */
angular.module('mblowfish-core').controller('AmdNavigatorDialogCtrl', function($scope, $mdDialog, config) {
	$scope.config = config;
	$scope.hide = function() {
		$mdDialog.cancel();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(a) {
		$mdDialog.hide(a);
	};
});



/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Directives
@name mb-icon
@description Icon for MBlowfish

 */
mblowfish.directive('mbIcon', function($mbIcon, $interpolate) {
	// FORMAT
	var template = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="{{icon.viewbox}}" width="{{icon.size}}" height="{{icon.size}}">{{{icon.shape}}}</svg>';
	// REPLACE FORMAT
	var replaceTemplate = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="{{icon.viewbox}}" width="{{icon.size}}" height="{{icon.size}}"><g id="{{icon.name}}" style="display:none">{{{icon.shape}}}</g><g id="{{old.name}}" style="display:none">{{{old.shape}}}</g></svg>';

	// optimize pars
	Mustache.parse(template);
	Mustache.parse(replaceTemplate);

	var shapes = $mbIcon.getShapes();

	function postLink(scope, element, attr, ctrls, transclude) {
		// icon information
		var icon = {
			name: 'help',
			viewbox: '0 0 24 24',
			size: 24,
		};
		// Counter
		var renderCount = 0;


		/*
		 * Sets icon and render the shape
		 */
		function setIcon(iconName) {
			var tempIcon = _.clone(icon);
			// icon
			if (iconName !== undefined) {
				tempIcon.name = iconName;
				// Check for material-design-icons style name, and extract icon / size
				var ss = iconName.match(/ic_(.*)_([0-9]+)px.svg/m);
				if (ss !== null) {
					tempIcon.name = ss[1];
					tempIcon.size = ss[2];
				}
			}

			render(tempIcon);
		}

		//        function setViewBox(viewBox){
		//            // viewBox
		//            if (attr.viewBox !== undefined) {
		//                viewBox = attr.viewBox;
		//            } else {
		//                viewBox = $mbIcon.getViewBox(icon) ? $mbIcon.getViewBox(icon) : '0 0 24 24';
		//            }
		//            render();
		//            return viewBox;
		//        }

		function setSize(newsize) {
			if (newsize === icon.size) {
				return;
			}
			var tempIcon = _.clone(icon);
			tempIcon.size = newsize;
			render(tempIcon);
		}

		function render(newIcon) {
			// check for new changes
			if (renderCount && newIcon.name === icon.name &&
				newIcon.size === icon.size &&
				newIcon.viewbox === icon.viewbox) {
				return;
			}
			newIcon.shape = shapes[newIcon.name];
			if (renderCount && window.SVGMorpheus) {
				// this block will succeed if SVGMorpheus is available
				var options = JSON.parse(attr.options || '{}');
				element.html(Mustache.render(replaceTemplate, {
					icon: newIcon,
					old: icon
				}));
				new SVGMorpheus(element.children()[0]).to(newIcon, options);
			} else {
				element.html(Mustache.render(template, {
					icon: newIcon
				}));
			}

			icon = newIcon;
			renderCount++;
		}

		// watch for any changes
		if (attr.icon !== undefined) {
			attr.$observe('icon', setIcon);
		} else if (attr.mbIconName !== undefined) {
			attr.$observe('mbIconName', setIcon);
		} else {
			transclude(scope, function(clone) {
				var text = clone.text();
				if (text && text.trim()) {
					scope.$watch(function() {
						return $interpolate(text.trim())(scope);
					}, setIcon);
				}
			});
		}
		if (attr.size !== undefined) {
			attr.$observe('size', setSize);
		}
	}

	return {
		restrict: 'E',
		transclude: true,
		link: postLink,
		replace: false
	};
});

mblowfish.directive('mdIconFloat', function($mdTheming) {

	var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT',
		'MD-SELECT'];

	var LEFT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat(['mb-icon ~ ' + isel, '.mb-icon ~ ' + isel]);
		}, []).join(',');

	var RIGHT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat([isel + ' ~ mb-icon', isel + ' ~ .mb-icon']);
		}, []).join(',');

	function compile(tElement) {
		// Check for both a left & right icon
		var leftIcon = tElement[0]
			.querySelector(LEFT_SELECTORS);
		var rightIcon = tElement[0]
			.querySelector(RIGHT_SELECTORS);

		if (leftIcon) {
			tElement.addClass('md-icon-left');
		}
		if (rightIcon) {
			tElement.addClass('md-icon-right');
		}

		return function postLink(scope, element) {
			$mdTheming(element);
		};
	}

	return {
		restrict: 'C',
		compile: compile
	};
});

/*
 * angular-material-icons v0.7.1
 * (c) 2014 Klar Systems
 * License: MIT
 */

/**
 * @ngdoc Services
 * @name $mbIconService
 * @description Manage icons to use in the view
 * 
 *  All icons will be managed
 */
mblowfish.provider('$mbIcon', function() {

	var provider, service;

	var shapes = {};
	var viewBoxes = {};
	var size = 24;

	service = {
		getShape: getShape,
		getShapes: getShapes,
		getViewBox: getViewBox,
		getViewBoxes: getViewBoxes,
		getSize: getSize,
		setShape: addShape,
		setShapes: addShapes,
		setViewBox: addViewBox,
		setViewBoxes: addViewBoxes,
		setSize: setSize,
		addShape: addShape,
		addShapes: addShapes,
		addViewBox: addViewBox,
		addViewBoxes: addViewBoxes
	};

	provider = {
		$get: $mbIconFactory,
		getShape: getShape,
		getShapes: getShapes,
		getViewBox: getViewBox,
		getViewBoxes: getViewBoxes,
		getSize: getSize,
		setShape: addShape,
		setShapes: addShapes,
		setViewBox: addViewBox,
		setViewBoxes: addViewBoxes,
		setSize: setSize,
		addShape: addShape,
		addShapes: addShapes,
		addViewBox: addViewBox,
		addViewBoxes: addViewBoxes
	};

	return provider;

	function addShape(name, shape) {
		shapes[name] = shape;

		return provider; // chainable function
	}

	function addShapes(newShapes) {
		shapes = angular.extend(shapes, newShapes);

		return provider; // chainable function
	}

	function addViewBox(name, viewBox) {
		viewBoxes[name] = viewBox;

		return provider; // chainable function
	}

	function addViewBoxes(newViewBoxes) {
		viewBoxes = angular.extend(viewBoxes, newViewBoxes);

		return provider; // chainable function
	}

	function getShape(name) {
		return shapes[name] || shapes['help'];
	}

	function getShapes() {
		return shapes;
	}

	function getViewBox(name) {
		return viewBoxes[name] || '0 0 24 24';
	}

	function getViewBoxes() {
		return viewBoxes;
	}

	function setSize(newSize) {
		size = newSize || 24;
	}

	function getSize() {
		return size;
	}

	function $mbIconFactory() {
		return service;
	}
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc module
 * @name ngDonate
 * @description Defines icons to use every where.
 *
 */
mblowfish.config(function($mbIconProvider) {
	$mbIconProvider


	/*
	 * Material Design Icons
	 * (http://materialdesignicons.com)
	 */
	.addShapes({
		'amazon': '<path d="M13.23 10.56V10c-1.94 0-3.99.39-3.99 2.67 0 1.16.61 1.95 1.63 1.95.76 0 1.43-.47 1.86-1.22.52-.93.5-1.8.5-2.84m2.7 6.53c-.18.16-.43.17-.63.06-.89-.74-1.05-1.08-1.54-1.79-1.47 1.5-2.51 1.95-4.42 1.95-2.25 0-4.01-1.39-4.01-4.17 0-2.18 1.17-3.64 2.86-4.38 1.46-.64 3.49-.76 5.04-.93V7.5c0-.66.05-1.41-.33-1.96-.32-.49-.95-.7-1.5-.7-1.02 0-1.93.53-2.15 1.61-.05.24-.25.48-.47.49l-2.6-.28c-.22-.05-.46-.22-.4-.56.6-3.15 3.45-4.1 6-4.1 1.3 0 3 .35 4.03 1.33C17.11 4.55 17 6.18 17 7.95v4.17c0 1.25.5 1.81 1 2.48.17.25.21.54 0 .71l-2.06 1.78h-.01"/><path d="M20.16 19.54C18 21.14 14.82 22 12.1 22c-3.81 0-7.25-1.41-9.85-3.76-.2-.18-.02-.43.25-.29 2.78 1.63 6.25 2.61 9.83 2.61 2.41 0 5.07-.5 7.51-1.53.37-.16.66.24.32.51"/><path d="M21.07 18.5c-.28-.36-1.85-.17-2.57-.08-.19.02-.22-.16-.03-.3 1.24-.88 3.29-.62 3.53-.33.24.3-.07 2.35-1.24 3.32-.18.16-.35.07-.26-.11.26-.67.85-2.14.57-2.5z"/>',
		'apple': '<path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>',
		'facebook-box': '<path d="M19 4v3h-2a1 1 0 0 0-1 1v2h3v3h-3v7h-3v-7h-2v-3h2V7.5C13 5.56 14.57 4 16.5 4M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2z"/>',
		'facebook-messenger': '<path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.88 1.42 5.45 3.65 7.15l.06 3.6 3.45-1.88-.03-.01c.91.25 1.87.39 2.87.39 5.5 0 10-4.14 10-9.25S17.5 2 12 2m1.03 12.41l-2.49-2.63-5.04 2.63 5.38-5.63 2.58 2.47 4.85-2.47-5.28 5.63z"/>',
		'facebook': '<path d="M17 2v4h-2c-.69 0-1 .81-1 1.5V10h3v4h-3v8h-4v-8H7v-4h3V6a4 4 0 0 1 4-4h3z"/>',
		'github-box': '<path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-5.15c-.35-.08-.35-.76-.35-1v-2.74c0-.93-.33-1.54-.69-1.85 2.23-.25 4.57-1.09 4.57-4.91 0-1.11-.38-2-1.03-2.71.1-.25.45-1.29-.1-2.64 0 0-.84-.27-2.75 1.02-.79-.22-1.65-.33-2.5-.33-.85 0-1.71.11-2.5.33-1.91-1.29-2.75-1.02-2.75-1.02-.55 1.35-.2 2.39-.1 2.64-.65.71-1.03 1.6-1.03 2.71 0 3.81 2.33 4.67 4.55 4.92-.28.25-.54.69-.63 1.34-.57.24-2.04.69-2.91-.83 0 0-.53-.96-1.53-1.03 0 0-.98-.02-.1.6 0 0 .68.31 1.14 1.47 0 0 .59 1.94 3.36 1.34V21c0 .24 0 .92-.36 1H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>',
		'github-circle': '<path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>',
		'google-plus-box': '<path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2M9.07 19.2C6.27 19.2 5 17.64 5 16.18c0-.45.14-1.59 1.5-2.38.75-.47 1.83-.8 3.12-.91-.19-.25-.34-.55-.34-.99 0-.15.02-.31.06-.46h-.39C7 11.44 5.8 9.89 5.8 8.39c0-1.73 1.29-3.59 4.11-3.59h4.22l-.34.34-.71.71-.08.06h-.7c.41.42.9 1.09.9 2.16 0 1.4-.74 2.09-1.56 2.73-.14.12-.42.38-.42.7 0 .32.24.5.39.64.13.11.29.22.47.36.81.55 1.92 1.33 1.92 2.86 0 1.77-1.29 3.84-4.93 3.84M19 12h-2v2h-1v-2h-2v-1h2V9h1v2h2"/><path d="M10.57 13.81c-.11-.01-.19-.01-.32-.01h-.02c-.26 0-1.15.05-1.82.27-.64.24-1.41.72-1.41 1.7C7 16.85 8.04 18 9.96 18c1.54 0 2.44-1 2.44-2 0-.75-.46-1.21-1.83-2.19"/><path d="M11.2 8.87c0-1.02-.63-3.02-2.08-3.02-.62 0-1.32.44-1.32 1.65 0 1.2.62 2.95 1.97 2.95.06 0 1.43-.01 1.43-1.58z"/>',
		'google-plus': '<path d="M13.3 13.45l-1.08-.85c-.36-.3-.82-.69-.82-1.42s.55-1.29.97-1.62c1.31-1.02 2.57-2.1 2.57-4.34 0-2.07-1.27-3.26-2.04-3.92h1.75L15.9.05H9.67c-4.36 0-6.6 2.71-6.6 5.72 0 2.33 1.79 4.83 4.98 4.83h.8c-.13.35-.35.84-.35 1.3 0 1.01.42 1.43.92 2-1.42.1-4.01.43-5.92 1.6-1.86 1.1-2.3 2.63-2.3 3.75 0 2.3 2.06 4.5 6.57 4.5 5.35 0 8.03-2.96 8.03-5.88 0-2.16-1.13-3.27-2.5-4.42M5.65 4.31c0-2.21 1.31-3.21 2.69-3.21 2.66 0 4.01 3.45 4.01 5.53 0 2.57-2.07 3.07-2.89 3.07C7 9.7 5.65 6.64 5.65 4.31M9.3 22.3c-3.33 0-5.45-1.49-5.45-3.7 0-2.2 1.96-2.91 2.65-3.16 1.3-.44 3-.49 3.27-.49.3 0 .46 0 .73.02 2.34 1.69 3.35 2.44 3.35 4.03 0 1.77-1.82 3.3-4.55 3.3"/><path d="M21 10V7h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/>',
		'hangouts': '<path d="M15 11l-1 2h-1.5l1-2H12V8h3m-4 3l-1 2H8.5l1-2H8V8h3m.5-6A8.5 8.5 0 0 0 3 10.5a8.5 8.5 0 0 0 8.5 8.5h.5v3.5c4.86-2.35 8-7.5 8-12C20 5.8 16.19 2 11.5 2z"/>',
		'linkedin-box': '<path d="M19 19h-3v-5.3a1.5 1.5 0 0 0-1.5-1.5 1.5 1.5 0 0 0-1.5 1.5V19h-3v-9h3v1.2c.5-.84 1.59-1.4 2.5-1.4a3.5 3.5 0 0 1 3.5 3.5M6.5 8.31c-1 0-1.81-.81-1.81-1.81A1.81 1.81 0 0 1 6.5 4.69c1 0 1.81.81 1.81 1.81A1.81 1.81 0 0 1 6.5 8.31M8 19H5v-9h3m12-8H4c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2z"/>',
		'linkedin': '<path d="M21 21h-4v-6.75c0-1.06-1.19-1.94-2.25-1.94S13 13.19 13 14.25V21H9V9h4v2c.66-1.07 2.36-1.76 3.5-1.76 2.5 0 4.5 2.04 4.5 4.51V21"/><path d="M7 21H3V9h4v12"/><path d="M5 3a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"/>',
		'login': '<path d="M10 17.25V14H3v-4h7V6.75L15.25 12 10 17.25"/><path d="M8 2h9a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4h2v4h9V4H8v4H6V4a2 2 0 0 1 2-2z"/>',
		'logout': '<path d="M17 17.25V14h-7v-4h7V6.75L22.25 12 17 17.25"/><path d="M13 2a2 2 0 0 1 2 2v4h-2V4H4v16h9v-4h2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>',
		'office': '<path d="M3 18l4-1.25V7l7-2v14.5L3.5 18.25 14 22l6-1.25V3.5L13.95 2 3 5.75V18z"/>',
		'twitter': '<path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>',
		'whatsapp': '<path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88"/><path d="M12 4a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96C8.69 19.46 10.28 20 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8zm0-2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65C2.57 15.8 2 13.97 2 12A10 10 0 0 1 12 2"/>',
		'windows': '<path d="M3 12V6.75l6-1.32v6.48L3 12"/><path d="M20 3v8.75l-10 .15V5.21L20 3"/><path d="M3 13l6 .09v6.81l-6-1.15V13"/><path d="M20 13.25V22l-10-1.91V13.1l10 .15z"/>',
	})

	/*
	 * Google Material Design Icons
	 * (https://www.google.com/design/icons)
	 */
	.addShapes({
		//
		// action
		//
		'3d_rotation': '<path d="M7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/><path d="M16.57 12.2c0 .42-.05.79-.14 1.13-.1.33-.24.62-.43.85-.19.23-.43.41-.71.53-.29.12-.62.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69.38.46.57 1.12.57 1.99v.4zm.39-3.16c-.32-.33-.7-.59-1.14-.77-.43-.18-.92-.27-1.46-.27H12v8h2.3c.55 0 1.06-.09 1.51-.27.45-.18.84-.43 1.16-.76.32-.33.57-.73.74-1.19.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57-.18-.47-.43-.87-.75-1.2zm-8.55 5.92c-.19 0-.37-.03-.52-.08-.16-.06-.29-.13-.4-.24-.11-.1-.2-.22-.26-.37-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.68.21.95.14.27.33.5.56.69.24.18.51.32.82.41.3.1.62.15.96.15.37 0 .72-.05 1.03-.15.32-.1.6-.25.83-.44.23-.19.42-.43.55-.72.13-.29.2-.61.2-.97 0-.19-.02-.38-.07-.56-.05-.18-.12-.35-.23-.51-.1-.16-.24-.3-.4-.43-.17-.13-.37-.23-.61-.31.2-.09.37-.2.52-.33.15-.13.27-.27.37-.42.1-.15.17-.3.22-.46.05-.16.07-.32.07-.48 0-.36-.06-.68-.18-.96-.12-.28-.29-.51-.51-.69-.2-.19-.47-.33-.77-.43C9.1 8.05 8.76 8 8.39 8c-.36 0-.69.05-1 .16-.3.11-.57.26-.79.45-.21.19-.38.41-.51.67-.12.26-.18.54-.18.85h1.3c0-.17.03-.32.09-.45s.14-.25.25-.34c.11-.09.23-.17.38-.22.15-.05.3-.08.48-.08.4 0 .7.1.89.31.19.2.29.49.29.86 0 .18-.03.34-.08.49-.05.15-.14.27-.25.37-.11.1-.25.18-.41.24-.16.06-.36.09-.58.09H7.5v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.22.24.29.4.07.16.1.35.1.57 0 .41-.12.72-.35.93-.23.23-.55.33-.95.33z"/><path d="M12 0l-.66.03 3.81 3.81 1.33-1.33c3.27 1.55 5.61 4.72 5.96 8.48h1.5C23.44 4.84 18.29 0 12 0z"/>',
		'accessibility': '<path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/><path d="M21 9h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>',
		'accessible': '<circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/>',
		'account_balance': '<path d="M4 10v7h3v-7H4z"/><path d="M10 10v7h3v-7h-3z"/><path d="M2 22h19v-3H2v3z"/><path d="M16 10v7h3v-7h-3z"/><path d="M11.5 1L2 6v2h19V6l-9.5-5z"/>',
		'account_balance_wallet': '<path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9z"/><path d="M16 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 16h10V8H12v8z"/>',
		'account_box': '<path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/>',
		'account_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
		'add_shopping_cart': '<path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3z"/><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/><path d="M7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/>',
		'alarm': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'alarm_add': '<path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M13 9h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"/>',
		'alarm_off': '<path d="M12 6c3.87 0 7 3.13 7 7 0 .84-.16 1.65-.43 2.4l1.52 1.52c.58-1.19.91-2.51.91-3.92a9 9 0 0 0-9-9c-1.41 0-2.73.33-3.92.91L9.6 6.43C10.35 6.16 11.16 6 12 6z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M16.47 18.39C15.26 19.39 13.7 20 12 20c-3.87 0-7-3.13-7-7 0-1.7.61-3.26 1.61-4.47l9.86 9.86zM2.92 2.29L1.65 3.57 2.98 4.9l-1.11.93 1.42 1.42 1.11-.94.8.8A8.964 8.964 0 0 0 3 13c0 4.97 4.02 9 9 9 2.25 0 4.31-.83 5.89-2.2l2.2 2.2 1.27-1.27L3.89 3.27l-.97-.98z"/><path d="M8.02 3.28L6.6 1.86l-.86.71 1.42 1.42.86-.71z"/>',
		'alarm_on': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M10.54 14.53L8.41 12.4l-1.06 1.06 3.18 3.18 6-6-1.06-1.06-4.93 4.95z"/>',
		'all_out': '<path d="M16.21 4.16l4 4v-4z"/><path d="M20.21 16.16l-4 4h4z"/><path d="M8.21 20.16l-4-4v4z"/><path d="M4.21 8.16l4-4h-4z"/><path d="M16.06 16.01a5.438 5.438 0 0 1-7.7 0 5.438 5.438 0 0 1 0-7.7 5.438 5.438 0 0 1 7.7 0 5.438 5.438 0 0 1 0 7.7zm1.1-8.8a7.007 7.007 0 0 0-9.9 0 7.007 7.007 0 0 0 0 9.9 7.007 7.007 0 0 0 9.9 0c2.73-2.73 2.73-7.16 0-9.9z"/>',
		'android': '<path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10z"/><path d="M3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8z"/><path d="M20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5z"/><path d="M15 5h-1V4h1v1zm-5 0H9V4h1v1zm5.53-2.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84z"/>',
		'announcement': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>',
		'aspect_ratio': '<path d="M19 12h-2v3h-3v2h5v-5z"/><path d="M7 9h3V7H5v5h2V9z"/><path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'assessment': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
		'assignment': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>',
		'assignment_ind': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>',
		'assignment_late': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 15h-2v-2h2v2zm0-4h-2V8h2v6zm-1-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>',
		'assignment_return': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-4v3l-5-5 5-5v3h4v4z"/>',
		'assignment_returned': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-5-5h3V9h4v4h3l-5 5z"/>',
		'assignment_turned_in': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>',
		'autorenew': '<path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z"/><path d="M18.76 7.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>',
		'backup': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>',
		'book': '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>',
		'bookmark': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>',
		'bookmark_outline': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>',
		'bug_report': '<path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>',
		'build': '<path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>',
		'cached': '<path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4z"/><path d="M6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>',
		'camera_enhanced': '<path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/> <path d="M12 17l1.25-2.75L16 13l-2.75-1.25L12 9l-1.25 2.75L8 13l2.75 1.25z"/>',
		'card_giftcard': '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>',
		'card_membership': '<path d="M20 2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h4v5l4-2 4 2v-5h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2zm0 13H4v-2h16v2zm0-5H4V4h16v6z"/>',
		'card_travel': '<path d="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z"/>',
		'change_history': '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>',
		'check_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
		'chrome_reader_mode': '<path d="M13 12h7v1.5h-7z"/><path d="M13 9.5h7V11h-7z"/><path d="M13 14.5h7V16h-7z"/><path d="M21 19h-9V6h9v13zm0-15H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'class': '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>',
		'code': '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"/><path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>',
		'compare_arrows': '<path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3z"/><path d="M14.99 13v-3H22V8h-7.01V5L11 9l3.99 4z"/>',
		'copyright': '<path d="M10.08 10.86c.05-.33.16-.62.3-.87.14-.25.34-.46.59-.62.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53c.09.2.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29-.17-.39-.4-.73-.7-1.01-.3-.28-.66-.5-1.08-.66-.42-.16-.88-.23-1.39-.23-.65 0-1.22.11-1.7.34-.48.23-.88.53-1.2.92-.32.39-.56.84-.71 1.36-.15.52-.24 1.06-.24 1.64v.27c0 .58.08 1.12.23 1.64.15.52.39.97.71 1.35.32.38.72.69 1.2.91.48.22 1.05.34 1.7.34.47 0 .91-.08 1.32-.23.41-.15.77-.36 1.08-.63.31-.27.56-.58.74-.94.18-.36.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58-.09.18-.21.33-.36.46s-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23a1.75 1.75 0 0 1-.59-.62c-.14-.25-.25-.55-.3-.88a6.74 6.74 0 0 1-.08-1v-.27c0-.35.03-.68.08-1.01z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'credit_card': '<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>',
		'dashboard': '<path d="M3 13h8V3H3v10z"/><path d="M3 21h8v-6H3v6z"/><path d="M13 21h8V11h-8v10z"/><path d="M13 3v6h8V3h-8z"/>',
		'date_range': '<path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>',
		'delete': '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
		'delete_forever': '<path d="M8.46 11.88l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>',
		'description': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
		'dns': '<path d="M7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm13-6H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1z"/><path d="M7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm13-6H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/>',
		'done': '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
		'done_all': '<path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7z"/><path d="M22.24 5.59L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41z"/><path d="M.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>',
		'donut_large': '<path d="M11 5.08V2c-5 .5-9 4.81-9 10s4 9.5 9 10v-3.08c-3-.48-6-3.4-6-6.92s3-6.44 6-6.92z"/><path d="M18.97 11H22c-.47-5-4-8.53-9-9v3.08C16 5.51 18.54 8 18.97 11z"/><path d="M13 18.92V22c5-.47 8.53-4 9-9h-3.03c-.43 3-2.97 5.49-5.97 5.92z"/>',
		'donut_small': '<path d="M11 9.16V2c-5 .5-9 4.79-9 10s4 9.5 9 10v-7.16c-1-.41-2-1.52-2-2.84 0-1.32 1-2.43 2-2.84z"/><path d="M14.86 11H22c-.48-4.75-4-8.53-9-9v7.16c1 .3 1.52.98 1.86 1.84z"/><path d="M13 14.84V22c5-.47 8.52-4.25 9-9h-7.14c-.34.86-.86 1.54-1.86 1.84z"/>',
		'eject': '<path d="M5 17h14v2H5z"/><path d="M12 5L5.33 15h13.34z"/>',
		'euro_symbol': '<path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1 0 .34.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"/>',
		'event': '<path d="M17 12h-5v5h5v-5z"/><path d="M19 19H5V8h14v11zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2z"/>',
		'event_seat': '<path d="M4 18v3h3v-3h10v3h3v-6H4z"/><path d="M19 10h3v3h-3z"/><path d="M2 10h3v3H2z"/><path d="M17 13H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"/>',
		'exit_to_app': '<path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59z"/><path d="M19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'explore': '<path d="M12 10.9c-.61 0-1.1.49-1.1 1.1 0 .61.49 1.1 1.1 1.1.61 0 1.1-.49 1.1-1.1 0-.61-.49-1.1-1.1-1.1z"/><path d="M14.19 14.19L6 18l3.81-8.19L18 6l-3.81 8.19zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'extension': '<path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>',
		'face': '<path d="M14.69 17.1c-.74.58-1.7.9-2.69.9s-1.95-.32-2.69-.9c-.22-.17-.53-.13-.7.09-.17.22-.13.53.09.7.91.72 2.09 1.11 3.3 1.11s2.39-.39 3.31-1.1c.22-.17.26-.48.09-.7-.17-.23-.49-.26-.71-.1z"/><path d="M19.96 14.82c-1.09 3.74-4.27 6.46-8.04 6.46-3.78 0-6.96-2.72-8.04-6.47-1.19-.11-2.13-1.18-2.13-2.52 0-1.27.85-2.31 1.97-2.5 2.09-1.46 3.8-3.49 4.09-5.05v-.01c1.35 2.63 6.3 5.19 11.83 5.06l.3-.03c1.28 0 2.31 1.14 2.31 2.54 0 1.38-1.02 2.51-2.29 2.52zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/><path d="M16.5 12.5c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm-7 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1z"/>',
		'favorite': '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
		'favorite_border': '<path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>',
		'feedback': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>',
		'find_in_page': '<path d="M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59z"/><path d="M9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/>',
		'find_replace': '<path d="M11 6c1.38 0 2.63.56 3.54 1.46L12 10h6V4l-2.05 2.05C14.68 4.78 12.93 4 11 4c-3.53 0-6.43 2.61-6.92 6H6.1c.46-2.28 2.48-4 4.9-4z"/><path d="M16.64 15.14c.66-.9 1.12-1.97 1.28-3.14H15.9c-.46 2.28-2.48 4-4.9 4-1.38 0-2.63-.56-3.54-1.46L10 12H4v6l2.05-2.05C7.32 17.22 9.07 18 11 18c1.55 0 2.98-.51 4.14-1.36L20 21.49 21.49 20l-4.85-4.86z"/>',
		'fingerprint': '<path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2a.506.506 0 0 1 .2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67a.49.49 0 0 1-.44.28z"/><path d="M3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25a.5.5 0 0 1-.12.7c-.23.16-.54.11-.7-.12a9.388 9.388 0 0 0-3.39-2.94c-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21z"/><path d="M9.75 21.79a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15z"/><path d="M16.92 19.94c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12z"/><path d="M14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1a7.297 7.297 0 0 1-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29a11.14 11.14 0 0 1-.73-3.96c0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94-1.7 0-3.08-1.32-3.08-2.94 0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>',
		'flight_land': '<path d="M2.5 19h19v2h-19z"/><path d="M9.68 13.27l4.35 1.16 5.31 1.42c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l1.6.43 5.31 1.43z"/>',
		'flight_takeoff': '<path d="M2.5 19h19v2h-19z"/><path d="M22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z"/>',
		'flip_to_back': '<path d="M9 7H7v2h2V7z"/><path d="M9 11H7v2h2v-2z"/><path d="M9 3a2 2 0 0 0-2 2h2V3z"/><path d="M13 15h-2v2h2v-2z"/><path d="M19 3v2h2c0-1.1-.9-2-2-2z"/><path d="M13 3h-2v2h2V3z"/><path d="M9 17v-2H7a2 2 0 0 0 2 2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 17c1.1 0 2-.9 2-2h-2v2z"/><path d="M5 7H3v12a2 2 0 0 0 2 2h12v-2H5V7z"/><path d="M15 5h2V3h-2v2z"/><path d="M15 17h2v-2h-2v2z"/>',
		'flip_to_front': '<path d="M3 13h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M5 21v-2H3a2 2 0 0 0 2 2z"/><path d="M3 9h2V7H3v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M19 15H9V5h10v10zm0-12H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/>',
		'g_translate': '<path d="M20 5h-9.12L10 2H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h7l1 3h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM7.17 14.59c-2.25 0-4.09-1.83-4.09-4.09s1.83-4.09 4.09-4.09c1.04 0 1.99.37 2.74 1.07l.07.06-1.23 1.18-.06-.05c-.29-.27-.78-.59-1.52-.59-1.31 0-2.38 1.09-2.38 2.42s1.07 2.42 2.38 2.42c1.37 0 1.96-.87 2.12-1.46H7.08V9.91h3.95l.01.07c.04.21.05.4.05.61 0 2.35-1.61 4-3.92 4zm6.03-1.71c.33.6.74 1.18 1.19 1.7l-.54.53-.65-2.23zm.77-.76h-.99l-.31-1.04h3.99s-.34 1.31-1.56 2.74c-.52-.62-.89-1.23-1.13-1.7zM21 20c0 .55-.45 1-1 1h-7l2-2-.81-2.77.92-.92L17.79 18l.73-.73-2.71-2.68c.9-1.03 1.6-2.25 1.92-3.51H19v-1.04h-3.64V9h-1.04v1.04h-1.96L11.18 6H20c.55 0 1 .45 1 1v13z"/>',
		'gavel': '<path d="M1 21h12v2H1z"/><path d="M5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828z"/><path d="M12.317 1l5.657 5.656-2.83 2.83-5.654-5.66z"/><path d="M3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z"/>',
		'get_app': '<path d="M19 9h-4V3H9v6H5l7 7 7-7z"/><path d="M5 18v2h14v-2H5z"/>',
		'gif': '<path d="M11.5 9H13v6h-1.5z"/><path d="M9 9H6c-.6 0-1 .5-1 1v4c0 .5.4 1 1 1h3c.6 0 1-.5 1-1v-2H8.5v1.5h-2v-3H10V10c0-.5-.4-1-1-1z"/><path d="M19 10.5V9h-4.5v6H16v-2h2v-1.5h-2v-1z"/>',
		'grade': '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
		'group_work': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'help': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',
		'help_outline': '<path d="M11 18h2v-2h-2v2z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>',
		'highlight_off': '<path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"/>',
		'history': '<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M12 8v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>',
		'home': '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
		'hourglass_empty': '<path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/>',
		'hourglass_full': '<path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"/>',
		'http': '<path d="M4.5 11h-2V9H1v6h1.5v-2.5h2V15H6V9H4.5v2z"/><path d="M7 10.5h1.5V15H10v-4.5h1.5V9H7v1.5z"/><path d="M12.5 10.5H14V15h1.5v-4.5H17V9h-4.5v1.5z"/><path d="M21.5 11.5h-2v-1h2v1zm0-2.5H18v6h1.5v-2h2c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5z"/>',
		'https': '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
		'important_devices': '<path d="M23 20h-5v-7h5v7zm0-8.99L18 11c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-9c0-.55-.45-.99-1-.99z"/><path d="M20 2H2C.89 2 0 2.89 0 4v12a2 2 0 0 0 2 2h7v2H7v2h8v-2h-2v-2h2v-2H2V4h18v5h2V4a2 2 0 0 0-2-2z"/><path d="M11.97 9L11 6l-.97 3H7l2.47 1.76-.94 2.91 2.47-1.8 2.47 1.8-.94-2.91L15 9h-3.03z"/>',
		'info': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
		'info_outline': '<path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M11 9h2V7h-2v2zm0 8h2v-6h-2v6z"/>',
		'input': '<path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2z"/><path d="M11 16l4-4-4-4v3H1v2h10v3z"/>',
		'invert_colors': '<path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"/>',
		'label': '<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>',
		'label_outline': '<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"/>',
		'language': '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>',
		'launch': '<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>',
		'lightbulb_outline': '<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z"/><path d="M14.85 13.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1zM12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>',
		'line_style': '<path d="M3 16h5v-2H3v2z"/><path d="M9.5 16h5v-2h-5v2z"/><path d="M16 16h5v-2h-5v2z"/><path d="M3 20h2v-2H3v2z"/><path d="M7 20h2v-2H7v2z"/><path d="M11 20h2v-2h-2v2z"/><path d="M15 20h2v-2h-2v2z"/><path d="M19 20h2v-2h-2v2z"/><path d="M3 12h8v-2H3v2z"/><path d="M13 12h8v-2h-8v2z"/><path d="M3 4v4h18V4H3z"/>',
		'line_weight': '<path d="M3 17h18v-2H3v2z"/><path d="M3 20h18v-1H3v1z"/><path d="M3 13h18v-3H3v3z"/><path d="M3 4v4h18V4H3z"/>',
		'list': '<path d="M3 9h2V7H3v2zm0 8h2v-2H3v2zm0-4h2v-2H3v2z"/><path d="M7 13h14v-2H7v2z"/><path d="M7 17h14v-2H7v2z"/><path d="M7 7v2h14V7H7z"/>',
		'lock': '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
		'lock_open': '<path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M18 20H6V10h12v10zm0-12h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>',
		'lock_outline': '<path d="M18 20H6V10h12zM12 2.9c1.71 0 3.1 1.39 3.1 3.1v2H9V6l-.002-.008C8.998 4.282 10.29 2.9 12 2.9zM18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>',
		'loyalty': '<path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7zm11.77 8.27L13 19.54l-4.27-4.27C8.28 14.81 8 14.19 8 13.5c0-1.38 1.12-2.5 2.5-2.5.69 0 1.32.28 1.77.74l.73.72.73-.73c.45-.45 1.08-.73 1.77-.73 1.38 0 2.5 1.12 2.5 2.5 0 .69-.28 1.32-.73 1.77z"/>',
		'markunread_mailbox': '<path d="M20 6H10v6H8V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>',
		'motorcycle': '<path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H5v2h2.82zM19 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>',
		'note_add': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"/>',
		'offline_pin': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 16H7v-2h10v2zm-6.7-4L7 10.7l1.4-1.4 1.9 1.9 5.3-5.3L17 7.3 10.3 14z"/>',
		'opacity': '<path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"/>',
		'open_in_browser': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2z"/><path d="M12 10l-4 4h3v6h2v-6h3l-4-4z"/>',
		'open_in_new': '<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>',
		'open_with': '<path d="M10 9h4V6h3l-5-5-5 5h3v3z"/><path d="M9 10H6V7l-5 5 5 5v-3h3v-4z"/><path d="M23 12l-5-5v3h-3v4h3v3l5-5z"/><path d="M14 15h-4v3H7l5 5 5-5h-3v-3z"/>',
		'pageview': '<path d="M11 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><path d="M17.59 19l-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L19 17.59 17.59 19zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'pan_tool': '<path d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"/>',
		'payment': '<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>',
		'perm_camera_mic': '<path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v-2.09c-2.83-.48-5-2.94-5-5.91h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 2.97-2.17 5.43-5 5.91V21h7c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-6 8c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v4z"/>',
		'perm_contact_calendar': '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/>',
		'perm_data_setting': '<path d="M18.99 11.5c.34 0 .67.03 1 .07L20 0 0 20h11.56c-.04-.33-.07-.66-.07-1 0-4.14 3.36-7.5 7.5-7.5z"/><path d="M18.99 20.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.71-1.01c.02-.16.04-.32.04-.49 0-.17-.01-.33-.04-.49l1.06-.83c.09-.08.12-.21.06-.32l-1-1.73c-.06-.11-.19-.15-.31-.11l-1.24.5c-.26-.2-.54-.37-.85-.49l-.19-1.32c-.01-.12-.12-.21-.24-.21h-2c-.12 0-.23.09-.25.21l-.19 1.32c-.3.13-.59.29-.85.49l-1.24-.5c-.11-.04-.24 0-.31.11l-1 1.73c-.06.11-.04.24.06.32l1.06.83c-.02.16-.03.32-.03.49 0 .17.01.33.03.49l-1.06.83c-.09.08-.12.21-.06.32l1 1.73c.06.11.19.15.31.11l1.24-.5c.26.2.54.37.85.49l.19 1.32c.02.12.12.21.25.21h2c.12 0 .23-.09.25-.21l.19-1.32c.3-.13.59-.29.84-.49l1.25.5c.11.04.24 0 .31-.11l1-1.73c.06-.11.03-.24-.06-.32l-1.07-.83z"/>',
		'perm_device_information': '<path d="M13 11h-2v6h2v-6zm0-4h-2v2h2V7z"/><path d="M17 19H7V5h10v14zm0-17.99L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/>',
		'perm_identity': '<path d="M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.9c1.16 0 2.1.94 2.1 2.1 0 1.16-.94 2.1-2.1 2.1-1.16 0-2.1-.94-2.1-2.1 0-1.16.94-2.1 2.1-2.1"/><path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm0 1.9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1"/>',
		'perm_media': '<path d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6z"/><path d="M7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7zM22 4h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'perm_phone_msg': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M12 3v10l3-3h6V3h-9z"/>',
		'perm_scan_wifi': '<path d="M12 3C6.95 3 3.15 4.85 0 7.23L12 22 24 7.25C20.85 4.87 17.05 3 12 3zm1 13h-2v-6h2v6zm-2-8V6h2v2h-2z"/>',
		'pets': '<circle cx="4.5" cy="9.5" r="2.5"/> <circle cx="9" cy="5.5" r="2.5"/> <circle cx="15" cy="5.5" r="2.5"/> <circle cx="19.5" cy="9.5" r="2.5"/> <path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z"/>',
		'picture_in_picture': '<path d="M19 7h-8v6h8V7z"/><path d="M21 19.01H3V4.98h18v14.03zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2z"/>',
		'picture_in_picture_alt': '<path d="M19 11h-8v6h8v-6z"/><path d="M21 19.02H3V4.97h18v14.05zm2-.02V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2z"/>',
		'play_for_work': '<path d="M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2z"/><path d="M6 14c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z"/>',
		'polymer': '<path d="M19 4h-4L7.11 16.63 4.5 12 9 4H5L.5 12 5 20h4l7.89-12.63L19.5 12 15 20h4l4.5-8z"/>',
		'power_settings_new': '<path d="M13 3h-2v10h2V3z"/><path d="M17.83 5.17l-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7A6.995 6.995 0 0 1 7.58 6.58L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83z"/>',
		'pregnant_woman': '<path d="M9 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm7 9c-.01-1.34-.83-2.51-2-3 0-1.66-1.34-3-3-3s-3 1.34-3 3v7h2v5h3v-5h3v-4z"/>',
		'print': '<path d="M19 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3 7H8v-5h8v5zm3-11H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3z"/><path d="M18 3H6v4h12V3z"/>',
		'query_builder': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
		'question_answer': '<path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"/><path d="M17 12V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>',
		'receipt': '<path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>',
		'record_voice_over': '<circle cx="9" cy="9" r="4"/><path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64l-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"/>',
		'redeem': '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>',
		'remove_shopping_cart': '<path d="M7.42 15c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h2.36l2 2H7.42zm15.31 7.73L2.77 2.77 2 2l-.73-.73L0 2.54l4.39 4.39 2.21 4.66-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h7.46l1.38 1.38A1.997 1.997 0 0 0 17 22c.67 0 1.26-.33 1.62-.84L21.46 24l1.27-1.27z"/><path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H6.54l9.01 9z"/><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/>',
		'reorder': '<path d="M3 15h18v-2H3v2z"/><path d="M3 19h18v-2H3v2z"/><path d="M3 11h18V9H3v2z"/><path d="M3 5v2h18V5H3z"/>',
		'report_problem': '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
		'restore': '<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M12 8v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>',
		'restore_page': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"/>',
		'room': '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'rounded_corner': '<path d="M19 19h2v2h-2v-2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M3 5h2V3H3v2z"/><path d="M7 5h2V3H7v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M21 8c0-2.76-2.24-5-5-5h-5v2h5c1.65 0 3 1.35 3 3v5h2V8z"/>',
		'rowing': '<path d="M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5z"/><path d="M15 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M21 21.01L18 24l-2.99-3.01V19.5l-7.1-7.09c-.31.05-.61.07-.91.07v-2.16c1.66.03 3.61-.87 4.67-2.04l1.4-1.55c.19-.21.43-.38.69-.5.29-.14.62-.23.96-.23h.03C15.99 6.01 17 7.02 17 8.26v5.75c0 .84-.35 1.61-.92 2.16l-3.58-3.58v-2.27c-.63.52-1.43 1.02-2.29 1.39L16.5 18H18l3 3.01z"/>',
		'schedule': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
		'search': '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
		'settings': '<path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>',
		'settings_applications': '<path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M17.25 12c0 .23-.02.46-.05.68l1.48 1.16c.13.11.17.3.08.45l-1.4 2.42c-.09.15-.27.21-.43.15l-1.74-.7c-.36.28-.76.51-1.18.69l-.26 1.85c-.03.17-.18.3-.35.3h-2.8c-.17 0-.32-.13-.35-.29l-.26-1.85c-.43-.18-.82-.41-1.18-.69l-1.74.7c-.16.06-.34 0-.43-.15l-1.4-2.42c-.09-.15-.05-.34.08-.45l1.48-1.16c-.03-.23-.05-.46-.05-.69 0-.23.02-.46.05-.68l-1.48-1.16c-.13-.11-.17-.3-.08-.45l1.4-2.42c.09-.15.27-.21.43-.15l1.74.7c.36-.28.76-.51 1.18-.69l.26-1.85c.03-.17.18-.3.35-.3h2.8c.17 0 .32.13.35.29l.26 1.85c.43.18.82.41 1.18.69l1.74-.7c.16-.06.34 0 .43.15l1.4 2.42c.09.15.05.34-.08.45l-1.48 1.16c.03.23.05.46.05.69zM19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2z"/>',
		'settings_backup_restore': '<path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/><path d="M12 3c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'settings_bluetooth': '<path d="M15 24h2v-2h-2v2zm-8 0h2v-2H7v2zm4 0h2v-2h-2v2z"/><path d="M14.88 14.29L13 16.17v-3.76l1.88 1.88zM13 3.83l1.88 1.88L13 7.59V3.83zm4.71 1.88L12 0h-1v7.59L6.41 3 5 4.41 10.59 10 5 15.59 6.41 17 11 12.41V20h1l5.71-5.71-4.3-4.29 4.3-4.29z"/>',
		'settings_brightness': '<path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M12 9c1.66 0 3 1.34 3 3s-1.34 3-3 3V9zm-4 7h2.5l1.5 1.5 1.5-1.5H16v-2.5l1.5-1.5-1.5-1.5V8h-2.5L12 6.5 10.5 8H8v2.5L6.5 12 8 13.5V16z"/>',
		'settings_cell': '<path d="M15 24h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/><path d="M16 16H8V4h8v12zM16 .01L8 0C6.9 0 6 .9 6 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V2c0-1.1-.9-1.99-2-1.99z"/>',
		'settings_ethernet': '<path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24z"/><path d="M11 13h2v-2h-2v2zm6-2h-2v2h2v-2zM7 13h2v-2H7v2z"/><path d="M17.77 5.48l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"/>',
		'settings_input_antenna': '<path d="M12 5c-3.87 0-7 3.13-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M13 14.29c.88-.39 1.5-1.26 1.5-2.29 0-1.38-1.12-2.5-2.5-2.5S9.5 10.62 9.5 12c0 1.02.62 1.9 1.5 2.29v3.3L7.59 21 9 22.41l3-3 3 3L16.41 21 13 17.59v-3.3z"/><path d="M12 1C5.93 1 1 5.93 1 12h2c0-4.97 4.03-9 9-9s9 4.03 9 9h2c0-6.07-4.93-11-11-11z"/>',
		'settings_input_component': '<path d="M1 16c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2z"/><path d="M13 2c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zM9 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2z"/><path d="M17 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2zm4-10V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2z"/>',
		'settings_input_composite': '<path d="M1 16c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2z"/><path d="M13 2c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zM9 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2z"/><path d="M17 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2zm4-10V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2z"/>',
		'settings_input_hdmi': '<path d="M18 7V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3H5v6l3 6v3h8v-3l3-6V7h-1zM8 4h8v3h-2V5h-1v2h-2V5h-1v2H8V4z"/>',
		'settings_input_svideo': '<path d="M15 6.5c0-.83-.67-1.5-1.5-1.5h-3C9.67 5 9 5.67 9 6.5S9.67 8 10.5 8h3c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 15c-.83 0-1.5.67-1.5 1.5S7.67 18 8.5 18s1.5-.67 1.5-1.5S9.33 15 8.5 15zM8 11.5c0-.83-.67-1.5-1.5-1.5S5 10.67 5 11.5 5.67 13 6.5 13 8 12.33 8 11.5z"/><path d="M12 21c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm0-20C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1z"/><path d="M15.5 15c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm2-5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>',
		'settings_overscan': '<path d="M14 16h-4l2.01 2.5L14 16zm-8-6l-2.5 2.01L6 14v-4zm12 0v4l2.5-1.99L18 10zm-5.99-4.5L10 8h4l-1.99-2.5z"/><path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'settings_phone': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19 9v2h2V9h-2zm-2 0h-2v2h2V9zm-4 0h-2v2h2V9z"/>',
		'settings_power': '<path d="M13 2h-2v10h2V2z"/><path d="M16.56 4.44l-1.45 1.45C16.84 6.94 18 8.83 18 11c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 4.44C5.36 5.88 4 8.28 4 11c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56z"/><path d="M15 24h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/>',
		'settings_remote': '<path d="M12 15c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-6H9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1z"/><path d="M7.05 6.05l1.41 1.41C9.37 6.56 10.62 6 12 6s2.63.56 3.54 1.46l1.41-1.41C15.68 4.78 13.93 4 12 4c-1.93 0-3.68.78-4.95 2.05z"/><path d="M12 0C8.96 0 6.21 1.23 4.22 3.22l1.41 1.41C7.26 3.01 9.51 2 12 2s4.74 1.01 6.36 2.64l1.41-1.41C17.79 1.23 15.04 0 12 0z"/>',
		'settings_voice': '<path d="M12 13c1.66 0 2.99-1.34 2.99-3L15 4c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3z"/><path d="M15 24h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/><path d="M19 10h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 13 6.7 10H5c0 3.41 2.72 6.23 6 6.72V20h2v-3.28c3.28-.49 6-3.31 6-6.72z"/>',
		'shop': '<path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"/>',
		'shop_two': '<path d="M3 9H1v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2H3V9z"/><path d="M12 15V8l5.5 3-5.5 4zm0-12h4v2h-4V3zm6 2V3c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H5v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5h-5z"/>',
		'shopping_basket': '<path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.4L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
		'shopping_cart': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
		'speaker_notes': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 14H6v-2h2v2zm0-3H6V9h2v2zm0-3H6V6h2v2zm7 6h-5v-2h5v2zm3-3h-8V9h8v2zm0-3h-8V6h8v2z"/>',
		'speaker_notes_off': '<path d="M6 11V9l2 2H6zm2 3H6v-2h2v2zm2.54-3l-.54-.54L7.54 8 6 6.46 2.38 2.84 1.27 1.73 0 3l2.01 2.01L2 22l4-4h9l5.73 5.73L22 22.46 17.54 18l-7-7z"/><path d="M20 2H4.08L10 7.92V6h8v2h-7.92l1 1H18v2h-4.92l6.99 6.99C21.14 17.95 22 17.08 22 16V4c0-1.1-.9-2-2-2z"/>',
		'spellcheck': '<path d="M6.43 11L8.5 5.48 10.57 11H6.43zm6.02 5h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.64l1.14 3z"/><path d="M21.59 11.59l-8.09 8.09L9.83 16l-1.41 1.41 5.09 5.09L23 13l-1.41-1.41z"/>',
		'star_rate': '<path d="M12 14.3l3.71 2.7-1.42-4.36L18 10h-4.55L12 5.5 10.55 10H6l3.71 2.64L8.29 17z"/>',
		'stars': '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>',
		'store': '<path d="M20 4H4v2h16V4z"/><path d="M12 18H6v-4h6v4zm9-4v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1z"/>',
		'subject': '<path d="M14 17H4v2h10v-2z"/><path d="M20 9H4v2h16V9z"/><path d="M4 15h16v-2H4v2z"/><path d="M4 5v2h16V5H4z"/>',
		'supervisor_account': '<path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5z"/><path d="M9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3z"/><path d="M16.5 14c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75z"/><path d="M9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/>',
		'swap_horiz': '<path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3z"/><path d="M21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>',
		'swap_vert': '<path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3z"/>',
		'swap_vertial_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM6.5 9L10 5.5 13.5 9H11v4H9V9H6.5zm11 6L14 18.5 10.5 15H13v-4h2v4h2.5z"/>',
		'system_update_alt': '<path d="M12 16.5l4-4h-3v-9h-2v9H8l4 4z"/><path d="M21 3.5h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2z"/>',
		'tab': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"/>',
		'tab_unselected': '<path d="M1 9h2V7H1v2z"/><path d="M1 13h2v-2H1v2z"/><path d="M1 5h2V3c-1.1 0-2 .9-2 2z"/><path d="M9 21h2v-2H9v2z"/><path d="M1 17h2v-2H1v2z"/><path d="M3 21v-2H1c0 1.1.9 2 2 2z"/><path d="M21 3h-8v6h10V5c0-1.1-.9-2-2-2z"/><path d="M21 17h2v-2h-2v2z"/><path d="M9 5h2V3H9v2z"/><path d="M5 21h2v-2H5v2z"/><path d="M5 5h2V3H5v2z"/><path d="M21 21c1.1 0 2-.9 2-2h-2v2z"/><path d="M21 13h2v-2h-2v2z"/><path d="M13 21h2v-2h-2v2z"/><path d="M17 21h2v-2h-2v2z"/>',
		'theaters': '<path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>',
		'thumb_down': '<path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2z"/><path d="M19 3v12h4V3h-4z"/>',
		'thumb_up': '<path d="M1 21h4V9H1v12z"/><path d="M23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>',
		'thumbs_up_down': '<path d="M12 6c0-.55-.45-1-1-1H5.82l.66-3.18.02-.23c0-.31-.13-.59-.33-.8L5.38 0 .44 4.94C.17 5.21 0 5.59 0 6v6.5c0 .83.67 1.5 1.5 1.5h6.75c.62 0 1.15-.38 1.38-.91l2.26-5.29c.07-.17.11-.36.11-.55V6z"/><path d="M22.5 10h-6.75c-.62 0-1.15.38-1.38.91l-2.26 5.29c-.07.17-.11.36-.11.55V18c0 .55.45 1 1 1h5.18l-.66 3.18-.02.24c0 .31.13.59.33.8l.79.78 4.94-4.94c.27-.27.44-.65.44-1.06v-6.5c0-.83-.67-1.5-1.5-1.5z"/>',
		'timeline': '<path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"/>',
		'toc': '<path d="M3 9h14V7H3v2z"/><path d="M3 13h14v-2H3v2z"/><path d="M3 17h14v-2H3v2z"/><path d="M19 13h2v-2h-2v2zm0-6v2h2V7h-2zm0 10h2v-2h-2v2z"/>',
		'today': '<path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M7 10h5v5H7z"/>',
		'toll': '<path d="M3 12c0-2.61 1.67-4.83 4-5.65V4.26C3.55 5.15 1 8.27 1 12s2.55 6.85 6 7.74v-2.09c-2.33-.82-4-3.04-4-5.65z"/>',
		'touch_app': '<path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74z"/><path d="M18.84 15.87l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>',
		'track_changes': '<path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.9 16 10.9 16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86v2.14c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V2h-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z"/>',
		'translate': '<path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z"/><path d="M15.88 17l1.62-4.33L19.12 17h-3.24zm2.62-7h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12z"/>',
		'trending_down': '<path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>',
		'trending_flat': '<path d="M22 12l-4-4v3H3v2h15v3z"/>',
		'trending_up': '<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>',
		'turned_in': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>',
		'turned_in_not': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>',
		'update': '<path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1a6.875 6.875 0 0 0 0 9.79 7.02 7.02 0 0 0 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58a8.987 8.987 0 0 1 12.65 0L21 3v7.12z"/><path d="M12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/>',
		'verified_user': '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>',
		'view_agenda': '<path d="M20 13H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1z"/><path d="M20 3H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/>',
		'view_array': '<path d="M4 18h3V5H4v13z"/><path d="M18 5v13h3V5h-3z"/><path d="M8 18h9V5H8v13z"/>',
		'view_carousel': '<path d="M7 19h10V4H7v15z"/><path d="M2 17h4V6H2v11z"/><path d="M18 6v11h4V6h-4z"/>',
		'view_column': '<path d="M10 18h5V5h-5v13z"/><path d="M4 18h5V5H4v13z"/><path d="M16 5v13h5V5h-5z"/>',
		'view_day': '<path d="M2 21h19v-3H2v3z"/><path d="M20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/><path d="M2 3v3h19V3H2z"/>',
		'view_headline': '<path d="M4 15h17v-2H4v2z"/><path d="M4 19h17v-2H4v2z"/><path d="M4 11h17V9H4v2z"/><path d="M4 5v2h17V5H4z"/>',
		'view_list': '<path d="M4 14h4v-4H4v4z"/><path d="M4 19h4v-4H4v4z"/><path d="M4 9h4V5H4v4z"/><path d="M9 14h12v-4H9v4z"/><path d="M9 19h12v-4H9v4z"/><path d="M9 5v4h12V5H9z"/>',
		'view_module': '<path d="M4 11h5V5H4v6z"/><path d="M4 18h5v-6H4v6z"/><path d="M10 18h5v-6h-5v6z"/><path d="M16 18h5v-6h-5v6z"/><path d="M10 11h5V5h-5v6z"/><path d="M16 5v6h5V5h-5z"/>',
		'view_quilt': '<path d="M10 18h5v-6h-5v6z"/><path d="M4 18h5V5H4v13z"/><path d="M16 18h5v-6h-5v6z"/><path d="M10 5v6h11V5H10z"/>',
		'view_stream': '<path d="M4 18h17v-6H4v6z"/><path d="M4 5v6h17V5H4z"/>',
		'view_week': '<path d="M6 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/><path d="M20 5h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/><path d="M13 5h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>',
		'visibility': '<path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'visibility_off': '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7z"/><path d="M7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/><path d="M11.84 9.02l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>',
		'watch_later': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>',
		'work': '<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
		'youtube_searched_for': '<path d="M17.01 14h-.8l-.27-.27c.98-1.14 1.57-2.61 1.57-4.23 0-3.59-2.91-6.5-6.5-6.5s-6.5 3-6.5 6.5H2l3.84 4 4.16-4H6.51C6.51 7 8.53 5 11.01 5s4.5 2.01 4.5 4.5c0 2.48-2.02 4.5-4.5 4.5-.65 0-1.26-.14-1.82-.38L7.71 15.1c.97.57 2.09.9 3.3.9 1.61 0 3.08-.59 4.22-1.57l.27.27v.79l5.01 4.99L22 19l-4.99-5z"/>',
		'zoom_in': '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>',
		'zoom_out': '<path d="M9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm6 0h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/><path d="M7 9h5v1H7z"/>',
		//
		// alert
		//
		'add_alert':'<path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z"/>',
		'error': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
		'error_outline':'<path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>',
		'warning': '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
		//
		// av
		//
		'add_to_queue': '<path d="M21 17H3V5h18v12zm0-14H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2z"/><path d="M16 10v2h-3v3h-2v-3H8v-2h3V7h2v3h3z"/>',
		'airplay': '<path d="M6 22h12l-6-6z"/><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V5h18v12h-4v2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'album': '<path d="M12 16.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 11c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>',
		'art_track': '<path d="M22 13h-8v-2h8v2z"/><path d="M22 7h-8v2h8V7z"/><path d="M14 17h8v-2h-8v2z"/><path d="M10.5 15l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7zM12 9v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2z"/>',
		'av_timer': '<path d="M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"/><path d="M11 3v4h2V5.08c3.39.49 6 3.39 6 6.92 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.68.59-3.22 1.58-4.42L12 13l1.41-1.41-6.8-6.8v.02C4.42 6.45 3 9.05 3 12c0 4.97 4.02 9 9 9 4.97 0 9-4.03 9-9s-4.03-9-9-9h-1z"/><path d="M18 12c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1z"/><path d="M6 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"/>',
		'branding_watermark': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-9v-6h9v6z"/>',
		'call_to_action': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"/>',
		'closed_caption': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"/>',
		'equalizer': '<path d="M10 20h4V4h-4v16z"/><path d="M4 20h4v-8H4v8z"/><path d="M16 9v11h4V9h-4z"/>',
		'explicit': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z"/>',
		'fast_forward': '<path d="M4 18l8.5-6L4 6v12z"/><path d="M13 6v12l8.5-6L13 6z"/>',
		'fast_rewind': '<path d="M11 18V6l-8.5 6 8.5 6z"/><path d="M11.5 12l8.5 6V6l-8.5 6z"/>',
		'featured_play_list': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 8H3V9h9v2zm0-4H3V5h9v2z"/>',
		'featured_video': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 9H3V5h9v7z"/>',
		'fibre_dvr': '<path d="M17.5 10.5h2v1h-2zm-13 0h2v3h-2zM21 3H3c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h18c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zM8 13.5c0 .85-.65 1.5-1.5 1.5H3V9h3.5c.85 0 1.5.65 1.5 1.5v3zm4.62 1.5h-1.5L9.37 9h1.5l1 3.43 1-3.43h1.5l-1.75 6zM21 11.5c0 .6-.4 1.15-.9 1.4L21 15h-1.5l-.85-2H17.5v2H16V9h3.5c.85 0 1.5.65 1.5 1.5v1z"/>',
		'fiber_manual_record': '<circle cx="12" cy="12" r="8"/>',
		'fibre_new': '<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-3.5V15H3.5V9h1.25l2.5 3.5V9H8.5v6zm5-4.74H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4v1.26zm7 3.74c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25v5z"/>',
		'fibre_pin': '<path d="M5.5 10.5h2v1h-2zM20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM9 11.5c0 .85-.65 1.5-1.5 1.5h-2v2H4V9h3.5c.85 0 1.5.65 1.5 1.5v1zm3.5 3.5H11V9h1.5v6zm7.5 0h-1.2l-2.55-3.5V15H15V9h1.25l2.5 3.5V9H20v6z"/>',
		'fibre_smart_record': '<path d="M17 4.26v2.09c2.33.82 4 3.04 4 5.65s-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74s-2.55-6.85-6-7.74z"/>',
		'forward_10': '<path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z"/><path d="M10.8 16H10v-3.3L9 13v-.7l1.8-.6h.1V16z"/><path d="M14.3 13.4v-.5s-.1-.2-.1-.3c0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.8.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/>',
		'forward_30': '<path d="M9.6 13.5h.4c.2 0 .4-.1.5-.2.1-.1.2-.2.2-.4v-.2s-.1-.1-.1-.2-.1-.1-.2-.1h-.5s-.1.1-.2.1-.1.1-.1.2v.2h-1c0-.2 0-.3.1-.5s.2-.3.3-.4c.1-.1.3-.2.4-.2.1 0 .4-.1.5-.1.2 0 .4 0 .6.1.2.1.3.1.5.2s.2.2.3.4c.1.2.1.3.1.5v.3s-.1.2-.1.3c0 .1-.1.2-.2.2s-.2.1-.3.2c.2.1.4.2.5.4.1.2.2.4.2.6 0 .2 0 .4-.1.5-.1.1-.2.3-.3.4-.1.1-.3.2-.5.2s-.4.1-.6.1c-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.4-.1-.6h.8v.2s.1.1.1.2.1.1.2.1h.5s.1-.1.2-.1.1-.1.1-.2v-.5s-.1-.1-.1-.2-.1-.1-.2-.1h-.6v-.7z"/><path d="M14.4 13.4v-.5s-.1-.2-.1-.3c0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.9.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/><path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z"/>',
		'forward_5': '<path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z"/><path d="M10.7 13.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1.1.1.3.2.4.3.1.1.2.3.3.5.1.2.1.4.1.6 0 .2 0 .4-.1.5-.1.1-.1.3-.3.5-.2.2-.3.2-.5.3-.2.1-.4.1-.6.1-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.3-.1-.5h.8c0 .2.1.3.2.4.1.1.2.1.4.1.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.6z"/>',
		'games': '<path d="M15 7.5V2H9v5.5l3 3 3-3z"/><path d="M7.5 9H2v6h5.5l3-3-3-3z"/><path d="M9 16.5V22h6v-5.5l-3-3-3 3z"/><path d="M16.5 9l-3 3 3 3H22V9h-5.5z"/>',
		'hd': '<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm2-6h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-4V9zm1.5 4.5h2v-3h-2v3z"/>',
		'hearing': '<path d="M17 20c-.29 0-.56-.06-.76-.15-.71-.37-1.21-.88-1.71-2.38-.51-1.56-1.47-2.29-2.39-3-.79-.61-1.61-1.24-2.32-2.53C9.29 10.98 9 9.93 9 9c0-2.8 2.2-5 5-5s5 2.2 5 5h2c0-3.93-3.07-7-7-7S7 5.07 7 9c0 1.26.38 2.65 1.07 3.9.91 1.65 1.98 2.48 2.85 3.15.81.62 1.39 1.07 1.71 2.05.6 1.82 1.37 2.84 2.73 3.55.51.23 1.07.35 1.64.35 2.21 0 4-1.79 4-4h-2c0 1.1-.9 2-2 2z"/><path d="M7.64 2.64L6.22 1.22C4.23 3.21 3 5.96 3 9s1.23 5.79 3.22 7.78l1.41-1.41C6.01 13.74 5 11.49 5 9s1.01-4.74 2.64-6.36z"/><path d="M11.5 9c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5z"/>',
		'high_quality': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm7-1c0 .55-.45 1-1 1h-.75v1.5h-1.5V15H14c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v4zm-3.5-.5h2v-3h-2v3z"/>',
		'my_library_add': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 11h-4v4h-2v-4H9V9h4V5h2v4h4v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'my_library_books': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 7H9V5h10v2zm-4 8H9v-2h6v2zm4-4H9V9h10v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'my_library_music': '<path d="M18 7h-3v5.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zm2-5H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>',
		'loop': '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"/><path d="M12 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>',
		'mic': '<path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>',
		'mic_none': '<path d="M10.8 4.9c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2-.66 0-1.2-.54-1.2-1.2V4.9zM12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>',
		'mic_off': '<path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28z"/><path d="M14.98 11.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99z"/><path d="M4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>',
		'movie': '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>',
		'music_video': '<path d="M21 19H3V5h18v14zm0-16H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03A3.003 3.003 0 0 1 11 18c-1.66 0-3-1.34-3-3z"/>',
		'new_releases': '<path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
		'not_interested': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>',
		'note': '<path d="M22 10l-6-6H4c-1.1 0-2 .9-2 2v12.01c0 1.1.9 1.99 2 1.99l16-.01c1.1 0 2-.89 2-1.99v-8zm-7-4.5l5.5 5.5H15V5.5z"/>',
		'pause': '<path d="M6 19h4V5H6v14z"/><path d="M14 5v14h4V5h-4z"/>',
		'pause_circle_filled': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>',
		'pause_circle_outline': '<path d="M9 16h2V8H9v8z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M13 16h2V8h-2v8z"/>',
		'play_arrow': '<path d="M8 5v14l11-7z"/>',
		'play_circle_fill': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>',
		'play_circle_outline': '<path d="M10 16.5l6-4.5-6-4.5v9z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'playlist_add': '<path d="M14 10H2v2h12v-2z"/><path d="M14 6H2v2h12V6z"/><path d="M18 14v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z"/><path d="M2 16h8v-2H2v2z"/>',
		'playlist_add_check': '<path d="M14 10H2v2h12v-2z"/><path d="M14 6H2v2h12V6z"/><path d="M2 16h8v-2H2v2z"/><path d="M21.5 11.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"/>',
		'playlist_play': '<path d="M19 9H2v2h17V9z"/><path d="M19 5H2v2h17V5z"/><path d="M2 15h13v-2H2v2z"/><path d="M17 13v6l5-3-5-3z"/>',
		'queue': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 11h-4v4h-2v-4H9V9h4V5h2v4h4v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'queue_music': '<path d="M15 6H3v2h12V6z"/><path d="M15 10H3v2h12v-2z"/><path d="M3 16h8v-2H3v2z"/><path d="M17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>',
		'queue_play_next': '<path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h2v-2H3V5h18v8h2V5a2 2 0 0 0-2-2z"/><path d="M13 10V7h-2v3H8v2h3v3h2v-3h3v-2h-3z"/><path d="M24 18l-4.5 4.5L18 21l3-3-3-3 1.5-1.5L24 18z"/>',
		'radio': '<path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>',
		'recent_actors': '<path d="M17 19h2V5h-2v14zm4-14v14h2V5h-2z"/><path d="M12.5 17h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V17zM8 7.75c1.24 0 2.25 1.01 2.25 2.25S9.24 12.25 8 12.25 5.75 11.24 5.75 10 6.76 7.75 8 7.75zM14 5H2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>',
		'remove_from_queue': '<path d="M21 17H3V5h18v12zm0-14H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2z"/><path d="M16 10v2H8v-2h8z"/>',
		'repeat': '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7z"/><path d="M17 17H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>',
		'repeat_one': '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7z"/><path d="M17 17H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><path d="M13 15V9h-1l-2 1v1h1.5v4H13z"/>',
		'replay': '<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>',
		'replay_10': '<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/><path d="M10.9 16H10v-3.3L9 13v-.7l1.8-.6h.1V16z"/><path d="M14.3 13.4v-.5s-.1-.2-.1-.3c0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.9.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/>',
		'replay_30': '<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/><path d="M9.6 13.5h.4c.2 0 .4-.1.5-.2.1-.1.2-.2.2-.4v-.2s-.1-.1-.1-.2-.1-.1-.2-.1h-.5s-.1.1-.2.1-.1.1-.1.2v.2h-1c0-.2 0-.3.1-.5s.2-.3.3-.4c.1-.1.3-.2.4-.2.1 0 .4-.1.5-.1.2 0 .4 0 .6.1.2.1.3.1.5.2s.2.2.3.4c.1.2.1.3.1.5v.3s-.1.2-.1.3c0 .1-.1.2-.2.2s-.2.1-.3.2c.2.1.4.2.5.4.1.2.2.4.2.6 0 .2 0 .4-.1.5-.1.1-.2.3-.3.4-.1.1-.3.2-.5.2s-.4.1-.6.1c-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.4-.1-.6h.8v.2s.1.1.1.2.1.1.2.1h.5s.1-.1.2-.1.1-.1.1-.2v-.5s-.1-.1-.1-.2-.1-.1-.2-.1h-.6v-.7z"/><path d="M14.5 13.4v-.5c0-.1-.1-.2-.1-.3 0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.8.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/>',
		'replay_5': '<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/><path d="M10.7 13.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1.1.1.3.2.4.3.1.1.2.3.3.5.1.2.1.4.1.6 0 .2 0 .4-.1.5-.1.1-.1.3-.3.5-.2.2-.3.2-.4.3-.1.1-.4.1-.6.1-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.3-.1-.5h.8c0 .2.1.3.2.4.1.1.2.1.4.1.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.7z"/>',
		'shuffle': '<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41z"/><path d="M14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5z"/><path d="M14.83 13.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>',
		'skip_next': '<path d="M6 18l8.5-6L6 6v12z"/><path d="M16 6v12h2V6h-2z"/>',
		'skip_previous': '<path d="M6 6h2v12H6z"/><path d="M9.5 12l8.5 6V6z"/>',
		'slow_motion_video': '<path d="M13.05 9.79L10 7.5v9l3.05-2.29L16 12z"/><path d="M13.05 9.79L10 7.5v9l3.05-2.29L16 12z"/><path d="M13.05 9.79L10 7.5v9l3.05-2.29L16 12z"/><path d="M11 4.07V2.05c-2.01.2-3.84 1-5.32 2.21L7.1 5.69A7.941 7.941 0 0 1 11 4.07z"/><path d="M5.69 7.1L4.26 5.68A9.949 9.949 0 0 0 2.05 11h2.02c.18-1.46.76-2.79 1.62-3.9z"/><path d="M4.07 13H2.05c.2 2.01 1 3.84 2.21 5.32l1.43-1.43A7.868 7.868 0 0 1 4.07 13z"/><path d="M5.68 19.74A9.981 9.981 0 0 0 11 21.95v-2.02a7.941 7.941 0 0 1-3.9-1.62l-1.42 1.43z"/><path d="M22 12c0 5.16-3.92 9.42-8.95 9.95v-2.02C16.97 19.41 20 16.05 20 12s-3.03-7.41-6.95-7.93V2.05C18.08 2.58 22 6.84 22 12z"/>',
		'snooze': '<path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M9 11h3.63L9 15.2V17h6v-2h-3.63L15 10.8V9H9v2z"/>',
		'sort_by_alpha': '<path d="M14.94 4.66h-4.72l2.36-2.36z"/><path d="M10.25 19.37h4.66l-2.33 2.33z"/><path d="M4.97 13.64l1.94-5.18 1.94 5.18H4.97zM6.1 6.27L1.6 17.73h1.84l.92-2.45h5.11l.92 2.45h1.84L7.74 6.27H6.1z"/><path d="M15.73 16.14h6.12v1.59h-8.53v-1.29l5.92-8.56h-5.88v-1.6h8.3v1.26l-5.93 8.6z"/>',
		'stop': '<path d="M6 6h12v12H6z"/>',
		'subscriptions': '<path d="M20 8H4V6h16v2z"/><path d="M18 2H6v2h12V2z"/><path d="M16 16l-6-3.27v6.53L16 16zm6-4v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2z"/>',
		'subtitles': '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"/>',
		'surround_sound': '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.76 16.24l-1.41 1.41C4.78 16.1 4 14.05 4 12c0-2.05.78-4.1 2.34-5.66l1.41 1.41C6.59 8.93 6 10.46 6 12s.59 3.07 1.76 4.24zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm5.66 1.66l-1.41-1.41C17.41 15.07 18 13.54 18 12s-.59-3.07-1.76-4.24l1.41-1.41C19.22 7.9 20 9.95 20 12c0 2.05-.78 4.1-2.34 5.66zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'video_call': ' <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>',
		'video_label': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z"/>',
		'video_library': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M12 14.5v-9l6 4.5-6 4.5zM20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'videocam': '<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>',
		'videocam_off': '<path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5z"/><path d="M3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>',
		'volume_down': '<path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M5 9v6h4l5 5V4L9 9H5z"/>',
		'volume_mute': '<path d="M7 9v6h4l5 5V4l-5 5H7z"/>',
		'volume_off': '<path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63z"/><path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z"/><path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z"/><path d="M12 4L9.91 6.09 12 8.18V4z"/>',
		'volume_up': '<path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>',
		'web': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>',
		'web_asset': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 14H5V8h14v10z" />',
		//
		// communication
		//
		'business': '<path d="M20 19h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zM10 7H8V5h2v2zm0 4H8V9h2v2zm0 4H8v-2h2v2zm0 4H8v-2h2v2zM6 7H4V5h2v2zm0 4H4V9h2v2zm0 4H4v-2h2v2zm0 4H4v-2h2v2zm6-12V3H2v18h20V7H12z"/><path d="M18 11h-2v2h2v-2z"/><path d="M18 15h-2v2h2v-2z"/>',
		'call': '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
		'call_end': '<path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>',
		'call_made': '<path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>',
		'call_merge': '<path d="M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41z"/><path d="M7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z"/>',
		'call_missed': '<path d="M19.59 7L12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z"/>',
		'call_missed_outgoing':'<path d="M3 8.41l9 9 7-7V15h2V7h-8v2h4.59L12 14.59 4.41 7 3 8.41z"/>',
		'call_received': '<path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"/>',
		'call_split': '<path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4z"/><path d="M10 4H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"/>',
		'chat': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>',
		'chat_bubble': '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'chat_bubble_outline': '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>',
		'clear_all': '<path d="M5 13h14v-2H5v2z"/><path d="M3 17h14v-2H3v2z"/><path d="M7 7v2h14V7H7z"/>',
		'comment': '<path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>',
		'contact_mail':'<path d="M21 8V7l-3 2-3-2v1l3 2 3-2zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm8-6h-8V6h8v6z"/>',
		'contact_phone':'<path d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm3.85-4h1.64L21 16l-1.99 1.99c-1.31-.98-2.28-2.38-2.73-3.99-.18-.64-.28-1.31-.28-2s.1-1.36.28-2c.45-1.62 1.42-3.01 2.73-3.99L21 8l-1.51 2h-1.64c-.22.63-.35 1.3-.35 2s.13 1.37.35 2z"/>',
		'contacts': '<path d="M20 0H4v2h16V0z"/><path d="M4 24h16v-2H4v2z"/><path d="M17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17zM12 6.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'dialer_sip': '<path d="M20 5h-1V4h1v1zm-2-2v5h1V6h2V3h-3zm-3 2h-2V4h2V3h-3v3h2v1h-2v1h3V5zm2-2h-1v5h1V3z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.27-.26.35-.65.24-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>',
		'dialpad': '<path d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M6 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M12 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'email': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'forum': '<path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"/><path d="M17 12V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>',
		'import_contacts': '<path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>',
		'import_export': '<path d="M9 3L5 6.99h3V14h2V6.99h3L9 3z"/><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/>',
		'invert_colors_off': '<path d="M12 19.59c-1.6 0-3.11-.62-4.24-1.76A5.945 5.945 0 0 1 6 13.59c0-1.32.43-2.57 1.21-3.6L12 14.77v4.82zm8.65 1.28l-2.35-2.35-6.3-6.29-3.56-3.57-1.42-1.41L4.27 4.5 3 5.77l2.78 2.78a8.005 8.005 0 0 0 .56 10.69A7.98 7.98 0 0 0 12 21.58c1.79 0 3.57-.59 5.03-1.78l2.7 2.7L21 21.23l-.35-.36z"/><path d="M12 5.1v4.58l7.25 7.26c1.37-2.96.84-6.57-1.6-9.01L12 2.27l-3.7 3.7 1.41 1.41L12 5.1z"/>',
		'live_help': '<path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',
		'location_off': '<path d="M12 6.5A2.5 2.5 0 0 1 14.5 9c0 .74-.33 1.39-.83 1.85l3.63 3.63c.98-1.86 1.7-3.8 1.7-5.48 0-3.87-3.13-7-7-7a7 7 0 0 0-5.04 2.15l3.19 3.19c.46-.52 1.11-.84 1.85-.84z"/><path d="M16.37 16.1l-4.63-4.63-.11-.11L3.27 3 2 4.27l3.18 3.18C5.07 7.95 5 8.47 5 9c0 5.25 7 13 7 13s1.67-1.85 3.38-4.35L18.73 21 20 19.73l-3.63-3.63z"/>',
		'location_on': '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'mail_outline': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>',
		'message': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>',
		'no_sim': '<path d="M18.99 5c0-1.1-.89-2-1.99-2h-7L7.66 5.34 19 16.68 18.99 5z"/><path d="M3.65 3.88L2.38 5.15 5 7.77V19c0 1.1.9 2 2 2h10.01c.35 0 .67-.1.96-.26l1.88 1.88 1.27-1.27L3.65 3.88z"/>',
		'phone': '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
		'phonelink_erase':'<path d="M13 8.2l-1-1-4 4-4-4-1 1 4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4zM19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'phonelink_lock':'<path d="M19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-8.2 10V9.5C10.8 8.1 9.4 7 8 7S5.2 8.1 5.2 9.5V11c-.6 0-1.2.6-1.2 1.2v3.5c0 .7.6 1.3 1.2 1.3h5.5c.7 0 1.3-.6 1.3-1.2v-3.5c0-.7-.6-1.3-1.2-1.3zm-1.3 0h-3V9.5c0-.8.7-1.3 1.5-1.3s1.5.5 1.5 1.3V11z"/>',
		'phonelink_ring':'<path d="M20.1 7.7l-1 1c1.8 1.8 1.8 4.6 0 6.5l1 1c2.5-2.3 2.5-6.1 0-8.5zM18 9.8l-1 1c.5.7.5 1.6 0 2.3l1 1c1.2-1.2 1.2-3 0-4.3zM14 1H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 19H4V4h10v16z"/>',
		'phonelink_setup':'<path d="M11.8 12.5v-1l1.1-.8c.1-.1.1-.2.1-.3l-1-1.7c-.1-.1-.2-.2-.3-.1l-1.3.4c-.3-.2-.6-.4-.9-.5l-.2-1.3c0-.1-.1-.2-.3-.2H7c-.1 0-.2.1-.3.2l-.2 1.3c-.3.1-.6.3-.9.5l-1.3-.5c-.1 0-.2 0-.3.1l-1 1.7c-.1.1 0 .2.1.3l1.1.8v1l-1.1.8c-.1.2-.1.3-.1.4l1 1.7c.1.1.2.2.3.1l1.4-.4c.3.2.6.4.9.5l.2 1.3c-.1.1.1.2.2.2h2c.1 0 .2-.1.3-.2l.2-1.3c.3-.1.6-.3.9-.5l1.3.5c.1 0 .2 0 .3-.1l1-1.7c.1-.1 0-.2-.1-.3l-1.1-.9zM8 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'portable_wifi_off': '<path d="M17.56 14.24c.28-.69.44-1.45.44-2.24 0-3.31-2.69-6-6-6-.79 0-1.55.16-2.24.44l1.62 1.62c.2-.03.41-.06.62-.06a3.999 3.999 0 0 1 3.95 4.63l1.61 1.61z"/><path d="M12 4c4.42 0 8 3.58 8 8 0 1.35-.35 2.62-.95 3.74l1.47 1.47A9.86 9.86 0 0 0 22 12c0-5.52-4.48-10-10-10-1.91 0-3.69.55-5.21 1.47l1.46 1.46C9.37 4.34 10.65 4 12 4z"/><path d="M3.27 2.5L2 3.77l2.1 2.1C2.79 7.57 2 9.69 2 12c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 17.53 4 14.96 4 12c0-1.76.57-3.38 1.53-4.69l1.43 1.44C6.36 9.68 6 10.8 6 12c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-.65.17-1.25.44-1.79l1.58 1.58L10 12c0 1.1.9 2 2 2l.21-.02.01.01 7.51 7.51L21 20.23 4.27 3.5l-1-1z"/>',
		'present_to_all': '<path d="M21 19.02H3V4.98h18v14.04zM21 3H3c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/><path d="M10 12H8l4-4 4 4h-2v4h-4v-4z"/>',
		'ring_volume': '<path d="M23.71 16.67C20.66 13.78 16.54 12 12 12 7.46 12 3.34 13.78.29 16.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73 1.6 0 3.15.25 4.6.72v3.1c0 .39.23.74.56.9.98.49 1.87 1.12 2.66 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.27-.11-.52-.29-.7z"/><path d="M21.16 6.26l-1.41-1.41-3.56 3.55 1.41 1.41s3.45-3.52 3.56-3.55z"/><path d="M13 2h-2v5h2V2z"/><path d="M6.4 9.81L7.81 8.4 4.26 4.84 2.84 6.26c.11.03 3.56 3.55 3.56 3.55z"/>',
		'rss_feed': '<path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56z"/><path d="M4 10.1v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>',
		'screen_share': '<path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zm-7-3.53v-2.19c-2.78 0-4.61.85-6 2.72.56-2.67 2.11-5.33 6-5.87V7l4 3.73-4 3.74z"/>',
		'stay_current_landscape': '<path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"/>',
		'stay_current_portrait': '<path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>',
		'stay_primary_landscape': '<path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"/>',
		'stay_primary_portrait': '<path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>',
		'stop_screen_share': '<path d="M21.22 18.02l2 2H24v-2h-2.78z"/><path d="M21.99 16.02l.01-10a2 2 0 0 0-2-2H7.22l5.23 5.23c.18-.04.36-.07.55-.1V7.02l4 3.73-1.58 1.47 5.54 5.54c.61-.33 1.03-.99 1.03-1.74z"/><path d="M7 15.02c.31-1.48.92-2.95 2.07-4.06l1.59 1.59c-1.54.38-2.7 1.18-3.66 2.47zM2.39 1.73L1.11 3l1.54 1.54c-.4.36-.65.89-.65 1.48v10a2 2 0 0 0 2 2H0v2h18.13l2.71 2.71 1.27-1.27L2.39 1.73z"/>',
		'swap_calls': '<path d="M18 4l-4 4h3v7c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-2.21-1.79-4-4-4S5 5.79 5 8v7H2l4 4 4-4H7V8c0-1.1.9-2 2-2s2 .9 2 2v7c0 2.21 1.79 4 4 4s4-1.79 4-4V8h3l-4-4z"/>',
		'textsms': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>',
		'voicemail': '<path d="M18.5 6C15.46 6 13 8.46 13 11.5c0 1.33.47 2.55 1.26 3.5H9.74c.79-.95 1.26-2.17 1.26-3.5C11 8.46 8.54 6 5.5 6S0 8.46 0 11.5 2.46 17 5.5 17h13c3.04 0 5.5-2.46 5.5-5.5S21.54 6 18.5 6zm-13 9C3.57 15 2 13.43 2 11.5S3.57 8 5.5 8 9 9.57 9 11.5 7.43 15 5.5 15zm13 0c-1.93 0-3.5-1.57-3.5-3.5S16.57 8 18.5 8 22 9.57 22 11.5 20.43 15 18.5 15z"/>',
		'vpn_key': '<path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
		//
		// content
		//
		'add': '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
		'add_box': '<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
		'add_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
		'add_circle_outline': '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'archive': '<path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>',
		'backspace': '<path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/>',
		'block': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>',
		'clear': '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
		'content_copy': '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z"/><path d="M19 21H8V7h11v14zm0-16H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/>',
		'content_cut': '<path d="M12 12.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM6 20a2 2 0 1 1-.001-3.999A2 2 0 0 1 6 20zM6 8a2 2 0 1 1-.001-3.999A2 2 0 0 1 6 8zm3.64-.36c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64z"/><path d="M19 3l-6 6 2 2 7-7V3z"/>',
		'content_paste': '<path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>',
		'create': '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
		'delete_sweep': '<path d="M15 16h4v2h-4z"/><path d="M15 8h7v2h-7z"/><path d="M15 12h6v2h-6z"/><path d="M3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10z"/><path d="M14 5h-3l-1-1H6L5 5H2v2h12z"/>',
		'drafts': '<path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z"/>',
		'filter_list': '<path d="M10 18h4v-2h-4v2z"/><path d="M3 6v2h18V6H3z"/><path d="M6 13h12v-2H6v2z"/>',
		'flag': '<path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>',
		'font_download': '<path d="M9.93 13.5h4.14L12 7.98z"/><path d="M15.95 18.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'forward': '<path d="M12 8V4l8 8-8 8v-4H4V8z"/>',
		'gesture': '<path d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"/>',
		'inbox': '<path d="M19 15h-4c0 1.66-1.34 3-3 3s-3-1.34-3-3H4.99V5H19v10zm0-12H4.99c-1.1 0-1.98.9-1.98 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M16 10h-2V7h-4v3H8l4 4 4-4z"/>',
		'link': '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1z"/><path d="M8 13h8v-2H8v2z"/><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
		'low_priority': '<path d="M14 5h8v2h-8z"/><path d="M14 10.5h8v2h-8z"/><path d="M14 16h8v2h-8z"/><path d="M2 11.5C2 15.08 4.92 18 8.5 18H9v2l3-3-3-3v2h-.5C6.02 16 4 13.98 4 11.5S6.02 7 8.5 7H12V5H8.5C4.92 5 2 7.92 2 11.5z"/>',
		'mail': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'markunread': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'move_to_inbox': '<path d="M19 15h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10zm0-12H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M16 10h-2V7h-4v3H8l4 4 4-4z"/>',
		'next_week': '<path d="M20 7h-4V5c0-.55-.22-1.05-.59-1.41C15.05 3.22 14.55 3 14 3h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm1 13.5l-1-1 3-3-3-3 1-1 4 4-4 4z"/>',
		'redo': '<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>',
		'remove': '<path d="M19 13H5v-2h14v2z"/>',
		'remove_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>',
		'remove_circle_outline': '<path d="M7 11v2h10v-2H7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'reply': '<path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>',
		'reply_all': '<path d="M7 8V5l-7 7 7 7v-3l-4-4 4-4z"/><path d="M13 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>',
		'report': '<path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"/>',
		'save': '<path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>',
		'select_all': '<path d="M3 5h2V3c-1.1 0-2 .9-2 2z"/><path d="M3 13h2v-2H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M3 9h2V7H3v2z"/><path d="M13 3h-2v2h2V3z"/><path d="M19 3v2h2c0-1.1-.9-2-2-2z"/><path d="M5 21v-2H3c0 1.1.9 2 2 2z"/><path d="M3 17h2v-2H3v2z"/><path d="M9 3H7v2h2V3z"/><path d="M11 21h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21c1.1 0 2-.9 2-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M9 9h6v6H9V9zm-2 8h10V7H7v10z"/>',
		'send': '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>',
		'sort': '<path d="M3 18h6v-2H3v2z"/><path d="M3 6v2h18V6H3z"/><path d="M3 13h12v-2H3v2z"/>',
		'text_format': '<path d="M5 17v2h14v-2H5z"/><path d="M12 5.98L13.87 11h-3.74L12 5.98zM9.5 12.8h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2z"/>',
		'unarchive': '<path d="M20.55 5.22l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z"/>',
		'undo': '<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>',
		'weekend': '<path d="M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2z"/><path d="M18 5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z"/>',
		//
		// device
		//
		'access_alarms': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'access_alarm': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'access_time': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
		'add_alarm': '<path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M13 9h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"/>',
		'airplanemode_on': '<path d="M10.18 9"/><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>',
		'airplanemode_inactive': '<path d="M13 9V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v3.68l7.83 7.83L21 16v-2l-8-5z"/><path d="M3 5.27l4.99 4.99L2 14v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-3.73L18.73 21 20 19.73 4.27 4 3 5.27z"/>',
		'battery_charging_full': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/>',
		'battery_full': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_std': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_unknown': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zm-2.72 13.95h-1.9v-1.9h1.9v1.9zm1.35-5.26s-.38.42-.67.71c-.48.48-.83 1.15-.83 1.6h-1.6c0-.83.46-1.52.93-2l.93-.94c.27-.27.44-.65.44-1.06 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5H9c0-1.66 1.34-3 3-3s3 1.34 3 3c0 .66-.27 1.26-.7 1.69z"/>',
		'bluetooth': '<path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>',
		'bluetooth_connected': '<path d="M14.88 16.29L13 18.17v-3.76l1.88 1.88zM13 5.83l1.88 1.88L13 9.59V5.83zm4.71 1.88L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29z"/><path d="M19 10l-2 2 2 2 2-2-2-2z"/><path d="M7 12l-2-2-2 2 2 2 2-2z"/>',
		'bluetooth_disabled': '<path d="M13 5.83l1.88 1.88-1.6 1.6 1.41 1.41 3.02-3.02L12 2h-1v5.03l2 2v-3.2z"/><path d="M13 18.17v-3.76l1.88 1.88L13 18.17zM5.41 4L4 5.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l4.29-4.29 2.3 2.29L20 18.59 5.41 4z"/>',
		'bluetooth_searching': '<path d="M14.24 12.01l2.32 2.32c.28-.72.44-1.51.44-2.33 0-.82-.16-1.59-.43-2.31l-2.33 2.32z"/><path d="M19.53 6.71l-1.26 1.26c.63 1.21.98 2.57.98 4.02 0 1.45-.36 2.82-.98 4.02l1.2 1.2c.97-1.54 1.54-3.36 1.54-5.31-.01-1.89-.55-3.67-1.48-5.19z"/><path d="M12.88 16.29L11 18.17v-3.76l1.88 1.88zM11 5.83l1.88 1.88L11 9.59V5.83zm4.71 1.88L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29z"/>',
		'brightness_auto': '<path d="M10.85 12.65h2.3L12 9l-1.15 3.65zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM14.3 16l-.7-2h-3.2l-.7 2H7.8L11 7h2l3.2 9h-1.9z"/>',
		'brightness_high': '<path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm8-9.31V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69z"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'brightness_low': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>',
		'brightness_medium': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>',
		'data_usage': '<path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95z"/><path d="M12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>',
		'developer_mode': '<path d="M7 5h10v2h2V3c0-1.1-.9-1.99-2-1.99L7 1c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M15.41 16.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42z"/><path d="M10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17z"/><path d="M17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/>',
		'devices': '<path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6z"/><path d="M22 17h-4v-7h4v7zm1-9h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/>',
		'dvr': '<path d="M21 17H3V5h18v12zm0-14H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2z"/><path d="M7 8H5v2h2V8zm12 0H8v2h11V8z"/><path d="M7 12H5v2h2v-2zm12 0H8v2h11v-2z"/>',
		'gps_fixed': '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm8.94-8c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z"/>',
		'gps_not_fixed': '<path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>',
		'gps_off': '<path d="M20.94 11A8.994 8.994 0 0 0 13 3.06V1h-2v2.06c-1.13.12-2.19.46-3.16.97l1.5 1.5A6.995 6.995 0 0 1 19 12c0 .94-.19 1.84-.52 2.65l1.5 1.5c.5-.96.84-2.02.97-3.15H23v-2h-2.06z"/><path d="M16.27 17.54a6.995 6.995 0 0 1-9.81-9.81l9.81 9.81zM3 4.27l2.04 2.04A8.914 8.914 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06c1.77-.2 3.38-.91 4.69-1.98L19.73 21 21 19.73 4.27 3 3 4.27z"/>',
		'graphic_eq': '<path d="M7 18h2V6H7v12z"/><path d="M11 22h2V2h-2v20z"/><path d="M3 14h2v-4H3v4z"/><path d="M15 18h2V6h-2v12z"/><path d="M19 10v4h2v-4h-2z"/>',
		'location_disabled': '<path d="M20.94 11A8.994 8.994 0 0 0 13 3.06V1h-2v2.06c-1.13.12-2.19.46-3.16.97l1.5 1.5A6.995 6.995 0 0 1 19 12c0 .94-.19 1.84-.52 2.65l1.5 1.5c.5-.96.84-2.02.97-3.15H23v-2h-2.06z"/><path d="M16.27 17.54a6.995 6.995 0 0 1-9.81-9.81l9.81 9.81zM3 4.27l2.04 2.04A8.914 8.914 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06c1.77-.2 3.38-.91 4.69-1.98L19.73 21 21 19.73 4.27 3 3 4.27z"/>',
		'location_searching': '<path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>',
		'network_cell': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M17 7L2 22h15z"/>',
		'network_wifi': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>',
		'nfc': '<path d="M20 20H4V4h16v16zm0-18H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><path d="M18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"/>',
		'screen_lock_landscape': '<path d="M19 17H5V7h14v10zm2-12H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/><path d="M10.8 10c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2v1h-2.4v-1zm-.8 6h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1v-1c0-1.11-.9-2-2-2-1.11 0-2 .9-2 2v1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1z"/>',
		'screen_lock_portrait': '<path d="M10.8 10c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2v1h-2.4v-1zm-.8 6h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1v-1c0-1.11-.9-2-2-2-1.11 0-2 .9-2 2v1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1z"/><path d="M17 19H7V5h10v14zm0-18H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'screen_lock_rotation': '<path d="M23.25 12.77l-2.57-2.57-1.41 1.41 2.22 2.22-5.66 5.66L4.51 8.17l5.66-5.66 2.1 2.1 1.41-1.41L11.23.75c-.59-.59-1.54-.59-2.12 0L2.75 7.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12z"/><path d="M8.47 20.48C5.2 18.94 2.86 15.76 2.5 12H1c.51 6.16 5.66 11 11.95 11l.66-.03-3.81-3.82-1.33 1.33z"/><path d="M16.8 2.5c0-.94.76-1.7 1.7-1.7s1.7.76 1.7 1.7V3h-3.4v-.5zM16 9h5c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1v-.5C21 1.12 19.88 0 18.5 0S16 1.12 16 2.5V3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1z"/>',
		'screen_rotation': '<path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32z"/><path d="M14.83 21.19L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-4.6-19.44c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75z"/><path d="M7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>',
		'sd_storage': '<path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 6h-2V4h2v4zm3 0h-2V4h2v4zm3 0h-2V4h2v4z"/>',
		'settings_system_daydream': '<path d="M9 16h6.5c1.38 0 2.5-1.12 2.5-2.5S16.88 11 15.5 11h-.05c-.24-1.69-1.69-3-3.45-3-1.4 0-2.6.83-3.16 2.02h-.16C7.17 10.18 6 11.45 6 13c0 1.66 1.34 3 3 3z"/><path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'signal_cellular_4_bar': '<path d="M2 22h20V2z"/>',
		'signal_cellular_connected_no_internet_4_bar': '<path d="M20 18h2v-8h-2v8z"/><path d="M20 22h2v-2h-2v2z"/><path d="M2 22h16V8h4V2L2 22z"/>',
		'signal_cellular_no_sim': '<path d="M18.99 5c0-1.1-.89-2-1.99-2h-7L7.66 5.34 19 16.68 18.99 5z"/><path d="M3.65 3.88L2.38 5.15 5 7.77V19c0 1.1.9 2 2 2h10.01c.35 0 .67-.1.96-.26l1.88 1.88 1.27-1.27L3.65 3.88z"/>',
		'signal_cellular_null': '<path d="M20 6.83V20H6.83L20 6.83M22 2L2 22h20V2z"/>',
		'signal_cellular_off': '<path d="M21 1l-8.59 8.59L21 18.18V1z"/><path d="M4.77 4.5L3.5 5.77l6.36 6.36L1 21h17.73l2 2L22 21.73 4.77 4.5z"/>',
		'signal_wifi_4_bar': '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>',
		'signal_wifi_4_bar_lock': '<path d="M22 16h-3v-1.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V16zm1 0v-1.5c0-1.4-1.1-2.5-2.5-2.5S18 13.1 18 14.5V16c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1h5c.5 0 1-.5 1-1v-4c0-.5-.5-1-1-1z"/><path d="M15.5 14.5c0-2.8 2.2-5 5-5 .4 0 .7 0 1 .1L23.6 7c-.4-.3-4.9-4-11.6-4C5.3 3 .8 6.7.4 7L12 21.5l3.5-4.4v-2.6z"/>',
		'signal_wifi_off': '<path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7z"/><path d="M17.04 15.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>',
		'storage': '<path d="M4 17h2v2H4v-2zm-2 3h20v-4H2v4z"/><path d="M6 7H4V5h2v2zM2 4v4h20V4H2z"/><path d="M4 11h2v2H4v-2zm-2 3h20v-4H2v4z"/>',
		'usb': '<path d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07c.7-.37 1.2-1.08 1.2-1.93 0-1.21-.99-2.2-2.2-2.2-1.21 0-2.2.99-2.2 2.2 0 .85.5 1.56 1.2 1.93V13c0 1.11.89 2 2 2h3v3.05c-.71.37-1.2 1.1-1.2 1.95 0 1.22.99 2.2 2.2 2.2 1.21 0 2.2-.98 2.2-2.2 0-.85-.49-1.58-1.2-1.95V15h3c1.11 0 2-.89 2-2v-2h1V7h-4z"/>',
		'wallpaper': '<path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4z"/><path d="M10 13l-4 5h12l-3-4-2.03 2.71L10 13z"/><path d="M17 8.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5z"/><path d="M20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2z"/><path d="M20 20h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/>',
		'wifi_lock': '<path d="M20.5 9.5c.28 0 .55.04.81.08L24 6c-3.34-2.51-7.5-4-12-4S3.34 3.49 0 6l12 16 3.5-4.67V14.5c0-2.76 2.24-5 5-5z"/><path d="M22 16h-3v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V16zm1 0v-1.5c0-1.38-1.12-2.5-2.5-2.5S18 13.12 18 14.5V16c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/>',
		'wifi_tethering': '<path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 13c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19z"/><path d="M12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z"/>',
		//
		// editor
		//
		'attach_file': '<path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>',
		'attach_money': '<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>',
		'border_all': '<path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/>',
		'border_bottom': '<path d="M9 11H7v2h2v-2z"/><path d="M13 15h-2v2h2v-2z"/><path d="M9 3H7v2h2V3z"/><path d="M13 11h-2v2h2v-2z"/><path d="M5 3H3v2h2V3z"/><path d="M13 7h-2v2h2V7z"/><path d="M17 11h-2v2h2v-2z"/><path d="M13 3h-2v2h2V3z"/><path d="M17 3h-2v2h2V3z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M5 7H3v2h2V7z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 9h2V7h-2v2z"/><path d="M5 11H3v2h2v-2z"/><path d="M3 21h18v-2H3v2z"/><path d="M5 15H3v2h2v-2z"/>',
		'border_clear': '<path d="M7 5h2V3H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M3 5h2V3H3v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M11 9h2V7h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M11 5h2V3h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/>',
		'border_color': '<path d="M17.75 7L14 3.25l-10 10V17h3.75l10-10zm2.96-2.96c.39-.39.39-1.02 0-1.41L18.37.29c-.39-.39-1.02-.39-1.41 0L15 2.25 18.75 6l1.96-1.96z"/><path fill-opacity=".36" d="M0 20h24v4H0z"/>',
		'border_horizontal': '<path d="M3 21h2v-2H3v2z"/><path d="M5 7H3v2h2V7z"/><path d="M3 17h2v-2H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M5 3H3v2h2V3z"/><path d="M9 3H7v2h2V3z"/><path d="M17 3h-2v2h2V3z"/><path d="M13 7h-2v2h2V7z"/><path d="M13 3h-2v2h2V3z"/><path d="M19 17h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 9h2V7h-2v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/>',
		'border_inner': '<path d="M3 21h2v-2H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M5 7H3v2h2V7z"/><path d="M3 17h2v-2H3v2z"/><path d="M9 3H7v2h2V3z"/><path d="M5 3H3v2h2V3z"/><path d="M17 3h-2v2h2V3z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M13 3h-2v8H3v2h8v8h2v-8h8v-2h-8V3z"/><path d="M19 21h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/>',
		'border_left': '<path d="M11 21h2v-2h-2v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M11 5h2V3h-2v2z"/><path d="M11 9h2V7h-2v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M7 5h2V3H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M3 21h2V3H3v18z"/><path d="M19 9h2V7h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/>',
		'border_outer': '<path d="M13 7h-2v2h2V7z"/><path d="M13 11h-2v2h2v-2z"/><path d="M17 11h-2v2h2v-2z"/><path d="M19 19H5V5h14v14zM3 3v18h18V3H3z"/><path d="M13 15h-2v2h2v-2z"/><path d="M9 11H7v2h2v-2z"/>',
		'border_right': '<path d="M7 21h2v-2H7v2z"/><path d="M3 5h2V3H3v2z"/><path d="M7 5h2V3H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/><path d="M19 3v18h2V3h-2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M11 5h2V3h-2v2z"/><path d="M11 9h2V7h-2v2z"/>',
		'border_style': '<path d="M15 21h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M3 3v18h2V5h16V3H3z"/><path d="M19 9h2V7h-2v2z"/>',
		'border_top': '<path d="M7 21h2v-2H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M3 3v2h18V3H3z"/><path d="M19 17h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M11 9h2V7h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/>',
		'border_vertical': '<path d="M3 9h2V7H3v2z"/><path d="M3 5h2V3H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M7 5h2V3H7v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M11 21h2V3h-2v18z"/><path d="M19 21h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 9h2V7h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/>',
		'bubble_chart': '<circle cx="7.2" cy="14.4" r="3.2"/><circle cx="14.8" cy="18" r="2"/><circle cx="15.2" cy="8.8" r="4.8"/>',
		'drag_handle': '<path d="M20 9H4v2h16V9z"/><path d="M4 15h16v-2H4v2z"/>',
		'format_align_center': '<path d="M7 15v2h10v-2H7z"/><path d="M3 21h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M7 7v2h10V7H7z"/><path d="M3 3v2h18V3H3z"/>',
		'format_align_justify': '<path d="M3 21h18v-2H3v2z"/><path d="M3 17h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 9h18V7H3v2z"/><path d="M3 3v2h18V3H3z"/>',
		'format_align_left': '<path d="M15 15H3v2h12v-2z"/><path d="M15 7H3v2h12V7z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 21h18v-2H3v2z"/><path d="M3 3v2h18V3H3z"/>',
		'format_align_right': '<path d="M3 21h18v-2H3v2z"/><path d="M9 17h12v-2H9v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M9 9h12V7H9v2z"/><path d="M3 3v2h18V3H3z"/>',
		'format_bold': '<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>',
		'format_clear': '<path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5z"/><path d="M6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/>',
		'format_color_fill': '<path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/><path fill-opacity=".36" d="M0 20h24v4H0z"/>',
		'format_color_reset': '<path d="M18 14c0-4-6-10.8-6-10.8s-1.33 1.51-2.73 3.52l8.59 8.59c.09-.42.14-.86.14-1.31z"/><path d="M17.12 17.12L12.5 12.5 5.27 5.27 4 6.55l3.32 3.32C6.55 11.32 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.96-1.5l2.63 2.63 1.27-1.27-2.74-2.74z"/>',
		'format_color_text': '<path fill-opacity=".36" d="M0 20h24v4H0z"/><path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>',
		'format_indent_decrease': '<path d="M11 17h10v-2H11v2z"/><path d="M3 12l4 4V8l-4 4z"/><path d="M3 21h18v-2H3v2z"/><path d="M3 3v2h18V3H3z"/><path d="M11 9h10V7H11v2z"/><path d="M11 13h10v-2H11v2z"/>',
		'format_indent_increase': '<path d="M3 21h18v-2H3v2z"/><path d="M3 8v8l4-4-4-4z"/><path d="M11 17h10v-2H11v2z"/><path d="M3 3v2h18V3H3z"/><path d="M11 9h10V7H11v2z"/><path d="M11 13h10v-2H11v2z"/>',
		'format_italic': '<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>',
		'format_line_spacing': '<path d="M6 7h2.5L5 3.5 1.5 7H4v10H1.5L5 20.5 8.5 17H6V7z"/><path d="M10 5v2h12V5H10z"/><path d="M10 19h12v-2H10v2z"/><path d="M10 13h12v-2H10v2z"/>',
		'format_list_bulleted': '<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M4 4.5c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5z"/><path d="M4 16.67c-.74 0-1.33.6-1.33 1.33 0 .73.6 1.33 1.33 1.33.73 0 1.33-.6 1.33-1.33 0-.73-.59-1.33-1.33-1.33z"/><path d="M7 19h14v-2H7v2z"/><path d="M7 13h14v-2H7v2z"/><path d="M7 5v2h14V5H7z"/>',
		'format_list_numbered': '<path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1z"/><path d="M3 8h1V4H2v1h1v3z"/><path d="M2 11h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1z"/><path d="M7 5v2h14V5H7z"/><path d="M7 19h14v-2H7v2z"/><path d="M7 13h14v-2H7v2z"/>',
		'format_paint': '<path d="M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z"/>',
		'format_quote': '<path d="M6 17h3l2-4V7H5v6h3z"/><path d="M14 17h3l2-4V7h-6v6h3z"/>',
		'format_shapes': '<path d="M19 5V3h2v2h-2zm2 16h-2v-2h2v2zm-4-2H7v-2H5V7h2V5h10v2h2v10h-2v2zM5 21H3v-2h2v2zM3 3h2v2H3V3zm20 4V1h-6v2H7V1H1v6h2v10H1v6h6v-2h10v2h6v-6h-2V7h2z"/><path d="M10.69 12.74h2.61L12 8.91l-1.31 3.83zM13.73 14h-3.49l-.73 2H7.89l3.4-9h1.4l3.41 9h-1.63l-.74-2z"/>',
		'format_size': '<path d="M9 4v3h5v12h3V7h5V4H9z"/><path d="M3 12h3v7h3v-7h3V9H3v3z"/>',
		'format_strikethrough': '<path d="M10 19h4v-3h-4v3z"/><path d="M5 4v3h5v3h4V7h5V4H5z"/><path d="M3 14h18v-2H3v2z"/>',
		'format_textdirection_l_to_r': '<path d="M9 10v5h2V4h2v11h2V4h2V2H9C6.79 2 5 3.79 5 6s1.79 4 4 4z"/><path d="M21 18l-4-4v3H5v2h12v3l4-4z"/>',
		'format_textdirection_r_to_l': '<path d="M10 10v5h2V4h2v11h2V4h2V2h-8C7.79 2 6 3.79 6 6s1.79 4 4 4z"/><path d="M8 17v-3l-4 4 4 4v-3h12v-2H8z"/>',
		'format_underline': '<path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6z"/><path d="M5 19v2h14v-2H5z"/>',
		'functions': '<path d="M18 4H6v2l6.5 6L6 18v2h12v-3h-7l5-5-5-5h7z"/>',
		'highlight': '<path d="M6 14l3 3v5h6v-5l3-3V9H6z"/><path d="M11 2h2v3h-2z"/><path d="M3.5 5.875L4.914 4.46l2.12 2.122L5.62 7.997z"/><path d="M16.96 6.585l2.123-2.12 1.414 1.414L18.375 8z"/>',
		'insert_chart': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
		'insert_comment': '<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>',
		'insert_drive_file': '<path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>',
		'insert_emoticon': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'insert_invitation': '<path d="M17 12h-5v5h5v-5z"/><path d="M19 19H5V8h14v11zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2z"/>',
		'insert_link': '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1z"/><path d="M8 13h8v-2H8v2z"/><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
		'insert_photo': '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
		'linear_scale': '<path d="M19.5 9.5c-1.03 0-1.9.62-2.29 1.5h-2.92c-.39-.88-1.26-1.5-2.29-1.5s-1.9.62-2.29 1.5H6.79c-.39-.88-1.26-1.5-2.29-1.5C3.12 9.5 2 10.62 2 12s1.12 2.5 2.5 2.5c1.03 0 1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5s1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5 1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z"/>',
		'merge_type': '<path d="M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41z"/><path d="M7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z"/>',
		'mode_comment': '<path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>',
		'mode_edit': '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
		'monetization_on': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>',
		'money_off': '<path d="M12.5 6.9c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-.53.12-1.03.3-1.48.54l1.47 1.47c.41-.17.91-.27 1.51-.27z"/><path d="M5.33 4.06L4.06 5.33 7.5 8.77c0 2.08 1.56 3.21 3.91 3.91l3.51 3.51c-.34.48-1.05.91-2.42.91-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c.96-.18 1.82-.55 2.45-1.12l2.22 2.22 1.27-1.27L5.33 4.06z"/>',
		'multiline_chart': '<path d="M22 6.92l-1.41-1.41-2.85 3.21C15.68 6.4 12.83 5 9.61 5 6.72 5 4.07 6.16 2 8l1.42 1.42C5.12 7.93 7.27 7 9.61 7c2.74 0 5.09 1.26 6.77 3.24l-2.88 3.24-4-4L2 16.99l1.5 1.5 6-6.01 4 4 4.05-4.55c.75 1.35 1.25 2.9 1.44 4.55H21c-.22-2.3-.95-4.39-2.04-6.14L22 6.92z"/>',
		'pie_chart': '<path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10z"/><path d="M13.03 2v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99z"/><path d="M13.03 13.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/>',
		'pie_chart_outline': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 2.07c3.61.45 6.48 3.33 6.93 6.93H13V4.07zM4 12c0-4.06 3.07-7.44 7-7.93v15.87c-3.93-.5-7-3.88-7-7.94zm9 7.93V13h6.93c-.45 3.61-3.32 6.48-6.93 6.93z"/>',
		'publish': '<path d="M5 4v2h14V4H5z"/><path d="M5 14h4v6h6v-6h4l-7-7-7 7z"/>',
		'short_text': '<path d="M4 9h16v2H4z"/><path d="M4 13h10v2H4z"/>',
		'show_chart': '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>',
		'space_bar': '<path d="M18 9v4H6V9H4v6h16V9z"/>',
		'strikethrough_s': '<path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29a5.73 5.73 0 0 1 1.7-.83c.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25z"/><path d="M21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28.65-.19 1.21-.45 1.67-.79.46-.34.82-.77 1.07-1.27.25-.5.38-1.07.38-1.71 0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z"/>',
		'text_fields': '<path d="M2.5 4v3h5v12h3V7h5V4h-13z"/><path d="M21.5 9h-9v3h3v7h3v-7h3V9z"/>',
		'title': '<path d="M5 4v3h5.5v12h3V7H19V4z"/>',
		'vertical_align_bottom': '<path d="M16 13h-3V3h-2v10H8l4 4 4-4z"/><path d="M4 19v2h16v-2H4z"/>',
		'vertical_align_center': '<path d="M8 19h3v4h2v-4h3l-4-4-4 4z"/><path d="M16 5h-3V1h-2v4H8l4 4 4-4z"/><path d="M4 11v2h16v-2H4z"/>',
		'vertical_align_top': '<path d="M8 11h3v10h2V11h3l-4-4-4 4z"/><path d="M4 3v2h16V3H4z"/>',
		'wrap_text': '<path d="M4 19h6v-2H4v2z"/><path d="M20 5H4v2h16V5z"/><path d="M17 11H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"/>',
		//
		// file
		//
		'attachment': '<path d="M7.5 18C4.46 18 2 15.54 2 12.5S4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v1.5H9.5c-.55 0-1 .45-1 1s.45 1 1 1H18c1.38 0 2.5-1.12 2.5-2.5S19.38 8.5 18 8.5H7.5c-2.21 0-4 1.79-4 4s1.79 4 4 4H17V18H7.5z"/>',
		'cloud': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>',
		'cloud_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.66 0-3-1.34-3-3s1.34-3 3-3l.14.01C8.58 8.28 10.13 7 12 7c2.21 0 4 1.79 4 4h.5c1.38 0 2.5 1.12 2.5 2.5S17.88 16 16.5 16z"/>',
		'cloud_done': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z"/>',
		'cloud_download': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>',
		'cloud_off': '<path d="M19.35 10.04A7.49 7.49 0 0 0 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46a5.497 5.497 0 0 1 8.05 4.87v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96z"/><path d="M7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27z"/>',
		'cloud_queue': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/>',
		'cloud_upload': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>',
		'create_new_folder': '<path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"/>',
		'file_download': '<path d="M19 9h-4V3H9v6H5l7 7 7-7z"/><path d="M5 18v2h14v-2H5z"/>',
		'file_upload': '<path d="M9 16h6v-6h4l-7-7-7 7h4z"/><path d="M5 18h14v2H5z"/>',
		'folder': '<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>',
		'folder_open': '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>',
		'folder_shared': '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"/>',
		//
		// hardware
		//
		'cast': '<path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M1 18v3h3c0-1.66-1.34-3-3-3z"/><path d="M1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/>',
		'cast_connected': '<path d="M1 18v3h3c0-1.66-1.34-3-3-3z"/><path d="M1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M19 7H5v1.63c3.96 1.28 7.09 4.41 8.37 8.37H19V7z"/><path d="M1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/><path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'computer': '<path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>',
		'desktop_mac': '<path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/>',
		'desktop_windows': '<path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>',
		'developer_dashboard': '<path d="M18 19H4V5h14v14zm4-10V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2z"/><path d="M6 13h5v4H6z"/><path d="M12 7h4v3h-4z"/><path d="M6 7h5v5H6z"/><path d="M12 11h4v6h-4z"/>',
		'device_hub': '<path d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V21h5v-5h-4z"/>',
		'devices_other': '<path d="M3 6h18V4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V6z"/><path d="M11 17.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2-5.5H9v1.78c-.61.55-1 1.33-1 2.22 0 .89.39 1.67 1 2.22V20h4v-1.78c.61-.55 1-1.34 1-2.22 0-.88-.39-1.67-1-2.22V12z"/><path d="M21 18h-4v-8h4v8zm1-10h-6c-.5 0-1 .5-1 1v10c0 .5.5 1 1 1h6c.5 0 1-.5 1-1V9c0-.5-.5-1-1-1z"/>',
		'dock': '<path d="M8 23h8v-2H8v2z"/><path d="M16 15H8V5h8v10zm0-13.99L8 1c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/>',
		'gamepad': '<path d="M15 7.5V2H9v5.5l3 3 3-3z"/><path d="M7.5 9H2v6h5.5l3-3-3-3z"/><path d="M9 16.5V22h6v-5.5l-3-3-3 3z"/><path d="M16.5 9l-3 3 3 3H22V9h-5.5z"/>',
		'headset': '<path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>',
		'headset_mic': '<path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h4v1h-7v2h6c1.66 0 3-1.34 3-3V10c0-4.97-4.03-9-9-9z"/>',
		'keyboard': '<path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>',
		'keyboard_arrow_down': '<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>',
		'keyboard_arrow_left': '<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>',
		'keyboard_arrow_right': '<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>',
		'keyboard_arrow_up': '<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>',
		'keyboard_backspace': '<path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"/>',
		'keyboard_capslock': '<path d="M12 8.41L16.59 13 18 11.59l-6-6-6 6L7.41 13 12 8.41z"/><path d="M6 18h12v-2H6v2z"/>',
		'keyboard_hide': '<path d="M19 8h-2V6h2v2zm0 3h-2V9h2v2zm-3-3h-2V6h2v2zm0 3h-2V9h2v2zm0 4H8v-2h8v2zM7 8H5V6h2v2zm0 3H5V9h2v2zm1-2h2v2H8V9zm0-3h2v2H8V6zm3 3h2v2h-2V9zm0-3h2v2h-2V6zm9-3H4c-1.1 0-1.99.9-1.99 2L2 15c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M12 23l4-4H8l4 4z"/>',
		'keyboard_return': '<path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>',
		'keyboard_tab': '<path d="M11.59 7.41L15.17 11H1v2h14.17l-3.59 3.59L13 18l6-6-6-6-1.41 1.41z"/><path d="M20 6v12h2V6h-2z"/>',
		'keyboard_voice': '<path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/><path d="M17.3 12c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>',
		'laptop': '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>',
		'laptop_chromebook': '<path d="M22 18V3H2v15H0v2h24v-2h-2zm-8 0h-4v-1h4v1zm6-3H4V5h16v10z"/>',
		'laptop_mac': '<path d="M20 18c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2H0c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2h-4zM4 5h16v11H4V5zm8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>',
		'laptop_windows': '<path d="M20 18v-1c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2v1H0v2h24v-2h-4zM4 5h16v10H4V5z"/>',
		'memory': '<path d="M13 13h-2v-2h2v2zm2-4H9v6h6V9z"/><path d="M17 17H7V7h10v10zm4-6V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2z"/>',
		'mouse': '<path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93z"/><path d="M4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4z"/><path d="M11 1.07C7.05 1.56 4 4.92 4 9h7V1.07z"/>',
		'phone_android': '<path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z"/>',
		'phone_iphone': '<path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>',
		'phonelink': '<path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6z"/><path d="M22 17h-4v-7h4v7zm1-9h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/>',
		'phonelink_off': '<path d="M22 6V4H6.82l2 2H22z"/><path d="M4 6.27L14.73 17H4V6.27zM1.92 1.65L.65 2.92l1.82 1.82C2.18 5.08 2 5.52 2 6v11H0v3h17.73l2.35 2.35 1.27-1.27L3.89 3.62 1.92 1.65z"/><path d="M23 8h-6c-.55 0-1 .45-1 1v4.18l2 2V10h4v7h-2.18l3 3H23c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/>',
		'power_input': '<path d="M2 9v2h19V9H2z"/><path d="M2 15h5v-2H2v2z"/><path d="M9 15h5v-2H9v2z"/><path d="M16 15h5v-2h-5v2z"/>',
		'router': '<path d="M20.2 5.9l.8-.8C19.6 3.7 17.8 3 16 3c-1.8 0-3.6.7-5 2.1l.8.8C13 4.8 14.5 4.2 16 4.2s3 .6 4.2 1.7z"/><path d="M19.3 6.7c-.9-.9-2.1-1.4-3.3-1.4-1.2 0-2.4.5-3.3 1.4l.8.8c.7-.7 1.6-1 2.5-1 .9 0 1.8.3 2.5 1l.8-.8z"/><path d="M15 18h-2v-2h2v2zm-3.5 0h-2v-2h2v2zM8 18H6v-2h2v2zm11-5h-2V9h-2v4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z"/>',
		'scanner': '<path d="M19.8 10.7L4.2 5l-.7 1.9L17.6 12H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5.5c0-.8-.5-1.6-1.2-1.8zM7 17H5v-2h2v2zm12 0H9v-2h10v2z"/>',
		'security': '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>',
		'sim_card': '<path d="M19.99 4c0-1.1-.89-2-1.99-2h-8L4 8v12c0 1.1.9 2 2 2h12.01c1.1 0 1.99-.9 1.99-2l-.01-16zM9 19H7v-2h2v2zm8 0h-2v-2h2v2zm-8-4H7v-4h2v4zm4 4h-2v-4h2v4zm0-6h-2v-2h2v2zm4 2h-2v-4h2v4z"/>',
		'smartphone': '<path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>',
		'speaker': '<path d="M12 20c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-16c1.1 0 2 .9 2 2s-.9 2-2 2c-1.11 0-2-.9-2-2s.89-2 2-2zm5-2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 1.99 2 1.99L17 22c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'speaker_group': '<path d="M18.2 1H9.8C8.81 1 8 1.81 8 2.8v14.4c0 .99.81 1.79 1.8 1.79l8.4.01c.99 0 1.8-.81 1.8-1.8V2.8c0-.99-.81-1.8-1.8-1.8zM14 3c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm0 13.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/> <circle cx="14" cy="12.5" r="2.5"/> <path d="M6 5H4v16c0 1.1.89 2 2 2h10v-2H6V5z"/>',
		'tablet': '<path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 1.99-.9 1.99-2L23 6c0-1.1-.9-2-2-2zm-2 14H5V6h14v12z"/>',
		'tablet_android': '<path d="M18 0H6C4.34 0 3 1.34 3 3v18c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V3c0-1.66-1.34-3-3-3zm-4 22h-4v-1h4v1zm5.25-3H4.75V3h14.5v16z"/>',
		'tablet_mac': '<path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z"/>',
		'toys': '<path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12H12z"/><path d="M12 12c0 3-2.5 5.5-5.5 5.5S1 15 1 12h11z"/><path d="M12 12c-3 0-5.5-2.5-5.5-5.5S9 1 12 1v11z"/><path d="M12 12c3 0 5.5 2.5 5.5 5.5S15 23 12 23V12z"/>',
		'tv': '<path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>',
		'vidiogame_asset': '<path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'watch': '<path d="M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"/>',
		//
		// image
		//
		'add_a_photo': '<path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3z"/><path d="M13 19c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-7-9V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3z"/><path d="M9.8 14c0 1.77 1.43 3.2 3.2 3.2 1.77 0 3.2-1.43 3.2-3.2 0-1.77-1.43-3.2-3.2-3.2-1.77 0-3.2 1.43-3.2 3.2z"/>',
		'add_to_photos': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 11h-4v4h-2v-4H9V9h4V5h2v4h4v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'adjust': '<path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2z"/><path d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>',
		'assistant_photo': '<path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>',
		'audiotrack': '<path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>',
		'blur_circular': '<path d="M10 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M10 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M7 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 16.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M7 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 7.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M14 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M14 7.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M17 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M17 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M14 16.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M14 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>',
		'blur_linear': '<path d="M5 17.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/><path d="M9 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M9 9c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M3 21h18v-2H3v2z"/><path d="M5 9.5c.83 0 1.5-.67 1.5-1.5S5.83 6.5 5 6.5 3.5 7.17 3.5 8 4.17 9.5 5 9.5z"/><path d="M5 13.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/><path d="M9 17c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M17 16.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M3 3v2h18V3H3z"/><path d="M17 8.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M17 12.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M13 9c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M13 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M13 17c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>',
		'blur_off': '<path d="M14 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M13.8 11.48l.2.02c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5l.02.2c.09.67.61 1.19 1.28 1.28z"/><path d="M14 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M10 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M21 10.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M10 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M18 15c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M18 11c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M18 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M14 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M2.5 5.27l3.78 3.78L6 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1c0-.1-.03-.19-.06-.28l2.81 2.81c-.71.11-1.25.73-1.25 1.47 0 .83.67 1.5 1.5 1.5.74 0 1.36-.54 1.47-1.25l2.81 2.81c-.09-.03-.18-.06-.28-.06-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1c0-.1-.03-.19-.06-.28l3.78 3.78L20 20.23 3.77 4 2.5 5.27z"/><path d="M10 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M21 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M3 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M6 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M3 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>',
		'blur_on': '<path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M6 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M6 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M3 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M6 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M21 10.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M14 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M14 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M3 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M10 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M10 12.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M18 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M18 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M18 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M18 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M21 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M14 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M14 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M14 12.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M14 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>',
		'brightness_1': '<circle cx="12" cy="12" r="10"/>',
		'brightness_2': '<path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/>',
		'brightness_3': '<path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>',
		'brightness_4': '<path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>',
		'brightness_5': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>',
		'brightness_6': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>',
		'brightness_7': '<path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm8-9.31V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69z"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'broken_image': '<path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z"/><path d="M18 11.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z"/>',
		'brush': '<path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z"/><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>',
		'burst_mode': '<path d="M1 5h2v14H1z"/><path d="M5 5h2v14H5z"/><path d="M11 17l2.5-3.15L15.29 16l2.5-3.22L21 17H11zM22 5H10c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>',
		'camera': '<path d="M9.4 10.5l4.77-8.26C13.47 2.09 12.75 2 12 2c-2.4 0-4.6.85-6.32 2.25l3.66 6.35.06-.1z"/><path d="M21.54 9c-.92-2.92-3.15-5.26-6-6.34L11.88 9h9.66z"/><path d="M21.8 10h-7.49l.29.5 4.76 8.25C21 16.97 22 14.61 22 12c0-.69-.07-1.35-.2-2z"/><path d="M8.54 12l-3.9-6.75C3.01 7.03 2 9.39 2 12c0 .69.07 1.35.2 2h7.49l-1.15-2z"/><path d="M2.46 15c.92 2.92 3.15 5.26 6 6.34L12.12 15H2.46z"/><path d="M13.73 15l-3.9 6.76c.7.15 1.42.24 2.17.24 2.4 0 4.6-.85 6.32-2.25l-3.66-6.35-.93 1.6z"/>',
		'camera_alt': '<circle cx="12" cy="12" r="3.2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>',
		'camera_front': '<path d="M10 20H5v2h5v2l3-3-3-3v2z"/><path d="M14 20v2h5v-2h-5z"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-1.99.9-1.99 2S10.9 8 12 8z"/><path d="M7 2h10v10.5c0-1.67-3.33-2.5-5-2.5s-5 .83-5 2.5V2zm10-2H7C5.9 0 5 .9 5 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"/>',
		'camera_rear': '<path d="M10 20H5v2h5v2l3-3-3-3v2z"/><path d="M14 20v2h5v-2h-5z"/><path d="M12 6c-1.11 0-2-.9-2-2s.89-2 1.99-2 2 .9 2 2C14 5.1 13.1 6 12 6zm5-6H7C5.9 0 5 .9 5 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"/>',
		'camera_roll': '<path d="M14 5c0-1.1-.9-2-2-2h-1V2c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1v1H4c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2h8V5h-8zm-2 13h-2v-2h2v2zm0-9h-2V7h2v2zm4 9h-2v-2h2v2zm0-9h-2V7h2v2zm4 9h-2v-2h2v2zm0-9h-2V7h2v2z"/>',
		'center_focus_strong': '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/>',
		'center_focus_weak': '<path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/><path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'collections': '<path d="M11 12l2.03 2.71L16 11l4 5H8l3-4zm11 4V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2z"/><path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>',
		'collections_bookmark': '<path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 10l-2.5-1.5L15 12V4h5v8z"/>',
		'color_lens': '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'colorize': '<path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>',
		'compare': '<path d="M10 18H5l5-6v6zm0-15H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2z"/><path d="M19 3h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'control_point': '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2z"/>',
		'control_point_duplicate': '<path d="M16 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/><path d="M2 12c0-2.79 1.64-5.2 4.01-6.32V3.52C2.52 4.76 0 8.09 0 12s2.52 7.24 6.01 8.48v-2.16C3.64 17.2 2 14.79 2 12z"/><path d="M15 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-16c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9z"/>',
		'crop': '<path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8z"/><path d="M7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z"/>',
		'crop_16_9': '<path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>',
		'crop_3_2': '<path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12z"/>',
		'crop_5_4': '<path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z"/>',
		'crop_7_5': '<path d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>',
		'crop_din': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>',
		'crop_free': '<path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2z"/><path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/>',
		'crop_landscape': '<path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z"/>',
		'crop_original': '<path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M13.96 12.29l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>',
		'crop_portrait': '<path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z"/>',
		'crop_rotate': '<path d="M7.47 21.49C4.2 19.93 1.86 16.76 1.5 13H0c.51 6.16 5.66 11 11.95 11 .23 0 .44-.02.66-.03L8.8 20.15l-1.33 1.34z"/><path d="M12.05 0c-.23 0-.44.02-.66.04l3.81 3.81 1.33-1.33C19.8 4.07 22.14 7.24 22.5 11H24c-.51-6.16-5.66-11-11.95-11z"/><path d="M16 14h2V8a2 2 0 0 0-2-2h-6v2h6v6z"/><path d="M8 16V4H6v2H4v2h2v8a2 2 0 0 0 2 2h8v2h2v-2h2v-2H8z"/>',
		'crop_square': '<path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/>',
		'dehaze': '<path d="M2 15.5v2h20v-2H2z"/><path d="M2 10.5v2h20v-2H2z"/><path d="M2 5.5v2h20v-2H2z"/>',
		'details': '<path d="M3 4l9 16 9-16H3zm3.38 2h11.25L12 16 6.38 6z"/>',
		'edit': '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
		'exposure': '<path d="M15 17v2h2v-2h2v-2h-2v-2h-2v2h-2v2h2z"/><path d="M20 20H4L20 4v16zM5 5h6v2H5V5zm15-3H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'exposure_neg_1': '<path d="M4 11v2h8v-2H4z"/><path d="M19 18h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"/>',
		'exposure_neg_2': '<path d="M15.05 16.29l2.86-3.07c.38-.39.72-.79 1.04-1.18.32-.39.59-.78.82-1.17.23-.39.41-.78.54-1.17.13-.39.19-.79.19-1.18 0-.53-.09-1.02-.27-1.46-.18-.44-.44-.81-.78-1.11-.34-.31-.77-.54-1.26-.71A5.72 5.72 0 0 0 16.47 5c-.69 0-1.31.11-1.85.32-.54.21-1 .51-1.36.88-.37.37-.65.8-.84 1.3-.18.47-.27.97-.28 1.5h2.14c.01-.31.05-.6.13-.87.09-.29.23-.54.4-.75.18-.21.41-.37.68-.49.27-.12.6-.18.96-.18.31 0 .58.05.81.15.23.1.43.25.59.43.16.18.28.4.37.65.08.25.13.52.13.81 0 .22-.03.43-.08.65-.06.22-.15.45-.29.7-.14.25-.32.53-.56.83-.23.3-.52.65-.88 1.03l-4.17 4.55V18H21v-1.71h-5.95z"/><path d="M2 11v2h8v-2H2z"/>',
		'exposure_plus_1': '<path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7z"/><path d="M20 18h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"/>',
		'exposure_plus_2': '<path d="M16.05 16.29l2.86-3.07c.38-.39.72-.79 1.04-1.18.32-.39.59-.78.82-1.17.23-.39.41-.78.54-1.17.13-.39.19-.79.19-1.18 0-.53-.09-1.02-.27-1.46-.18-.44-.44-.81-.78-1.11-.34-.31-.77-.54-1.26-.71A5.72 5.72 0 0 0 17.47 5c-.69 0-1.31.11-1.85.32-.54.21-1 .51-1.36.88-.37.37-.65.8-.84 1.3-.18.47-.27.97-.28 1.5h2.14c.01-.31.05-.6.13-.87.09-.29.23-.54.4-.75.18-.21.41-.37.68-.49.27-.12.6-.18.96-.18.31 0 .58.05.81.15.23.1.43.25.59.43.16.18.28.4.37.65.08.25.13.52.13.81 0 .22-.03.43-.08.65-.06.22-.15.45-.29.7-.14.25-.32.53-.56.83-.23.3-.52.65-.88 1.03l-4.17 4.55V18H22v-1.71h-5.95z"/><path d="M8 7H6v4H2v2h4v4h2v-4h4v-2H8V7z"/>',
		'exposure_zero': '<path d="M16.14 12.5c0 1-.1 1.85-.3 2.55-.2.7-.48 1.27-.83 1.7-.36.44-.79.75-1.3.95-.51.2-1.07.3-1.7.3-.62 0-1.18-.1-1.69-.3-.51-.2-.95-.51-1.31-.95-.36-.44-.65-1.01-.85-1.7-.2-.7-.3-1.55-.3-2.55v-2.04c0-1 .1-1.85.3-2.55.2-.7.48-1.26.84-1.69.36-.43.8-.74 1.31-.93C10.81 5.1 11.38 5 12 5c.63 0 1.19.1 1.7.29.51.19.95.5 1.31.93.36.43.64.99.84 1.69.2.7.3 1.54.3 2.55v2.04zm-2.11-2.36c0-.64-.05-1.18-.13-1.62-.09-.44-.22-.79-.4-1.06-.17-.27-.39-.46-.64-.58-.25-.13-.54-.19-.86-.19-.32 0-.61.06-.86.18s-.47.31-.64.58c-.17.27-.31.62-.4 1.06s-.13.98-.13 1.62v2.67c0 .64.05 1.18.14 1.62.09.45.23.81.4 1.09s.39.48.64.61.54.19.87.19c.33 0 .62-.06.87-.19s.46-.33.63-.61c.17-.28.3-.64.39-1.09.09-.45.13-.99.13-1.62v-2.66z"/>',
		'filter': '<path d="M15.96 10.29l-2.75 3.54-1.96-2.36L8.5 15h11l-3.54-4.71z"/><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_1': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M14 15h2V5h-4v2h2v8z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_2': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M17 13h-4v-2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4v2h4v2h-2a2 2 0 0 0-2 2v4h6v-2z"/>',
		'filter_3': '<path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M17 13v-1.5c0-.83-.67-1.5-1.5-1.5.83 0 1.5-.67 1.5-1.5V7a2 2 0 0 0-2-2h-4v2h4v2h-2v2h2v2h-4v2h4a2 2 0 0 0 2-2z"/>',
		'filter_4': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M15 15h2V5h-2v4h-2V5h-2v6h4v4z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_5': '<path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M17 13v-2a2 2 0 0 0-2-2h-2V7h4V5h-6v6h4v2h-4v2h4a2 2 0 0 0 2-2z"/>',
		'filter_6': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M13 11h2v2h-2v-2zm0 4h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V7h4V5h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"/>',
		'filter_7': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M13 15l4-8V5h-6v2h4l-4 8h2z"/>',
		'filter_8': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M13 11h2v2h-2v-2zm0-4h2v2h-2V7zm0 8h2a2 2 0 0 0 2-2v-1.5c0-.83-.67-1.5-1.5-1.5.83 0 1.5-.67 1.5-1.5V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1.5c0 .83.67 1.5 1.5 1.5-.83 0-1.5.67-1.5 1.5V13a2 2 0 0 0 2 2z"/>',
		'filter_9': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M15 9h-2V7h2v2zm0-4h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h-4v2h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>',
		'filter_9_plus': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M11 9V8h1v1h-1zm3 3V8a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v1H9v2h3a2 2 0 0 0 2-2z"/><path d="M21 9h-2V7h-2v2h-2v2h2v2h2v-2h2v6H7V3h14v6zm0-8H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_b_and_w': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16l-7-8v8H5l7-8V5h7v14z"/>',
		'filter_center_focus': '<path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'filter_drama': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.61 5.64 5.36 8.04 2.35 8.36 0 10.9 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4h2c0-2.76-1.86-5.08-4.4-5.78C8.61 6.88 10.2 6 12 6c3.03 0 5.5 2.47 5.5 5.5v.5H19c1.65 0 3 1.35 3 3s-1.35 3-3 3z"/>',
		'filter_frames': '<path d="M20 20H4V6h4.52l3.52-3.5L15.52 6H20v14zm0-16h-4l-4-4-4 4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/><path d="M18 8H6v10h12"/>',
		'filter_hdr': '<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>',
		'filter_none': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_tilt_shift': '<path d="M11 4.07V2.05c-2.01.2-3.84 1-5.32 2.21L7.1 5.69A7.941 7.941 0 0 1 11 4.07z"/><path d="M18.32 4.26A9.949 9.949 0 0 0 13 2.05v2.02c1.46.18 2.79.76 3.9 1.62l1.42-1.43z"/><path d="M19.93 11h2.02c-.2-2.01-1-3.84-2.21-5.32L18.31 7.1a7.941 7.941 0 0 1 1.62 3.9z"/><path d="M5.69 7.1L4.26 5.68A9.949 9.949 0 0 0 2.05 11h2.02c.18-1.46.76-2.79 1.62-3.9z"/><path d="M4.07 13H2.05c.2 2.01 1 3.84 2.21 5.32l1.43-1.43A7.868 7.868 0 0 1 4.07 13z"/><path d="M15 12c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z"/><path d="M18.31 16.9l1.43 1.43a9.981 9.981 0 0 0 2.21-5.32h-2.02a7.945 7.945 0 0 1-1.62 3.89z"/><path d="M13 19.93v2.02c2.01-.2 3.84-1 5.32-2.21l-1.43-1.43c-1.1.86-2.43 1.44-3.89 1.62z"/><path d="M5.68 19.74A9.981 9.981 0 0 0 11 21.95v-2.02a7.941 7.941 0 0 1-3.9-1.62l-1.42 1.43z"/>',
		'filter_vintage': '<path d="M18.7 12.4c-.28-.16-.57-.29-.86-.4.29-.11.58-.24.86-.4 1.92-1.11 2.99-3.12 3-5.19-1.79-1.03-4.07-1.11-6 0-.28.16-.54.35-.78.54.05-.31.08-.63.08-.95 0-2.22-1.21-4.15-3-5.19C10.21 1.85 9 3.78 9 6c0 .32.03.64.08.95-.24-.2-.5-.39-.78-.55-1.92-1.11-4.2-1.03-6 0 0 2.07 1.07 4.08 3 5.19.28.16.57.29.86.4-.29.11-.58.24-.86.4-1.92 1.11-2.99 3.12-3 5.19 1.79 1.03 4.07 1.11 6 0 .28-.16.54-.35.78-.54-.05.32-.08.64-.08.96 0 2.22 1.21 4.15 3 5.19 1.79-1.04 3-2.97 3-5.19 0-.32-.03-.64-.08-.95.24.2.5.38.78.54 1.92 1.11 4.2 1.03 6 0-.01-2.07-1.08-4.08-3-5.19zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>',
		'flare': '<path d="M7 11H1v2h6v-2z"/><path d="M9.17 7.76L7.05 5.64 5.64 7.05l2.12 2.12 1.41-1.41z"/><path d="M13 1h-2v6h2V1z"/><path d="M18.36 7.05l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12z"/><path d="M17 11v2h6v-2h-6z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><path d="M14.83 16.24l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41z"/><path d="M5.64 16.95l1.41 1.41 2.12-2.12-1.41-1.41-2.12 2.12z"/><path d="M11 23h2v-6h-2v6z"/>',
		'flash_auto': '<path d="M3 2v12h3v9l7-12H9l4-9H3z"/><path d="M16.85 7.65L18 4l1.15 3.65h-2.3zM19 2h-2l-3.2 9h1.9l.7-2h3.2l.7 2h1.9L19 2z"/>',
		'flash_off': '<path d="M3.27 3L2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3z"/><path d="M17 10h-4l4-8H7v2.18l8.46 8.46L17 10z"/>',
		'flash_on': '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>',
		'flip': '<path d="M15 21h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2z"/><path d="M19 3v2h2c0-1.1-.9-2-2-2z"/><path d="M11 23h2V1h-2v22z"/><path d="M19 17h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21c1.1 0 2-.9 2-2h-2v2z"/>',
		'gradient': '<path d="M11 9h2v2h-2zm-2 2h2v2H9zm4 0h2v2h-2zm2-2h2v2h-2zM7 9h2v2H7zm12-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z"/>',
		'grain': '<path d="M10 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M6 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M14 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M14 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M10 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'grid_off': '<path d="M16 4h4v4h-4V4zM8 4v1.45l2 2V4h4v4h-3.45l2 2H14v1.45l2 2V10h4v4h-3.45l2 2H20v1.45l2 2V4c0-1.1-.9-2-2-2H4.55l2 2H8z"/><path d="M16 20v-1.46L17.46 20H16zm-2 0h-4v-4h3.45l.55.54V20zm-6-6H4v-4h3.45l.55.55V14zm0 6H4v-4h4v4zM4 6.55L5.45 8H4V6.55zm6 6L11.45 14H10v-1.45zM1.27 1.27L0 2.55l2 2V20c0 1.1.9 2 2 2h15.46l2 2 1.27-1.27L1.27 1.27z"/>',
		'grid_on': '<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/>',
		'hdr_off': '<path d="M13 15h-2v-2.45l2 2V15zm5 2L3.27 2.27 2 3.55l4 4V11H4V7H2v10h2v-4h2v4h2V9.55l1 1V17h4c.67 0 1.26-.33 1.62-.84l6.34 6.34 1.27-1.27L18 17z"/><path d="M18 9h2v2h-2V9zm0 4h1l.82 3.27.73.73H22l-1.19-4.17c.7-.31 1.19-1.01 1.19-1.83V9c0-1.1-.9-2-2-2h-4v5.45l2 2V13z"/><path d="M15 11.45V9c0-1.1-.9-2-2-2h-2.45L15 11.45z"/>',
		'hdr_on': '<path d="M6 11H4V7H2v10h2v-4h2v4h2V7H6v4z"/><path d="M13 15h-2V9h2v6zm0-8H9v10h4c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/><path d="M20 11h-2V9h2v2zm2 0V9c0-1.1-.9-2-2-2h-4v10h2v-4h1l1 4h2l-1.19-4.17c.7-.31 1.19-1.01 1.19-1.83z"/>',
		'hdr_strong': '<path d="M17 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/><path d="M5 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'hdr_weak': '<path d="M5 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M17 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>',
		'healing': '<path d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.2.2.45.29.71.29.26 0 .51-.1.71-.29l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.99-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.62-3.62 3.63z"/>',
		'image': '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
		'image_aspect_ratio': '<path d="M16 10h-2v2h2v-2z"/><path d="M16 14h-2v2h2v-2z"/><path d="M8 10H6v2h2v-2z"/><path d="M12 10h-2v2h2v-2z"/><path d="M20 18H4V6h16v12zm0-14H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'iso': '<path d="M19 19H5L19 5v14zM5.5 7.5h2v-2H9v2h2V9H9v2H7.5V9h-2V7.5zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M17 17v-1.5h-5V17h5z"/>',
		'landscape': '<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>',
		'leak_add': '<path d="M6 3H3v3c1.66 0 3-1.34 3-3z"/><path d="M14 3h-2a9 9 0 0 1-9 9v2c6.08 0 11-4.93 11-11z"/><path d="M10 3H8c0 2.76-2.24 5-5 5v2c3.87 0 7-3.13 7-7z"/><path d="M10 21h2a9 9 0 0 1 9-9v-2c-6.07 0-11 4.93-11 11z"/><path d="M18 21h3v-3c-1.66 0-3 1.34-3 3z"/><path d="M14 21h2c0-2.76 2.24-5 5-5v-2c-3.87 0-7 3.13-7 7z"/>',
		'leak_remove': '<path d="M10 3H8c0 .37-.04.72-.12 1.06l1.59 1.59C9.81 4.84 10 3.94 10 3z"/><path d="M3 4.27l2.84 2.84C5.03 7.67 4.06 8 3 8v2c1.61 0 3.09-.55 4.27-1.46L8.7 9.97A8.99 8.99 0 0 1 3 12v2c2.71 0 5.19-.99 7.11-2.62l2.5 2.5A11.044 11.044 0 0 0 10 21h2c0-2.16.76-4.14 2.03-5.69l1.43 1.43A6.922 6.922 0 0 0 14 21h2c0-1.06.33-2.03.89-2.84L19.73 21 21 19.73 4.27 3 3 4.27z"/><path d="M14 3h-2c0 1.5-.37 2.91-1.02 4.16l1.46 1.46C13.42 6.98 14 5.06 14 3z"/><path d="M19.94 16.12c.34-.08.69-.12 1.06-.12v-2c-.94 0-1.84.19-2.66.52l1.6 1.6z"/><path d="M15.38 11.56l1.46 1.46A8.98 8.98 0 0 1 21 12v-2c-2.06 0-3.98.58-5.62 1.56z"/>',
		'lens': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'linked_camera': '<circle cx="12" cy="14" r="3.2"/><path d="M16 3.33c2.58 0 4.67 2.09 4.67 4.67H22c0-3.31-2.69-6-6-6v1.33M16 6c1.11 0 2 .89 2 2h1.33c0-1.84-1.49-3.33-3.33-3.33V6"/><path d="M17 9c0-1.11-.89-2-2-2V4H9L7.17 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9h-5zm-5 10c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>',
		'looks': '<path d="M12 10c-3.86 0-7 3.14-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.86-3.14-7-7-7z"/><path d="M12 6C5.93 6 1 10.93 1 17h2c0-4.96 4.04-9 9-9s9 4.04 9 9h2c0-6.07-4.93-11-11-11z"/>',
		'looks_3': '<path d="M19.01 3h-14c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 7.5c0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5V15c0 1.11-.9 2-2 2h-4v-2h4v-2h-2v-2h2V9h-4V7h4c1.1 0 2 .89 2 2v1.5z"/>',
		'looks_4': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-2v-4H9V7h2v4h2V7h2v10z"/>',
		'looks_5': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2c1.1 0 2 .89 2 2v2c0 1.11-.9 2-2 2H9v-2h4v-2H9V7h6v2z"/>',
		'looks_6': '<path d="M11 15h2v-2h-2v2zm8-12H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2c1.1 0 2 .89 2 2v2c0 1.11-.9 2-2 2h-2c-1.1 0-2-.89-2-2V9c0-1.11.9-2 2-2h4v2z"/>',
		'looks_one': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>',
		'looks_two': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.11-.9 2-2 2h-2v2h4v2H9v-4c0-1.11.9-2 2-2h2V9H9V7h4c1.1 0 2 .89 2 2v2z"/>',
		'loupe': '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10h8c1.1 0 2-.9 2-2v-8c0-5.51-4.49-10-10-10z"/>',
		'monochrome_photos': '<path d="M20 19h-8v-1c-2.8 0-5-2.2-5-5s2.2-5 5-5V7h8v12zm0-14h-3.2L15 3H9L7.2 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/><path d="M17 13c0-2.8-2.2-5-5-5v1.8c1.8 0 3.2 1.4 3.2 3.2 0 1.8-1.4 3.2-3.2 3.2V18c2.8 0 5-2.2 5-5z"/><path d="M8.8 13c0 1.8 1.4 3.2 3.2 3.2V9.8c-1.8 0-3.2 1.4-3.2 3.2z"/>',
		'movie_creation': '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>',
		'movie_filter': '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.58 11.68L10.37 18l-1.05-2.32L7 14.63l2.32-1.05 1.05-2.32 1.05 2.32 2.32 1.05-2.32 1.05zm3.69-3.47l-.53 1.16-.53-1.16-1.16-.53 1.16-.53.53-1.15.53 1.16 1.16.53-1.16.52z"/>',
		'music_note': '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>',
		'nature': '<path d="M13 16.12c3.47-.41 6.17-3.36 6.17-6.95 0-3.87-3.13-7-7-7s-7 3.13-7 7c0 3.47 2.52 6.34 5.83 6.89V20H5v2h14v-2h-6v-3.88z"/>',
		'nature_people': '<path d="M22.17 9.17c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 3.47 2.52 6.34 5.83 6.89V20H6v-3h1v-4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v4h1v5h16v-2h-3v-3.88c3.47-.41 6.17-3.36 6.17-6.95zM4.5 11c.83 0 1.5-.67 1.5-1.5S5.33 8 4.5 8 3 8.67 3 9.5 3.67 11 4.5 11z"/>',
		'navigate_before': '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>',
		'navigate_next': '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
		'palette': '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'panorama': '<path d="M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z"/>',
		'panorama_fisheye': '<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>',
		'panorama_horizontal': '<path d="M20 6.54v10.91c-2.6-.77-5.28-1.16-8-1.16-2.72 0-5.4.39-8 1.16V6.54c2.6.77 5.28 1.16 8 1.16 2.72.01 5.4-.38 8-1.16M21.43 4c-.1 0-.2.02-.31.06C18.18 5.16 15.09 5.7 12 5.7c-3.09 0-6.18-.55-9.12-1.64-.11-.04-.22-.06-.31-.06-.34 0-.57.23-.57.63v14.75c0 .39.23.62.57.62.1 0 .2-.02.31-.06 2.94-1.1 6.03-1.64 9.12-1.64 3.09 0 6.18.55 9.12 1.64.11.04.21.06.31.06.33 0 .57-.23.57-.63V4.63c0-.4-.24-.63-.57-.63z"/>',
		'panorama_vertical': '<path d="M19.94 21.12c-1.1-2.94-1.64-6.03-1.64-9.12 0-3.09.55-6.18 1.64-9.12.04-.11.06-.22.06-.31 0-.34-.23-.57-.63-.57H4.63c-.4 0-.63.23-.63.57 0 .1.02.2.06.31C5.16 5.82 5.71 8.91 5.71 12c0 3.09-.55 6.18-1.64 9.12-.05.11-.07.22-.07.31 0 .33.23.57.63.57h14.75c.39 0 .63-.24.63-.57-.01-.1-.03-.2-.07-.31zM6.54 20c.77-2.6 1.16-5.28 1.16-8 0-2.72-.39-5.4-1.16-8h10.91c-.77 2.6-1.16 5.28-1.16 8 0 2.72.39 5.4 1.16 8H6.54z"/>',
		'panorama_wide_angle': '<path d="M12 6c2.45 0 4.71.2 7.29.64.47 1.78.71 3.58.71 5.36 0 1.78-.24 3.58-.71 5.36-2.58.44-4.84.64-7.29.64s-4.71-.2-7.29-.64C4.24 15.58 4 13.78 4 12c0-1.78.24-3.58.71-5.36C7.29 6.2 9.55 6 12 6m0-2c-2.73 0-5.22.24-7.95.72l-.93.16-.25.9C2.29 7.85 2 9.93 2 12s.29 4.15.87 6.22l.25.89.93.16c2.73.49 5.22.73 7.95.73s5.22-.24 7.95-.72l.93-.16.25-.89c.58-2.08.87-4.16.87-6.23s-.29-4.15-.87-6.22l-.25-.89-.93-.16C17.22 4.24 14.73 4 12 4z"/>',
		'photo': '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
		'photo_album': '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 15l3-3.86 2.14 2.58 3-3.86L18 19H6z"/>',
		'photo_camera': '<circle cx="12" cy="12" r="3.2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>',
		'photo_filter': '<path d="M17.13 8.9l.59-1.3 1.3-.6-1.3-.59-.59-1.3-.59 1.3-1.31.59 1.31.6z"/><path d="M12.39 6.53l-1.18 2.61-2.61 1.18 2.61 1.18 1.18 2.61 1.19-2.61 2.6-1.18-2.6-1.18z"/><path d="M19.02 10v9H5V5h9V3H5.02c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2z"/>',
		'photo_library': '<path d="M11 12l2.03 2.71L16 11l4 5H8l3-4zm11 4V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2z"/><path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>',
		'photo_size_select_actual': '<path d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"/>',
		'photo_size_select_large': '<path d="M21 15h2v2h-2v-2z"/><path d="M21 11h2v2h-2v-2z"/><path d="M23 19h-2v2c1 0 2-1 2-2z"/><path d="M13 3h2v2h-2V3z"/><path d="M21 7h2v2h-2V7z"/><path d="M21 3v2h2c0-1-1-2-2-2z"/><path d="M1 7h2v2H1V7z"/><path d="M17 3h2v2h-2V3z"/><path d="M17 19h2v2h-2v-2z"/><path d="M3 3C2 3 1 4 1 5h2V3z"/><path d="M9 3h2v2H9V3z"/><path d="M5 3h2v2H5V3z"/><path d="M3 19l2.5-3.21 1.79 2.15 2.5-3.22L13 19H3zm-2-8v8c0 1.1.9 2 2 2h12V11H1z"/>',
		'photo_size_select_small': '<path d="M23 15h-2v2h2v-2z"/><path d="M23 11h-2v2h2v-2z"/><path d="M23 19h-2v2c1 0 2-1 2-2z"/><path d="M15 3h-2v2h2V3z"/><path d="M23 7h-2v2h2V7z"/><path d="M21 3v2h2c0-1-1-2-2-2z"/><path d="M3 21h8v-6H1v4c0 1.1.9 2 2 2z"/><path d="M3 7H1v2h2V7z"/><path d="M15 19h-2v2h2v-2z"/><path d="M19 3h-2v2h2V3z"/><path d="M19 19h-2v2h2v-2z"/><path d="M3 3C2 3 1 4 1 5h2V3z"/><path d="M3 11H1v2h2v-2z"/><path d="M11 3H9v2h2V3z"/><path d="M7 3H5v2h2V3z"/>',
		'picture_as_pdf': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M14 11.5h1v-3h-1v3zm-5-2h1v-1H9v1zm11.5-1H19v1h1.5V11H19v2h-1.5V7h3v1.5zm-4 3c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm-5-2c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zM20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'portrait': '<path d="M16.5 16.25c0-1.5-3-2.25-4.5-2.25s-4.5.75-4.5 2.25V17h9v-.75zm-4.5-4c1.24 0 2.25-1.01 2.25-2.25S13.24 7.75 12 7.75 9.75 8.76 9.75 10s1.01 2.25 2.25 2.25z"/><path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'remove_red_eye': '<path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'rotate_90_degrees_ccw': '<path d="M3.69 12.9l3.66-3.66L11 12.9l-3.66 3.66-3.65-3.66zm3.65-6.49L.86 12.9l6.49 6.48 6.49-6.48-6.5-6.49z"/><path d="M19.36 6.64A8.95 8.95 0 0 0 13 4V.76L8.76 5 13 9.24V6c1.79 0 3.58.68 4.95 2.05a7.007 7.007 0 0 1 0 9.9 6.973 6.973 0 0 1-7.79 1.44l-1.49 1.49C10.02 21.62 11.51 22 13 22c2.3 0 4.61-.88 6.36-2.64a8.98 8.98 0 0 0 0-12.72z"/>',
		'rotate_left': '<path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47z"/><path d="M6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47z"/><path d="M7.1 18.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32z"/><path d="M13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>',
		'rotate_right': '<path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45z"/><path d="M19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02z"/><path d="M13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03z"/><path d="M16.89 15.48l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>',
		'slideshow': '<path d="M10 8v8l5-4-5-4z"/><path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'straighten': '<path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h2v4h2V8h2v4h2V8h2v4h2V8h2v4h2V8h2v8z"/>',
		'style': '<path d="M2.53 19.65l1.34.56v-9.03l-2.43 5.86c-.41 1.02.08 2.19 1.09 2.61z"/><path d="M7.88 8.75c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm14.15 7.2L17.07 3.98a2.013 2.013 0 0 0-1.81-1.23c-.26 0-.53.04-.79.15L7.1 5.95a1.999 1.999 0 0 0-1.08 2.6l4.96 11.97a1.998 1.998 0 0 0 2.6 1.08l7.36-3.05a1.994 1.994 0 0 0 1.09-2.6z"/><path d="M5.88 19.75c0 1.1.9 2 2 2h1.45l-3.45-8.34v6.34z"/>',
		'switch_camera': '<path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"/>',
		'switch_video': '<path d="M18 9.5V6c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-3.5l4 4v-13l-4 4zm-5 6V13H7v2.5L3.5 12 7 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"/>',
		'tag_faces': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'texture': '<path d="M19.51 3.08L3.08 19.51c.09.34.27.65.51.9.25.24.56.42.9.51L20.93 4.49c-.19-.69-.73-1.23-1.42-1.41z"/><path d="M11.88 3L3 11.88v2.83L14.71 3h-2.83z"/><path d="M5 3c-1.1 0-2 .9-2 2v2l4-4H5z"/><path d="M19 21c.55 0 1.05-.22 1.41-.59.37-.36.59-.86.59-1.41v-2l-4 4h2z"/><path d="M9.29 21h2.83L21 12.12V9.29L9.29 21z"/>',
		'timelapse': '<path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48z"/><path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'timer': '<path d="M15 1H9v2h6V1z"/><path d="M11 14h2V8h-2v6z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm7.03-12.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61z"/>',
		'timer_10': '<path d="M0 7.72V9.4l3-1V18h2V6h-.25L0 7.72z"/><path d="M23.78 14.37c-.14-.28-.35-.53-.63-.74-.28-.21-.61-.39-1.01-.53s-.85-.27-1.35-.38a6.64 6.64 0 0 1-.87-.23 2.61 2.61 0 0 1-.55-.25.717.717 0 0 1-.28-.3.978.978 0 0 1 .01-.8c.06-.13.15-.25.27-.34.12-.1.27-.18.45-.24s.4-.09.64-.09c.25 0 .47.04.66.11.19.07.35.17.48.29.13.12.22.26.29.42.06.16.1.32.1.49h1.95a2.517 2.517 0 0 0-.93-1.97c-.3-.25-.66-.44-1.09-.59C21.49 9.07 21 9 20.46 9c-.51 0-.98.07-1.39.21-.41.14-.77.33-1.06.57-.29.24-.51.52-.67.84a2.2 2.2 0 0 0-.23 1.01c0 .36.08.69.23.96.15.28.36.52.64.73.27.21.6.38.98.53.38.14.81.26 1.27.36.39.08.71.17.95.26s.43.19.57.29c.13.1.22.22.27.34.05.12.07.25.07.39 0 .32-.13.57-.4.77-.27.2-.66.29-1.17.29-.22 0-.43-.02-.64-.08-.21-.05-.4-.13-.56-.24a1.333 1.333 0 0 1-.59-1.11h-1.89c0 .36.08.71.24 1.05.16.34.39.65.7.93.31.27.69.49 1.15.66.46.17.98.25 1.58.25.53 0 1.01-.06 1.44-.19.43-.13.8-.31 1.11-.54.31-.23.54-.51.71-.83.17-.32.25-.67.25-1.06-.02-.4-.09-.74-.24-1.02z"/><path d="M12.9 13.22c0 .6-.04 1.11-.12 1.53-.08.42-.2.76-.36 1.02-.16.26-.36.45-.59.57-.23.12-.51.18-.82.18-.3 0-.58-.06-.82-.18s-.44-.31-.6-.57c-.16-.26-.29-.6-.38-1.02-.09-.42-.13-.93-.13-1.53v-2.5c0-.6.04-1.11.13-1.52.09-.41.21-.74.38-1 .16-.25.36-.43.6-.55.24-.11.51-.17.81-.17.31 0 .58.06.81.17.24.11.44.29.6.55.16.25.29.58.37.99.08.41.13.92.13 1.52v2.51zm.92-6.17c-.34-.4-.75-.7-1.23-.88-.47-.18-1.01-.27-1.59-.27-.58 0-1.11.09-1.59.27-.48.18-.89.47-1.23.88-.34.41-.6.93-.79 1.59-.18.65-.28 1.45-.28 2.39v1.92c0 .94.09 1.74.28 2.39.19.66.45 1.19.8 1.6.34.41.75.71 1.23.89.48.18 1.01.28 1.59.28.59 0 1.12-.09 1.59-.28.48-.18.88-.48 1.22-.89.34-.41.6-.94.78-1.6.18-.65.28-1.45.28-2.39v-1.92c0-.94-.09-1.74-.28-2.39-.18-.66-.44-1.19-.78-1.59z"/>',
		'timer_3': '<path d="M11.61 12.97c-.16-.24-.36-.46-.62-.65a3.38 3.38 0 0 0-.93-.48c.3-.14.57-.3.8-.5.23-.2.42-.41.57-.64.15-.23.27-.46.34-.71.08-.24.11-.49.11-.73 0-.55-.09-1.04-.28-1.46-.18-.42-.44-.77-.78-1.06-.33-.28-.73-.5-1.2-.64-.45-.13-.97-.2-1.53-.2-.55 0-1.06.08-1.52.24-.47.17-.87.4-1.2.69-.33.29-.6.63-.78 1.03-.2.39-.29.83-.29 1.29h1.98c0-.26.05-.49.14-.69.09-.2.22-.38.38-.52.17-.14.36-.25.58-.33.22-.08.46-.12.73-.12.61 0 1.06.16 1.36.47.3.31.44.75.44 1.32 0 .27-.04.52-.12.74-.08.22-.21.41-.38.57-.17.16-.38.28-.63.37-.25.09-.55.13-.89.13H6.72v1.57H7.9c.34 0 .64.04.91.11.27.08.5.19.69.35.19.16.34.36.44.61.1.24.16.54.16.87 0 .62-.18 1.09-.53 1.42-.35.33-.84.49-1.45.49-.29 0-.56-.04-.8-.13-.24-.08-.44-.2-.61-.36-.17-.16-.3-.34-.39-.56-.09-.22-.14-.46-.14-.72H4.19c0 .55.11 1.03.32 1.45.21.42.5.77.86 1.05s.77.49 1.24.63.96.21 1.48.21c.57 0 1.09-.08 1.58-.23.49-.15.91-.38 1.26-.68.36-.3.64-.66.84-1.1.2-.43.3-.93.3-1.48 0-.29-.04-.58-.11-.86-.08-.25-.19-.51-.35-.76z"/><path d="M20.87 14.37c-.14-.28-.35-.53-.63-.74-.28-.21-.61-.39-1.01-.53s-.85-.27-1.35-.38a6.64 6.64 0 0 1-.87-.23 2.61 2.61 0 0 1-.55-.25.717.717 0 0 1-.28-.3.935.935 0 0 1-.08-.39.946.946 0 0 1 .36-.75c.12-.1.27-.18.45-.24s.4-.09.64-.09c.25 0 .47.04.66.11.19.07.35.17.48.29.13.12.22.26.29.42.06.16.1.32.1.49h1.95a2.517 2.517 0 0 0-.93-1.97c-.3-.25-.66-.44-1.09-.59-.43-.15-.92-.22-1.46-.22-.51 0-.98.07-1.39.21-.41.14-.77.33-1.06.57-.29.24-.51.52-.67.84a2.2 2.2 0 0 0-.23 1.01c0 .36.08.68.23.96.15.28.37.52.64.73.27.21.6.38.98.53.38.14.81.26 1.27.36.39.08.71.17.95.26s.43.19.57.29c.13.1.22.22.27.34.05.12.07.25.07.39 0 .32-.13.57-.4.77-.27.2-.66.29-1.17.29-.22 0-.43-.02-.64-.08-.21-.05-.4-.13-.56-.24a1.333 1.333 0 0 1-.59-1.11h-1.89c0 .36.08.71.24 1.05.16.34.39.65.7.93.31.27.69.49 1.15.66.46.17.98.25 1.58.25.53 0 1.01-.06 1.44-.19.43-.13.8-.31 1.11-.54.31-.23.54-.51.71-.83.17-.32.25-.67.25-1.06-.02-.4-.09-.74-.24-1.02z"/>',
		'timer_off': '<path d="M19.04 4.55l-1.42 1.42a9.012 9.012 0 0 0-10.57-.49l1.46 1.46C9.53 6.35 10.73 6 12 6c3.87 0 7 3.13 7 7 0 1.27-.35 2.47-.94 3.49l1.45 1.45A8.878 8.878 0 0 0 21 13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42-1.41-1.42z"/><path d="M15 1H9v2h6V1z"/><path d="M11 9.44l2 2V8h-2v1.44z"/><path d="M12 20c-3.87 0-7-3.13-7-7 0-1.28.35-2.48.95-3.52l9.56 9.56c-1.03.61-2.23.96-3.51.96zM3.02 4L1.75 5.27 4.5 8.03A8.905 8.905 0 0 0 3 13c0 4.97 4.02 9 9 9 1.84 0 3.55-.55 4.98-1.5l2.5 2.5 1.27-1.27-7.71-7.71L3.02 4z"/>',
		'tonality': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.87.48-1.84.8-2.87.93zM18.24 17H13v-1h5.92c-.2.35-.43.69-.68 1zm1.5-3H13v-1h6.93c-.04.34-.11.67-.19 1z"/>',
		'transform': '<path d="M22 18v-2H8V4h2L7 1 4 4h2v2H2v2h4v8c0 1.1.9 2 2 2h8v2h-2l3 3 3-3h-2v-2h4z"/><path d="M10 8h6v6h2V8c0-1.1-.9-2-2-2h-6v2z"/>',
		'tune': '<path d="M13 21v-2h8v-2h-8v-2h-2v6h2zM3 17v2h6v-2H3z"/><path d="M21 13v-2H11v2h10zM7 9v2H3v2h4v2h2V9H7z"/><path d="M15 9h2V7h4V5h-4V3h-2v6zM3 5v2h10V5H3z"/>',
		'view_comfy': '<path d="M3 9h4V5H3v4z"/><path d="M3 14h4v-4H3v4z"/><path d="M8 14h4v-4H8v4z"/><path d="M13 14h4v-4h-4v4z"/><path d="M8 9h4V5H8v4z"/><path d="M13 5v4h4V5h-4z"/><path d="M18 14h4v-4h-4v4z"/><path d="M3 19h4v-4H3v4z"/><path d="M8 19h4v-4H8v4z"/><path d="M13 19h4v-4h-4v4z"/><path d="M18 19h4v-4h-4v4z"/><path d="M18 5v4h4V5h-4z"/>',
		'view_compact': '<path d="M3 19h6v-7H3v7z"/><path d="M10 19h12v-7H10v7z"/><path d="M3 5v6h19V5H3z"/>',
		'vignette': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 15c-4.42 0-8-2.69-8-6s3.58-6 8-6 8 2.69 8 6-3.58 6-8 6z"/>',
		'wb_auto': '<path d="M6.85 12.65h2.3L8 9l-1.15 3.65zM22 7l-1.2 6.29L19.3 7h-1.6l-1.49 6.29L15 7h-.76C12.77 5.17 10.53 4 8 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.13 0 5.84-1.81 7.15-4.43l.1.43H17l1.5-6.1L20 16h1.75l2.05-9H22zm-11.7 9l-.7-2H6.4l-.7 2H3.8L7 7h2l3.2 9h-1.9z"/>',
		'wb_cloudy': '<path d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z"/>',
		'wb_incandescent': '<path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/><path d="M11 22.45h2V19.5h-2v2.95z"/><path d="M4 10.5H1v2h3v-2z"/><path d="M15 6.31V1.5H9v4.81C7.21 7.35 6 9.28 6 11.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19z"/><path d="M20 10.5v2h3v-2h-3z"/><path d="M17.24 18.16l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z"/>',
		'wb_irradescent': '<path d="M5 14.5h14v-6H5v6z"/><path d="M11 .55V3.5h2V.55h-2z"/><path d="M19.04 3.05l-1.79 1.79 1.41 1.41 1.8-1.79-1.42-1.41z"/><path d="M13 22.45V19.5h-2v2.95h2z"/><path d="M20.45 18.54l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42z"/><path d="M3.55 4.46l1.79 1.79 1.41-1.41-1.79-1.79-1.41 1.41z"/><path d="M4.96 19.95l1.79-1.8-1.41-1.41-1.79 1.79 1.41 1.42z"/>',
		'wb_sunny': '<path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41z"/><path d="M4 10.5H1v2h3v-2z"/><path d="M13 .55h-2V3.5h2V.55z"/><path d="M20.45 4.46l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79z"/><path d="M17.24 18.16l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z"/><path d="M20 10.5v2h3v-2h-3z"/><path d="M12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/><path d="M11 22.45h2V19.5h-2v2.95z"/><path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>',
		//
		// maps
		//
		'add_location': '<path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm4 8h-3v3h-2v-3H8V8h3V5h2v3h3v2z"/>',
		'beenhere': '<path d="M19 1H5c-1.1 0-1.99.9-1.99 2L3 15.93c0 .69.35 1.3.88 1.66L12 23l8.11-5.41c.53-.36.88-.97.88-1.66L21 3c0-1.1-.9-2-2-2zm-9 15l-5-5 1.41-1.41L10 13.17l7.59-7.59L19 7l-9 9z"/>',
		'directions': '<path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>',
		'directions_bike': '<path d="M16 4.8c.99 0 1.8-.81 1.8-1.8s-.81-1.8-1.8-1.8c-1 0-1.8.81-1.8 1.8S15 4.8 16 4.8z"/><path d="M19 20.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-8.5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/><path d="M14.8 10H19V8.2h-3.2l-1.93-3.27c-.3-.5-.84-.83-1.46-.83-.47 0-.89.19-1.2.5l-3.7 3.7c-.32.3-.51.73-.51 1.2 0 .63.33 1.16.85 1.47L11.2 13v5H13v-6.48l-2.25-1.67 2.32-2.33L14.8 10z"/><path d="M5 20.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zM5 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>',
		'directions_bus': '<path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>',
		'directions_car': '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
		'directions_ferry': '<path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2z"/><path d="M6 6h12v3.97L12 8 6 9.97V6zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19z"/>',
		'directions_subway': '<path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"/>',
		'directions_train': '<path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z"/>',
		'directions_transit': '<path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"/>',
		'directions_walk': '<path d="M14 3.8c.99 0 1.8-.81 1.8-1.8 0-1-.81-1.8-1.8-1.8-1 0-1.8.81-1.8 1.8S13 3.8 14 3.8z"/><path d="M14.12 10H19V8.2h-3.62l-2-3.33c-.3-.5-.84-.83-1.46-.83-.17 0-.34.03-.49.07L6 5.8V11h1.8V7.33l2.11-.66L6 22h1.8l2.87-8.11L13 17v5h1.8v-6.41l-2.49-4.54.73-2.87L14.12 10z"/>',
		'edit_location': '<path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm-1.56 10H9v-1.44l3.35-3.34 1.43 1.43L10.44 12zm4.45-4.45l-.7.7-1.44-1.44.7-.7c.15-.15.39-.15.54 0l.9.9c.15.15.15.39 0 .54z"/>',
		'ev_station': '<path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6L10 6v5h2l-4 7z"/>',
		'flight': '<path d="M10.18 9"/><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>',
		'hotel': '<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3z"/><path d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>',
		'layers': '<path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74z"/><path d="M12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>',
		'layers_clear': '<path d="M19.81 14.99l1.19-.92-1.43-1.43-1.19.92 1.43 1.43z"/><path d="M19.36 10.27L21 9l-9-7-2.91 2.27 7.87 7.88 2.4-1.88z"/><path d="M3.27 1L2 2.27l4.22 4.22L3 9l1.63 1.27L12 16l2.1-1.63 1.43 1.43L12 18.54l-7.37-5.73L3 14.07l9 7 4.95-3.85L20.73 21 22 19.73 3.27 1z"/>',
		'local_activity': '<path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z"/>',
		'local_airport': '<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>',
		'local_atm': '<path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1z"/><path d="M20 18H4V6h16v12zm0-14H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2z"/>',
		'local_bar': '<path d="M11 13v6H6v2h12v-2h-5v-6l8-8V3H3v2l8 8zM7.5 7l-2-2h13l-2 2h-9z"/>',
		'local_cafe': '<path d="M20 8h-2V5h2v3zm0-5H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/><path d="M2 21h18v-2H2v2z"/>',
		'local_car_wash': '<path d="M17 5c.83 0 1.5-.67 1.5-1.5 0-1-1.5-2.7-1.5-2.7s-1.5 1.7-1.5 2.7c0 .83.67 1.5 1.5 1.5z"/><path d="M12 5c.83 0 1.5-.67 1.5-1.5 0-1-1.5-2.7-1.5-2.7s-1.5 1.7-1.5 2.7c0 .83.67 1.5 1.5 1.5z"/><path d="M7 5c.83 0 1.5-.67 1.5-1.5C8.5 2.5 7 .8 7 .8S5.5 2.5 5.5 3.5C5.5 4.33 6.17 5 7 5z"/><path d="M5 13l1.5-4.5h11L19 13H5zm12.5 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 15 6.5 15s1.5.67 1.5 1.5S7.33 18 6.5 18zm12.42-9.99C18.72 7.42 18.16 7 17.5 7h-11c-.66 0-1.21.42-1.42 1.01L3 14v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>',
		'local_convenience_store': '<path d="M19 7V4H5v3H2v13h8v-4h4v4h8V7h-3zm-8 3H9v1h2v1H8V9h2V8H8V7h3v3zm5 2h-1v-2h-2V7h1v2h1V7h1v5z"/>',
		'local_dining': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18z"/><path d="M14.88 11.53c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',
		'local_drink': '<path d="M3 2l2.01 18.23C5.13 21.23 5.97 22 7 22h10c1.03 0 1.87-.77 1.99-1.77L21 2H3zm9 17c-1.66 0-3-1.34-3-3 0-2 3-5.4 3-5.4s3 3.4 3 5.4c0 1.66-1.34 3-3 3zm6.33-11H5.67l-.44-4h13.53l-.43 4z"/>',
		'local_florist': '<path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z"/><path d="M12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zm-6.4 4.75c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25z"/><path d="M3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z"/>',
		'local_gas_station': '<path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>',
		'local_grocery_store': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
		'local_hospital': '<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>',
		'local_hotel': '<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3z"/><path d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>',
		'local_laundry_service': '<path d="M9.17 16.83a4.008 4.008 0 0 0 5.66 0 4.008 4.008 0 0 0 0-5.66l-5.66 5.66z"/><path d="M12 20c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM7 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm8-1.99L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99z"/>',
		'local_library': '<path d="M12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/><path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55z"/>',
		'local_mall': '<path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>',
		'local_movies': '<path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>',
		'local_offer': '<path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>',
		'local_parking': '<path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/>',
		'local_pharmacy': '<path d="M21 5h-2.64l1.14-3.14L17.15 1l-1.46 4H3v2l2 6-2 6v2h18v-2l-2-6 2-6V5zm-5 9h-3v3h-2v-3H8v-2h3V9h2v3h3v2z"/>',
		'local_phone': '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
		'local_pizza': '<path d="M12 2C8.43 2 5.23 3.54 3.01 6L12 22l8.99-16C18.78 3.55 15.57 2 12 2zM7 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm5 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
		'local_play': '<path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z"/>',
		'local_post_office': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'local_print_shop': '<path d="M19 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3 7H8v-5h8v5zm3-11H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3z"/><path d="M18 3H6v4h12V3z"/>',
		'local_restaurant': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18z"/><path d="M14.88 11.53c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',
		'local_see': '<circle cx="12" cy="12" r="3.2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>',
		'local_shipping': '<path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'local_taxi': '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
		'map': '<path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>',
		'my_location': '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm8.94-8c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z"/>',
		'navigation': '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>',
		'near_me': '<path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/>',
		'person_pin_circle': '<path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 2c1.1 0 2 .9 2 2 0 1.11-.9 2-2 2s-2-.89-2-2c0-1.1.9-2 2-2zm0 10c-1.67 0-3.14-.85-4-2.15.02-1.32 2.67-2.05 4-2.05s3.98.73 4 2.05c-.86 1.3-2.33 2.15-4 2.15z"/>',
		'person_pin': '<path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.3c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7zM18 16H6v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z"/>',
		'pin_drop': '<path d="M10 8c0-1.1.9-2 2-2s2 .9 2 2-.89 2-2 2c-1.1 0-2-.9-2-2zm8 0c0-3.31-2.69-6-6-6S6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11z"/><path d="M5 20v2h14v-2H5z"/>',
		'place': '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'rate_review': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2.47l6.88-6.88c.2-.2.51-.2.71 0l1.77 1.77c.2.2.2.51 0 .71L8.47 14H6zm12 0h-7.5l2-2H18v2z"/>',
		'restaurant': '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/><path d="M16 6v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>',
		'restaurant_menu': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18z"/><path d="M14.88 11.53c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',
		'satellite': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.99h3C8 6.65 6.66 8 5 8V4.99zM5 12v-2c2.76 0 5-2.25 5-5.01h2C12 8.86 8.87 12 5 12zm0 6l3.5-4.5 2.5 3.01L14.5 12l4.5 6H5z"/>',
		'store_mall_directory': '<path d="M20 4H4v2h16V4z"/><path d="M12 18H6v-4h6v4zm9-4v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1z"/>',
		'streetview': '<path d="M12.56 14.33c-.34.27-.56.7-.56 1.17V21h7c1.1 0 2-.9 2-2v-5.98c-.94-.33-1.95-.52-3-.52-2.03 0-3.93.7-5.44 1.83z"/><circle cx="18" cy="6" r="5"/><path d="M11.5 6c0-1.08.27-2.1.74-3H5c-1.1 0-2 .9-2 2v14c0 .55.23 1.05.59 1.41l9.82-9.82C12.23 9.42 11.5 7.8 11.5 6z"/>',
		'subway': '<circle cx="15.5" cy="16" r="1"/><circle cx="8.5" cy="16" r="1"/><path d="M7.01 9h10v5h-10z"/><path d="M17.8 2.8C16 2.09 13.86 2 12 2c-1.86 0-4 .09-5.8.8C3.53 3.84 2 6.05 2 8.86V22h20V8.86c0-2.81-1.53-5.02-4.2-6.06zm.2 13.08c0 1.45-1.18 2.62-2.63 2.62l1.13 1.12V20H15l-1.5-1.5h-2.83L9.17 20H7.5v-.38l1.12-1.12C7.18 18.5 6 17.32 6 15.88V9c0-2.63 3-3 6-3 3.32 0 6 .38 6 3v6.88z"/>',
		'terrain': '<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>',
		'traffic': '<path d="M20 10h-3V8.86c1.72-.45 3-2 3-3.86h-3V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H4c0 1.86 1.28 3.41 3 3.86V10H4c0 1.86 1.28 3.41 3 3.86V15H4c0 1.86 1.28 3.41 3 3.86V20c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1.14c1.72-.45 3-2 3-3.86h-3v-1.14c1.72-.45 3-2 3-3.86zm-8 9c-1.11 0-2-.9-2-2s.89-2 2-2c1.1 0 2 .9 2 2s-.89 2-2 2zm0-5c-1.11 0-2-.9-2-2s.89-2 2-2c1.1 0 2 .9 2 2s-.89 2-2 2zm0-5c-1.11 0-2-.9-2-2 0-1.11.89-2 2-2 1.1 0 2 .89 2 2 0 1.1-.89 2-2 2z"/>',
		'train': '<path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'tram': '<path d="M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06zm-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-4.5H7V9h10v5z"/>',
		'transfer_within_a_station': '<path d="M16.49 15.5v-1.75L14 16.25l2.49 2.5V17H22v-1.5z"/><path d="M19.51 19.75H14v1.5h5.51V23L22 20.5 19.51 18z"/><path d="M9.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5.75 8.9L3 23h2.1l1.75-8L9 17v6h2v-7.55L8.95 13.4l.6-3C10.85 12 12.8 13 15 13v-2c-1.85 0-3.45-1-4.35-2.45l-.95-1.6C9.35 6.35 8.7 6 8 6c-.25 0-.5.05-.75.15L2 8.3V13h2V9.65l1.75-.75"/>',
		'zoom_out_map': '<path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3z"/><path d="M3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3z"/><path d="M9 21l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6z"/><path d="M21 15l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"/>',
		//
		// navigation
		//
		'apps': '<path d="M4 8h4V4H4v4z"/><path d="M10 20h4v-4h-4v4z"/><path d="M4 20h4v-4H4v4z"/><path d="M4 14h4v-4H4v4z"/><path d="M10 14h4v-4h-4v4z"/><path d="M16 4v4h4V4h-4z"/><path d="M10 8h4V4h-4v4z"/><path d="M16 14h4v-4h-4v4z"/><path d="M16 20h4v-4h-4v4z"/>',
		'arrow_back': '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>',
		'arrow_downward': '<path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>',
		'arrow_drop_down': '<path d="M7 10l5 5 5-5z"/>',
		'arrow_drop_down_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 12l-4-4h8l-4 4z"/>',
		'arrow_drop_up': '<path d="M7 14l5-5 5 5z"/>',
		'arrow_forward': '<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>',
		'arrow_upwards': '<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>',
		'cancel': '<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>',
		'check': '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
		'chevron_left': '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>',
		'chevron_right': '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
		'close': '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
		'expand_less': '<path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>',
		'expand_more': '<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>',
		'first_page': '<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6z"/><path d="M6 6h2v12H6z"/>',
		'fullscreen': '<path d="M7 14H5v5h5v-2H7v-3z"/><path d="M5 10h2V7h3V5H5v5z"/><path d="M17 17h-3v2h5v-5h-2v3z"/><path d="M14 5v2h3v3h2V5h-5z"/>',
		'fullscreen_exit': '<path d="M5 16h3v3h2v-5H5v2z"/><path d="M8 8H5v2h5V5H8v3z"/><path d="M14 19h2v-3h3v-2h-5v5z"/><path d="M16 8V5h-2v5h5V8h-3z"/>',
		'last_page': '<path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6z"/><path d="M16 6h2v12h-2z"/>',
		'menu': '<path d="M3 18h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 6v2h18V6H3z"/>',
		'more_horiz': '<path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'more_vert': '<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'refresh': '<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>',
		'subdirectory_arrow_left': ' <path d="M11 9l1.42 1.42L8.83 14H18V4h2v12H8.83l3.59 3.58L11 21l-6-6 6-6z"/>',
		'subdirectory_arrow_right': '<path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"/>',
		//
		// notification
		//
		'adb': '<path d="M5 16c0 3.87 3.13 7 7 7s7-3.13 7-7v-4H5v4z"/><path d="M15 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM9 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7.12-4.63l2.1-2.1-.82-.83-2.3 2.31C14.16 3.28 13.12 3 12 3s-2.16.28-3.09.75L6.6 1.44l-.82.83 2.1 2.1C6.14 5.64 5 7.68 5 10v1h14v-1c0-2.32-1.14-4.36-2.88-5.63z"/>',
		'airline_seat_flat': '<path d="M22 11v2H9V7h9c2.21 0 4 1.79 4 4z"/><path d="M2 14v2h6v2h8v-2h6v-2H2z"/><path d="M7.14 12.1a3 3 0 0 0-.04-4.24 3 3 0 0 0-4.24.04 3 3 0 0 0 .04 4.24 3 3 0 0 0 4.24-.04z"/>',
		'airline_seat_angled': '<path d="M22.25 14.29l-.69 1.89L9.2 11.71l2.08-5.66 8.56 3.09a4 4 0 0 1 2.41 5.15z"/><path d="M1.5 12.14L8 14.48V19h8v-1.63L20.52 19l.69-1.89-19.02-6.86-.69 1.89z"/><path d="M7.3 10.2a3.01 3.01 0 0 0 1.41-4A3.005 3.005 0 0 0 4.7 4.8a2.99 2.99 0 0 0-1.4 4 2.99 2.99 0 0 0 4 1.4z"/>',
		'airline_seat_individual_suite': '<path d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3z"/><path d="M19 7h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4z"/>',
		'airline_seat_legroom_extra': '<path d="M4 12V3H2v9c0 2.76 2.24 5 5 5h6v-2H7c-1.66 0-3-1.34-3-3z"/><path d="M22.83 17.24c-.38-.72-1.29-.97-2.03-.63l-1.09.5-3.41-6.98a2.01 2.01 0 0 0-1.79-1.12L11 9V3H5v8c0 1.66 1.34 3 3 3h7l3.41 7 3.72-1.7c.77-.36 1.1-1.3.7-2.06z"/>',
		'airline_seat_legroom_normal': '<path d="M5 12V3H3v9c0 2.76 2.24 5 5 5h6v-2H8c-1.66 0-3-1.34-3-3z"/><path d="M20.5 18H19v-7c0-1.1-.9-2-2-2h-5V3H6v8c0 1.65 1.35 3 3 3h7v7h4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>',
		'airline_seat_legroom_reduced': '<path d="M19.97 19.2c.18.96-.55 1.8-1.47 1.8H14v-3l1-4H9c-1.65 0-3-1.35-3-3V3h6v6h5c1.1 0 2 .9 2 2l-2 7h1.44c.73 0 1.39.49 1.53 1.2z"/><path d="M5 12V3H3v9c0 2.76 2.24 5 5 5h4v-2H8c-1.66 0-3-1.34-3-3z"/>',
		'airline_seat_recline_extra': '<path d="M5.35 5.64c-.9-.64-1.12-1.88-.49-2.79.63-.9 1.88-1.12 2.79-.49.9.64 1.12 1.88.49 2.79-.64.9-1.88 1.12-2.79.49z"/><path d="M16 19H8.93c-1.48 0-2.74-1.08-2.96-2.54L4 7H2l1.99 9.76A5.01 5.01 0 0 0 8.94 21H16v-2z"/><path d="M16.23 15h-4.88l-1.03-4.1c1.58.89 3.28 1.54 5.15 1.22V9.99c-1.63.31-3.44-.27-4.69-1.25L9.14 7.47c-.23-.18-.49-.3-.76-.38a2.21 2.21 0 0 0-.99-.06h-.02a2.268 2.268 0 0 0-1.84 2.61l1.35 5.92A3.008 3.008 0 0 0 9.83 18h6.85l3.82 3 1.5-1.5-5.77-4.5z"/>',
		'airline_seat_recline_normal': '<path d="M7.59 5.41c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83-.79.79-2.05.79-2.83 0z"/><path d="M6 16V7H4v9c0 2.76 2.24 5 5 5h6v-2H9c-1.66 0-3-1.34-3-3z"/><path d="M20 20.07L14.93 15H11.5v-3.68c1.4 1.15 3.6 2.16 5.5 2.16v-2.16c-1.66.02-3.61-.87-4.67-2.04l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C8.01 7 7 8.01 7 9.25V15c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07z"/>',
		'bluetooth_audio': '<path d="M19.53 6.71l-1.26 1.26c.63 1.21.98 2.57.98 4.02 0 1.45-.36 2.82-.98 4.02l1.2 1.2c.97-1.54 1.54-3.36 1.54-5.31-.01-1.89-.55-3.67-1.48-5.19zm-5.29 5.3l2.32 2.32c.28-.72.44-1.51.44-2.33 0-.82-.16-1.59-.43-2.31l-2.33 2.32z"/><path d="M12.88 16.29L11 18.17v-3.76l1.88 1.88zM11 5.83l1.88 1.88L11 9.59V5.83zm4.71 1.88L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29z"/>',
		'confirmation_number': '<path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/>',
		'disc_full': '<path d="M20 7v5h2V7h-2zm0 9h2v-2h-2v2z"/><path d="M10 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"/>',
		'do_not_disturb': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>',
		'do_not_disturb_alt': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM4 12c0-4.4 3.6-8 8-8 1.8 0 3.5.6 4.9 1.7L5.7 16.9C4.6 15.5 4 13.8 4 12zm8 8c-1.8 0-3.5-.6-4.9-1.7L18.3 7.1C19.4 8.5 20 10.2 20 12c0 4.4-3.6 8-8 8z"/>',
		'do_not_disturb_off': '<path d="M17 11v2h-1.46l4.68 4.68A9.92 9.92 0 0 0 22 12c0-5.52-4.48-10-10-10-2.11 0-4.07.66-5.68 1.78L13.54 11H17z"/><path d="M7 13v-2h1.46l2 2H7zM2.27 2.27L1 3.54l2.78 2.78A9.92 9.92 0 0 0 2 12c0 5.52 4.48 10 10 10 2.11 0 4.07-.66 5.68-1.78L20.46 23l1.27-1.27L11 11 2.27 2.27z"/>',
		'do_not_disturb_on': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>',
		'drive_eta': '<path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>',
		'enhanced_encryption': '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM16 16h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z"/>',
		'event_available': '<path d="M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94z"/><path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'event_busy': '<path d="M9.31 17l2.44-2.44L14.19 17l1.06-1.06-2.44-2.44 2.44-2.44L14.19 10l-2.44 2.44L9.31 10l-1.06 1.06 2.44 2.44-2.44 2.44L9.31 17z"/><path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'event_note': '<path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M14 14H7v2h7v-2zm3-4H7v2h10v-2z"/>',
		'folder_special': '<path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6.42 12L10 15.9 6.42 18l.95-4.07-3.16-2.74 4.16-.36L10 7l1.63 3.84 4.16.36-3.16 2.74.95 4.06z"/>',
		'live_tv': '<path d="M21 20H3V8h18v12zm0-14h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8a2 2 0 0 0-2-2z"/><path d="M9 10v8l7-4z"/>',
		'mms': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM5 14l3.5-4.5 2.5 3.01L14.5 8l4.5 6H5z"/>',
		'more': '<path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.97.89 1.66.89H22c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'network_check': '<path d="M15.9 5c-.17 0-.32.09-.41.23l-.07.15-5.18 11.65c-.16.29-.26.61-.26.96 0 1.11.9 2.01 2.01 2.01.96 0 1.77-.68 1.96-1.59l.01-.03L16.4 5.5c0-.28-.22-.5-.5-.5z"/><path d="M21 11l2-2a15.367 15.367 0 0 0-5.59-3.57l-.53 2.82c1.5.62 2.9 1.53 4.12 2.75zM1 9l2 2c2.88-2.88 6.79-4.08 10.53-3.62l1.19-2.68C9.89 3.84 4.74 5.27 1 9z"/><path d="M5 13l2 2a7.1 7.1 0 0 1 4.03-2l1.28-2.88c-2.63-.08-5.3.87-7.31 2.88zm12 2l2-2c-.8-.8-1.7-1.42-2.66-1.89l-.55 2.92c.42.27.83.59 1.21.97z"/>',
		'network_locked': '<path d="M19.5 10c.17 0 .33.03.5.05V1L1 20h13v-3c0-.89.39-1.68 1-2.23v-.27c0-2.48 2.02-4.5 4.5-4.5z"/><path d="M21 16h-3v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V16zm1 0v-1.5c0-1.38-1.12-2.5-2.5-2.5S17 13.12 17 14.5V16c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/>',
		'no_encryption': '<path d="M21 21.78L4.22 5 3 6.22l2.04 2.04C4.42 8.6 4 9.25 4 10v10c0 1.1.9 2 2 2h12c.23 0 .45-.05.66-.12L19.78 23 21 21.78z"/><path d="M8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H9.66L20 18.34V10c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5-2.56 0-4.64 1.93-4.94 4.4L8.9 7.24V6z"/>',
		'ondemand_video': '<path d="M21 17H3V5h18v12zm0-14H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2z"/><path d="M16 11l-7 4V7z"/>',
		'personal_video': '<path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>',
		'phone_bluetooth_speaker': '<path d="M18 7.21l.94.94-.94.94V7.21zm0-4.3l.94.94-.94.94V2.91zM14.71 9.5L17 7.21V11h.5l2.85-2.85L18.21 6l2.15-2.15L17.5 1H17v3.79L14.71 2.5l-.71.71L16.79 6 14 8.79l.71.71z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>',
		'phone_forwarded': '<path d="M18 11l5-5-5-5v3h-4v4h4v3z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>',
		'phone_in_talk': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7z"/><path d="M15 12h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>',
		'phone_locked': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19.2 4h-3.4v-.5c0-.94.76-1.7 1.7-1.7s1.7.76 1.7 1.7V4zm.8 0v-.5C20 2.12 18.88 1 17.5 1S15 2.12 15 3.5V4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1z"/>',
		'phone_missed': '<path d="M6.5 5.5L12 11l7-7-1-1-6 6-4.5-4.5H11V3H5v6h1.5V5.5z"/><path d="M23.71 16.67C20.66 13.78 16.54 12 12 12 7.46 12 3.34 13.78.29 16.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73 1.6 0 3.15.25 4.6.72v3.1c0 .39.23.74.56.9.98.49 1.87 1.12 2.67 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.28-.12-.52-.3-.7z"/>',
		'phone_paused': '<path d="M17 3h-2v7h2V3z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19 3v7h2V3h-2z"/>',
		'power': '<path d="M16.01 7L16 3h-2v4h-4V3H8v4h-.01C7 6.99 6 7.99 6 8.99v5.49L9.5 18v3h5v-3l3.5-3.51v-5.5c0-1-1-2-1.99-1.99z"/>',
		'priority_high': '<circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/>',
		'sd_card': '<path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 6h-2V4h2v4zm3 0h-2V4h2v4zm3 0h-2V4h2v4z"/>',
		'sim_card_alert': '<path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 15h-2v-2h2v2zm0-4h-2V8h2v5z"/>',
		'sms': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>',
		'sms_failed': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>',
		'sync': '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"/><path d="M12 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>',
		'sync_disabled': '<path d="M10 6.35V4.26c-.8.21-1.55.54-2.23.96l1.46 1.46c.25-.12.5-.24.77-.33z"/><path d="M2.86 5.41l2.36 2.36a7.925 7.925 0 0 0 1.14 9.87L4 20h6v-6l-2.24 2.24A6.003 6.003 0 0 1 6 12c0-1 .25-1.94.68-2.77l8.08 8.08c-.25.13-.5.25-.77.34v2.09c.8-.21 1.55-.54 2.23-.96l2.36 2.36 1.27-1.27L4.14 4.14 2.86 5.41z"/><path d="M20 4h-6v6l2.24-2.24A6.003 6.003 0 0 1 18 12c0 1-.25 1.94-.68 2.77l1.46 1.46a7.925 7.925 0 0 0-1.14-9.87L20 4z"/>',
		'sync_problem': '<path d="M3 12c0 2.21.91 4.2 2.36 5.64L3 20h6v-6l-2.24 2.24C5.68 15.15 5 13.66 5 12c0-2.61 1.67-4.83 4-5.65V4.26C5.55 5.15 3 8.27 3 12z"/><path d="M21 4h-6v6l2.24-2.24C18.32 8.85 19 10.34 19 12c0 2.61-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74 0-2.21-.91-4.2-2.36-5.64L21 4z"/><path d="M11 13h2V7h-2v6zm0 4h2v-2h-2v2z"/>',
		'system_update': '<path d="M17 19H7V5h10v14zm0-17.99L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/><path d="M16 13h-3V8h-2v5H8l4 4 4-4z"/>',
		'tap_and_play': '<path d="M2 16v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M2 20v3h3c0-1.66-1.34-3-3-3z"/><path d="M2 12v2a9 9 0 0 1 9 9h2c0-6.08-4.92-11-11-11z"/><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v7.37c.69.16 1.36.37 2 .64V5h10v13h-3.03c.52 1.25.84 2.59.95 4H17c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/>',
		'time_to_leave': '<path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>',
		'vibration': '<path d="M0 15h2V9H0v6z"/><path d="M3 17h2V7H3v10z"/><path d="M22 9v6h2V9h-2z"/><path d="M19 17h2V7h-2v10z"/><path d="M16 19H8V5h8v14zm.5-16h-9C6.67 3 6 3.67 6 4.5v15c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5z"/>',
		'voice_chat': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12l-4-3.2V14H6V6h8v3.2L18 6v8z"/>',
		'vpn_lock': '<path d="M21.2 4h-3.4v-.5c0-.94.76-1.7 1.7-1.7s1.7.76 1.7 1.7V4zm.8 0v-.5a2.5 2.5 0 0 0-5 0V4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1z"/><path d="M10 20.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8 16v1c0 1.1.9 2 2 2v1.93zM18.92 12c.04.33.08.66.08 1 0 2.08-.8 3.97-2.1 5.39-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H7v-2h2c.55 0 1-.45 1-1V8h2c1.1 0 2-.9 2-2V3.46c-.95-.3-1.95-.46-3-.46C5.48 3 1 7.48 1 13s4.48 10 10 10 10-4.48 10-10c0-.34-.02-.67-.05-1h-2.03z"/>',
		'wc': '<path d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4z"/><path d="M18 22v-6h3l-2.54-7.63A2.01 2.01 0 0 0 16.56 7h-.12a2 2 0 0 0-1.9 1.37L12 16h3v6h3z"/><path d="M7.5 6c1.11 0 2-.89 2-2 0-1.11-.89-2-2-2-1.11 0-2 .89-2 2 0 1.11.89 2 2 2z"/><path d="M16.5 6c1.11 0 2-.89 2-2 0-1.11-.89-2-2-2-1.11 0-2 .89-2 2 0 1.11.89 2 2 2z"/>',
		'wifi': '<path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"/><path d="M9 17l3 3 3-3a4.237 4.237 0 0 0-6 0z"/><path d="M5 13l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>',
		//
		// places
		//
		'ac_unit': '<path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>',
		'airport_shuttle': '<path d="M17 5H3c-1.1 0-2 .89-2 2v9h2c0 1.65 1.34 3 3 3s3-1.35 3-3h5.5c0 1.65 1.34 3 3 3s3-1.35 3-3H23v-5l-6-6zM3 11V7h4v4H3zm3 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7-6.5H9V7h4v4zm4.5 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM15 11V7h1l4 4h-5z"/>',
		'all_inclusive': '<path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"/>',
		'beach_access': '<path d="M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21z"/><path d="M17.42 8.83l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88z"/><path d="M5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98z"/><path d="M5.97 5.96l-.01.01c-.38 3.01 1.17 6.88 4.3 10.02l5.73-5.73c-3.13-3.13-7.01-4.68-10.02-4.3z"/>',
		'business_center': '<path d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4z"/><path d="M14 7h-4V5h4v2zm6 0h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>',
		'casino': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z"/>',
		'child_care': '<circle cx="14.5" cy="10.5" r="1.25"/> <circle cx="9.5" cy="10.5" r="1.25"/> <path d="M22.94 12.66c.04-.21.06-.43.06-.66s-.02-.45-.06-.66c-.25-1.51-1.36-2.74-2.81-3.17-.53-1.12-1.28-2.1-2.19-2.91C16.36 3.85 14.28 3 12 3s-4.36.85-5.94 2.26c-.92.81-1.67 1.8-2.19 2.91-1.45.43-2.56 1.65-2.81 3.17-.04.21-.06.43-.06.66s.02.45.06.66c.25 1.51 1.36 2.74 2.81 3.17.52 1.11 1.27 2.09 2.17 2.89C7.62 20.14 9.71 21 12 21s4.38-.86 5.97-2.28c.9-.8 1.65-1.79 2.17-2.89 1.44-.43 2.55-1.65 2.8-3.17zM19 14c-.1 0-.19-.02-.29-.03-.2.67-.49 1.29-.86 1.86C16.6 17.74 14.45 19 12 19s-4.6-1.26-5.85-3.17c-.37-.57-.66-1.19-.86-1.86-.1.01-.19.03-.29.03-1.1 0-2-.9-2-2s.9-2 2-2c.1 0 .19.02.29.03.2-.67.49-1.29.86-1.86C7.4 6.26 9.55 5 12 5s4.6 1.26 5.85 3.17c.37.57.66 1.19.86 1.86.1-.01.19-.03.29-.03 1.1 0 2 .9 2 2s-.9 2-2 2zM7.5 14c.76 1.77 2.49 3 4.5 3s3.74-1.23 4.5-3h-9z"/>',
		'child_friedly': '<path d="M13 2v8h8c0-4.42-3.58-8-8-8z"/><path d="M17 20c-.83 0-1.5-.67-1.5-1.5S16.17 17 17 17s1.5.67 1.5 1.5S17.83 20 17 20zm-9 0c-.83 0-1.5-.67-1.5-1.5S7.17 17 8 17s1.5.67 1.5 1.5S8.83 20 8 20zm11.32-4.11A7.948 7.948 0 0 0 21 11H6.44l-.95-2H2v2h2.22s1.89 4.07 2.12 4.42c-1.1.59-1.84 1.75-1.84 3.08C4.5 20.43 6.07 22 8 22c1.76 0 3.22-1.3 3.46-3h2.08c.24 1.7 1.7 3 3.46 3 1.93 0 3.5-1.57 3.5-3.5 0-1.04-.46-1.97-1.18-2.61z"/>',
		'fitness_center': '<path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>',
		'free_breakfast': '<path d="M20 8h-2V5h2v3zm0-5H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2a2 2 0 0 0 2-2V5c0-1.11-.89-2-2-2z"/><path d="M4 19h16v2H4z"/>',
		'golf_course': '<circle cx="19.5" cy="19.5" r="1.5"/><path d="M17 5.92L9 2v18H7v-1.73c-1.79.35-3 .99-3 1.73 0 1.1 2.69 2 6 2s6-.9 6-2c0-.99-2.16-1.81-5-1.97V8.98l6-3.06z"/>',
		'hot_tub': '<circle cx="7" cy="6" r="2"/><path d="M11.15 12c-.31-.22-.59-.46-.82-.72l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C6.01 9 5 10.01 5 11.25V12H2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8H11.15zM7 20H5v-6h2v6zm4 0H9v-6h2v6zm4 0h-2v-6h2v6zm4 0h-2v-6h2v6zm-.35-14.14l-.07-.07c-.57-.62-.82-1.41-.67-2.2L18 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71zm-4 0l-.07-.07c-.57-.62-.82-1.41-.67-2.2L14 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71z"/>',
		'kitchen': '<path d="M18 9H6V4h12v5zm0 11H6v-9.02h12V20zm0-17.99L6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99z"/><path d="M8 5h2v3H8z"/><path d="M8 12h2v5H8z"/>',
		'pool': '<path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.08.64-2.19.64-1.11 0-1.73-.37-2.18-.64-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zm0-4.5c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36s-.78.13-1.15.36c-.47.27-1.09.64-2.2.64v-2c.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2zM8.67 12c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.12-.07.26-.15.41-.23L10.48 5C8.93 3.45 7.5 2.99 5 3v2.5c1.82-.01 2.89.39 4 1.5l1 1-3.25 3.25c.31.12.56.27.77.39.37.23.59.36 1.15.36z"/> <circle cx="16.5" cy="5.5" r="2.5"/>',
		'room_service': '<path d="M2 17h20v2H2z"/><path d="M13.84 7.79A2.006 2.006 0 0 0 12 5a2.006 2.006 0 0 0-1.84 2.79C6.25 8.6 3.27 11.93 3 16h18c-.27-4.07-3.25-7.4-7.16-8.21z"/>',
		'rv_hookup': '<path d="M18 14h-4v-3h4v3zm-7 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9-3v-6c0-1.1-.9-2-2-2H7V7l-3 3 3 3v-2h4v3H4v3c0 1.1.9 2 2 2h2c0 1.66 1.34 3 3 3s3-1.34 3-3h8v-2h-2z"/><path d="M17 2v2H9v2h8v2l3-3z"/>',
		'smoke_free': '<path d="M2 6l6.99 7H2v3h9.99l7 7 1.26-1.25-17-17z"/><path d="M20.5 13H22v3h-1.5z"/><path d="M18 13h1.5v3H18z"/><path d="M18.85 4.88c.62-.61 1-1.45 1-2.38h-1.5c0 1.02-.83 1.85-1.85 1.85v1.5c2.24 0 4 1.83 4 4.07V12H22V9.92c0-2.23-1.28-4.15-3.15-5.04z"/><path d="M14.5 8.7h1.53c1.05 0 1.97.74 1.97 2.05V12h1.5v-1.59c0-1.8-1.6-3.16-3.47-3.16H14.5c-1.02 0-1.85-.98-1.85-2s.83-1.75 1.85-1.75V2a3.35 3.35 0 0 0 0 6.7z"/><path d="M17 15.93V13h-2.93z"/>',
		'smoke_rooms': '<path d="M2 16h15v3H2z"/><path d="M20.5 16H22v3h-1.5z"/><path d="M18 16h1.5v3H18z"/><path d="M18.85 7.73c.62-.61 1-1.45 1-2.38C19.85 3.5 18.35 2 16.5 2v1.5c1.02 0 1.85.83 1.85 1.85S17.52 7.2 16.5 7.2v1.5c2.24 0 4 1.83 4 4.07V15H22v-2.24c0-2.22-1.28-4.14-3.15-5.03z"/><path d="M16.03 10.2H14.5c-1.02 0-1.85-.98-1.85-2s.83-1.75 1.85-1.75v-1.5a3.35 3.35 0 0 0 0 6.7h1.53c1.05 0 1.97.74 1.97 2.05V15h1.5v-1.64c0-1.81-1.6-3.16-3.47-3.16z"/>',
		'spa': '<path d="M8.55 12c-1.07-.71-2.25-1.27-3.53-1.61 1.28.34 2.46.9 3.53 1.61zm10.43-1.61c-1.29.34-2.49.91-3.57 1.64 1.08-.73 2.28-1.3 3.57-1.64z"/> <path d="M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63zm-6.5 2.65c-.14-.1-.3-.19-.45-.29.15.11.31.19.45.29zm6.42-.25c-.13.09-.27.16-.4.26.13-.1.27-.17.4-.26zM12 15.45C9.85 12.17 6.18 10 2 10c0 5.32 3.36 9.82 8.03 11.49.63.23 1.29.4 1.97.51.68-.12 1.33-.29 1.97-.51C18.64 19.82 22 15.32 22 10c-4.18 0-7.85 2.17-10 5.45z"/>',
		//
		// social
		//
		'cake': '<path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2z"/><path d="M16.6 15.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01z"/><path d="M18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"/>',
		'domain': '<path d="M20 19h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zM10 7H8V5h2v2zm0 4H8V9h2v2zm0 4H8v-2h2v2zm0 4H8v-2h2v2zM6 7H4V5h2v2zm0 4H4V9h2v2zm0 4H4v-2h2v2zm0 4H4v-2h2v2zm6-12V3H2v18h20V7H12z"/><path d="M18 11h-2v2h2v-2z"/><path d="M18 15h-2v2h2v-2z"/>',
		'group': '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/><path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/><path d="M8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/><path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
		'group_add': '<path d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2z"/><path d="M18 11c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86 0 1.07-.34 2.04-.9 2.86.28.09.59.14.91.14z"/><path d="M13 11c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/><path d="M19.62 13.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84z"/><path d="M13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"/>',
		'location_city': '<path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>',
		'mood': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'mood_bad': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>',
		'notifications': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M18 16v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
		'notifications_none': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M16 17H7v-6.5C7 8.01 9.01 6 11.5 6S16 8.01 16 10.5V17zm2-1v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
		'notifications_off': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M18 10.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-.51.12-.99.32-1.45.56L18 14.18V10.5z"/><path d="M17.73 19l2 2L21 19.73 4.27 3 3 4.27l2.92 2.92C5.34 8.16 5 9.29 5 10.5V16l-2 2v1h14.73z"/>',
		'notifications_active': '<path d="M6.58 3.58L5.15 2.15C2.76 3.97 1.18 6.8 1.03 10h2c.15-2.65 1.51-4.97 3.55-6.42z"/><path d="M19.97 10h2c-.15-3.2-1.73-6.03-4.13-7.85l-1.43 1.43c2.05 1.45 3.41 3.77 3.56 6.42z"/><path d="M18 10.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2v-5.5z"/><path d="M11.5 22c.14 0 .27-.01.4-.04.65-.13 1.19-.58 1.44-1.18.1-.24.16-.5.16-.78h-4c0 1.1.9 2 2 2z"/>',
		'notifications_paused': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M14 9.8l-2.8 3.4H14V15H9v-1.8l2.8-3.4H9V8h5v1.8zm4 6.2v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
		'pages': '<path d="M3 5v6h5L7 7l4 1V3H5c-1.1 0-2 .9-2 2z"/><path d="M8 13H3v6c0 1.1.9 2 2 2h6v-5l-4 1 1-4z"/><path d="M17 17l-4-1v5h6c1.1 0 2-.9 2-2v-6h-5l1 4z"/><path d="M19 3h-6v5l4-1-1 4h5V5c0-1.1-.9-2-2-2z"/>',
		'party_mode': '<path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 3c1.63 0 3.06.79 3.98 2H12c-1.66 0-3 1.34-3 3 0 .35.07.69.18 1H7.1c-.06-.32-.1-.66-.1-1 0-2.76 2.24-5 5-5zm0 10c-1.63 0-3.06-.79-3.98-2H12c1.66 0 3-1.34 3-3 0-.35-.07-.69-.18-1h2.08c.07.32.1.66.1 1 0 2.76-2.24 5-5 5z"/>',
		'people': '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/><path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/><path d="M8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/><path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
		'people_outline': '<path d="M21.5 17.5H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zm-9 0h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm4-4.5c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25z"/><path d="M7.5 6.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 5.5c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12z"/><path d="M16.5 6.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5z"/>',
		'person': '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
		'person_add': '<path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6 10V7H4v3H1v2h3v3h2v-3h3v-2H6z"/><path d="M15 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
		'person_outline': '<path d="M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.9c1.16 0 2.1.94 2.1 2.1 0 1.16-.94 2.1-2.1 2.1-1.16 0-2.1-.94-2.1-2.1 0-1.16.94-2.1 2.1-2.1"/><path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm0 1.9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1"/>',
		'plus_one': '<path d="M10 8H8v4H4v2h4v4h2v-4h4v-2h-4z"/><path d="M14.5 6.08V7.9l2.5-.5V18h2V5z"/>',
		'poll': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
		'public': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
		'school': '<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>',
		'sentiment_dissatisfied': '<circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"/>',
		'sentiment_neutral': '<path d="M9 14h6v1.5H9z"/><circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>',
		'sentiment_satisfied': '<circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-4c-1.48 0-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5s4.32-1.45 5.12-3.5h-1.67c-.7 1.19-1.97 2-3.45 2z"/>',
		'sentiment_very_dissatisfied': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.47 2 12s4.47 10 9.99 10C17.51 22 22 17.53 22 12S17.52 2 11.99 2z"/><path d="M16.18 7.76l-1.06 1.06-1.06-1.06L13 8.82l1.06 1.06L13 10.94 14.06 12l1.06-1.06L16.18 12l1.06-1.06-1.06-1.06 1.06-1.06z"/><path d="M7.82 12l1.06-1.06L9.94 12 11 10.94 9.94 9.88 11 8.82 9.94 7.76 8.88 8.82 7.82 7.76 6.76 8.82l1.06 1.06-1.06 1.06z"/><path d="M12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>',
		'sentiment_very_satisfied': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.47 2 12s4.47 10 9.99 10C17.51 22 22 17.53 22 12S17.52 2 11.99 2z"/><path d="M13 9.94L14.06 11l1.06-1.06L16.18 11l1.06-1.06-2.12-2.12z"/><path d="M8.88 9.94L9.94 11 11 9.94 8.88 7.82 6.76 9.94 7.82 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'share': '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>',
		'whatshot': '<path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>',
		//
		// toggle
		//
		'check_box': '<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
		'check_box_outline_blank': '<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'indeterminate_check_box': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/>',
		'radio_button_unchecked': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>',
		'radio_button_checked': '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/><path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'star': '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
		'star_half': '<path d="M22 9.74l-7.19-.62L12 2.5 9.19 9.13 2 9.74l5.46 4.73-1.64 7.03L12 17.77l6.18 3.73-1.63-7.03L22 9.74zM12 15.9V6.6l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.9z"/>',
		'star_border': '<path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>'
	})

	/*
	 * custom icons
	 */
	.addShapes({
		// Add single icon
		'standby': '<path d="M13 3.5h-2v10h2v-10z"/><path d="M16.56 5.94l-1.45 1.45C16.84 8.44 18 10.33 18 12.5c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.94C5.36 7.38 4 9.78 4 12.5c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56z"/>',
		'custom-delete': $mbIconProvider.getShape('delete'),
		'vertical': $mbIconProvider.getShape('view_sequential'),

		'corner_bottom_left': '<path d="M 5,5 H 3 V 3 H 5 Z M 5,7 H 3 v 2 h 2 z m 16,4 h -2 v 2 h 2 z m 0,-4 h -2 v 2 h 2 z m 0,8 h -2 v 2 h 2 z m 0,4 h -2 v 2 h 2 z m -4,0 h -2 v 2 h 2 z M 9,3 H 7 v 2 h 2 z m 4,0 h -2 v 2 h 2 z M 9,3 H 7 v 2 h 2 z m 8,0 h -2 v 2 h 2 z m 4,0 h -2 v 2 h 2 z M 3,16 c 0,2.76 2.24,5 5,5 h 5 V 19 H 8 C 6.35,19 5,17.65 5,16 V 11 H 3 Z" />',
		'corner_bottom_right': '<path d="m 5,19 v 2 H 3 v -2 z m 2,0 v 2 h 2 v -2 z m 4,-16 0,2 2,0 0,-2 z M 7,3 V 5 L 9,5 9,3 Z m 8,0 0,2 2,0 V 3 Z m 4,0 v 2 h 2 V 3 Z m 0,4 v 2 l 2,0 V 7 Z M 3,15 v 2 h 2 v -2 z m 0,-4 v 2 h 2 v -2 z m 0,4 v 2 H 5 V 15 Z M 3,7 V 9 H 5 V 7 Z M 3,3 V 5 H 5 V 3 Z m 13,18 c 2.76,0 5,-2.24 5,-5 v -5 l -2,0 0,5 c 0,1.65 -1.35,3 -3,3 l -5,0 v 2 z" />',
		'corner_top_left': '<path d="M 19,5 V 3 h 2 V 5 Z M 17,5 V 3 h -2 v 2 z m -4,16 v -2 h -2 v 2 z m 4,0 v -2 h -2 v 2 z M 9,21 V 19 H 7 v 2 z M 5,21 V 19 H 3 l 0,2 z M 5,17 5,15 H 3 v 2 z M 21,9 V 7 h -2 v 2 z m 0,4 v -2 h -2 v 2 z M 21,9 V 7 h -2 v 2 z m 0,8 v -2 h -2 v 2 z m 0,4 v -2 h -2 v 2 z M 8,3 C 5.24,3 3,5.24 3,8 v 5 H 5 V 8 C 5,6.35 6.35,5 8,5 h 5 V 3 Z" />',
		'corner_top_right': '<path d="m 19,19 h 2 v 2 h -2 z m 0,-2 h 2 V 15 H 19 Z M 3,13 H 5 V 11 H 3 Z m 0,4 H 5 V 15 H 3 Z M 3,9 H 5 V 7 H 3 Z M 3,5 H 5 V 3 H 3 Z M 7,5 H 9 V 3 H 7 Z m 8,16 h 2 v -2 h -2 z m -4,0 h 2 v -2 h -2 z m 4,0 h 2 V 19 H 15 Z M 7,21 H 9 V 19 H 7 Z M 3,21 H 5 V 19 H 3 Z M 21,8 C 21,5.24 18.76,3 16,3 h -5 v 2 h 5 c 1.65,0 3,1.35 3,3 v 5 h 2 z" />',
		'full_rounded': $mbIconProvider.getShape('crop_free'),

		'align_justify_vertical': '<path d="M 21,21 V 3 h -2 v 18 z m -4,0 V 3 h -2 l 0,18 z m -4,0 0,-18 h -2 l 0,18 z M 9,21 9,3 H 7 L 7,21 Z M 3,21 H 5 L 5,3 H 3 Z" />',
		'align_center_vertical': '<path d="m 15,17 h 2 V 7 h -2 z m 6,4 V 3 h -2 v 18 z m -8,0 0,-18 h -2 l 0,18 z M 7,17 H 9 L 9,7 H 7 Z M 3,21 H 5 L 5,3 H 3 Z" />',
		'align_end_vertical': '<path d="m 15,9 0,12 h 2 V 9 Z M 7,9 7,21 H 9 L 9,9 Z m 6,12 0,-18 h -2 l 0,18 z m 8,0 V 3 H 19 V 21 Z M 3,21 H 5 L 5,3 H 3 Z" />',
		'align_start_vertical': '<path d="M 21,21 V 3 H 19 V 21 Z M 17,15 V 3 h -2 l 0,12 z m -4,6 0,-18 h -2 l 0,18 z M 9,15 9,3 H 7 V 15 Z M 3,21 H 5 L 5,3 H 3 Z" />',

		'sort_space_between_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 1.5373337,1.999831 c -0.4320491,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.3436967 c 0,0.428253 0.3534947,0.778642 0.7855438,0.778642 H 8.465053 c 0.4320489,0 0.7855436,-0.350389 0.7855436,-0.778642 V 7.3281513 c 0,-0.4282528 -0.3534947,-0.7786414 -0.7855436,-0.7786414 z m 9.4265256,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356632 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z" />',
		'sort_space_around_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007773 3,4.5572829 V 19.442717 C 3,20.299223 3.7069894,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572829 C 21,3.7007773 20.293011,3 19.428912,3 Z m 0,1.549679 H 19.428912 V 19.451842 H 4.5710877 Z m 2.6757586,1.9602906 c -0.4320491,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.343697 c 0,0.428253 0.3534947,0.778642 0.7855438,0.778642 h 2.3566315 c 0.4320492,0 0.7855442,-0.350389 0.7855442,-0.778642 V 7.288611 c 0,-0.4282528 -0.353495,-0.7786414 -0.7855442,-0.7786414 z m 7.0698947,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.343697 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356631 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.288611 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z" />',
		'sort_center_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 3.7344017,1.999831 c -0.4320492,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.3436967 c 0,0.428253 0.3534946,0.778642 0.7855438,0.778642 h 2.3566316 c 0.432049,0 0.785543,-0.350389 0.785543,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353494,-0.7786414 -0.785543,-0.7786414 z m 5.4988066,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356631 c 0.43205,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353494,-0.7786414 -0.785544,-0.7786414 z" />',
		'sort_start_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 1.5373337,1.999831 c -0.4320491,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.3436967 c 0,0.428253 0.3534947,0.778642 0.7855438,0.778642 H 8.465053 c 0.4320489,0 0.7855436,-0.350389 0.7855436,-0.778642 V 7.3281513 c 0,-0.4282528 -0.3534947,-0.7786414 -0.7855436,-0.7786414 z m 5.4988066,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356632 c 0.432049,0 0.785543,-0.350389 0.785543,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353494,-0.7786414 -0.785543,-0.7786414 z" />',
		'sort_end_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 5.4650523,1.999831 c -0.4320487,0 -0.7855434,0.3503886 -0.7855434,0.7786414 v 9.3436967 c 0,0.428253 0.3534947,0.778642 0.7855434,0.778642 h 2.356632 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z m 5.498807,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356632 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z" />',

		'sort_space_between_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-1.537333 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 h 9.3436967 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-9.426526 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 6.108421 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 H 7.3281513 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z" />',
		'sort_space_around_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007773,21 4.5572829,21 H 19.442717 C 20.299223,21 21,20.293011 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572829 C 3.7007773,3 3,3.706989 3,4.571088 Z m 1.549679,0 0,-14.857824 h 14.902163 v 14.857824 z m 1.9602906,-2.675758 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 h 9.343697 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.343697,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-7.069895 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.343697,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 7.326628 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 H 7.288611 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z" />',
		'sort_center_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-3.734401 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 h 9.3436967 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785543 -0.778642,-0.785543 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353494 -0.7786414,0.785543 z m 0,-5.498807 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 7.839073 c 0,-0.43205 -0.350389,-0.785544 -0.778642,-0.785544 H 7.3281513 c -0.4282528,0 -0.7786414,0.353494 -0.7786414,0.785544 z" />',
		'sort_start_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-5.465052 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 l 9.3436967,0 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-5.498807 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 6.108421 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 H 7.3281513 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z" />',
		'sort_end_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-1.537333 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 h 9.3436967 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-5.498807 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 10.03614 c 0,-0.432049 -0.350389,-0.785543 -0.778642,-0.785543 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353494 -0.7786414,0.785543 z" />',
		'download': '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" id="Capa_1" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24" xml:space="preserve" sodipodi:docname="download11111.svg" inkscape:version="0.92.3(2405546, 2018-03-11)"><metadata id="metadata44"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id="defs42" /><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1366" inkscape:window-height="706" id="namedview40" showgrid="false" inkscape:zoom="6.1592508" inkscape:cx="-15.061405" inkscape:cy="1.1743357" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="Capa_1" /><g id="g135" transform="matrix(0.06722689,0,0,0.05536332,-2.5714288,-4.45e-6)"><g id="g78"><g id="file-download"><path id="path75" d="m 395.25,153 h -102 V 0 h -153 v 153 h -102 l 178.5,178.5 z m -357,229.5 v 51 h 357 v -51 z" inkscape:connector-curvature="0" /></g></g></g></svg>',
		'upload': '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" id="Capa_1" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24" xml:space="preserve" sodipodi:docname="upload-button.svg" inkscape:version="0.92.3 (2405546, 2018-03-11)"><metadata id="metadata44"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title /></cc:Work></rdf:RDF></metadata><defs id="defs42" /><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10"  guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1366" inkscape:window-height="706" id="namedview40" showgrid="false" inkscape:zoom="2.177624" inkscape:cx="-53.237791" inkscape:cy="29.341367" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="Capa_1" /><g id="g73" transform="matrix(0.06722689,0,0,0.05536332,-2.5714288,-4.45e-6)"><g id="g15"><g   id="file-upload-8"><polygon id="polygon10" points="140.25,178.5 140.25,331.5 293.25,331.5 293.25,178.5 395.25,178.5 216.75,0 38.25,178.5 " /><rect id="rect12" height="51" width="357" y="382.5" x="38.25" /></g></g></g></svg>',

		'wb-opacity': '<path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26L6.76,4.84Z" />',
		'wb-vertical-boxes': '<path d="M4,21V3H8V21H4M10,21V3H14V21H10M16,21V3H20V21H16Z" />',
		'wb-horizontal-boxes': '<path d="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z" />',
		'wb-horizontal-arrows': '<path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />',
		'wb-vertical-arrows': '<path d="M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z" />',
		'wb-direction':'<path d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z" />',

		'list_tree': '<path d="m 3.0063556,9.3749998 2.3368645,-1.125 -2.3432204,-1.25 z M 11,13 H 21 V 11 H 11 Z m 0,4 H 21 V 15 H 11 Z M 6.9999997,6.9999998 v 2 H 21 v -2 z" />',

		'wb-object-video': $mbIconProvider.getShape('video_library'),
		'wb-object-audio':  $mbIconProvider.getShape('audiotrack'),
		'wb-object-data': $mbIconProvider.getShape('storage'),

		'wb-widget-group': $mbIconProvider.getShape('pages'),
		'wb-widget-html': $mbIconProvider.getShape('settings_ethernet'),
		'wb-widget-input': $mbIconProvider.getShape('settings_ethernet'),
		'wb-widget-textarea': $mbIconProvider.getShape('settings_ethernet'),
		'wb-widget-iframe': $mbIconProvider.getShape('settings_ethernet'),

		'wb-setting-iframe': $mbIconProvider.getShape('settings_ethernet'),
		'wb-setting-input': $mbIconProvider.getShape('settings_ethernet'),
		'wb-setting-textarea': $mbIconProvider.getShape('settings_ethernet'),
		/*
		 * Wifi
		 */
		'signal_wifi_0_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>',
		'signal_wifi_1_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"/>',
		'signal_wifi_2_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"/>',
		'signal_wifi_3_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>',
		'signal_cellular_connected_no_internet_0_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M20 22h2v-2h-2v2zm0-12v8h2v-8h-2z"/>',
		'signal_cellular_connected_no_internet_1_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M20 10v8h2v-8h-2zm-8 12V12L2 22h10zm8 0h2v-2h-2v2z"/>',
		'signal_cellular_connected_no_internet_2_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M14 22V10L2 22h12zm6-12v8h2v-8h-2zm0 12h2v-2h-2v2z"/>',
		'signal_cellular_connected_no_internet_3_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M17 22V7L2 22h15zm3-12v8h2v-8h-2zm0 12h2v-2h-2v2z"/>',
		'signal_cellular_0_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/>',
		'signal_cellular_1_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M12 12L2 22h10z"/>',
		'signal_cellular_2_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M14 10L2 22h12z"/>',
		'signal_cellular_3_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M17 7L2 22h15z"/>',
		'now_wallpaper': '<path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4z"/><path d="M10 13l-4 5h12l-3-4-2.03 2.71L10 13z"/><path d="M17 8.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5z"/><path d="M20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2z"/><path d="M20 20h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/>',
		'now_widgets': '<path d="M13 13v8h8v-8h-8z"/><path d="M3 21h8v-8H3v8z"/><path d="M3 3v8h8V3H3z"/><path d="M16.66 1.69L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"/>',
		'battery_20': '<path d="M7 17v3.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V17H7z"/><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V17h10V5.33z"/>',
		'battery_30': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V15h10V5.33z"/><path d="M7 15v5.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V15H7z"/>',
		'battery_50': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V13h10V5.33z"/><path d="M7 13v7.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V13H7z"/>',
		'battery_60': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V11h10V5.33z"/><path d="M7 11v9.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V11H7z"/>',
		'battery_80': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h10V5.33z"/><path d="M7 9v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9H7z"/>',
		'battery_90': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V8h10V5.33z"/><path d="M7 8v12.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V8H7z"/>',
		'battery_alert': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/>',
		'battery_charging_20': '<path d="M11 20v-3H7v3.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V17h-4.4L11 20z"/><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V17h4v-2.5H9L13 7v5.5h2L12.6 17H17V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_charging_30': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v9.17h2L13 7v5.5h2l-1.07 2H17V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M11 20v-5.5H7v6.17C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V14.5h-3.07L11 20z"/>',
		'battery_charging_50': '<path d="M14.47 13.5L11 20v-5.5H9l.53-1H7v7.17C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V13.5h-2.53z"/><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v8.17h2.53L13 7v5.5h2l-.53 1H17V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_charging_60': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V11h3.87L13 7v4h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9l1.87-3.5H7v9.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V11h-4v1.5z"/>',
		'battery_charging_80': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h4.93L13 7v2h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9L11.93 9H7v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9h-4v3.5z"/>',
		'battery_charging_90': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V8h5.47L13 7v1h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9L12.47 8H7v12.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V8h-4v4.5z"/>',
		'account_child': '<circle cx="12" cy="13.49" r="1.5"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2.5c1.24 0 2.25 1.01 2.25 2.25S13.24 9 12 9 9.75 7.99 9.75 6.75 10.76 4.5 12 4.5zm5 10.56v2.5c-.45.41-.96.77-1.5 1.05v-.68c0-.34-.17-.65-.46-.92-.65-.62-1.89-1.02-3.04-1.02-.96 0-1.96.28-2.65.73l-.17.12-.21.17c.78.47 1.63.72 2.54.82l1.33.15c.37.04.66.36.66.75 0 .29-.16.53-.4.66-.28.15-.64.09-.95.09-.35 0-.69-.01-1.03-.05-.5-.06-.99-.17-1.46-.33-.49-.16-.97-.38-1.42-.64-.22-.13-.44-.27-.65-.43l-.31-.24c-.04-.02-.28-.18-.28-.23v-4.28c0-1.58 2.63-2.78 5-2.78s5 1.2 5 2.78v1.78z"/>',
	});


});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Directive
@name mb-sidenav
@description Defines a place to add sidenaves



 */
angular.module('mblowfish-core').directive('mbSidenavs', function($mbSidenav) {
	return {
		restrict: 'AE',
		replace: false,
		link: function($scope, $element) {
			$mbSidenav.setRootElement($element);
		}
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbSidenav
@description An action item

 */
angular.module('mblowfish-core').factory('MbSidenav', function(MbContainer, $mdSidenav) {

	function MbSidenav(config) {
		MbContainer.call(this, config);
		return this;
	};
	// Circle derives from Shape
	MbSidenav.prototype = Object.create(MbContainer.prototype);

	MbSidenav.prototype.render = function(locals) {
		locals.$sidnav = this;
		return MbContainer.prototype.render.call(this, locals);
	};

	MbSidenav.prototype.toggle = function() {
		$mdSidenav(this.url)
			.toggle();
		return this;
	};

	return MbSidenav;
});

/*
 * angular-material-icons v0.7.1
 * (c) 2014 Klar Systems
 * License: MIT
 */

/**
 * @ngdoc Services
 * @name $mbSidenav
 * @description Manage sidenaves and drowver
 * 
 */
angular.module('mblowfish-core').provider('$mbSidenav', function() {
	var Sidenav;

	var provider;
	var service;

	var configs = {};
	var sidenavConfigs = {};
	var sidenavs = {};
	var rootElement = undefined;

	function addSidenavConfig(sidenavId, config) {
		sidenavConfigs[sidenavId] = config;
		return provider;
	}

	function renderAllSidenavs() {
		if (_.isUndefined(rootElement)) {
			return;
		}
		_.forEach(sidenavs, function(sidenav, id) {
			if (!sidenav.isVisible()) {
				// XXX: maso, 2020: 
				// support left, right
				var element = angular.element('<md-sidenav class="md-sidenav-left" ' +
					' md-component-id="' + id + '"' +
					'md-is-locked-open="' + sidenav.locked + '"' +
					'md-whiteframe="4"></md-sidenav>');
				// rootElement.append(element);
				rootElement.prepend(element);
				sidenav.render({
					$element: element,
				});
			}
		});
	}

	function loadSidenavs() {
		_.forEach(sidenavConfigs, function(config, id) {
			config.url = id;
			var sidenav = new Sidenav(config);
			addSidenav(id, sidenav);
		});
	}

	function addSidenav(sidenavId, sidenav) {
		sidenavs[sidenavId] = sidenav;
		renderAllSidenavs();
		return service;
	}

	function getSidenav(sidenavId) {
		return sidenavs[sidenavId];
	}

	function removeSidenav(sidenavId) {
		var sidenav = sidenavs[sidenavId];
		if (sidenav) {
			sidenav.destroy();
		}
		delete sidenavs[sidenavId];
		return service;
	}

	provider = {
		$get: function($mdSidenav, MbSidenav) {
			mdSidenav = $mdSidenav;
			Sidenav = MbSidenav;

			loadSidenavs();

			this.addSidenav = addSidenav;
			this.getSidenav = getSidenav;
			this.removeSidenav = removeSidenav;
			this.setRootElement = function(element) {
				rootElement = element;
				renderAllSidenavs();
			};

			return this;
		},
		init: function(sidenavProvider) {
			configs = sidenavProvider;
			_.forEach(configs.items || {}, function(config, url) {
				addSidenavConfig(url, config);
			});
		},
		addSidenav: addSidenavConfig
	};
	return provider;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbAction
@description An action item

Action is a named function which can be executed with its command id and parameters
from every where.

In the other word, MbAction divides defineition and usage of a function in a complex
system.


@tutorial core-action-callById
 */
angular.module('mblowfish-core').factory('MbAction', function($injector, $location, MbComponent) {

	/* @ngInject */
	var defaultActionController = function($element, $action) {
		$element.on('click', function($event) {
			$action.exec($event);
		});
	};


	function Action(data) {
		data = data || {};
		data.isAction = true;
		data.id = data.id || Math.random();
		MbComponent.call(this, data)
		this.controller = defaultActionController;
		this.visible = this.visible || function() {
			return true;
		};
		return this;
	};
	// Circle derives from Shape
	Action.prototype = Object.create(MbComponent.prototype);

	Action.prototype.exec = function($event) {
		if (this.alias) {
			var actionId = this.actionId || this.id;
			var $actions = $injector.get('$actions');
			return $actions.exec(actionId, $event);
		}
		if (this.action) {
			return $injector.invoke(this.action, this, {
				$event: $event
			});
		}
		if (this.url) {
			return $location.url(this.url);
		}
		// TODO: maso, 2020: log to show the error
		// $window.alert('Action \'' + this.id + '\' is not executable!?')
	};

	Action.prototype.render = function(locals) {
		// find parent type
		var parent;
		var parentType;
		if (locals.$toolbar) {
			parentType = 'toolbar';
			parent = locals.$toolbar;
		} else if (locals.$menu) {
			parentType = 'menu';
			parent = locals.$menu;
		}

		var html;

		switch (parentType) {
			case 'toolbar':
				html = '<mb-icon size="16">' + (this.icon || 'close') + '</mb-icon>';
				break;
			case 'menu':
				// XXX
				break;
			default:
			// TODO: maso, 2020 log error
		}

		var element = locals.$element;
		element.html(html);
		element.addClass('mbAction')

		locals.$action = this;
		return MbComponent.prototype.render.call(this, locals);
	};

	return Action;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbActionGroup
@description A collection of actions

This is used to group actions, which usefull in UI.

 */
angular.module('mblowfish-core').factory('MbActionGroup', function($injector, $navigator, $window) {

	function ActionGroup(data) {
		data = data || {};
		angular.extend(this, data, {
			actions: [],
			isActionGroup: true
		});
		return this;
	};

	ActionGroup.prototype.add = function(action) {
	};


	ActionGroup.prototype.has = function(action) {
	};

	ActionGroup.prototype.remove = function(action) {
	};

	ActionGroup.prototype.clear = function(action) {
	};
	
	return ActionGroup;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
@ngdoc Services
@name $mbActions
@description Manage application actions

Controllers and views can access actions which is registered by an
applications. This service is responsible to manage global actions.

Note: if an action added at the configuration then there is no event.

 */
angular.module('mblowfish-core').provider('$mbActions', function() {


	/*
	All required services to do actions
	*/
	var dispatcher;
	var Action;

	/*
	All storage and variables
	*/
	var configs = {
		items: {}
	};
	var actions = {};
	var groups = {};

	function addAction(commandId, action) {
		if (!(action instanceof Action)) {
			action = new Action(action);
		}
		actions[commandId] = action;
		action.id = commandId;
		return service;
	}

	function removeAction(commandId, action) {
		delete actions[commandId];
		return service;
	}

	function getAction(commandId) {
		return actions[commandId];
	}

	function getActions() {
		return actions;
	};

	function addGroup(groupId, groupConfigs) { }
	function removeGroup(groupId) { }
	function getGroup(groupId) { }
	function getGroups() { }


	function exec(actionId, $event) {
		$event = $event || {
			stopPropagation: function() { },
			preventDefault: function() { },
		}; // TODO: amso, 2020: crate an action event
		var action = this.getAction(actionId);
		if (!action) {
			// TODO: maso, 2020: add an alert system to manage all errors and notifications
			$window.alert('Action \'' + actionId + '\' not found!');
			return;
		}
		// TODO: maso, 2020: run action inside the actions service
		return action.exec($event);
	};

	function loadActions() {
		// Load actions
		var items = configs.items || {};
		_.forEach(items, function(config, id) {
			var action = new Action(config);
			addAction(id, action);
		});
	}


	/* @ngInject */
	var service = function(
        /* angularjs */ $window,
        /* mb        */ $mbDispatcher, MbAction) {
		dispatcher = $mbDispatcher;
		window = $window;
		Action = MbAction;

		loadActions();

		this.addAction = addAction;
		this.removeAction = removeAction;
		this.getAction = getAction;
		this.getActions = getActions;
		this.exec = exec;

		this.addGroup = addGroup;
		this.removeGroup = removeGroup;
		this.getGroup = getGroup;
		this.getGroups = getGroups;

		// Legacy
		newAction = addAction;


		return this;
	};

	var provider = {
		$get: service,
		init: function(actionsConfig) {
			if (configs) {
				// TODO: 2020: merge actions
			}
			configs = actionsConfig;
			return provider;
		},
		addAction: function(actionId, actionConfig) {
			configs.items[actionId] = actionConfig;
			return provider;
		}
	};
	return provider;

});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbComponent
@description A basic UI Component wich is used to build views, editor, tooblars and others.
@public
@type {Object}

@property {string}  id           - The identitifier of the component. Must be unique in a list
@property {string}  url          - An alias fo the id
@property {boolean} isEditor     - A falg used for editors (special types of ui Components)
@property {boolean} isView       - A flag used for views (special types of UI components)
@property {boolean} isToolbar    - Is a toolbar
@property {boolean} isMenu       - Is a menu
@property {boolean} isComponent  - This is a basic UI component and must be used inside other components
@property {string}  title        - Title of the UI component
@property {string}  description  - A brife description of the UI component.
@property {string}  icon         - An Icon to display for the component
@property {string}  template     - A HTML text used as a UI for the component
@property {string}  templateUrl  - A URL of HTML resources to use as UI of the component
@property {string}  controller   - Name of a controller to used with UI
@property {string}  controllerAs - Alias of the controller in the UI
@property {number}  priority     - the priority of the component in the component list for example in toolbar

UI component is the basic of the whoule view. All part wil be registerd as a UI component such as a menu, toolbar,
view, or an editor.


@tutorial ui-component-action
 */
angular.module('mblowfish-core').factory('MbComponent', function(
	/* Angularjs */ $rootScope, $compile, $controller, $q, $mbTheming,
	/* Mblowfish */ $mbUiUtil) {

	/*
	Create new instance of a UI component. It may used as view, editor
	or other part of UI.
	
	@memberof MbComponent
	@constructor
	@param {object} configs - A configuration set to crate a new instance
	*/
	function MbComponent(configs) {
		_.assign(this, {
			// global attributes
			id: undefined,
			isEditor: false,
			isView: false,
			isToolbar: false,
			isMenu: false,
			isComponent: true,
			title: undefined,
			description: undefined,
			template: undefined,
			templateUrl: undefined,
			controller: undefined,
			controllerAs: undefined,
			priority: 0,
		}, configs);

		// $element, $controller, $scope pairs
		this.$binds = [];
		return this;
	};

	/**
	Gets template of the component
	
	Template is a HTML text which is used to build a view of the component.
	
	@returns {promisse} To resolve the template value
	@memberof MbComponent
	 */
	MbComponent.prototype.getTemplate = function() {
		return $q.when(this.template || $mbUiUtil.getTemplateFor(this));
	}


	/**
	Checks if the component is visible anywhare
	
	A component is visible if there is a paire of MVC item. For example an action is visible if
	it is created and append to the view by MVC elements.
	
	@returns {boolean} True if the component is visible.
	@memberof MbComponent
	 */
	MbComponent.prototype.isVisible = function() {
		return this.$binds.length > 0;
	}


	/**
	
	@memberof MbComponent
	 */
	MbComponent.prototype.render = function(locals) {
		var cmp = this;
		this.visible = true;
		return $q.when(this.getTemplate(), function(template) {
			var rootScope = cmp.rootScope || $rootScope;
			var $scope = rootScope.$new(false);
			var $element = locals.$element;
			var $ctrl;
			var controllerDef;

			$element.html(template);
			$mbTheming($element);
			var link = $compile($element);
			locals.$scope = $scope;
			if ((controllerDef = cmp.controller)) {
				$ctrl = $controller(controllerDef, locals);
				if ((cmp.controllerAs)) {
					$scope[cmp.controllerAs] = $ctrl;
				}
				$element.data('$ngControllerController', $ctrl);
			}
			$scope[cmp.resolveAs || '$resolve'] = locals;
			link($scope);
			cmp.$binds.push({
				$controller: $ctrl,
				$element: $element,
				$scope: $scope
			});
		});
	}


	/**
	Destroy all visible parts and free all resources
	
	@memberof MbComponent
	 */
	MbComponent.prototype.destroy = function() {
		var $bind = this.$binds;
		this.$binds = [];
		_.forEach($bind, function(pair) {
			if (pair.$scope) {
				pair.$scope.$destroy();
				pair.$scope = undefined;
			}
			if (pair.$element) {
				pair.$element.remove();
				pair.$element = undefined;
			}
			pair.$controller = undefined;
		})
	};

	return MbComponent;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Serivces
@name $mbComponent
@description Manages list of all global component to share with containers 


 */
angular.module('mblowfish-core').provider('$mbComponent', function() {

	var Component;

	var configs = {};
	var components = {};

	function add(componentId, component) {
		components[componentId] = component;
	}

	function get(componentId) {
		return components[componentId];
	}

	function remove(componentId) {
		delete components[componentId];
	}

	function loadItems() {
		var items = configs.items || {};
		_.forEach(items, function(config, componentId) {
			var component = new Component(item);
			add(componentId, component);
		});
	}

	return {
		/* @ngInject */
		$get: function(MbComponent) {
			Component = MbComponent;

			loadItems();

			this.add = add;
			this.remove = remove;
			this.get = get;

			return this;
		},
		init: function(moduleConfigs) {
			configs = moduleConfigs;
		}
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbContainer
@description A basic UI Component wich is used to build views, editor, and tooblars.
@public
@type {Object}

It 

@property {string}  url          - An alias fo the id
@property {boolean} isEditor     - A falg used for editors (special types of ui Components)
@property {boolean} isView       - A flag used for views (special types of UI components)
@property {boolean} isToolbar    - Is a toolbar
@property {boolean} isMenu       - Is a menu
@property {string}  title        - Title of the UI component
@property {string}  description  - A brife description of the UI component.
@property {string}  icon         - An Icon to display for the component
@property {string}  template     - A HTML text used as a UI for the component
@property {string}  templateUrl  - A URL of HTML resources to use as UI of the component
@property {string}  controller   - Name of a controller to used with UI
@property {string}  controllerAs - Alias of the controller in the UI


UI component is the basic of the whoule view. All part wil be registerd as a UI component such as a menu, toolbar,
view, or an editor.


 */
mblowfish.factory('MbContainer', function(
	/* Angularjs */ $rootScope, $compile, $controller, $q,
	/* Mblowfish */ $mbUiUtil, MbUiHandler, $mbTheming) {

	/*
	Create new instance of a UI component. It may used as view, editor
	or other part of UI.
	
	@memberof MbContainer
	@constructor
	@param {object} configs - A configuration set to crate a new instance
	*/
	function MbContainer(configs) {
		_.assignIn(this, {
			// global attributes
			url: undefined,
			isEditor: false,
			isView: false,
			isToolbar: false,
			isMenu: false,
			isComponent: true,
			title: undefined,
			description: undefined,
			template: undefined,
			templateUrl: undefined,
			controller: undefined,
			controllerAs: undefined,
			priority: 0,
		}, configs);

		// $element, $controller, $scope pairs
		this.$handler = undefined;
		return this;
	};

	/**
	Gets template of the component
	
	Template is a HTML text which is used to build a view of the component.
	
	@returns {promisse} To resolve the template value
	@memberof MbContainer
	 */
	MbContainer.prototype.getTemplate = function() {
		return $q.when(this.template || $mbUiUtil.getTemplateFor(this));
	}


	/**
	Checks if the component is visible anywhare
	
	A component is visible if there is a paire of MVC item. For example an action is visible if
	it is created and append to the view by MVC elements.
	
	@returns {boolean} True if the component is visible.
	@memberof MbContainer
	 */
	MbContainer.prototype.isVisible = function() {
		return !_.isUndefined(this.$handler);
	}


	/**
	Renders the container and return its handler
	
	@memberof MbContainer
	 */
	MbContainer.prototype.render = function(locals) {
		var cmp = this;
		this.$handler = true;
		// If there is no root element, then we create a new one
		if (_.isUndefined(locals.$element)) {
			locals.$element = angualr.element('<div></div>');
		}

		// If there is no root element, then we create a new one
		if (_.isUndefined(locals.$scope)) {
			locals.$scope = $rootScope.$new(false);
		}
		return $q.when(this.getTemplate(), function(template) {
			var $scope = locals.$scope
			var $element = locals.$element;
			var $ctrl;
			var controllerDef;

			$element.html(template);
			$mbTheming($element);
			var link = $compile($element);
			if ((controllerDef = cmp.controller)) {
				$ctrl = $controller(controllerDef, locals);
				if ((cmp.controllerAs)) {
					$scope[cmp.controllerAs] = $ctrl;
				}
				$element.data('$ngControllerController', $ctrl);
			}
			$scope[cmp.resolveAs || '$resolve'] = locals;
			link($scope);


			cmp.$handler = new MbUiHandler(_.assign(locals, {
				$scope: $scope,
				$element: $element,
				$controller: $ctrl
			}));
			return cmp.$handler;
		});
	}


	/**
	Destroy all visible parts and free all resources
	
	@memberof MbContainer
	 */
	MbContainer.prototype.destroy = function() {
		if (_.isUndefined(this.$handler)) {
			return;
		}
		this.$handler.destroy();
		delete this.$handler;
	};

	return MbContainer;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
@ngdoc Services
@name $mbDialog
@description Manage dialogs

 */
angular.module('mblowfish-core').provider('$mbDialog', function() {

	//--------------------------------------------------------
	// Services
	//--------------------------------------------------------
	var provider;
	//	var service;


	//--------------------------------------------------------
	// varialbes
	//--------------------------------------------------------


	//--------------------------------------------------------
	// Functions
	//--------------------------------------------------------


	//--------------------------------------------------------
	// End
	//--------------------------------------------------------
	provider = {
		$get: function($mdDialog) {
			return $mdDialog;
		}
	}
	return provider;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbEditor
@description An action item

 */
angular.module('mblowfish-core').factory('MbEditor', function(MbFrame) {

	function MbEditor(configs) {
		MbFrame.call(this, configs);
		return this;
	};
	// Circle derives from Shape
	MbEditor.prototype = Object.create(MbFrame.prototype);

	MbEditor.prototype.render = function(locals) {
		locals.$editor = this;
		locals.$mbRouteParams = this.$route;
		locals.$routeParams = this.$route;
		// add othere services to push
		return MbFrame.prototype.render.call(this, locals);
	};
	
	return MbEditor;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
@ngdoc Services
@name $mbEditor
@description Manages editors

/**
@ngdoc Serivces
@name $mbView
@description Manages list of views 

Editor is a multiple instance page whit a unique  path in the system. There is one ore more
variable. However original path is unique to each editor.

Path parameters are not writable by editor controller.

It is possiblet to create (or register an editor) with parametirzed path. If there is no variable
part in the path, this is not an editor.

There may be some additional parameters which is send to an editor by 
query parameters. Note that, path parameter is more important than query parameters.

Here is list of services related to an specific editor:

- $params: list of param from query and path
- $editor: related editor controller from layout system
- $element: HTML view
- $scope: data scope of the editor

These are injectable to an editor contrller.

 */
angular.module('mblowfish-core').provider('$mbEditor', function() {
	//------------------------------------------------
	// Services
	//------------------------------------------------
	var rootScope;
	var mbRoute;
	var Editor;

	var service;
	var provider;

	//------------------------------------------------
	// variables
	//------------------------------------------------
	var inherit;// = $mbUiUtil.inherit;
	var switchRouteMatcher; // = $mbUiUtil.switchRouteMatcher;

	var editorConfigProvider = {};
	var editorConfigs = {};
	var editors = {};


	//------------------------------------------------
	// functions
	//------------------------------------------------

	/**
	Adds new editor descritpion
	
	@name registerEditor	
	@memberof $mbEditor
	 */
	function registerEditor(name, editorConfig) {
		var config = _.assign({
			isEditor: true,
			reloadOnSearch: false,
			reloadOnUrl: true,
			componentState: {
				originalUrl: name,
			}
		}, editorConfig)
		editorConfigs[name] = config;
		// Add to routes
		mbRoute.when(name, config);
		config.route = mbRoute.getRoutes(name);
		// TODO: Add toolbar
		// TODO: Add menu
		return service;
	}

	/**
	Removes editor description from system
	
	@name registerEditor	
	@memberof $mbEditor
	 */
	function unregisterEditor(name) {
		// TODO: remove toolbar
		// TODO: remove menu
		delete editorConfigs[name];
		return service;
	}

	function getEditorConfigMatch(url, inputParams) {
		// Match a route
		var params;
		var match;
		_.forEach(editorConfigs, function(editorConfig, name) {
			if (!match && (params = switchRouteMatcher(url, editorConfig.route))) {
				route = _.assign({}, editorConfig.route, {
					params: angular.extend({}, inputParams, params),
					pathParams: params
				});
				match = _.assign({}, editorConfig, {
					url: url,
					name: name,
					$route: route
				});
			}
		});
		return match;
	}


	/**
	Find and return existed editor
	
	@name getEditor	
	@memberof $mbEditor
	 */
	function getEditor(name) {
		return editors[name];
	}


	/**
	Check if the editor exist
	
	@name has	
	@memberof $mbEditor
	 */
	function hasEditor(name) {
		var editor = getEditor(name);
		return !_.isUndefined(editor);
	}

	/**
	Opens a new editor
	
	To open a new editor, name (unique path of the view) is required. As you know, editors
	are registered with a dynamic path (e.g. /users/:userId) but you must open a new editor
	with static path (e.g. /users/1).
	
	@memberof $mbEditor
	 */
	function fetch(name, state) {
		// 0- check if editor is open
		var editor = editors[name];
		if (editor) {
			return editor;
		}

		// 1- Get editor configuration
		var editorConfig = getEditorConfigMatch(name, state);
		if (_.isUndefined(editorConfig)) {
			// XXX: maso, 2020: View not found throw error
			return;
		}

		// 3- Creat new editor
		return editors[name] = new Editor(editorConfig)
			.setAnchor('editors')
			.setState(state);
	}

	/**
	Opens a new editor
	
	To open a new editor, name (unique path of the view) is required. As you know, editors
	are registered with a dynamic path (e.g. /users/:userId) but you must open a new editor
	with static path (e.g. /users/1).
	
	@memberof $mbEditor
	 */
	function open(name, state) {
		return fetch(name, state)
			.setVisible(true);
	}

	function init() {
		_.forEach(editorConfigProvider, function(config, id) {
			registerEditor(id, config);
		});
	}


	//------------------------------------------------
	// End
	//------------------------------------------------
	service = {
		registerEditor: registerEditor,
		unregisterEditor: unregisterEditor,

		open: open,
		fetch: fetch,
		has: hasEditor,
		getEditor: getEditor,
	};

	provider = {
		$get: function(
			/* AngularJS */ $rootScope,
			/* Mblowfish */ $mbUiUtil, $mbRoute, MbEditor) {
			inherit = $mbUiUtil.inherit;
			switchRouteMatcher = $mbUiUtil.switchRouteMatcher;

			// Services
			rootScope = $rootScope;
			mbRoute = $mbRoute;
			Editor = MbEditor;

			init();
			return service;
		},
		addEditor: function(editorId, editorConfig) {
			editorConfigProvider[editorId] = editorConfig;
			return provider;
		}
	};
	return provider;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbFrame
@description A container which is managed with layout manager to display

 */
angular.module('mblowfish-core').factory('MbFrame', function($mbUiUtil, MbContainer, $mbLayout, MbToolbar, $mbToolbar) {

	function MbFrame(configs) {
		// 1- create and register frame toolbar
		var toolbar = new MbToolbar({
			url: configs.url,
			//isToolbar: false,
			//isView: false,
			//isEditor: false,
			//isMenu: false,
			controller: function() { },
			controllerAs: 'toolbarCtrl'
		});
		$mbToolbar.addToolbar(configs.url, toolbar);
		this.toolbar = toolbar;

		// 2- create and register frame menu
		this.menu = undefined;

		// 3- call container initialization
		configs.state = configs.state || {};
		MbContainer.call(this, configs);
		return this;
	};

	// Circle derives from Shape
	MbFrame.prototype = Object.create(MbContainer.prototype);

	MbFrame.prototype.getToolbar = function() {
		return this.toolbar;
	};

	MbFrame.prototype.getMenu = function() {
		return this.menu;
	};

	MbFrame.prototype.setTitle = function(title) {
		switch ($mbLayout.getMode()) {
			case 'docker':
				this.$handler.$dockerContainer.setTitle(title);
				break;
			default:
				// TODO: support mobile layout
				break;
		}
	};

	/**
	Close the frame
	
	In docker view the frame will be closed.
	
	In the mobile view we load previews view.
	
	@memberof MbFrame
	 */
	MbFrame.prototype.close = function() {
		switch ($mbLayout.getMode()) {
			case 'docker':
				this.$handler.$dockerContainer.close();
				break;
			default:
				// TODO: support mobile layout
				break;
		}
	};

	MbFrame.prototype.setFocus = function() {
		$mbLayout.setFocus(this);
	};

	MbFrame.prototype.render = function(locals) {
		locals.$toolbar = this.getToolbar();
		locals.$menu = this.getMenu();
		locals.$frame = this;


		var toolbar = locals.$toolbar;
		var toolbarElement = angular.element('<mb-toolbar></mb-toolbar>');
		toolbarElement.attr('id', this.url);

		// store criticla services
		this.state = locals.$state;


		return MbContainer.prototype.render.call(this, locals)
			.then(function(handler) {
				handler.$element.children().addClass('mb-container-content');
				handler.$element.prepend(toolbarElement);
				toolbar.render({
					$element: toolbarElement,
				});
			});
	};


	/**
	Destroy all visible parts and free all resources
	
	@memberof MbFrame
	 */
	MbFrame.prototype.destroy = function() {
		if (this.toolbar) {
			this.toolbar.destroy();
		}
		if (this.menu) {
			this.menu.destroy();
		}
		this.state = {};
		return MbContainer.prototype.destroy.call(this);
	};


	/**
	Set visible or un visible the frame
	
	@name setVisible
	@memberof MbFrame
	@param {boolean} visible If true, the frame will be show or it will be removed from the layout system
	 */
	MbFrame.prototype.setVisible = function(visible) {
		if (visible) {
			$location.url($mbUiUtil.frameToUrl(this));
			return this;
		}
		return this.destroy();
	};

	/**
	Set the place where the frame will be display
	
	@name setAnchor
	@memberof MbFrame
	 */
	MbFrame.prototype.setAnchor = function(anchor) {
		this.anchor = anchor;
		return this;
	};

	// TODO: maso, 2020: send new params to editor
	MbFrame.prototype.setState = function(state) {
		this.state = _.assign(this.state, state);
		// TOOD: fire params changed
		return this;
	};


	return MbFrame;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('mblowfish-core')

/**
 * @ngdoc Factories
 * @name MbActionGroup
 * @description Groups of actions.
 * 
 */
.factory('MbActionGroup', function() {
	function ActionGroup(data) {
		if(!angular.isDefined(data)){
			data = {};
		}
		data.priority = data.priority || 10;
		angular.extend(this, data);
		this.items = [];
		this.isGroup = true;
	};

	/**
	 * Clear the items list from action group
	 * 
	 * @name clear
	 * @memberof ActionGroup
	 */
	ActionGroup.prototype.clear = function(){
		this.items = [];
	};
	
	ActionGroup.prototype.removeItem = function(action){
		var j = this.items.indexOf(action);
		if (j > -1) {
			this.items.splice(j, 1);
		}
	};
	
	ActionGroup.prototype.addItem = function(action){
		this.items.push(action);
	};

	return ActionGroup;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc Factories
 * @name MbLayout
 * @description An action item
 * 
 */
angular.module('mblowfish-core').factory('MbLayout', function() {

	function MbLayout() {
		return this;
	};

	MbLayout.prototype.foo = function($) {
	};

	return MbLayout;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc service
@name $mbLayout
@description A page management service

This service manage all visible ui components which are registered int the route 
service.

All components (view and editors) which is opened in the current session will be store
to show in the next sessions too.

 */
angular.module('mblowfish-core').provider('$mbLayout', function() {


	//-----------------------------------------------------------------------------------
	// Services and factories
	//-----------------------------------------------------------------------------------
	var service;
	var provider;
	var rootScope; // = $rootScope
	var compile; // = $compile
	var injector;// = $injector;
	var mbStorage; // = $mbStorage


	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------

	/*
	List of layouts which is loaded at run time by configurations. These are not
	editable
	*/
	var hardCodeLayout = {};

	var defaultLayoutName = 'default';
	var currentLayoutName;

	/*
	Default layout of the sysetm. If there is no layout then this one will be
	used as default layout.
	This field will be stored in local storage for farther usage.
	 */
	var layouts = {}

	// Root element of the layout system
	var rootElement;

	// layout mode
	var mode = 'docker';

	//-----------------------------------------------------------------------------------
	// Global functions
	//-----------------------------------------------------------------------------------
	function getLayout(name) {
		name = name || defaultLayoutName;
		var layout = layouts[name];
		if (!layout) {
			layout = _.cloneDeep(hardCodeLayout[name]);
			layouts[name] = layout;
		}
		return layout;
	}

	function setLayout(name, layout) {
		layouts[name] = layout;
	}

	/**
	@description Open a frame on the layout system and stores the configuration
	
	All frames will be stored and reopen with the layout system.
	
	The state of a frame will be stored by the layout system to be used later.
	
	The address of the frame will be used for the first time to put the frame. User may change the place
	dynamically at the runtime, so, the anchor may be changed with the firs one.
	
	@memberof $mbLayout
	@name open
	@param {MbFrame} frame A component to open in a place on the layout system
	@param {Object} state A list of configuration, parameters and settings to send to the container
	@param {string} anchor An address where the container must be placed for example 'editor' is a place to put all editors
	 */
	function open(frame, state, anchor) {
		var result;
		switch (mode) {
			case 'docker':
				result = openDockerContent(frame, state, anchor);
				break;
			default:
				result = openMobileView(frame, state, anchor);
				break;
		}
		return result;
	}

	function reload(element, layoutName) {
		rootElement = element;
		currentLayoutName = layoutName || defaultLayoutName;
		switch (mode) {
			case 'docker':
				loadDockerLayout();
				break;
			default:
				loadMobileView();
				break;
		}
	}

	function setFocus(frame) {
		// TODO:
	}

	function storeState() {
		// 1 - create new config
		storage = {};
		storage.layouts = layouts;
		storage.currentLayoutName = currentLayoutName;

		// 2- store
		mbStorage.mbLayout = storage;
	}

	function init() {
		// 1 - load layout from storage
		storage = mbStorage.mbLayout || {};
		layouts = storage.layouts || {};
		currentLayoutName = storage.currentLayoutName || defaultLayoutName;
	}

	//-----------------------------------------------------------------------------------
	// Mobile Layout
	//-----------------------------------------------------------------------------------
	function loadMobileView() { }
	function openMobileView(component, anchor) { }


	//-----------------------------------------------------------------------------------
	// Docker Layout
	//-----------------------------------------------------------------------------------
	var docker;
	var dockerBodyElement;
	var dockerPanelElement;
	var dockerViewElement;

	var DOCKER_COMPONENT_EDITOR_ID = 'editors';
	var DOCKER_COMPONENT_VIEW_CLASS = 'mb_docker_container_view';
	var DOCKER_COMPONENT_EDITOR_CLASS = 'mb_docker_container_editor';

	var DOCKER_BODY_CLASS = 'mb_docker_body';
	var DOCKER_PANEL_CLASS = 'mb_docker_panel';
	var DOCKER_VIEW_CLASS = 'mb_docker_view';



	function loadDockerLayout() {
		// load element
		var template = '<div id="mb_docker_panel"><div id="mb_docker_view"></div></div>';
		dockerBodyElement = rootElement;
		dockerPanelElement = angular.element(template);
		dockerViewElement = dockerPanelElement.find('#mb_docker_view')
		dockerBodyElement.append(dockerPanelElement);

		dockerBodyElement.addClass(DOCKER_BODY_CLASS);
		dockerPanelElement.addClass(DOCKER_PANEL_CLASS);
		dockerViewElement.addClass(DOCKER_VIEW_CLASS);

		// load docker view
		docker = new GoldenLayout(getLayout(currentLayoutName), dockerViewElement);
		docker.registerComponent('component', loadComponent);


		docker.on('stateChanged', function() {
			layouts[currentLayoutName] = docker.toConfig();
			storeState();
		});

		docker.on('selectionChanged', function() {
			// XXX: maso, 2020: change active view or editor
		});

		docker.on('initialised', function() {
			// link element
			var link = compile(dockerBodyElement.contents());
			link(rootScope);
		});
		docker.init();
	}
	/*
	 *  In docker view, this will create a new tap and add into the editor area
	 * based on Golden Layout Manager.
	 */
	function loadComponent(editor, state) {
		// Component is loaded before
		var component;
		if (state.isView) {
			var $mbView = injector.get('$mbView');
			component = $mbView.get(state.url);
		} else {
			var $mbEditor = injector.get('$mbEditor');
			component = $mbEditor.fetch(
				state.url, // path
				state);    // parameters
		}
		if (_.isUndefined(component)) {
			$mbEditor = injector.get('$mbEditor');
			component = $mbEditor.fetch(
				'/ui/notfound/' + state.url, // path
				state);                      // parameters
			// TODO: add the editor
			//		$mbEditor
			//			.add('/mb/notfound/:path*', {
			//				template: '<h1>Path not found</h1><p>path: {{:path}}</p>',
			//				anchore: 'editors',
			//				/* @ngInject */
			//				controller: function($scope, $state) {
			//					$scope.path = $state.params.path;
			//				},
			//			});
		}

		// discannect all resrouces
		if (component.isVisible()) {
			return component.setFocus();
		}

		// load element
		var element = editor.getElement();
		element.addClass(DOCKER_COMPONENT_VIEW_CLASS);
		editor.on('destroy', function() {
			component.destroy();
		});
		return component.render({
			$dockerContainer: editor,
			$element: element,
			$state: state
		});
		// TODO: maso,2020: dispatc view is loaded
	}

	function getDockerContentById(id) {
		var items = docker.root.getItemsById(id);
		return items[0];
	}

	function getDockerRootContent() {
		return docker.root;
	}

	function openDockerContent(component, state, anchor) {
		if (component.isEditor) {
			anchor = anchor || DOCKER_COMPONENT_EDITOR_ID;
		}


		if (component.isView) {
			var $mbView = injector.get('$mbView');
			component = $mbView.fetch(
				component.url,   // path
				state,           // state
				anchor);        // anchor
		} else {
			var $mbEditor = injector.get('$mbEditor');
			component = $mbEditor.fetch(
				component.url,    // path
				state,           // state
				anchor);        // anchor
		}

		if (_.isUndefined(component)) {
			// TODO: maso, 2020: support undefined view
			return;
		}
		// discannect all resrouces
		if (component.isVisible()) {
			return component.setFocus();
		}

		var anchorContent = getDockerContentById(anchor) || getDockerRootContent().contentItems[0];
		// TODO: maso, 2020: load component info to load later
		var contentConfig = {
			//Non ReactJS
			type: 'component',
			componentName: 'component',
			componentState: _.assign({}, state, {
				url: component.url,
				isEditor: component.isEditor,
				isView: component.isView,
			}),
			//General
			content: [],
			id: component.url,
			isClosable: true,
			title: component.title,
			activeItemIndex: 1
		};
		var ret = anchorContent.addChild(contentConfig);
		return ret;
	}


	/*
	Profider
	*/
	service = {
		// global api
		reload: reload,
		open: open,
		setFocus: setFocus,

		setLayout: setLayout,
		getLayout: getLayout,
		getMode: function() {
			return mode;
		},
	}
	provider = {
		setDefault: function(name) {
			defaultLayoutName = name;
			return provider;
		},
		addLayout: function(name, layout) {
			hardCodeLayout[name] = layout;
			return provider
		},
		getLayout: function(name) {
			return hardCodeLayout[name];
		},
		setMode: function(appMode) {
			mode = appMode;
			return;
		},
		/* @ngInject */
		$get: function(
			/* Angularjs */ $compile, $rootScope, $injector,
			/* MblowFish */ $mbStorage) {
			//
			// 1- Init layouts
			//
			rootScope = rootScope || $rootScope;
			compile = $compile;
			injector = $injector;

			mbStorage = $mbStorage;

			//
			// 3- Initialize the laytout
			//
			init();
			return service;
		}
	};
	return provider;
});

(function() {
	var mlDirectiveItems = [
		'lmGoldenlayout',
		'lmContent',
		'lmSplitter',
		'lmHeader',
		'lmControls',
		'lmMaximised',
		'lmTransitionIndicator'
	];
	_.forEach(mlDirectiveItems, function(directiveName) {
		mblowfish.directive(directiveName, function($mbTheming) {
			'ngInject';
			return {
				restrict: 'C',
				link: function($scope, $element) {
					$mbTheming($element);
				}
			};
		});
	});
})();


/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc Factories
 * @name MbMenu
 * @description An action item
 * 
 */
angular.module('mblowfish-core').factory('MbMenu', function() {

	function MbMenu() {
		return this;
	};

	MbMenu.prototype.foo = function($) {
	};

	return MbMenu;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
 * @ngdoc service
 * @name $ui
 * @description A page management service
 */
angular.module('mblowfish-core').service('$mbMenu', function() {

	return this;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
 * @ngdoc service
 * @name $mbRoute
 * @requires $location
 * @requires $mbRouteParams
 *
 * @property {Object} current Reference to the current route definition.
 * The route definition contains:
 *
 *   - `controller`: The controller constructor as defined in the route definition.
 *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
 *     controller instantiation. The `locals` contain
 *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
 *
 *     - `$scope` - The current route scope.
 *     - `$template` - The current route template HTML.
 *
 *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
 *     the property name, using `resolveAs` in the route definition. See
 *     {@link ngRoute.$mbRouteProvider $mbRouteProvider} for more info.
 *
 * @property {Object} routes Object with all route configuration Objects as its properties.
 *
 * @description
 * `$mbRoute` is used for deep-linking URLs to controllers and views (HTML partials).
 * It watches `$location.url()` and tries to map the path to an existing route definition.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * You can define routes through {@link ngRoute.$mbRouteProvider $mbRouteProvider}'s API.
 *
 * The `$mbRoute` service is typically used in conjunction with the
 * {@link ngRoute.directive:ngView `ngView`} directive and the
 * {@link ngRoute.$mbRouteParams `$mbRouteParams`} service.
 *
 * @example
 * This example shows how changing the URL hash causes the `$mbRoute` to match a route against the
 * URL, and the `ngView` pulls in the partial.
 *
 * <example name="$mbRoute-service" module="ngRouteExample"
 *          deps="angular-route.js" fixBase="true">
 *   <file name="index.html">
 *     <div ng-controller="MainController">
 *       Choose:
 *       <a href="Book/Moby">Moby</a> |
 *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
 *       <a href="Book/Gatsby">Gatsby</a> |
 *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
 *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
 *
 *       <div ng-view></div>
 *
 *       <hr />
 *
 *       <pre>$location.path() = {{$location.path()}}</pre>
 *       <pre>$mbRoute.current.templateUrl = {{$mbRoute.current.templateUrl}}</pre>
 *       <pre>$mbRoute.current.params = {{$mbRoute.current.params}}</pre>
 *       <pre>$mbRoute.current.scope.name = {{$mbRoute.current.scope.name}}</pre>
 *       <pre>$mbRouteParams = {{$mbRouteParams}}</pre>
 *     </div>
 *   </file>
 *
 *   <file name="book.html">
 *     controller: {{name}}<br />
 *     Book Id: {{params.bookId}}<br />
 *   </file>
 *
 *   <file name="chapter.html">
 *     controller: {{name}}<br />
 *     Book Id: {{params.bookId}}<br />
 *     Chapter Id: {{params.chapterId}}
 *   </file>
 *
 *   <file name="script.js">
 *     angular.module('ngRouteExample', ['ngRoute'])
 *
 *      .controller('MainController', function($scope, $mbRoute, $mbRouteParams, $location) {
 *          $scope.$mbRoute = $mbRoute;
 *          $scope.$location = $location;
 *          $scope.$mbRouteParams = $mbRouteParams;
 *      })
 *
 *      .controller('BookController', function($scope, $mbRouteParams) {
 *          $scope.name = 'BookController';
 *          $scope.params = $mbRouteParams;
 *      })
 *
 *      .controller('ChapterController', function($scope, $mbRouteParams) {
 *          $scope.name = 'ChapterController';
 *          $scope.params = $mbRouteParams;
 *      })
 *
 *     .config(function($mbRouteProvider, $locationProvider) {
 *       $mbRouteProvider
 *        .when('/Book/:bookId', {
 *         templateUrl: 'book.html',
 *         controller: 'BookController',
 *         resolve: {
 *           // I will cause a 1 second delay
 *           delay: function($q, $timeout) {
 *             var delay = $q.defer();
 *             $timeout(delay.resolve, 1000);
 *             return delay.promise;
 *           }
 *         }
 *       })
 *       .when('/Book/:bookId/ch/:chapterId', {
 *         templateUrl: 'chapter.html',
 *         controller: 'ChapterController'
 *       });
 *
 *       // configure html5 to get links working on jsfiddle
 *       $locationProvider.html5Mode(true);
 *     });
 *
 *   </file>
 *
 *   <file name="protractor.js" type="protractor">
 *     it('should load and compile correct template', function() {
 *       element(by.linkText('Moby: Ch1')).click();
 *       var content = element(by.css('[ng-view]')).getText();
 *       expect(content).toMatch(/controller: ChapterController/);
 *       expect(content).toMatch(/Book Id: Moby/);
 *       expect(content).toMatch(/Chapter Id: 1/);
 *
 *       element(by.partialLinkText('Scarlet')).click();
 *
 *       content = element(by.css('[ng-view]')).getText();
 *       expect(content).toMatch(/controller: BookController/);
 *       expect(content).toMatch(/Book Id: Scarlet/);
 *     });
 *   </file>
 * </example>
 */


/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteChangeStart
 * @eventType broadcast on root scope
 * @description
 * Broadcasted before a route change. At this  point the route services starts
 * resolving all of the dependencies needed for the route change to occur.
 * Typically this involves fetching the view template as well as any dependencies
 * defined in `resolve` route property. Once  all of the dependencies are resolved
 * `$mbRouteChangeSuccess` is fired.
 *
 * The route change (and the `$location` change that triggered it) can be prevented
 * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
 * for more details about event object.
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {Route} next Future route information.
 * @param {Route} current Current route information.
 */

/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteChangeSuccess
 * @eventType broadcast on root scope
 * @description
 * Broadcasted after a route change has happened successfully.
 * The `resolve` dependencies are now available in the `current.locals` property.
 *
 * {@link ngRoute.directive:ngView ngView} listens for the directive
 * to instantiate the controller and render the view.
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {Route} current Current route information.
 * @param {Route|Undefined} previous Previous route information, or undefined if current is
 * first route entered.
 */

/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteChangeError
 * @eventType broadcast on root scope
 * @description
 * Broadcasted if a redirection function fails or any redirection or resolve promises are
 * rejected.
 *
 * @param {Object} angularEvent Synthetic event object
 * @param {Route} current Current route information.
 * @param {Route} previous Previous route information.
 * @param {Route} rejection The thrown error or the rejection reason of the promise. Usually
 * the rejection reason is the error that caused the promise to get rejected.
 */

/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteUpdate
 * @eventType broadcast on root scope
 * @description
 * Broadcasted if the same instance of a route (including template, controller instance,
 * resolved dependencies, etc.) is being reused. This can happen if either `reloadOnSearch` or
 * `reloadOnUrl` has been set to `false`.
 *
 * @param {Object} angularEvent Synthetic event object
 * @param {Route} current Current/previous route information.
 */
angular.module('mblowfish-core').service('$mbRoute', function(
	/* angularjs */ $rootScope, $location, $q, $injector, $templateRequest, $sce, $browser,
	/* MBlowfish */ $mbRouteParams, $mbUtil, $mbUiUtil
) {

	/***********************************************************************************
	 * Variables
	 ***********************************************************************************/
	var $mbRoute = this;
	var routes = {};
	var forceReload = false;
	var preparedRoute;
	var preparedRouteIsUpdateOnly;
	/**
	 * @ngdoc method
	 * @name $mbRouteProvider#eagerInstantiationEnabled
	 * @kind function
	 *
	 * @description
	 * Call this method as a setter to enable/disable eager instantiation of the
	 * {@link ngRoute.$mbRoute $mbRoute} service upon application bootstrap. You can also call it as a
	 * getter (i.e. without any arguments) to get the current value of the
	 * `eagerInstantiationEnabled` flag.
	 *
	 * Instantiating `$mbRoute` early is necessary for capturing the initial
	 * {@link ng.$location#$locationChangeStart $locationChangeStart} event and navigating to the
	 * appropriate route. Usually, `$mbRoute` is instantiated in time by the
	 * {@link ngRoute.ngView ngView} directive. Yet, in cases where `ngView` is included in an
	 * asynchronously loaded template (e.g. in another directive's template), the directive factory
	 * might not be called soon enough for `$mbRoute` to be instantiated _before_ the initial
	 * `$locationChangeSuccess` event is fired. Eager instantiation ensures that `$mbRoute` is always
	 * instantiated in time, regardless of when `ngView` will be loaded.
	 *
	 * The default value is true.
	 *
	 * **Note**:<br />
	 * You may want to disable the default behavior when unit-testing modules that depend on
	 * `ngRoute`, in order to avoid an unexpected request for the default route's template.
	 *
	 * @param {boolean=} enabled - If provided, update the internal `eagerInstantiationEnabled` flag.
	 *
	 * @returns {*} The current value of the `eagerInstantiationEnabled` flag if used as a getter or
	 *     itself (for chaining) if used as a setter.
	 */
	isEagerInstantiationEnabled = true;


	/**
	 * @ngdoc property
	 * @name $mbRouteProvider#caseInsensitiveMatch
	 * @description
	 *
	 * A boolean property indicating if routes defined
	 * using this provider should be matched using a case insensitive
	 * algorithm. Defaults to `false`.
	 */
	this.caseInsensitiveMatch = false;


	/***********************************************************************************
	 * Utility
	 ***********************************************************************************/
	inherit = $mbUiUtil.inherit;
	switchRouteMatcher = $mbUiUtil.switchRouteMatcher;

	function prepareRoute($locationEvent) {
		var lastRoute = $mbRoute.current;

		preparedRoute = parseRoute();
		preparedRouteIsUpdateOnly = isNavigationUpdateOnly(preparedRoute, lastRoute);

		if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
			if ($rootScope.$broadcast('$mbRouteChangeStart', preparedRoute, lastRoute).defaultPrevented) {
				if ($locationEvent) {
					$locationEvent.preventDefault();
				}
			}
		}
	}

	function commitRoute() {
		var lastRoute = $mbRoute.current;
		var nextRoute = preparedRoute;

		if (preparedRouteIsUpdateOnly) {
			lastRoute.params = nextRoute.params;
			angular.copy(lastRoute.params, $mbRouteParams);
			$rootScope.$broadcast('$mbRouteUpdate', lastRoute);
		} else if (nextRoute || lastRoute) {
			forceReload = false;
			$mbRoute.current = nextRoute;

			var nextRoutePromise = $q.resolve(nextRoute);

			$browser.$$incOutstandingRequestCount('$mbRoute');

			nextRoutePromise.
				then(getRedirectionData).
				then(handlePossibleRedirection).
				then(function(keepProcessingRoute) {
					return keepProcessingRoute && nextRoutePromise.
						then(resolveLocals).
						then(function(locals) {
							// after route change
							if (nextRoute === $mbRoute.current) {
								if (nextRoute) {
									nextRoute.locals = locals;
									angular.copy(nextRoute.params, $mbRouteParams);
								}
								$rootScope.$broadcast('$mbRouteChangeSuccess', nextRoute, lastRoute);
							}
						});
				}).catch(function(error) {
					if (nextRoute === $mbRoute.current) {
						$rootScope.$broadcast('$mbRouteChangeError', nextRoute, lastRoute, error);
					}
				}).finally(function() {
					// Because `commitRoute()` is called from a `$rootScope.$evalAsync` block (see
					// `$locationWatch`), this `$$completeOutstandingRequest()` call will not cause
					// `outstandingRequestCount` to hit zero.  This is important in case we are redirecting
					// to a new route which also requires some asynchronous work.

					$browser.$$completeOutstandingRequest($mbUtil.noop, '$mbRoute');
				});
		}
	}

	function getRedirectionData(route) {
		var data = {
			route: route,
			hasRedirection: false
		};

		if (route) {
			if (route.redirectTo) {
				if (angular.isString(route.redirectTo)) {
					data.path = interpolate(route.redirectTo, route.params);
					data.search = route.params;
					data.hasRedirection = true;
				} else {
					var oldPath = $location.path();
					var oldSearch = $location.search();
					var newUrl = route.redirectTo(route.pathParams, oldPath, oldSearch);

					if (angular.$mbUtil.isDefined(newUrl)) {
						data.url = newUrl;
						data.hasRedirection = true;
					}
				}
			} else if (route.resolveRedirectTo) {
				return $q.
					resolve($injector.invoke(route.resolveRedirectTo)).
					then(function(newUrl) {
						if ($mbUtil.isDefined(newUrl)) {
							data.url = newUrl;
							data.hasRedirection = true;
						}

						return data;
					});
			}
		}

		return data;
	}

	function handlePossibleRedirection(data) {
		var keepProcessingRoute = true;

		if (data.route !== $mbRoute.current) {
			keepProcessingRoute = false;
		} else if (data.hasRedirection) {
			var oldUrl = $location.url();
			var newUrl = data.url;

			if (newUrl) {
				$location.
					url(newUrl).
					replace();
			} else {
				newUrl = $location.
					path(data.path).
					search(data.search).
					replace().
					url();
			}

			if (newUrl !== oldUrl) {
				// Exit out and don't process current next value,
				// wait for next location change from redirect
				keepProcessingRoute = false;
			}
		}

		return keepProcessingRoute;
	}

	function resolveLocals(route) {
		if (route) {
			var locals = angular.extend({}, route.resolve);
			angular.forEach(locals, function(value, key) {
				locals[key] = angular.isString(value) ?
					$injector.get(value) :
					$injector.invoke(value, null, null, key);
			});
			var template = $mbUiUtil.getTemplateFor(route);
			if ($mbUtil.isDefined(template)) {
				locals['$template'] = template;
			}
			return $q.all(locals);
		}
	}

	/**
	 * @returns {Object} the current active route, by matching it against the URL
	 */
	function parseRoute() {
		// Match a route
		var params, match;
		_.forEach(routes, function(route, path) {
			if (!match && (params = switchRouteMatcher($location.path(), route))) {
				match = inherit(route, {
					params: angular.extend({}, $location.search(), params),
					pathParams: params
				});
				match.$route = route;
			}
		});
		// No route matched; fallback to "otherwise" route
		return match || routes[null] && inherit(routes[null], { params: {}, pathParams: {} });
	}

	/**
	 * @param {Object} newRoute - The new route configuration (as returned by `parseRoute()`).
	 * @param {Object} oldRoute - The previous route configuration (as returned by `parseRoute()`).
	 * @returns {boolean} Whether this is an "update-only" navigation, i.e. the URL maps to the same
	 *                    route and it can be reused (based on the config and the type of change).
	 */
	function isNavigationUpdateOnly(newRoute, oldRoute) {
		// IF this is not a forced reload
		return !forceReload
			// AND both `newRoute`/`oldRoute` are defined
			&& newRoute && oldRoute
			// AND they map to the same Route Definition Object
			&& (newRoute.$route === oldRoute.$route)
			// AND `reloadOnUrl` is disabled
			&& (!newRoute.reloadOnUrl
				// OR `reloadOnSearch` is disabled
				|| (!newRoute.reloadOnSearch
					// AND both routes have the same path params
					&& angular.equals(newRoute.pathParams, oldRoute.pathParams)
				)
			);
	}

	/**
	 * @returns {string} interpolation of the redirect path with the parameters
	 */
	function interpolate(string, params) {
		var result = [];
		angular.forEach((string || '').split(':'), function(segment, i) {
			if (i === 0) {
				result.push(segment);
			} else {
				var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
				var key = segmentMatch[1];
				result.push(params[key]);
				result.push(segmentMatch[2] || '');
				delete params[key];
			}
		});
		return result.join('');
	}

	/***********************************************************************************
	 * Service
	 ***********************************************************************************/


	/**
	 * @ngdoc method
	 * @name $mbRoute#when
	 *
	 * @param {string} path Route path (matched against `$location.path`). If `$location.path`
	 *    contains redundant trailing slash or is missing one, the route will still match and the
	 *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
	 *    route definition.
	 *
	 *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
	 *        to the next slash are matched and stored in `$mbRouteParams` under the given `name`
	 *        when the route matches.
	 *    * `path` can contain named groups starting with a colon and ending with a star:
	 *        e.g.`:name*`. All characters are eagerly stored in `$mbRouteParams` under the given `name`
	 *        when the route matches.
	 *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
	 *
	 *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
	 *    `/color/brown/largecode/code/with/slashes/edit` and extract:
	 *
	 *    * `color: brown`
	 *    * `largecode: code/with/slashes`.
	 *
	 *
	 * @param {Object} route Mapping information to be assigned to `$mbRoute.current` on route
	 *    match.
	 *
	 *    Object properties:
	 *
	 *    - `controller` – `{(string|Function)=}` – Controller fn that should be associated with
	 *      newly created scope or the name of a {@link angular.Module#controller registered
	 *      controller} if passed as a string.
	 *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
	 *      If present, the controller will be published to scope under the `controllerAs` name.
	 *    - `template` – `{(string|Function)=}` – html template as a string or a function that
	 *      returns an html template as a string which should be used by {@link
	 *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
	 *      This property takes precedence over `templateUrl`.
	 *
	 *      If `template` is a function, it will be called with the following parameters:
	 *
	 *      - `{Array.<Object>}` - route parameters extracted from the current
	 *        `$location.path()` by applying the current route
	 *
	 *      One of `template` or `templateUrl` is required.
	 *
	 *    - `templateUrl` – `{(string|Function)=}` – path or function that returns a path to an html
	 *      template that should be used by {@link ngRoute.directive:ngView ngView}.
	 *
	 *      If `templateUrl` is a function, it will be called with the following parameters:
	 *
	 *      - `{Array.<Object>}` - route parameters extracted from the current
	 *        `$location.path()` by applying the current route
	 *
	 *      One of `templateUrl` or `template` is required.
	 *
	 *    - `resolve` - `{Object.<string, Function>=}` - An optional map of dependencies which should
	 *      be injected into the controller. If any of these dependencies are promises, the router
	 *      will wait for them all to be resolved or one to be rejected before the controller is
	 *      instantiated.
	 *      If all the promises are resolved successfully, the values of the resolved promises are
	 *      injected and {@link ngRoute.$mbRoute#$mbRouteChangeSuccess $mbRouteChangeSuccess} event is
	 *      fired. If any of the promises are rejected the
	 *      {@link ngRoute.$mbRoute#$mbRouteChangeError $mbRouteChangeError} event is fired.
	 *      For easier access to the resolved dependencies from the template, the `resolve` map will
	 *      be available on the scope of the route, under `$resolve` (by default) or a custom name
	 *      specified by the `resolveAs` property (see below). This can be particularly useful, when
	 *      working with {@link angular.Module#component components} as route templates.<br />
	 *      <div class="alert alert-warning">
	 *        **Note:** If your scope already contains a property with this name, it will be hidden
	 *        or overwritten. Make sure, you specify an appropriate name for this property, that
	 *        does not collide with other properties on the scope.
	 *      </div>
	 *      The map object is:
	 *
	 *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
	 *      - `factory` - `{string|Function}`: If `string` then it is an alias for a service.
	 *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
	 *        and the return value is treated as the dependency. If the result is a promise, it is
	 *        resolved before its value is injected into the controller. Be aware that
	 *        `ngRoute.$mbRouteParams` will still refer to the previous route within these resolve
	 *        functions.  Use `$mbRoute.current.params` to access the new route parameters, instead.
	 *
	 *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
	 *      the scope of the route. If omitted, defaults to `$resolve`.
	 *
	 *    - `redirectTo` – `{(string|Function)=}` – value to update
	 *      {@link ng.$location $location} path with and trigger route redirection.
	 *
	 *      If `redirectTo` is a function, it will be called with the following parameters:
	 *
	 *      - `{Object.<string>}` - route parameters extracted from the current
	 *        `$location.path()` by applying the current route templateUrl.
	 *      - `{string}` - current `$location.path()`
	 *      - `{Object}` - current `$location.search()`
	 *
	 *      The custom `redirectTo` function is expected to return a string which will be used
	 *      to update `$location.url()`. If the function throws an error, no further processing will
	 *      take place and the {@link ngRoute.$mbRoute#$mbRouteChangeError $mbRouteChangeError} event will
	 *      be fired.
	 *
	 *      Routes that specify `redirectTo` will not have their controllers, template functions
	 *      or resolves called, the `$location` will be changed to the redirect url and route
	 *      processing will stop. The exception to this is if the `redirectTo` is a function that
	 *      returns `undefined`. In this case the route transition occurs as though there was no
	 *      redirection.
	 *
	 *    - `resolveRedirectTo` – `{Function=}` – a function that will (eventually) return the value
	 *      to update {@link ng.$location $location} URL with and trigger route redirection. In
	 *      contrast to `redirectTo`, dependencies can be injected into `resolveRedirectTo` and the
	 *      return value can be either a string or a promise that will be resolved to a string.
	 *
	 *      Similar to `redirectTo`, if the return value is `undefined` (or a promise that gets
	 *      resolved to `undefined`), no redirection takes place and the route transition occurs as
	 *      though there was no redirection.
	 *
	 *      If the function throws an error or the returned promise gets rejected, no further
	 *      processing will take place and the
	 *      {@link ngRoute.$mbRoute#$mbRouteChangeError $mbRouteChangeError} event will be fired.
	 *
	 *      `redirectTo` takes precedence over `resolveRedirectTo`, so specifying both on the same
	 *      route definition, will cause the latter to be ignored.
	 *
	 *    - `[reloadOnUrl=true]` - `{boolean=}` - reload route when any part of the URL changes
	 *      (including the path) even if the new URL maps to the same route.
	 *
	 *      If the option is set to `false` and the URL in the browser changes, but the new URL maps
	 *      to the same route, then a `$mbRouteUpdate` event is broadcasted on the root scope (without
	 *      reloading the route).
	 *
	 *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
	 *      or `$location.hash()` changes.
	 *
	 *      If the option is set to `false` and the URL in the browser changes, then a `$mbRouteUpdate`
	 *      event is broadcasted on the root scope (without reloading the route).
	 *
	 *      <div class="alert alert-warning">
	 *        **Note:** This option has no effect if `reloadOnUrl` is set to `false`.
	 *      </div>
	 *
	 *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
	 *
	 *      If the option is set to `true`, then the particular route can be matched without being
	 *      case sensitive
	 *
	 * @returns {Object} self
	 *
	 * @description
	 * Adds a new route definition to the `$mbRoute` service.
	 */
	this.when = function(path, route) {
		//copy original route object to preserve params inherited from proto chain
		var routeCopy = $mbUtil.shallowCopy(route);
		if (angular.isUndefined(routeCopy.reloadOnUrl)) {
			routeCopy.reloadOnUrl = true;
		}
		if (angular.isUndefined(routeCopy.reloadOnSearch)) {
			routeCopy.reloadOnSearch = true;
		}
		if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
			routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
		}
		routes[path] = angular.extend(
			routeCopy,
			{ originalPath: path },
			path && $mbUiUtil.routeToRegExp(path, routeCopy)
		);

		// create redirection for trailing slashes
		if (path) {
			var redirectPath = (path[path.length - 1] === '/')
				? path.substr(0, path.length - 1)
				: path + '/';

			routes[redirectPath] = angular.extend(
				{ originalPath: path, redirectTo: path },
				$mbUiUtil.routeToRegExp(redirectPath, routeCopy)
			);
		}

		return this;
	};


	/**
	 * @ngdoc method
	 * @name $mbRouteProvider#otherwise
	 *
	 * @description
	 * Sets route definition that will be used on route change when no other route definition
	 * is matched.
	 *
	 * @param {Object|string} params Mapping information to be assigned to `$mbRoute.current`.
	 * If called with a string, the value maps to `redirectTo`.
	 * @returns {Object} self
	 */
	this.otherwise = function(params) {
		if (typeof params === 'string') {
			params = { redirectTo: params };
		}
		this.when(null, params);
		return this;
	};

	this.eagerInstantiationEnabled = function eagerInstantiationEnabled(enabled) {
		if (isDefined(enabled)) {
			isEagerInstantiationEnabled = enabled;
			return this;
		}

		return isEagerInstantiationEnabled;
	};


	/**
	 * @ngdoc method
	 * @name $mbRoute#reload
	 *
	 * @description
	 * Causes `$mbRoute` service to reload the current route even if
	 * {@link ng.$location $location} hasn't changed.
	 *
	 * As a result of that, {@link ngRoute.directive:ngView ngView}
	 * creates new scope and reinstantiates the controller.
	 */
	this.reload = function() {
		forceReload = true;

		var fakeLocationEvent = {
			defaultPrevented: false,
			preventDefault: function fakePreventDefault() {
				this.defaultPrevented = true;
				forceReload = false;
			}
		};

		$rootScope.$evalAsync(function() {
			prepareRoute(fakeLocationEvent);
			if (!fakeLocationEvent.defaultPrevented) commitRoute();
		});
	};

	/**
	 * @ngdoc method
	 * @name $mbRoute#updateParams
	 *
	 * @description
	 * Causes `$mbRoute` service to update the current URL, replacing
	 * current route parameters with those specified in `newParams`.
	 * Provided property names that match the route's path segment
	 * definitions will be interpolated into the location's path, while
	 * remaining properties will be treated as query params.
	 *
	 * @param {!Object<string, string>} newParams mapping of URL parameter names to values
	 */
	this.updateParams = function(newParams) {
		if (this.current && this.current.$route) {
			newParams = angular.extend({}, this.current.params, newParams);
			$location.path(interpolate(this.current.$route.originalPath, newParams));
			// interpolate modifies newParams, only query params are left
			$location.search(newParams);
		} else {
			throw $mbRouteMinErr('norout', 'Tried updating route with no current route');
		}
	};
	
	this.getRoutes = function(path){
		// TODO: maso, 2020: check redirect
		return routes[path];
	}

	$rootScope.$on('$locationChangeStart', prepareRoute);
	$rootScope.$on('$locationChangeSuccess', commitRoute);
	return this;
});



/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * @ngdoc directive
 * @name mbView
 * @restrict ECA
 *
 * @description
 * `mbView` is a directive that complements the {@link ngRoute.$mbRoute $mbRoute} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$mbRoute` service.
 *
 *  Dependeing on the version of the MB, it may open the view in the main page or a tab wiht in
 * a docker layout.
 *
 * Requires the {@link mbRoute `mbRoute`} module to be installed.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `mbView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="mbView-directive" module="mbViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div mb-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$mbRoute.current.templateUrl = {{main.$mbRoute.current.templateUrl}}</pre>
          <pre>$mbRoute.current.params = {{main.$mbRoute.current.params}}</pre>
          <pre>$mbRouteParams = {{main.$mbRouteParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('mbViewExample', ['mbRoute', 'ngAnimate'])
          .config(function($locationProvider){
              $locationProvider.html5Mode(true);
          })
          .run(function($mbRoute) {
              $mbRoute
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });
          })
          .controller('MainCtrl', function MainCtrl($mbRoute, $mbRouteParams, $location) {
              this.$mbRoute = $mbRoute;
              this.$mbRouteParams = $mbRouteParams;
              this.$location = $location;
          })
          .controller('BookCtrl', function BookCtrl($mbRouteParams) {
            this.name = 'BookCtrl';
            this.params = $mbRouteParams;
          })
          .controller('ChapterCtrl', function ChapterCtrl($mbRouteParams) {
            this.name = 'ChapterCtrl';
            this.params = $mbRouteParams;
          });
      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: ChapterCtrl/);
          expect(content).toMatch(/Book Id: Moby/);
          expect(content).toMatch(/Chapter Id: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: BookCtrl/);
          expect(content).toMatch(/Book Id: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name mbView#$viewContentLoaded
 * @eventType emit on the current mbView scope
 * @description
 * Emitted every time the mbView content is reloaded.
 */



angular.module('mblowfish-core').directive('mbView', function(
	/* MB        */ $mbLayout, $mbRoute,
	/* AngularJS */ $location, $dispatcher, $mbApplication, $q) {


	function link(scope, $element, attr) {
		// Variables
		var onloadExp = attr.onload || '';
		var layout = attr.mbLayout || 'docker';

		// staso, 2019: fire the state is changed
		$dispatcher.on('/app/state', checkApp);
		scope.$on('$destroy', function() {
			$dispatcher.off('/app/state', update);
		});


		function checkApp() {
			scope.$on('$mbRouteChangeSuccess', update);
			if ($mbApplication.getState() === 'ready') {
				$q.when(loadMainView())
					.then(update());
			}
		}

		function loadMainView() {
			return $mbLayout.reload($element);
		}

		/*
		 *  If the path change, this function will update the view and add the request
		 * page into the view.
		 */
		function update() {
			if (!$mbRoute.current) {
				return;
			}
			var route = $mbRoute.current;
			var state = {
				params: route.params,
				pathParams: route.pathParams,
			};
			route.$route.url = $location.url();
			return $mbLayout.open(route.$route, state);
		}

	}

	return {
		restrict: 'AE',
		terminal: true,
		priority: 400,
		link: link
	};
});



/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc service
 * @name $mbRouteParams
 * @requires $mbRoute
 * @this
 *
 * @description
 * The `$mbRouteParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$mbRoute `$mbRoute`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$mbRouteParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$mbRouteParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$mbRouteParams` being correct in route resolve functions.
 * Instead you can use `$mbRoute.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $mbRouteParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
angular.module('mblowfish-core').service('$mbRouteParams', function() { });
/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc directive
@name mb-status
@description List of component to display in status

 */
angular.module('mblowfish-core').directive('mbStatus', function($mbTheming) {
	
	function link($scope, $element) {
		// 0- init UI
		$element.empty();
		$mbTheming($element);
	}

	return {
		restrict: 'E',
		replace: false,
		/* @ngInject */
		controller: function() {
		},
		controllerAs: 'ctrl',
		link: link
	};
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core').config(function($mdThemingProvider) {

	// Dark theme
	$mdThemingProvider
		.theme('dark')//
		.primaryPalette('grey', {
			'default': '900',
			'hue-1': '700',
			'hue-2': '600',
			'hue-3': '500'
		})//
		.accentPalette('grey', {
			'default': '700'
		})//
		.warnPalette('red')
		.backgroundPalette('grey')
		.dark();

	$mdThemingProvider.alwaysWatchTheme(true);
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbToolbar
@description A toolbar model

Toolbar display list of ui component on top of a view, editor or the main application.

A unique address is used for each toolbar for example

	/demo/view/test

Default toolbar is '/app/toolbar'.

Toolbar is a UI component.

You can add a toolbar into a toolbar, however, do not add them more than two lever.

 */
angular.module('mblowfish-core').factory('MbToolbar', function(MbContainer, $mbActions, $mbComponent) {

	function MbToolbar(configs) {
		MbContainer.call(this, configs);
		this.actions = [];
		this.actionHandlers = {};
		this.components = [];
		this.componentHandlers = {};
		return this;
	};

	// Circle derives from Shape
	MbToolbar.prototype = Object.create(MbContainer.prototype);
	var supper = MbContainer.prototype;

	MbToolbar.prototype.render = function(locals) {
		var ctrl = this;
		locals.$toolbar = ctrl;
		return supper.render.call(this, locals)
			.then(function() {
				return loadItems(ctrl);
			})
			.then(function() {
				return ctrl.$handler;
			});
	};

	MbToolbar.prototype.addAction = function(action) {
		if (_.isUndefined(this.$handler)) {
			this.actions.push(action);
			return;
		}
		// keep action handler
		var toolbar = this;
		return loadComponent(toolbar, action).then(function(handler) {
			toolbar.actionHandlers[action.id] = handler;
			return handler;
		});
	};

	MbToolbar.prototype.removeAction = function(action) {
		var handler = toolbar.actionHandlers[action.id];
		delete toolbar.actionHandlers[action.id];
		handler.destroy();
	};

	MbToolbar.prototype.addComponent = function(component) {
		// keep action handler
		var toolbar = this;
		return loadComponent(toolbar, component).then(function(handler) {
			toolbar.componentHandlers[component.id] = handler;
			return handler;
		});
	};

	MbToolbar.prototype.removeComponent = function(component) {
		var handler = toolbar.componentHandlers[component.id];
		delete toolbar.componentHandlers[component.id];
		handler.destroy();
	};

	/*
	Loads all toolbar items
	*/
	function loadItems(toolbar) {
		var items = toolbar.items || [];
		_.forEach(items, function(itemId) {
			// get item
			var item = $mbActions.getAction(itemId);
			if (item) {
				toolbar.addAction(item);
				return;
			}
			item = $mbComponent.get(itemId);
			if (item) {
				toolbar.addComponent(item);
				return;
			}
			// TODO: maso, 2020: add log
		});

		// adding dynamci action
		_.forEach(toolbar.actions, function(action) {
			toolbar.addAction(action);
		});
		toolbar.actions = [];
	}


	function loadComponent(toolbar, component) {
		var handler = toolbar.$handler;
		// create place holder
		var element = angular.element('<mb-toolbar-item></mb-toolbar-item>');
		handler.$element.append(element);

		// render the item
		return component.render({
			$toolbar: toolbar,
			$element: element,
			$rootScope: handler.$scope
		});
	}

	return MbToolbar;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc directive
@name mb-toolbar-group
@description An ancher to load a list of toolbars

This is used to add a toolbar into the view.

It is not possible to add a toolbar with aa specific url into the view more than one time.

@example
	<mb-toolbar-group
		mb-url="/app/main"
		mb-default="true"
		mb-toolbars="['/app/main', '/app/editor/save', '/app/print']">
	</mb-toolbar-group>


 */
angular.module('mblowfish-core').directive('mbToolbarGroup', function($mbToolbar, $mbTheming) {


	function link($scope, $element, $attr, $ctrl) {
		// 0- init UI
		$element.empty();
		$mbTheming($element);

		// 1- load toolbars
		var toolbarIds = $scope.$eval($attr.mbToolbars);
		_.forEach(toolbarIds, function(toolbarId) {
			var toolbar = $mbToolbar.getToolbar(toolbarId);
			if (toolbar) {
				$ctrl.addToolbar(toolbar);
			} else {
				// TODO: maso, 2020: add a log to show the error
			}
		})

		// 2- register toolbar group
		$mbToolbar.addToolbarGroup($attr.mbUrl, $ctrl);
		if (!_.isUndefined($attr.mbDefault)) {
			$mbToolbar.setMainToolbarGroup($ctrl);
		}

		$scope.$on('$destroy', function() {
			$ctrl.destroy();
		});
	}

	return {
		restrict: 'E',
		replace: false,
		priority: 400,
		require: 'mbToolbarGroup',
		/* @ngInject */
		controller: function($scope, $element) {
			this.handlers = {};

			this.addToolbar = function(toolbar) {
				if(_.isString(toolbar)){
					toolbar = $mbToolbar.getToolbar(toolbar);
				}
				if (!_.isUndefined(this.handlers[toolbar.url])) {
					// FIXME: log and throw exception: the toolbar is added befor
					return;
				}
				// reserve a postions
				var element = angular.element('<mb-toolbar></mb-toolbar>');
				element.attr('id', toolbar.url);
				$element.append(element);

				// render toolbar
				var ctrl = this;
				toolbar.render({
					$rootScope: $scope,
					$toolbarGroup: ctrl,
					$element: element
				}).then(function(handler) {
					ctrl.handlers[toolbar.url] = handler;
				});
				return this;
			};

			this.removeToolbar = function(toolbar) {
				var url = toolbar;
				if(toolbar instanceof MbToolbar){
					url = toolbar.url;
				}
				if (_.isUndefined(this.handler[url])) {
					// TODO: maso, 2020: toolbar not exist, add a warning log
					return this;
				}
				var handler = this.handler[url];
				delete this.handler[url];
				handler.destroy();
				return this;
			};

			this.destoy = function() {
				var handlers = this.handlers;
				_.forEach(handlers, function(handler) {
					handler.destroy();
				});
				delete this.handler;
				$element.remove();
				// FIXME: maso, 2020: check if the scope is destroyed before
				$scope.$destroy();
			};
		},
		controllerAs: 'ctrl',
		link: link
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
@ngdoc Services
@name $mbToolbarProvider
@description Initialize the toolbar service

The main goole is to set default main toolbar layout.

You may enable dynamic toolbar.

*/
/**
@ngdoc Services
@name $mbToolbar
@description Manages list of toolbars.

You can register a toolbar with an url. For example

	/demo/view/test

All icons will be managed
 */
angular.module('mblowfish-core').provider('$mbToolbar', function() {
	
	//-----------------------------------------------------------------------------------
	// Type and service
	//-----------------------------------------------------------------------------------
	var Toolbar;

	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------
	var mainToolbarConfig = [];
	var toolbars = {};
	var toolbarGroups = {};
	var toolbarGroupsConfig = {};


	//-----------------------------------------------------------------------------------
	// Functions
	// TODO: load toolbar config from local storage
	//-----------------------------------------------------------------------------------
	function addToolbar(toolbarId, toolbar) {
		if (!(toolbar instanceof Toolbar)) {
			toolbar = new Toolbar(_.assign(toolbar, {
				url: toolbarId
			}));
		}
		if(toolbars[toolbarId]){
			// TODO: merge old toolbar with new one
			// toolbar.merge(toolbars[toolbarId]);
			var items = toolbars[toolbarId].items;
			var titems = toolbar.items;
			toolbar = _.assign(toolbar, toolbars[toolbarId]);
			toolbar.items = _.concat(items, titems);
		}
		toolbars[toolbarId] = toolbar;
		return toolbar;
	}

	function removeToolbar(toolbarId) {
		var toolbar = toolbars[toolbarId];
		if (toolbar) {
			toolbar.destroy();
		}
		delete toolbars[toolbarId];
	}


	function getToolbar(toolbarId) {
		var toolbar = toolbars[toolbarId];
		if(!toolbar){
			return addToolbar(toolbarId, {});
		}
		return toolbar;
	}

	function loadDefaultToolbars() {
		_.forEach(mainToolbarConfig, function(toolbarConfig) {
			var toolbar = new Toolbar(toolbarConfig);
			addToolbar(toolbarConfig.url, toolbar);
		});
	}

	function addToolbarGroup(toolbarGroupId, toolbarGroup) {
		// TODO: maso, 2020: support lazy load of a toolbar
		toolbarGroups[toolbarGroupId] = toolbarGroup;
		toolbarGroupConfig = toolbarGroupsConfig[toolbarGroupId];
		if (toolbarGroupConfig) {
			_.forEach(toolbarGroupConfig, function(toolbar) {
				toolbarGroup.addToolbar(toolbar);
			});
		}
	}


	function getToolbarGroup(toolbarGroupId) {
		if (_.isUndefined(toolbarGroupId)) {
			toolbarGroupId = '/app/main'
		}
		// TODO: maso,2020: support lazy load of toolbar groups
		var toolbarGroup = toolbarGroups[toolbarGroupId];
		var toolbarGroupConfig = toolbarGroupsConfig[toolbarGroupId];
		if (_.isUndefined(toolbarGroupConfig)) {
			toolbarGroupsConfig[toolbarGroupId] = toolbarGroupConfig = [];
		}
		var wrapper = {
			addToolbar: function(toolbar) {
				toolbarGroupConfig.push(toolbar);
				if (toolbarGroup) {
					toolbarGroup.addToolbar(toolbar);
				}
				return this;
			},
			removeToolbar: function(toolbar) {
				const index = toolbarGroupConfig.indexOf(toolbar);
				if (index > -1) {
					toolbarGroupConfig.splice(index, 1);
				}
				if (toolbarGroup) {
					toolbarGroup.removeToolbar(toolbar);
				}
				return this;
			},
			destroty: function() {
				toolbarGroupsConfig[toolbarGroupId] = [];
				toolbarGroupConfig = toolbarGroupsConfig[toolbarGroupId];
				if (toolbarGroup) {
					toolbarGroup.destroy();
				}
			}
		};
		return wrapper;
	}

	function removeToolbarGroup(toolbarGroupId) {
		// TODO:
	}

	/** 
	Initialize the default toolbar layout.
	
	@memberof $mbToolbarProvider
	*/
	function init(config) {
		mainToolbarConfig = config || [];
	}

	//-----------------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------------
	return {
		/* @ngInject */
		$get: function(MbToolbar) {
			Toolbar = MbToolbar;

			loadDefaultToolbars();

			// To manage toolbars ()
			this.getToolbar = getToolbar;
			this.addToolbar = addToolbar;
			this.removeToolbar = removeToolbar;

			// To manage toolbars group
			this.addToolbarGroup = addToolbarGroup;
			this.getToolbarGroup = getToolbarGroup;
			this.removeToolbarGroup = removeToolbarGroup;

			return this;
		},
		init: init
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbUiHandler
@description An handler to a ui component or container

It handles visible part of components or containers.

 */
angular.module('mblowfish-core').factory('MbUiHandler', function() {

	function MbUiHandler(configs) {
		_.assign(this, configs);
	};

	// Circle derives from Shape
	MbUiHandler.prototype = Object.create(Object.prototype);

	MbUiHandler.prototype.destroy = function() {
		if (this.$isDestoried) {
			// TODO: maso, 2020: add a log
			return;
		}
		this.$isDestoried = true;
		try {
			this.$scope.$destroy();
			delete this.$scope;
		} catch (err) {
			// TODO: log
		}

		try {
			if (this.$keepRootElement) {
				this.$element.empty();
			} else {
				this.$element.remove();
			}
			delete this.$element;
		} catch (err) {
			// TODO: log
		}

		delete this.$controller;
	};


	MbUiHandler.prototype.isDestroied = function() {
		return this.$isDestoried;
	};

	MbUiHandler.prototype.setVisible = function(visible) {
		// XXX: maso, 2020: set display none
	};

	MbUiHandler.prototype.isVisible = function() {
		// XXX: maso, 2020: check if the display of the element is not none
		return false;
	};

	return MbUiHandler;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
@ngdoc service
@name $mbUiUtil
@description Common function used in ui
 */
angular.module('mblowfish-core').service('$mbUiUtil', function(
	/* MBlowfish */ $mbUtil,
	/* AngularJS */ $templateRequest, $sce) {


	/**
	@param {string} path - The path to parse. (It is assumed to have query and hash stripped off.)
	@param {Object} opts - Options.
	@return {Object} - An object containing an array of path parameter names (`keys`) and a regular
	    expression (`regexp`) that can be used to identify a matching URL and extract the path
	    parameter values.
	
	@description
	Parses the given path, extracting path parameter names and a regular expression to match URLs.
	
	Originally inspired by `pathRexp` in `visionmedia/express/lib/utils.js`.

	@memberof $mbUiUtil
	 */
	this.routeToRegExp = function(path, opts) {
		var keys = [];

		var pattern = path
			.replace(/([().])/g, '\\$1')
			.replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function(_, slash, key, option) {
				var optional = option === '?' || option === '*?';
				var star = option === '*' || option === '*?';
				keys.push({ name: key, optional: optional });
				slash = slash || '';
				return (
					(optional ? '(?:' + slash : slash + '(?:') +
					(star ? '(.+?)' : '([^/]+)') +
					(optional ? '?)?' : ')')
				);
			})
			.replace(/([/$*])/g, '\\$1');

		if (opts.ignoreTrailingSlashes) {
			pattern = pattern.replace(/\/+$/, '') + '/*';
		}

		return {
			keys: keys,
			regexp: new RegExp(
				'^' + pattern + '(?:[?#]|$)',
				opts.caseInsensitiveMatch ? 'i' : ''
			)
		};
	};


	/**
	 * @param on {string} current url
	 * @param route {Object} route regexp to match the url against
	 * @return {?Object}
	 *
	 * @description
	 * Check if the route matches the current url.
	 *
	 * Inspired by match in
	 * visionmedia/express/lib/router/router.js.


	@memberof $mbUiUtil
	 */
	this.switchRouteMatcher = function(on, route) {
		var keys = route.keys,
			params = {};

		if (!route.regexp) return null;

		var m = route.regexp.exec(on);
		if (!m) return null;

		for (var i = 1, len = m.length; i < len; ++i) {
			var key = keys[i - 1];

			var val = m[i];

			if (key && val) {
				params[key.name] = val;
			}
		}
		return params;
	};

	this.inherit = function(parent, extra) {
		return angular.extend(Object.create(parent), extra);
	};

	this.getTemplateFor = function(route) {
		var template, templateUrl;
		if ($mbUtil.isDefined(template = route.template)) {
			if (angular.isFunction(template)) {
				template = template(route.params);
			}
		} else if ($mbUtil.isDefined(templateUrl = route.templateUrl)) {
			if (angular.isFunction(templateUrl)) {
				templateUrl = templateUrl(route.params);
			}
			if ($mbUtil.isDefined(templateUrl)) {
				route.loadedTemplateUrl = $sce.valueOf(templateUrl);
				template = $templateRequest(templateUrl);
			}
		}
		return template;
	};

	this.frameToUrl = function(frame) {
		return frame.url + '?' + $.param(frame.state);
	};

	return this;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbView
@description An system view

A view is consists fo a toolbar, menu and the main view. You are free to 
contributes directly into them.

 */
angular.module('mblowfish-core').factory('MbView', function(MbFrame) {

	function MbView(configs) {
		// Call constructor of superclass to initialize superclass-derived members.
		MbFrame.call(this, configs);
		return this;
	};
	// Circle derives from Shape
	MbView.prototype = Object.create(MbFrame.prototype);

	MbView.prototype.render = function(locals) {
		locals.$view = this;
		return MbFrame.prototype.render.call(this, locals);
	};

	return MbView;
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Serivces
@name $mbView
@description Manages list of views 

View is a singletone page whit a unique path in the system. 

It is not possiblet to create (or register a view) with parametirzed path.

There may be some additional parameters for a view which is send to the view by 
query parameters.

Here is list of services related to an specific view:

- $params: list of param from query
- $view: related view controller (controll the view in layout system)
- $element: HTML view
- $scope: data scope of the view

These are injectable to view contrller.

Note: A Toolbar with the same path will be registerd for a view.

Note: A Menu with the same path will be registerd fro a view.


 */
angular.module('mblowfish-core').provider('$mbView', function() {


	//-----------------------------------------------------------------------------------
	// Service and Factory
	//-----------------------------------------------------------------------------------
	var provider;
	var service;

	var mbRoute;
	var rootScope;
	var View;


	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------
	var views = {};
	var viewsConfig = {};
	var viewsRootScope;


	//-----------------------------------------------------------------------------------
	// functions
	//-----------------------------------------------------------------------------------
	function addView(name, viewConfig) {
		var config = _.assign({
			id: name,
			url: name,
			rootScope: viewsRootScope,
			isView: true,
			reloadOnSearch: false,
			reloadOnUrl: true,
		}, viewConfig)
		// create view
		var view = new View(config);
		views[name] = view;
		// Add to routes
		mbRoute.when(name, config);
		// TODO: Add toolbar
		// TODO: Add menu

		return service;
	};

	function getView(name) {
		return views[name];
	};

	function hasView(name) {
		var view = get(name);
		return !_.isUndefined(view);
	};

	/**
	Fetch a View 
	
	If the view is open, then se send focus to it and other parameters will be ignored.
	
	State will be saved by the layout system and used in launch time. It is accessible with $state from the
	view controller. If the controller changes the state then, it will be stored and used in the next time.
	
	The param is reserved in the state and it is forbiden to be canged by the controllers.
	
	Anchore is used for the first time. 
	It may be changed by the user.
	The layout system is responsible to track the location of the view.
	
	@name fetch
	@memberof $mbView
	@param {string} url The name/URL of the view
	@param {Object} state List of key-value to use in view (it is accessable with $state from view controller)
	@param {string} anchor Where the view placed.
	 */
	function fetchView(name, state, anchor) {
		var view = this.get(name);
		anchor = anchor || view.anchor;
		if (_.isUndefined(view)) {
			// TODO: maso, 2020: View not found throw error
			return;
		}
		if (view.isVisible()) {
			return view.setFocus();
		}
		return view
			.setAnchor(anchor)
			.setState(state);
	};

	function open(name, state, anchor) {
		return fetch(name, state, anchor)
			.setVisible(true);
	}

	function getViews() {
		return views;
	};

	function getScope() {
		return viewsRootScope;
	}

	function init() {
		// Load all views
		_.forEach(viewsConfig, function(viewConfig, viewId) {
			addView(viewId, viewConfig);
		})
	}

	//-----------------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------------
	service = {
		add: addView,
		get: getView,
		has: hasView,
		fetch: fetchView,
		open: open,
		getViews: getViews
	};
	provider = {
		$get: function(
		/* AngularJS */ $rootScope,
		/* Mblowfish */ $mbRoute, MbView) {
			// Service
			rootScope = $rootScope;
			mbRoute = $mbRoute;
			View = MbView;

			init();
			return service;
		},
		addView: function(viewId, viewConfig) {
			viewsConfig[viewId] = viewConfig;
			return provider;
		}
	}
	return provider;
});

angular.module('mblowfish-core').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/dialogs/mb-alert.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <mb-icon>error</mb-icon> <h2 mb-translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p mb-translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-confirm.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <mb-icon>warning</mb-icon> <h2 mb-translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(true) aria-label=done> <mb-icon aria-label=Done>done</mb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p mb-translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-prompt.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <mb-icon>input</mb-icon> <h2 mb-translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(config.model) aria-label=done> <mb-icon aria-label=Done>done</mb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-padding layout-align=\"center stretch\" flex> <p mb-translate>{{config.message}}</p> <md-input-container class=md-block> <label mb-translate>Input value</label> <input ng-model=config.model aria-label=\"input value\"> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mbl-add-word.html',
    "<md-dialog ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <h2 mb-translate>Add new word</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> <md-button class=md-icon-button ng-click=answer(word)> <mb-icon aria-label=\"Close dialog\">done</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-align=\"center stretch\" layout-padding flex> <span flex=10></span> <md-input-container class=md-block flex-gt-sm> <label mb-translate=\"\">Key</label> <input ng-model=word.key> </md-input-container> <md-input-container class=md-block flex-gt-sm> <label mb-translate=\"\">mb-translate</label> <input ng-model=word.mb-translate> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mbl-update-language.html',
    "<md-dialog ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <h2 mb-translate>{{::config.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> <md-button class=md-icon-button ng-click=answer(config.language)> <mb-icon aria-label=\"Close dialog\">done</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-align=\"center stretch\" layout-padding flex> <div layout=column> <md-input-container> <label mb-translate>Key</label> <input ng-model=config.language.key ng-readonly=true> </md-input-container> <md-input-container> <label mb-translate>Title</label> <input ng-model=config.language.title ng-readonly=true> </md-input-container> </div> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource-single-page.html',
    "<md-dialog aria-label=\"Select item/items\" style=\"width:50%; height:70%\"> <form ng-cloak layout=column flex> <md-dialog-content flex layout=row> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row> <span flex></span> <md-button ng-click=ctrl.cancel() aria-label=Cancel> <span mb-translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=ctrl.answer()> <span mb-translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource.html',
    "<md-dialog aria-label=\"Select item/items\" style=\"width:70%; height:70%\"> <form ng-cloak layout=column flex> <md-dialog-content flex layout=row> <md-sidenav class=md-sidenav-left md-component-id=left md-is-locked-open=true md-whiteframe=4 layout=column> <div style=\"text-align: center\"> <mb-icon size=64px ng-if=ctrl.style.icon>{{::ctrl.style.icon}}</mb-icon> <h2 style=\"text-align: center\" mb-translate>{{::ctrl.style.title}}</h2> <p style=\"text-align: center\" mb-translate>{{::ctrl.style.description}}</p> </div> <md-devider></md-devider> <md-content> <md-list style=\"padding:0px; margin: 0px\"> <md-list-item ng-repeat=\"page in ctrl.pages | orderBy:priority\" ng-click=\"ctrl.loadPage(page, $event);\" md-colors=\"ctrl.isPageVisible(page) ? {background:'accent'} : {}\"> <mb-icon>{{::(page.icon || 'attachment')}}</mb-icon> <p mb-translate>{{::page.title}}</p> </md-list-item> </md-list> </md-content> </md-sidenav> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row> <span flex></span> <md-button aria-label=Cancel ng-click=ctrl.cancel()> <span mb-translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=ctrl.answer()> <span mb-translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/directives/mb-captcha.html',
    "<div>  <div vc-recaptcha ng-model=ctrl.captchaValue theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.key lang=\"app.captcha.language || 'fa'\"> </div>  </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-form.html',
    "<div layout=column ng-repeat=\"prop in mbParameters track by $index\"> <md-input-container ng-show=\"prop.visible && prop.editable\" class=\"md-icon-float md-icon-right md-block\"> <label>{{prop.title}}</label> <input ng-required=\"{{prop.validators && prop.validators.indexOf('NotNull')>-1}}\" ng-model=values[prop.name] ng-change=\"modelChanged(prop.name, values[prop.name])\"> <mb-icon ng-show=hasResource(prop) ng-click=setValueFor(prop)>more_horiz</mb-icon>  </md-input-container> </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-tabs.html',
    "<div layout=column> <md-tabs md-selected=pageIndex> <md-tab ng-repeat=\"tab in mbTabs\"> <span mb-translate>{{tab.title}}</span> </md-tab> </md-tabs> <div id=mb-dynamic-tabs-select-resource-children> </div> </div>"
  );


  $templateCache.put('views/directives/mb-inline.html',
    "<div style=\"cursor: pointer\" ng-switch=mbInlineType>  <div ng-switch-when=image class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" md-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateImage() ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom md-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateImage()> <mb-icon>photo_camera </mb-icon></md-button> </div> </div>  <div ng-switch-when=file class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" md-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateFile() ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom md-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateFile()> <mb-icon>file </mb-icon></md-button> </div> </div>  <div ng-switch-when=datetime> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save() mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div> <div ng-switch-when=date> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save() mb-date-format=YYYY-MM-DD mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div>                                                                                                                                           <div ng-switch-default> <input wb-on-enter=ctrlInline.save() wb-on-esc=ctrlInline.cancel() ng-model=ctrlInline.model ng-show=ctrlInline.editMode> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div>  <div ng-messages=error.message> <div ng-message=error class=md-input-message-animation style=\"margin: 0px\">{{error.message}}</div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-navigation-bar.html',
    "<div class=mb-navigation-path-bar md-colors=\"{'background-color': 'primary'}\" layout=row> <div layout=row> <md-button ng-click=goToHome() aria-label=Home class=\"mb-navigation-path-bar-item mb-navigation-path-bar-item-home\"> <md-tooltip ng-if=menu.tooltip md-delay=1500> <span mb-translate>home</span> </md-tooltip> <mb-icon>home</mb-icon> </md-button> </div> <div layout=row data-ng-repeat=\"menu in pathMenu.items | orderBy:['-priority']\"> <mb-icon>{{app.dir==='rtl' ? 'chevron_left' : 'chevron_right'}}</mb-icon> <md-button ng-show=isVisible(menu) ng-href={{menu.url}} ng-click=menu.exec($event); class=mb-navigation-path-bar-item> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> <span mb-translate>{{::menu.title}} </span></md-button> </div> </div>"
  );


  $templateCache.put('views/directives/mb-pagination-bar.html',
    "<div layout=column> <div class=wrapper-stack-toolbar-container style=\"border-radius: 0px\">  <div md-colors=\"{background: 'primary-hue-1'}\"> <div class=md-toolbar-tools> <md-button ng-if=mbIcon md-no-ink class=md-icon-button aria-label={{::mbIcon}}> <mb-icon>{{::mbIcon}}</mb-icon> </md-button> <h2 flex md-truncate ng-if=mbTitle>{{::mbTitle}}</h2> <md-button ng-if=mbReload class=md-icon-button aria-label=Reload ng-click=__reload()> <mb-icon>repeat</mb-icon> </md-button> <md-button ng-show=mbSortKeys class=md-icon-button aria-label=Sort ng-click=\"showSort = !showSort\"> <mb-icon>sort</mb-icon> </md-button> <md-button ng-show=filterKeys class=md-icon-button aria-label=Sort ng-click=\"showFilter = !showFilter\"> <mb-icon>filter_list</mb-icon> </md-button> <md-button ng-show=mbEnableSearch class=md-icon-button aria-label=Search ng-click=\"showSearch = true; focusToElement('searchInput');\"> <mb-icon>search</mb-icon> </md-button> <md-button ng-if=exportData class=md-icon-button aria-label=Export ng-click=exportData()> <mb-icon>save</mb-icon> </md-button> <span flex ng-if=!mbTitle></span> <md-menu ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdOpenMenu($event)> <mb-icon>more_vert</mb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=\"runAction(item, $event)\" aria-label={{::item.title}}> <mb-icon ng-show=item.icon>{{::item.icon}}</mb-icon> <span mb-translate=\"\">{{::item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSearch> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSearch = false\" aria-label=Back> <mb-icon class=icon-rotate-180-for-rtl>arrow_back</mb-icon> </md-button> <md-input-container flex md-theme=dark md-no-float class=\"md-block fit-input\"> <input id=searchInput placeholder=\"{{::'Search'|translate}}\" ng-model=query.searchTerm ng-change=searchQuery() ng-model-options=\"{debounce: 1000}\"> </md-input-container> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSort> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSort = false\" aria-label=Back> <mb-icon class=icon-rotate-180-for-rtl>arrow_back</mb-icon> </md-button> <h3 mb-translate=\"\">Sort</h3> <span style=\"width: 10px\"></span>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <h3>{{mbSortKeysTitles ? mbSortKeysTitles[mbSortKeys.indexOf(query.sortBy)] : query.sortBy | translate}}</h3> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"key in mbSortKeys\"> <md-button ng-click=\"query.sortBy = key; setSortOrder()\"> <mb-icon ng-if=\"query.sortBy === key\">check_circle</mb-icon> <mb-icon ng-if=\"query.sortBy !== key\">radio_button_unchecked</mb-icon> {{::mbSortKeysTitles ? mbSortKeysTitles[$index] : key| translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <mb-icon ng-if=!query.sortDesc class=icon-rotate-180>filter_list</mb-icon> <mb-icon ng-if=query.sortDesc>filter_list</mb-icon> {{query.sortDesc ? 'Descending' : 'Ascending'|translate}} </md-button> <md-menu-content width=4> <md-menu-item> <md-button ng-click=\"query.sortDesc = false;setSortOrder()\"> <mb-icon ng-if=!query.sortDesc>check_circle</mb-icon> <mb-icon ng-if=query.sortDesc>radio_button_unchecked</mb-icon> {{::'Ascending'|translate}} </md-button> </md-menu-item> <md-menu-item> <md-button ng-click=\"query.sortDesc = true;setSortOrder()\"> <mb-icon ng-if=query.sortDesc>check_circle</mb-icon> <mb-icon ng-if=!query.sortDesc>radio_button_unchecked</mb-icon> {{::'Descending'|translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showFilter> <div layout=row layout-align=\"space-between center\" class=md-toolbar-tools> <div layout=row> <md-button style=min-width:0px ng-click=\"showFilter = false\" aria-label=Back> <mb-icon class=icon-rotate-180-for-rtl>arrow_back</mb-icon> </md-button> <h3 mb-translate=\"\">Filters</h3> </div> <div layout=row> <md-button ng-if=\"filters && filters.length\" ng-click=applyFilter() class=md-icon-button> <mb-icon>done</mb-icon> </md-button> <md-button ng-click=addFilter() class=md-icon-button> <mb-icon>add</mb-icon> </md-button> </div> </div> </div> </div>  <div layout=column md-colors=\"{background: 'primary-hue-1'}\" ng-show=\"showFilter && filters.length>0\" layout-padding>  <div ng-repeat=\"filter in filters track by $index\" layout=row layout-align=\"space-between center\" style=\"padding-top: 0px;padding-bottom: 0px\"> <div layout=row style=\"width: 50%\"> <md-input-container style=\"padding: 0px;margin: 0px;width: 20%\"> <label mb-translate=\"\">Key</label> <md-select name=filter ng-model=filter.key ng-change=\"showFilterValue=true;\" required> <md-option ng-repeat=\"key in filterKeys\" ng-value=key> <span mb-translate=\"\">{{key}}</span> </md-option> </md-select> </md-input-container> <span flex=5></span> <md-input-container style=\"padding: 0px;margin: 0px\" ng-if=showFilterValue> <label mb-translate=\"\">Value</label> <input ng-model=filter.value required> </md-input-container> </div> <md-button ng-if=showFilterValue ng-click=removeFilter(filter,$index) class=md-icon-button> <mb-icon>delete</mb-icon> </md-button> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-pay.html',
    "<div layout=column>  <div layout=column> <md-progress-linear style=min-width:50px ng-if=\"ctrl.loadingGates || ctrl.paying\" md-mode=indeterminate class=md-accent md-color> </md-progress-linear> <div layout=column ng-if=\"!ctrl.loadingGates && ctrl.gates.length\"> <p mb-translate>Select gate to pay</p> <div layout=row layout-align=\"center center\"> <md-button ng-repeat=\"gate in ctrl.gates\" ng-click=ctrl.pay(gate)> <img ng-src={{::gate.symbol}} style=\"max-height: 64px;border-radius: 4px\" alt={{::gate.title}}> </md-button> </div> </div> <div layout=row ng-if=\"!ctrl.loadingGates && ctrl.gates && !ctrl.gates.length\" layout-align=\"center center\"> <p style=\"color: red\"> <span mb-translate>No gate is defined for the currency of the wallet.</span> </p> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-preference-page.html',
    "<div id=mb-preference-body layout=row layout-margin flex> </div>"
  );


  $templateCache.put('views/directives/mb-titled-block.html',
    "<div layout=column style=\"border-radius: 5px; padding: 0px\" class=md-whiteframe-2dp> <md-toolbar class=md-hue-1 layout=row style=\"border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px; padding: 0px\"> <div layout=row layout-align=\"start center\" class=md-toolbar-tools> <mb-icon size=24px style=\"margin: 0;padding: 0px\" ng-if=mbIcon>{{::mbIcon}}</mb-icon> <h3 mb-translate=\"\" style=\"margin-left: 8px; margin-right: 8px\">{{::mbTitle}}</h3> </div> <md-menu layout-align=\"end center\" ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdMenu.open($event)> <mb-icon>more_vert</mb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=$evalAction(item) aria-label={{::item.title}}> <mb-icon ng-show=item.icon>{{::item.icon}}</mb-icon> <span mb-translate=\"\">{{::item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar> <md-progress-linear ng-style=\"{'visibility': mbProgress?'visible':'hidden'}\" md-mode=indeterminate class=md-primary> </md-progress-linear> <div flex ng-transclude style=\"padding: 16px\"></div> </div>"
  );


  $templateCache.put('views/directives/mb-user-menu.html',
    "<div md-colors=\"{'background-color': 'primary-hue-1'}\" class=amd-user-menu> <md-menu md-offset=\"0 20\"> <md-button class=amd-user-menu-button ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <img height=32px class=img-circle style=\"border-radius: 50%; vertical-align: middle\" ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> <span>{{app.user.profile.first_name}} {{app.user.profile.last_name}}</span> <mb-icon class=material-icons>keyboard_arrow_down</mb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items| orderBy:['-priority']\"> <md-button ng-click=item.exec($event) mb-translate=\"\"> <mb-icon ng-if=item.icon>{{::item.icon}}</mb-icon> <span ng-if=item.title mb-translate>{{::item.title}}</span> </md-button> </md-menu-item> <md-menu-divider ng-if=menu.items.length></md-menu-divider> <md-menu-item> <md-button ng-click=settings()> <span mb-translate>Settings</span> </md-button> </md-menu-item> <md-menu-item ng-if=!app.user.anonymous> <md-button ng-click=logout()> <span mb-translate>Logout</span> </md-button> </md-menu-item> <md-menu-item ng-if=app.user.anonymous> <md-button ng-href=users/login> <span mb-translate=\"\">Login</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div>"
  );


  $templateCache.put('views/directives/mb-user-toolbar.html',
    "<md-toolbar layout=row layout-align=\"center center\"> <img width=80px class=img-circle ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar> <md-menu md-offset=\"0 20\"> <md-button class=capitalize ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <span>{{::app.user.profile.first_name}} {{::app.user.profile.last_name}}</span> <mb-icon class=material-icons>keyboard_arrow_down</mb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items | orderBy:['-priority']\"> <md-button ng-click=item.exec($event) mb-translate> <mb-icon ng-if=item.icon>{{::item.icon}}</mb-icon> <span ng-if=item.title mb-translate>{{::item.title}}</span> </md-button> </md-menu-item> <md-menu-divider></md-menu-divider> <md-menu-item> <md-button ng-click=toggleRightSidebar();logout(); mb-translate>Logout</md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar>"
  );


  $templateCache.put('views/mb-application-preloading.html',
    "<div> Loading ... </div>"
  );


  $templateCache.put('views/mb-error-messages.html',
    "<div ng-message=403 layout=column layout-align=\"center center\"> <mb-icon size=64px>do_not_disturb</mb-icon> <strong mb-translate>Access denied</strong> <p mb-translate>You are not allowed to access this item.</p> </div> <div ng-message=404 layout=column layout-align=\"center center\"> <mb-icon size=64px>visibility_off</mb-icon> <strong mb-translate>Not found</strong> <p mb-translate>Requested item not found.</p> </div> <div ng-message=500 layout=column layout-align=\"center center\"> <mb-icon size=64px>bug_report</mb-icon> <strong mb-translate>Server error</strong> <p mb-translate>An internal server error is occurred.</p> </div>"
  );


  $templateCache.put('views/mb-initial.html',
    "<div layout=column flex> <md-content layout=column flex> {{basePath}} <mb-preference-page mb-preference-id=currentStep.id> </mb-preference-page> </md-content> <md-stepper id=setting-stepper ng-show=steps.length md-mobile-step-text=false md-vertical=false md-linear=false md-alternative=true> <md-step ng-repeat=\"step in steps\" md-label=\"{{step.title | translate}}\"> </md-step> </md-stepper> </div>"
  );


  $templateCache.put('views/mb-languages.html',
    "<div ng-controller=\"MbLanguagesCtrl as ctrl\" layout=row flex> <md-sidenav class=md-sidenav-left md-component-id=lanaguage-manager-left md-is-locked-open=true md-whiteframe=4> <md-content> <md-toolbar> <div class=md-toolbar-tools> <label flex mb-translate=\"\">Languages</label> <md-button ng-click=ctrl.addLanguage() class=md-icon-button aria-label=\"Add new language\"> <mb-icon>add</mb-icon> </md-button> <md-button class=md-icon-button aria-label=\"Upload a language\"> <mb-icon>more_vert</mb-icon> </md-button> </div> </md-toolbar> <div> <md-list> <md-list-item ng-repeat=\"lang in app.config.languages\" ng-click=ctrl.setLanguage(lang)> <p mb-translate=\"\">{{lang.title}}</p> <md-button class=md-icon-button ng-click=ctrl.saveAs(lang) aria-label=\"Save language as a file\"> <mb-icon>download</mb-icon> <md-tooltip md-direction=left md-delay=1500> <span mb-translate>Save language as a file</span> </md-tooltip> </md-button> <md-button class=md-icon-button ng-click=ctrl.deleteLanguage(lang) aria-label=\"Delete language\"> <mb-icon>delete</mb-icon> <md-tooltip md-direction=left md-delay=1500> <span mb-translate>Delete language</span> </md-tooltip> </md-button> </md-list-item> </md-list> </div> </md-content> </md-sidenav> <md-content flex mb-preloading=working layout-padding> <div ng-if=!ctrl.selectedLanguage layout-padding> <h3 mb-translate>Select a language to view/edit translations.</h3> </div> <fieldset ng-if=ctrl.selectedLanguage> <legend><span mb-translate=\"\">Selected Language</span></legend> <div layout=row layout-align=\"space-between center\"> <label>{{ctrl.selectedLanguage.title}} ({{ctrl.selectedLanguage.key}})</label>            </div> </fieldset> <fieldset ng-if=ctrl.selectedLanguage class=standard> <legend><span mb-translate=\"\">Language map</span></legend> <div layout=column layout-margin> <md-input-container class=\"md-icon-float md-block\" flex ng-repeat=\"(key, value) in ctrl.selectedLanguage.map\"> <label>{{key}}</label> <input ng-model=ctrl.selectedLanguage.map[key] ng-model-options=\"{ updateOn: 'blur', debounce: 3000 }\"> <mb-icon ng-click=ctrl.deleteWord(key)>delete</mb-icon> </md-input-container> </div> <md-button class=\"md-primary md-raised md-icon-button\" ng-click=ctrl.addWord() aria-label=\"Add word to language\"> <mb-icon>add</mb-icon> </md-button> </fieldset> </md-content> </div>"
  );


  $templateCache.put('views/mb-login-default.html',
    "<div class=default-login-panel layout=row layout-align=\"center center\" ng-init=\"state= isAnonymous()? 'login' : 'info';\"> <div md-whiteframe=3 flex=100 flex-gt-sm=50 layout=column>  <md-toolbar layout=row layout-padding md-colors=\"{backgroundColor: 'primary-100'}\">  <img style=\"max-width: 50%\" height=160 ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <div> <h3>{{app.config.title}}</h3> <p>{{ app.config.description | limitTo: 250 }}{{app.config.description.length > 250 ? '...' : ''}}</p> </div> </md-toolbar> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <form id=login ng-show=\"state == 'login'\" name=loginForm ng-submit=ctrl.login(credit) layout=column layout-margin> <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" mb-translate>{{loginMessage}}</span></p> </div> <md-input-container> <label mb-translate=\"\">Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required mb-translate=\"\">This field is required.</div> </div> </md-input-container> <md-input-container> <label mb-translate=\"\">Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container>  <div vc-recaptcha ng-if=\"__tenant.settings['captcha.engine'] === 'recaptcha'\" key=\"__tenant.settings['captcha.engine.recaptcha.key']\" ng-model=credit.g_recaptcha_response theme=\"__app.configs.captcha.theme || 'light'\" type=\"__app.configs.captcha.type || 'image'\" lang=\"__app.setting.local || __app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <md-button href=\"?state=forget\" flex-order=1 flex-order-gt-xs=-1 ng-click=\"state='forget'\"> <span mb-translate>Forgot your password?</span> </md-button> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=\"ctrl.login(credit, loginForm)\"> <span mb-translate>Login</span> </md-button> </div> </form> <div ng-show=\"state=='info'\" id=info> <div layout-margin ng-show=!app.user.anonymous layout=column layout-align=\"none center\"> <img width=150px height=150px ng-show=!uploadAvatar ng-src=\"{{app.user.current.avatar}}\"> <h3>{{app.user.current.login}}</h3> <p mb-translate>you are logged in. go to one of the following options.</p> </div> <div ng-show=!app.user.anonymous layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"center center\" layout-margin> <md-button ng-click=ctrl.cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> <mb-icon>settings_backup_restore</mb-icon> <span mb-translate>Back</span> </md-button> <md-button ng-href=users/account flex-order=1 flex-order-gt-xs=-1 class=md-raised> <mb-icon>account_circle</mb-icon> <span mb-translate>Account</span> </md-button> </div> </div> <div id=forget ng-show=\"state=='forget'\"> <form name=ctrl.myForm ng-submit=sendToken(credit) layout=column layout-margin> <md-input-container> <label mb-translate>Username</label> <input ng-model=credit.login name=username> </md-input-container> <md-input-container> <label mb-translate>Email</label> <input ng-model=credit.email name=email type=email> <div ng-messages=ctrl.myForm.email.$error> <div ng-message=email mb-translate>Email is not valid.</div> </div> </md-input-container>     <div ng-if=\"app.captcha.engine==='recaptcha'\" vc-recaptcha ng-model=credit.g_recaptcha_response theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.recaptcha.key lang=\"app.captcha.language || 'fa'\"> </div> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <md-button ng-disabled=\"(credit.email === undefined && credit.login === undefined) || ctrl.myForm.$invalid\" flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=sendToken(credit)>{{'send recover message' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> <span>cancel</span> </md-button> </div> <div layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"center center\" layout-margin> <md-button ng-click=\"state='login'\" flex-order=0 flex-order-gt-xs=0> <span mb-translate>Login</span> </md-button> </div> </div> </div> </div>"
  );


  $templateCache.put('views/mb-navigator.html',
    "<div layout=column> <md-toolbar class=\"md-whiteframe-z2 mb-navigation-top-toolbar\" layout=column layout-align=\"start center\"> <img width=128px height=128px ng-show=app.config.logo ng-src={{app.config.logo}} ng-src-error=images/logo.svg style=\"min-height: 128px; min-width: 128px\"> <strong>{{app.config.title}}</strong> <p style=\"text-align: center\">{{ app.config.description | limitTo: 100 }}{{app.config.description.length > 150 ? '...' : ''}}</p> </md-toolbar> <md-content class=mb-sidenav-main-menu flex>  <md-list> <md-subheader ng-repeat-start=\"group in groups\" class=md-no-sticky>{{::group.title}}</md-subheader> <md-list-item ng-repeat=\"(url, item) in group.items\" ng-href=./{{::url}}> <mb-icon>{{::(item.icon || 'layers')}}</mb-icon> <p mb-translate>{{::item.title}}</p> </md-list-item> <md-divider ng-repeat-end></md-divider> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/mb-passowrd-recover.html',
    " <md-toolbar layout-padding>  <h3>Forget Your PassWord ?</h3> </md-toolbar>  <div layout=column layout-padding> <md-input-container> <label>Username or Email</label> <input ng-model=credit.login required> </md-input-container> </div> <div layout=column layout-align=none layout-gt-sm=row layout-align-gt-sm=\"space-between center\" layout-padding> <a ui-sref=login flex-order=1 flex-order-gt-sm=-1>Back To Login Page</a> <md-button flex-order=0 class=\"md-primary md-raised\" ng-click=login(credit)>Send</md-button> </div>"
  );


  $templateCache.put('views/mb-preference.html',
    "<md-content style=\"width: 100%; height: 100%; overflow: auto\"> <div id=page-panel></div> </md-content>"
  );


  $templateCache.put('views/mb-preferences.html',
    "<md-content style=\"width: 100%; height: 100%; overflow: auto\"> <md-list ng-cloak> <md-list-item ng-repeat=\"page in pages\" ng-href=preferences/{{::page.id}}> <mb-icon>{{::page.icon}}</mb-icon> <p mb-translate>{{::page.title}}</p> </md-list-item> </md-list> </md-content>"
  );


  $templateCache.put('views/mb-preloading-default.html',
    "<div class=mb-preloading-default> <div class=stage> <img src=resources/images/mb-preloading-blow.svg class=\"box bounce-7\"> </div> </div>"
  );


  $templateCache.put('views/modules/mb-preference.html',
    "<form ng-cloak flex> <md-toolbar class=\"content-sidenavs-toolbar wb-layer-tool-bottom\" layout=row layout-align=\"space-around center\"> <md-button class=md-icon-button ng-click=ctrl.addModule($event)> <mb-icon>add</mb-icon> </md-button> </md-toolbar> <md-dialog-content layout=row flex> <md-content flex> <md-list style=\"width: 100%\"> <md-list-item class=md-3-line ng-repeat=\"item in ctrl.modules\" ng-click=\"ctrl.editModule(item, $event)\"> <mb-icon ng-if=\"item.type == 'css'\">style</mb-icon> <mb-icon ng-if=\"item.type == 'js'\">tune</mb-icon> <div class=md-list-item-text layout=column> <h3>{{ item.title }}</h3> <h4>{{ item.url }}</h4> <p> Load: {{ item.load }}</p> </div> <mb-icon class=\"md-secondary md-icon-button\" ng-click=\"ctrl.deleteModule(item, $event)\" id=action-delete>delete</mb-icon> </md-list-item> </md-list> </md-content> </md-dialog-content> </form>"
  );


  $templateCache.put('views/modules/mb-resources-manual.html',
    "<md-content layout=column layout-padding flex> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label mb-translate>Title</label> <input ng-model=module.title> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label mb-translate>URL</label> <input ng-model=module.url required> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label mb-translate>Type</label> <input ng-model=module.type required placeholder=\"js, css\"> </md-input-container> <md-input-container class=md-block> <label>Load type</label> <md-select ng-model=module.load> <md-option mb-translate=\"\">None</md-option> <md-option ng-value=\"'before'\" mb-translate=\"\">Before Page Load</md-option> <md-option ng-value=\"'lazy'\" mb-translate=\"\">Lazy Load</md-option> <md-option ng-value=\"'after'\" mb-translate=\"\">After Page Load</md-option> </md-select> </md-input-container> </md-content>"
  );


  $templateCache.put('views/options/mb-local.html',
    "<md-divider></md-divider> <md-input-container class=md-block> <label mb-translate>Language & Local</label> <md-select ng-model=app.setting.local> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key mb-translate>{{lang.title}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Direction</label> <md-select ng-model=app.setting.dir placeholder=Direction> <md-option value=rtl mb-translate>Right to left</md-option> <md-option value=ltr mb-translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Calendar</label> <md-select ng-model=app.setting.calendar placeholder=\"\"> <md-option value=Gregorian mb-translate>Gregorian</md-option> <md-option value=Jalaali mb-translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Date format</label> <md-select ng-model=app.setting.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY mb-translate> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD mb-translate> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" mb-translate> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container>"
  );


  $templateCache.put('views/options/mb-theme.html',
    "<md-input-container class=md-block> <label mb-translate>Theme</label> <md-select ng-model=app.setting.theme> <md-option ng-repeat=\"theme in themes\" value={{theme.id}} mb-translate>{{theme.label}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block ng-init=\"app.setting.navigationPath = app.setting.navigationPath || true\"> <md-switch class=md-primary name=special ng-model=app.setting.navigationPath> <sapn flex mb-translate>Navigation path</sapn> </md-switch> </md-input-container>"
  );


  $templateCache.put('views/partials/mb-branding-header-toolbar.html',
    " <md-toolbar layout=row layout-padding md-colors=\"{backgroundColor: 'primary-100'}\">  <img style=\"max-width: 50%\" height=160 ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <div> <h3>{{app.config.title}}</h3> <p>{{ app.config.description | limitTo: 250 }}{{app.config.description.length > 250 ? '...' : ''}}</p> </div> </md-toolbar>"
  );


  $templateCache.put('views/partials/mb-view-access-denied.html',
    "<div id=mb-panel-root-access-denied ng-if=\"status === 'accessDenied'\" layout=column layout-fill> Access Denied </div>"
  );


  $templateCache.put('views/partials/mb-view-loading.html',
    "<div id=mb-view-loading layout=column layout-align=\"center center\" layout-fill> <img width=256px ng-src-error=images/logo.svg ng-src=\"/api/v2/cms/contents/mb-preloading-brand/content\"> <h3>Loading...</h3> <md-progress-linear style=\"width: 50%\" md-mode=indeterminate> </md-progress-linear> <md-button ng-if=\"app.state.status === 'fail'\" class=\"md-raised md-primary\" ng-click=restart() aria-label=Retry> <mb-icon>replay</mb-icon> retry </md-button> </div>"
  );


  $templateCache.put('views/partials/mb-view-login.html',
    "<div ng-if=\"status === 'login'\" layout=row layout-aligne=none layout-align-gt-sm=\"center center\" ng-controller=MbAccountCtrl flex> <div md-whiteframe=3 flex=100 flex-gt-sm=50 layout=column mb-preloading=ctrl.loadUser>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" mb-translate>{{loginMessage}}</span></p> </div> <form name=ctrl.myForm ng-submit=login(credit) layout=column layout-padding> <md-input-container> <label mb-translate>Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label mb-translate>Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container>  <div vc-recaptcha ng-if=\"__tenant.settings['captcha.engine'] === 'recaptcha'\" key=\"__tenant.settings['captcha.engine.recaptcha.key']\" ng-model=credit.g_recaptcha_response theme=\"__app.configs.captcha.theme || 'light'\" type=\"__app.configs.captcha.type || 'image'\" lang=\"__app.setting.local || __app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1>{{'forgot your password?'|translate}}</a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=login(credit)>{{'login'|translate}}</md-button>      </div> </form> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-brand.html',
    "<div layout=column layout-margin ng-cloak flex> <mb-titled-block mb-title=\"{{'Configurations' | translate}}\"> <md-input-container class=md-block> <label mb-translate>Title</label> <input required md-no-asterisk name=title ng-model=\"app.config.title\"> </md-input-container> <md-input-container class=md-block> <label mb-translate>Description</label> <input md-no-asterisk name=description ng-model=\"app.config.description\"> </md-input-container> </mb-titled-block> <div layout=row layout-wrap layout-margin> <mb-titled-block mb-title=\"{{'Brand' | translate}}\"> <mb-inline ng-model=app.config.logo mb-inline-type=image mb-inline-label=\"Application Logo\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.logo}}> </mb-inline> </mb-titled-block> <mb-titled-block mb-title=\"{{'Favicon' | translate }}\"> <mb-inline ng-model=app.config.favicon mb-inline-type=image mb-inline-label=\"Application Favicon\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.favicon}}> </mb-inline> </mb-titled-block> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-language.html',
    " <div layout=column layout-align=\"center center\" layout-margin style=\"min-height: 300px\" flex> <div layout=column layout-align=\"center start\"> <p>{{'Select default language of site:' | translate}}</p> <md-checkbox ng-repeat=\"lang in languages\" style=\"margin: 8px\" ng-checked=\"myLanguage.key === lang.key\" ng-click=setLanguage(lang) aria-label={{lang.key}}> {{lang.title | translate}} </md-checkbox> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-local.html',
    "<div layout=column layout-padding ng-cloak flex> <md-input-container class=\"md-icon-float md-block\"> <label mb-translate>Language</label> <md-select ng-model=__app.configs.language> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key>{{lang.title | translate}}</md-option> </md-select> <mb-icon style=\"cursor: pointer\" ng-click=goToManage()>settings</mb-icon> </md-input-container> <md-input-container class=md-block> <label mb-translate>Direction</label> <md-select ng-model=__app.configs.dir placeholder=Direction> <md-option value=rtl mb-translate>Right to left</md-option> <md-option value=ltr mb-translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Calendar</label> <md-select ng-model=__app.configs.calendar placeholder=\"\"> <md-option value=Gregorian mb-translate>Gregorian</md-option> <md-option value=Jalaali mb-translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Date format</label> <md-select ng-model=__app.configs.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY mb-translate> <span mb-translate>Month Day Year, </span> <span mb-translate>Ex. </span> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD mb-translate> <span mb-translate>Year Month Day, </span> <span mb-translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" mb-translate> <span mb-translate>Year Month Day, </span> <span mb-translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-modules.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p mb-translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p mb-translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/preferences/mb-update.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p mb-translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p mb-translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/resources/mb-accounts.html',
    "<div ng-controller=\"MbSeenUserAccountsCtrl as ctrl\" ng-init=\"ctrl.setDataQuery('{id, login, is_active, date_joined, last_login, profiles{first_name,last_name}, avatars{id}}')\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"user in ctrl.items track by user.id\" ng-click=\"multi || resourceCtrl.setSelected(user)\" class=md-3-line> <img class=md-avatar ng-src=/api/v2/user/accounts/{{::user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{ ::user.id | wbmd5 }}?d=identicon&size=32\"> <div class=md-list-item-text layout=column> <h4>{{user.login}}</h4> <h3>{{user.profiles[0].first_name}} {{user.profiles[0].last_name}}</h3> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"user.selected = resourceCtrl.isSelected(user)\" ng-model=user.selected ng-change=\"resourceCtrl.setSelected(user, user.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-cms-content-upload.html',
    "<div layout=column flex> <lf-ng-md-file-input lf-files=ctrl.files accept=image/* progress preview drag flex> </lf-ng-md-file-input>  <md-content layout-padding> <div layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(_absolutPathFlag) aria-label=\"Absolute path of the image\"> <span mb-translate>Absolute path</span> </md-checkbox> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-cms-images.html',
    "<div layout=column mb-preloading=\"ctrl.state === 'busy'\" ng-init=\"ctrl.addFilter('media_type', 'image')\" flex> <mb-pagination-bar style=\"border-top-right-radius: 10px; border-bottom-left-radius: 10px\" mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=row layout-wrap layout-align=\"start start\" flex> <div ng-click=\"ctrl.setSelected(pobject, $index, $event);\" ng-repeat=\"pobject in ctrl.items track by pobject.id\" style=\"border: 16px; border-style: solid; border-width: 1px; margin: 8px\" md-colors=\"ctrl.isSelected($index) ? {borderColor:'accent'} : {}\" ng-if=!listViewMode> <img style=\"width: 128px; height: 128px\" ng-src=\"{{'/api/v2/cms/contents/'+pobject.id+'/thumbnail'}}\"> </div> <md-list ng-if=listViewMode> <md-list-item ng-repeat=\"pobject in items track by pobject.id\" ng-click=\"ctrl.setSelected(pobject, $index, $event);\" md-colors=\"ctrl.isSelected($index) ? {background:'accent'} : {}\" class=md-3-line> <img ng-if=\"pobject.mime_type.startsWith('image/')\" style=\"width: 128px; height: 128px\" ng-src=/api/v2/cms/contents/{{pobject.id}}/thumbnail> <mb-icon ng-if=\"!pobject.mime_type.startsWith('image/')\">insert_drive_file</mb-icon> <div class=md-list-item-text layout=column> <h3>{{pobject.title}}</h3> <h4>{{pobject.name}}</h4> <p>{{pobject.description}}</p> </div> <md-divider md-inset></md-divider> </md-list-item> </md-list>  <div layout=column layout-align=\"center center\"> <md-progress-circular ng-show=\"ctrl.status === 'working'\" md-diameter=96> Loading ... </md-progress-circular> </div> </md-content> <md-content>  <div layout-padding layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(absolutPathFlag) aria-label=\"Absolute path of the image\"> <span mb-translate>Absolute path</span> </md-checkbox> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-groups.html',
    "<div ng-controller=\"MbSeenUserGroupsCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"group in ctrl.items track by group.id\" ng-click=\"multi || resourceCtrl.setSelected(group)\" class=md-3-line> <mb-icon>group</mb-icon> <div class=md-list-item-text layout=column> <h3>{{group.name}}</h3> <h4></h4> <p>{{group.description}}</p> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"group.selected = resourceCtrl.isSelected(group)\" ng-model=group.selected ng-click=\"resourceCtrl.setSelected(group, group.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item>  </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-language-custome.html',
    "<form layout-margin layout=column ng-submit=$event.preventDefault() name=searchForm> <md-autocomplete flex required md-input-name=Language md-selected-item=language md-search-text=resourceCtrl.searchText md-items=\"item in resourceCtrl.querySearch(resourceCtrl.searchText)\" md-item-text=item.key md-require-match=\"\" md-floating-label=Key input-aria-describedby=\"Language Key\"> <md-item-template> <span md-highlight-text=resourceCtrl.searchText>{{item.title}} ({{item.key}})</span> </md-item-template> <div ng-messages=searchForm.autocompleteField.$error ng-if=searchForm.autocompleteField.$touched> <div ng-message=required>You <b>must</b> have a language key.</div> <div ng-message=md-require-match>Please select an existing language.</div> <div ng-message=minlength>Your entry is not long enough.</div> <div ng-message=maxlength>Your entry is too long.</div> </div> </md-autocomplete> <md-input-container> <label mb-translate>Title</label> <input ng-model=language.title> </md-input-container> </form>"
  );


  $templateCache.put('views/resources/mb-language-list.html',
    "<md-list flex> <md-list-item class=md-3-line ng-repeat=\"item in languages\" ng-click=resourceCtrl.setLanguage(item)> <mb-icon>language</mb-icon> <div class=md-list-item-text layout=column> <h3>{{ item.key }}</h3> <h4>{{ item.title }}</h4> <p>{{ item.description }}</p> </div> </md-list-item> </md-list>"
  );


  $templateCache.put('views/resources/mb-language-upload.html',
    "<form layout-margin layout=column ng-submit=$event.preventDefault() name=searchForm> <lf-ng-md-file-input name=files lf-files=files lf-required lf-maxcount=5 lf-filesize=10MB lf-totalsize=20MB drag preview> </lf-ng-md-file-input> </form>"
  );


  $templateCache.put('views/resources/mb-local-file.html',
    "<div layout=column layout-padding flex> <lf-ng-md-file-input lf-files=resourceCtrl.files accept=\"{{style.accept || '*'}}\" progress preview drag flex> </lf-ng-md-file-input> </div>"
  );


  $templateCache.put('views/resources/mb-roles.html',
    "<div ng-controller=\"MbSeenUserRolesCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"role in ctrl.items track by role.id\" ng-click=\"multi || resourceCtrl.selectRole(role)\" class=md-3-line> <mb-icon>accessibility</mb-icon> <div class=md-list-item-text layout=column> <h3>{{role.name}}</h3> <p>{{role.description}}</p> </div> <md-checkbox class=md-secondary ng-init=\"role.selected = resourceCtrl.isSelected(role)\" ng-model=role.selected ng-click=\"resourceCtrl.setSelected(role, role.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-sidenav.html',
    ""
  );


  $templateCache.put('views/resources/mb-term-taxonomies.html',
    "<div ng-controller=\"MbSeenCmsTermTaxonomiesCtrl as ctrl\" ng-init=\"ctrl.setDataQuery('{id, taxonomy, term{id, name, metas{key,value}}}')\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"termTaxonomy in ctrl.items track by termTaxonomy.id\" ng-click=\"multi || resourceCtrl.selectRole(termTaxonomy)\" class=md-3-line> <mb-icon>label</mb-icon> <div class=md-list-item-text layout=column> <h3>{{termTaxonomy.term.name}}</h3> <p>{{termTaxonomy.description}}</p> <p>{{termTaxonomy.taxonomy}}</p> </div> <md-checkbox class=md-secondary ng-init=\"termTaxonomy.selected = resourceCtrl.isSelected(termTaxonomy)\" ng-model=termTaxonomy.selected ng-click=\"resourceCtrl.setSelected(termTaxonomy, termTaxonomy.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/wb-event-code-editor.html',
    "<div layout=column layout-fill> <md-toolbar> <div class=md-toolbar-tools layout=row> <span flex></span> <md-select ng-model=value.language ng-change=ctrl.setLanguage(value.language) class=md-no-underline> <md-option ng-repeat=\"l in value.languages track by $index\" ng-value=l.value> {{l.text}} </md-option> </md-select> </div> </md-toolbar> <md-content flex> <div style=\"min-height: 100%; min-width: 100%\" index=0 id=am-wb-resources-script-editor> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/wb-url.html',
    "<div layout=column layout-padding flex> <p mb-translate>Insert a valid URL, please.</p> <md-input-container class=\"md-icon-float md-block\"> <label mb-translate>URL</label> <input ng-model=value> </md-input-container> </div>"
  );


  $templateCache.put('views/sidenavs/mb-help.html',
    "<md-toolbar class=md-hue-1 layout=column layout-align=center> <div layout=row layout-align=\"start center\"> <md-button class=md-icon-button aria-label=Close ng-click=closeHelp()> <mb-icon>close</mb-icon> </md-button> <span flex></span> <h4 mb-translate>Help</h4> </div> </md-toolbar> <md-content mb-preloading=helpLoading layout-padding flex> <wb-group ng-model=helpContent> </wb-group> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-messages.html',
    "<div mb-preloading=\"ctrl.state === 'busy'\" layout=column flex>  <mb-pagination-bar mb-title=Messages mb-model=ctrl.queryParameter mb-reload=ctrl.reload() mb-sort-keys=ctrl.getSortKeys() mb-more-actions=ctrl.getMoreActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"message in ctrl.items track by message.id\" class=md-3-line> <mb-icon ng-class=\"\">mail</mb-icon> <div class=md-list-item-text> <p>{{::message.message}}</p> </div> <md-button class=\"md-secondary md-icon-button\" ng-click=ctrl.deleteItem(message) aria-label=remove> <mb-icon>delete</mb-icon> </md-button> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/sidenavs/mb-options.html',
    "<div mb-preloading=\"ctrl.state === 'busy'\" layout=column flex style=\"position: relative; height: 100%\">   <mb-user-toolbar mb-actions=userActions> </mb-user-toolbar>  <md-content layout-padding flex> <mb-dynamic-tabs mb-tabs=tabs> </mb-dynamic-tabs> </md-content> </div>"
  );


  $templateCache.put('views/toolbars/mb-dashboard.html',
    "<div layout=row layout-align=\"start center\" itemscope itemtype=http://schema.org/WPHeader> <md-button class=md-icon-button hide-gt-sm ng-click=toggleNavigationSidenav() aria-label=Menu> <mb-icon>menu</mb-icon> </md-button> <img hide-gt-sm height=32px ng-if=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong hide-gt-sm style=\"padding: 0px 8px 0px 8px\"> {{app.config.title}} </strong> <mb-navigation-bar hide show-gt-sm ng-show=\"app.setting.navigationPath !== false\"> </mb-navigation-bar> </div> <div layout=row layout-align=\"end center\">  <md-button ng-repeat=\"menu in scopeMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> </md-button> <md-divider ng-if=scopeMenu.items.length></md-divider> <md-button ng-repeat=\"menu in toolbarMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=\"menu.tooltip || menu.description\" md-delay=1500>{{menu.description | translate}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> </md-button> <md-button ng-show=messageCount ng-click=toggleMessageSidenav() style=\"overflow: visible\" class=md-icon-button> <md-tooltip md-delay=1500> <span mb-translate=\"\">Display list of messages</span> </md-tooltip> <mb-icon mb-badge={{messageCount}} mb-badge-fill=accent>notifications</mb-icon> </md-button> <mb-user-menu></mb-user-menu> <md-button ng-repeat=\"menu in userMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.exec($event) class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.tooltip}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> </md-button> </div>"
  );


  $templateCache.put('views/ui/mb-view-main.html',
    "<body class=mb_body>  <div>  <div id=view></div> </div> </body>"
  );


  $templateCache.put('views/users/mb-account.html',
    "<md-content mb-preloading=ctrl.loadingUser class=md-padding layout-padding flex> <div layout-gt=row>  <mb-titled-block mb-title=Account mb-progress=ctrl.avatarLoading flex-gt-sm=50> <div layout=column> <md-input-container> <label mb-translate>ID</label> <input ng-model=ctrl.user.id disabled> </md-input-container> <md-input-container> <label mb-translate>Username</label> <input ng-model=ctrl.user.login disabled> </md-input-container> <md-input-container> <label mb-translate>Email</label> <input ng-model=ctrl.user.email type=email disabled> </md-input-container> </div> </mb-titled-block> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-password.html',
    "<md-content class=md-padding layout-padding flex>  <mb-titled-block mb-title=\"Change password\" mb-progress=ctrl.changingPassword flex-gt-sm=50> <p mb-translate>Insert current password and new password to change it.</p> <form name=ctrl.passForm ng-submit=\"ctrl.changePassword(data, ctrl.passForm)\" layout=column layout-padding> <input hide type=\"submit\"> <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.changingPassword && changePassMessage\"> <p><span md-colors=\"{color:'warn'}\" mb-translate>{{changePassMessage}}</span></p> </div> <md-input-container layout-fill> <label mb-translate>current password</label> <input name=oldPass ng-model=data.oldPass type=password required> <div ng-messages=ctrl.passForm.oldPass.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label mb-translate>new password</label> <input name=newPass ng-model=data.newPass type=password required> <div ng-messages=ctrl.passForm.newPass.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label mb-translate>repeat new password</label> <input name=newPass2 ng-model=newPass2 type=password compare-to=data.newPass required> <div ng-messages=ctrl.passForm.newPass2.$error> <div ng-message=required mb-translate>This field is required.</div> <div ng-message=compareTo mb-translate>password is not match.</div> </div> </md-input-container> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=\"ctrl.changePassword(data, ctrl.passForm)\" ng-disabled=ctrl.passForm.$invalid> <span mb-translate>Change password</span> </md-button> </div> </form> </mb-titled-block>  </md-content>"
  );


  $templateCache.put('views/users/mb-profile.html',
    "<md-content layout-gt-sm=row layout=column style=\"width: 100%; height: fit-content\">  <mb-titled-block flex-gt-sm=50 mb-title=Avatar mb-progress=ctrl.avatarLoading layout=column style=\"margin: 8px\"> <div flex layout=column layout-fill> <div layout=row style=\"flex-grow: 1; min-height: 100px\" layout-align=\"center center\"> <lf-ng-md-file-input style=\"flex-grow: 1; padding: 10px\" ng-show=\"ctrl.avatarState === 'edit'\" lf-files=ctrl.avatarFiles accept=image/* progress preview drag> </lf-ng-md-file-input> <img style=\"max-width: 300px; max-height: 300px; min-width: 24px; min-height: 24px\" ng-if=\"ctrl.avatarState === 'normal'\" ng-src=/api/v2/user/accounts/{{ctrl.user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> </div> <div style=\"flex-grow:0; min-height: 40px\"> <div layout=column layout-align=\"center none\" style=\"flex-grow: 0\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'normal'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.editAvatar()> <sapn mb-translate=\"\">Edit</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.deleteAvatar()> <sapn mb-translate=\"\">Delete</sapn> </md-button> </div> <div style=\"flex-grow: 0\" layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'edit'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.uploadAvatar(ctrl.avatarFiles)> <sapn mb-translate=\"\">Save</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.cancelEditAvatar()> <sapn mb-translate=\"\">Cancel</sapn> </md-button> </div> </div> </div> </mb-titled-block>  <mb-titled-block flex-gt-sm=50 mb-title=\"Public Information\" mb-progress=\"ctrl.loadingProfile || ctrl.savingProfile\" layout=column style=\"margin: 8px\"> <form name=contactForm layout=column layout-padding> <md-input-container layout-fill> <label mb-translate=\"\">First Name</label> <input ng-model=ctrl.profile.first_name> </md-input-container> <md-input-container layout-fill> <label mb-translate=\"\">Last Name</label> <input ng-model=ctrl.profile.last_name> </md-input-container> <md-input-container layout-fill> <label mb-translate=\"\">Public Email</label> <input name=email ng-model=ctrl.profile.public_email type=email> </md-input-container> <md-input-container layout-fill> <label mb-translate=\"\">Language</label> <input ng-model=ctrl.profile.language> </md-input-container> <md-input-container layout-fill> <label mb-translate=\"\">Timezone</label> <input ng-model=ctrl.profile.timezone> </md-input-container> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=save()> <sapn mb-translate=\"\">Update</sapn> </md-button> </div> </mb-titled-block> </md-content>"
  );


  $templateCache.put('views/users/mb-recover-password.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=!ctrl.changingPass style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div layout-margin> <h3 mb-translate>reset password</h3> <p mb-translate>reset password description</p> </div> <div style=\"text-align: center\" layout-margin ng-show=!ctrl.changingPass> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" mb-translate>Failed to reset password.</span> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" mb-translate>{{$scope.changePassMessage}}</span> <span ng-show=\"ctrl.changePassState === 'success'\" md-colors=\"{color:'primary'}\" mb-translate>Password is reset.</span> </div> <form name=ctrl.myForm ng-submit=changePassword(data) layout=column layout-margin> <md-input-container> <label mb-translate>Token</label> <input ng-model=data.token name=token required> <div ng-messages=ctrl.myForm.token.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label mb-translate>New password</label> <input ng-model=data.password name=password type=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label mb-translate>Repeat new password</label> <input name=password2 ng-model=repeatPassword type=password compare-to=data.password required> <div ng-messages=ctrl.myForm.password2.$error> <div ng-message=required mb-translate>This field is required.</div> <div ng-message=compareTo mb-translate>Passwords is not match.</div> </div> </md-input-container> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=changePassword(data)>{{'change password' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> {{'cancel' | translate}} </md-button> </div> </div> </md-content>"
  );

}]);
