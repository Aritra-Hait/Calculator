function operate(num1, num2, op) {
    let ans;
    if (op === '+')
        ans = num1 + num2;
    else if (op === '-')
        ans = num1 - num2;
    else if (op === '*')
        ans = num1 * num2;
    else
        ans = num1 / num2;
    return ans;
}