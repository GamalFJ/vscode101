# Selling Lemonade

# You sell lemonade over two weeks, the lists show number of lemonades sold per week
# Profit for each lemonade sold is 1.5$
# Your task
# - Add another day to week 2 list by capturing a number as input
# - combine the two lists into the list called 'sales'
# - calculate/print how much you have earned on : Best Day, Worst Day, separately and in total
# - Hint: 3 prints in total

#My Code
# sales_w1 = [7,3,42,19,15,35,9]
# sales_w2 = [12,4,26,10,7,28]
# sales = []

# new_day = input()
# new_day_int = int(new_day)
# sales_w2.append(new_day_int)
# sales_w1.extend(sales_w2)
# sales = sales_w1

# print(max(sales))
# print(min(sales))
# print(sum(sales))

#Correct Code
sales_w1 = [7,3,42,19,15,35,9]
sales_w2 = [12,4,26,10,7,28]
sales = []
new_day = input('#Lemonades for new day: ')
sales_w2.append(int(new_day))
sales = sales_w1 + sales_w2
worst_day_prof = min(sales) * 1.5
best_day_prof = max(sales) * 1.5
print(f'Worst day profit:$ {worst_day_prof}')
print(f'Best day profit:$ {best_day_prof}')
print(f'Combined profit:$ {worst_day_prof + best_day_prof}')