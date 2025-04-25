# - What to do ?: Create a distance converter converting km to miles
# - 1.Take two inputs from user: Their first name and the distance in km
# - 2.Print: Greet user by name and show km, and mile values.
# - 3.1 mile is 1.609 kilometers
# - hint: use correct types for calculating and print
# - Did you capitalize the name ?

name = input('Enter your name: ')
distance_km = input('Enter distance in km: ')
distance_mi = float(distance_km) / 1.609
print(f'Hi {name.title()}! {distance_km}km is equivalent to {round(distance_mi, 1)} miles.')