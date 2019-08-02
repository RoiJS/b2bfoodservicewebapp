function CalculateSomeCategoriesAmount() {

    Object.defineProperty(this, 'CategoryTypes', {
        get: function () {
            return [
                CategoryEnum.MEAT_AND_POULTRY,
                CategoryEnum.FRUIT_AND_VEGETABLES,
                CategoryEnum.CONFECTIONARY_AND_DESSERTS,
                CategoryEnum.MISCELLANEOUS_ITEMS
            ];
        }
    });

    this.calculateAndApplyDiscount = (itemCount, amountWithoutDiscount) => {
        var someCategoryItemsNetAmount = parseFloat(amountWithoutDiscount.toFixed(2));
        return new NetAmountDetails({
            totalNetAmount: someCategoryItemsNetAmount,
            deductedAmount: 0
        });
    }
}