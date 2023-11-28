class BasicLoan {
  constructor(_currency, _loanAmount, _interestRate, _loanPeriod, _actualPayment, _startingDate) {
    this.currency = _currency
    this.loanAmount = _loanAmount
    this.interestRate = _interestRate
    this.loanPeriod = _loanPeriod
    this.startingDate = _startingDate
    this.startingDateString = this.dateToMonth(this.startingDate)
    this.actualPayment = _actualPayment
    this.customPayment = false
    this.monthlyInterest = this.interestRate/1200
    this.periodInMonths = this.loanPeriod*12
    this.minPayment = (this.loanAmount*this.monthlyInterest)/(1-1/((1+this.monthlyInterest)**this.periodInMonths))
    // this.dates = [] // Include in monthlyFigures?
    this.adHocPayments = Array.from({length: 60*12+1}, () => 0)
    this.adHocInterest = Array.from({length: 60*12+1}, () => null)
    this.adHocMonthlyPayments = Array.from({length: 60*12+1}, () => null)
    this.duration = "?! Something Went Wrong !?"
    this.finalPayment = null
    this.finalYear = 60
    this.totalContribution = 0
    this.monthlyFiguresArray = Array.from({length: this.periodInMonths + 1}, () => {
      return {
        date: null,
        onceOffPayment: 0,
        interest: this.monthlyInterest,
        interestRate: this.interestRate,
        monthlyInterest: this.monthlyInterest,
        payment: this.payments,
        capital: null,
      }
    }) // used to be called runningCalcs?

  }
  // Getters
  get dates() {
    const _startMonth = this.startingDate.getMonth()
    const _datesArray = Array.from({length: 60 * 12}, (x, i) => {
      const _currentMonth = new Date(this.startingDate)
      _currentMonth.setMonth(_startMonth + i)
      return _currentMonth
    })
    return _datesArray
  }

  get payments() {
    return this.actualPayment
  }
  get startingDateString() {
    return this.startingDate.toISOString().split("T")[0].split("-").slice(0, 2).join("-")
  }
  get monthlyInterest() {
    return this.interestRate/1200
  }
  get periodInMonths() {
    return this.loanPeriod*12
  }
  get minPayment() {
    return (this.loanAmount*this.monthlyInterest)/(1-1/((1+this.monthlyInterest)**this.periodInMonths))
  }

  get monthlyFigures() {
    let _monthlyFigures = []
    do {
      const _i = _monthlyFigures.length

      // calcs go here
      //date
      let tempDate = new Date(this.startingDate).setMonth(this.startingDate.getMonth() + _i)
      // interests
      let annualInterest = this.interestRate
      if (this.adHocInterest[_i]) {
        annualInterest = this.adHocInterest[_i]
      } else if (_i > 0) {
        annualInterest = _monthlyFigures[_i-1].annualInterest
      }
      let monthlyInterest = annualInterest/1200
      // actual payment [global]
      if (this.actualPayment === null || this.actualPayment <= this.minPayment || !this.customPayment) {
        this.actualPayment = this.minPayment
        this.customPayment = false
      }
      // ad hoc payment
      let _adHocPayment = this.adHocPayments[_i] ? this.adHocPayments[_i] : 0
      // this months payment
      let _payment
      if (this.adHocMonthlyPayments[_i]) {
        _payment = this.adHocMonthlyPayments[_i]
      } else if (_i == 0) {
        _payment = this.actualPayment
      } else if (_monthlyFigures[_i-1].capital*(1 + _monthlyFigures[_i].monthlyInterest) < _monthlyFigures[_i-1].payment) {
        _payment = _monthlyFigures[_i-1].capital*(1 + _monthlyFigures[_i].monthlyInterest)
      } else {
        _payment = _monthlyFigures[_i-1].payment
      }
      //capital
      let _capital
      if (_i == 0) {
        _capital = this.loanAmount
      } else {
        _capital = _monthlyFigures[_i-1].capital*(1 + _monthlyFigures[_i].monthlyInterest) - _monthlyFigures[_i].payment - _adHocPayment
      }
      //contribution
      let _contribution
      if (_i === 0) {
        _contribution = 0
      } else {
        _contribution = _monthlyFigures[_i-1]._contribution + _payment + _adHocPayment
      }


      // push all calculated things to array
      _monthlyFigures.push({
        date: new Date(tempDate),
        dateString: this.dateToMonth(_monthlyFigures.date),
        annualInterest,
        monthlyInterest,
        adHocPayment: _adHocPayment,
        payment: _payment,
        capital: _capital,
        contribution: _contribution
      })

    } while (_monthlyFigures[_monthlyFigures.length-1].capital > 0)

    
    return _monthlyFigures
  }

  // Setters
  set payments(_paymentAmount) {
    if(_paymentAmount > this.minPayment) {
      this.actualPayment = _paymentAmount
    } else {
      this.actualPayment = this.minPayment
    }
  }

  // Methods
  dateToMonth(_date) {
    return _date.toISOString().split("T")[0].split("-").slice(0, 2).join("-")
  }
}


export default BasicLoan