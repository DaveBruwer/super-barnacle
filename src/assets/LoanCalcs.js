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

export function monthlyCalcs(bond) {
  const minPayment = calcMinPayment(bond.loanAmount, bond.interestRate, bond.loanPeriod)

  let _monthlyFigures = []
  do {
    const _i = _monthlyFigures.length

    // calcs go here
    //date & dateString
    const tempDate = new Date(bond.startingDate).setMonth(bond.startingDate.getMonth() + _i)
    const tempDateString = getDateString(new Date(tempDate))
    
    // interests
    let annualInterest = bond.interestRate
    if (bond.adHocInterest[_i]) {
      annualInterest = bond.adHocInterest[_i]
    } else if (_i > 0) {
      annualInterest = _monthlyFigures[_i-1].annualInterest
    }
    const monthlyInterest = annualInterest/1200
    // ad hoc payment
    const adHocPayment = bond.adHocPayments[_i]
    // this months payment
    let _payment = minPayment
    if (bond.adHocMonthlyPayments[_i]) {
      _payment = bond.adHocMonthlyPayments[_i]
    } else if (_i === 0 && !isNaN(bond.actualPayment)) {
      _payment = bond.actualPayment
    } else if (_monthlyFigures[_i-1].capital*(1 + monthlyInterest) < _monthlyFigures[_i-1].payment) {
      // _payment = _monthlyFigures[_i-1].capital*(1 + monthlyInterest) < 0.005 ? 0: _monthlyFigures[_i-1].capital*(1 + monthlyInterest)
      _payment = _monthlyFigures[_i-1].capital*(1 + monthlyInterest)
    } else {
      _payment = _monthlyFigures[_i-1].payment
    }
    //capital
    let _capital
    if (_i === 0) {
      _capital = bond.loanAmount
    } else {
      _capital = _monthlyFigures[_i-1].capital*(1 + monthlyInterest) - _payment - adHocPayment
      if (_capital < 0.005) {
        _capital = 0
      }
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
      dateString: tempDateString,
      annualInterest,
      monthlyInterest,
      adHocPayment,
      payment: _payment,
      capital: _capital,
      contribution: _contribution
    })

  } while (_monthlyFigures[_monthlyFigures.length-1].capital > 0)

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
    let _capital
    if (_i === 0) {
      _capital = bond.loanAmount
    } else {
      _capital = _monthlyFigures[_i-1].capital*(1 + monthlyInterest) - _payment
      if (_capital < 0.005) {
        _capital = 0
      }
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
      capital: _capital,
      contribution: _contribution
    })

  } while (_monthlyFigures[_monthlyFigures.length-1].capital > 0)

  return _monthlyFigures
}