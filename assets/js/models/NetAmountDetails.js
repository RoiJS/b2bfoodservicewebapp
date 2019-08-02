function NetAmountDetails(object) {
    this.totalNetAmount = 0;
    this.deductedAmount = 0;

    if (object) {
        $.extend(this, object);
    }
}