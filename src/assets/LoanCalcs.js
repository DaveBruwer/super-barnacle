export function calcMinPayment(loanAmount, interestRate, loanPeriod) {
  return (loanAmount*(interestRate/1200))/(1-1/((1+(interestRate/1200))**(loanPeriod*12)))
}

const fullMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septermber",
  "October",
  "November",
  "December"
]

const shortlMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

export function dateToMonth(_date) {
  return _date.toISOString().split("T")[0].split("-").slice(0, 2).join("-")
}

export function getDateString(_date) {
  const _month = _date.getMonth()
  const _year = _date.getFullYear()
  return shortlMonthNames[_month] + "-" + _year
}

export function getMonthName(month) {
  return fullMonthNames[month]
}

export function calcDuration(totalMonths) {
  if (isNaN(totalMonths)) {
    return "?! Something Went Wrong !?"
  } else {
    const _years = Math.floor(totalMonths/12)
    const _months = totalMonths%12
    const _monthTerm = _months ==1 ? "month" : "months"
    return `${_years} years and ${_months} ${_monthTerm}`
  }
}

export function monthlyCalcs(bond, customPayments) {
  console.log("monthlyCalcs Triggered")

  let _monthlyFigures = []
  do {
    const _i = _monthlyFigures.length

    // calcs go here
    //date & dateString
    const tempDate = new Date(bond.startingDate).setMonth(bond.startingDate.getMonth() + _i)
    const tempDateString = getDateString(new Date(tempDate))

    // Starting Capital
    let startingCap
    if (_i === 0) {
      startingCap = bond.loanAmount
    } else {
      startingCap = _monthlyFigures[_i-1].endingCap
    }    
    // interests
    let annualInterest = bond.interestRate
    if (bond.adHocInterest[_i]) {
      annualInterest = bond.adHocInterest[_i]
    } else if (_i > 0) {
      annualInterest = _monthlyFigures[_i-1].annualInterest
    }
    const monthlyInterest = annualInterest/1200
    // Capital After Interest
    let capAfterInterest = startingCap*(1 + monthlyInterest)
    // minPayment
    const minPayment = calcMinPayment(startingCap, annualInterest, (bond.loanPeriod*12 - _i)/12)
    // ad hoc payment
    const adHocPayment = bond.adHocPayments[_i]
    // this months payment
    let _payment
    if (bond.adHocMonthlyPayments[_i] && bond.adHocMonthlyPayments[_i] >= minPayment) {
      console.log("1")
      _payment = bond.adHocMonthlyPayments[_i]
      // modRange(customPayments, 1, _i)
      // customPayments.fill(1, _i)
    } else if (_i === 0 && !isNaN(bond.actualPayment) && bond.actualPayment > minPayment) {
      console.log("2")
      _payment = bond.actualPayment
      // modRange(customPayments, 1, _i)
      // customPayments.fill(1, _i)
    } else if (customPayments[_i] && _monthlyFigures[_i-1].payment >= minPayment) {
      console.log("3")
      _payment = _monthlyFigures[_i-1].payment
    } else {
      console.log("4")
      _payment = minPayment
    }

    if (capAfterInterest < _payment) {
      _payment = capAfterInterest
    }
    // Ending Capital
    let endingCap = capAfterInterest - _payment - adHocPayment
    if (endingCap < 0.005) {
      endingCap = 0
    }
    //contribution
    let _contribution
    if (_i === 0) {
      _contribution = 0
    } else {
      _contribution = _monthlyFigures[_i-1].contribution + _payment + adHocPayment
    }

    // push all calculated things to array
    _monthlyFigures.push({
      date: new Date(tempDate),
      year: new Date(tempDate).getFullYear(),
      month: new Date(tempDate).getMonth(),
      monthString: shortlMonthNames[new Date(tempDate).getMonth()],
      dateString: tempDateString,
      minPayment,
      annualInterest,
      monthlyInterest,
      adHocPayment,
      payment: _payment,
      startingCap,
      capAfterInterest,
      endingCap,
      contribution: _contribution
    })

  } while (_monthlyFigures[_monthlyFigures.length-1].endingCap > 0)

  return _monthlyFigures
}

export function basicCalcs(bond) {
  const minPayment = calcMinPayment(bond.loanAmount, bond.interestRate, bond.loanPeriod)

  let _monthlyFigures = []
  do {
    const _i = _monthlyFigures.length

    // calcs go here
    //date & dateString
    const tempDate = new Date(bond.startingDate).setMonth(bond.startingDate.getMonth() + _i)
    const tempDateString = getDateString(new Date(tempDate))
    // interests
    const annualInterest = bond.interestRate
    const monthlyInterest = annualInterest/1200
    // this months payment
    let _payment = minPayment
    //capital
    let startingCap
    if (_i === 0) {
      startingCap = bond.loanAmount
    } else {
      startingCap = _monthlyFigures[_i-1].endingCap
    }
    let capAfterInterest = startingCap*(1 + monthlyInterest)
    let endingCap = capAfterInterest - _payment
    if (endingCap < 0.005) {
      endingCap = 0
    }
    //contribution
    let _contribution
    if (_i === 0) {
      _contribution = 0
    } else {
      _contribution = _monthlyFigures[_i-1].contribution + _payment
    }

    // push all calculated things to array
    _monthlyFigures.push({
      date: new Date(tempDate),
      dateString: tempDateString,
      annualInterest,
      monthlyInterest,
      payment: _payment,
      startingCap,
      capAfterInterest,
      endingCap,
      contribution: _contribution
    })

  } while (_monthlyFigures[_monthlyFigures.length-1].endingCap > 0)

  return _monthlyFigures
}

export function resetMonthlyPayment(adHocMonthlyPayments, customPayments, month) {
  adHocMonthlyPayments[month] = null
  // bond.customPayments[month] = 0
      modRange(customPayments, 0, month)
      // customPayments.fill(0, month)
  // bond.customPayments = bond.customPayments
  // console.log(month)
  console.log(customPayments)
  console.log(adHocMonthlyPayments)
  // console.log(bond)
}

function modRange(arrayToMutate, newVal, startingIndex, endingIndex = null) {
  console.log("modRage")
  if (endingIndex == null) {
    endingIndex = arrayToMutate.length - 1
  }

  for (let i = startingIndex; i <= endingIndex; i++) {
    arrayToMutate[i] = newVal
  }
}