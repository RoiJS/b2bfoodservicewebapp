function CalculateDrinkCategoryAmount() {

    Object.defineProperty(this, 'CategoryTypes', {
        get: function () {
            return [CategoryEnum.DRINKS];
        }
    });

    this.calculateAndApplyDiscount = (itemCount, amountWithoutDiscount) => {
        var drinkItemsNetAmount = amountWithoutDiscount;
        var deductedAmount = ((amountWithoutDiscount * 10) / 100)
        if (itemCount >= 10) {
            drinkItemsNetAmount = parseFloat((amountWithoutDiscount - ((amountWithoutDiscount * 10) / 100)).toFixed(2));
        }
        return new NetAmountDetails({
            totalNetAmount: drinkItemsNetAmount,
            deductedAmount: parseFloat(deductedAmount.toFixed(2))
        });
    }
}