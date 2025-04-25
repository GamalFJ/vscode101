#print('if elif else - exercise')
    #Create a calculator which handles +, -, *, / and outputs answer based on the mode/ operator used
    # Hint: use 3 seprate inputs
    # Bonus: Extend functionality with extra mode so it also does celsius to fareinheit conversion
    # formula is : temp in C*9/5 + 32 = temp in f

mode = input('Enter math operation(+,-,*,/) or f for Celsius to Fahrenheit conversion: ')
num1 = float(input('Enter first number: '))
if mode.lower() == 'f':
    print(f'{num1} Celsius is equivalent to {(num1*9/5)+32} fahrenheit')
else:
    num2 = float(input('Enter second number: '))

    if mode == '+':
        print(f'Answer is: {num1 + num2}')
    elif mode == '-':
        print(f'Answer is: {num1 - num2}')
    elif mode == '*':
        print(f'Answer is: {num1 * num2}')
    elif mode == '/':
        print(f'Answer is: {num1 / num2}')
    else:
        print('Input error!')