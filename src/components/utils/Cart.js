
export const CalculatePaymentDetails = (cartlistdata,cartQuantities) => {
    return (
        cartlistdata?.data?.result.reduce((acc, item) => {
            const quantity = cartQuantities[item.cart_id] ?? item.quantity;
            return acc + quantity * item.single_price;
        }, 0).toFixed(2)
    )
} 