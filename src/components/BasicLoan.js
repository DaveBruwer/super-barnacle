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
    this.adHocMontlyPayments = Array.from({length: 60*12+1}, () => null)
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
  // get monthlyFigures() {
  //   let _monthlyFigures = []
  //   do {
  //     // calcs go here
  //     let tempDate = new Date(this.startingDate).setMonth(this.startingDate.getMonth() + _monthlyFigures.length)

  //     // push all calculated things to array
  //     _monthlyFigures.push({
  //       date: new Date(tempDate),
  //       dateString: this.dateToMonth(_monthlyFigures.date),
        
  //     })

  //   } while (true)

    
  //   return _monthlyFigures
  // }

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