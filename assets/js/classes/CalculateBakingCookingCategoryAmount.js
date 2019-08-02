function CalculateBakingCookingCategoryAmount() {

    Object.defineProperty(this, 'CategoryTypes', {
        get: function () {
            return [CategoryEnum.BAKING_AND_COOKING_INGREDIENTS];
        }
    });

    this.calculateAndApplyDiscount = (itemCount, amountWithoutDiscount) => {
        var bakingCookingItemsNetAmount = parseFloat(amountWithoutDiscount.toFixed(2));
        return new NetAmountDetails({
            totalNetAmount: bakingCookingItemsNetAmount,
            deductedAmount: 0
        });
    }
}