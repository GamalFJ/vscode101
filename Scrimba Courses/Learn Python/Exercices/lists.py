friends = ['John','Michael','Terry','Eric','Graham']
cars = [911,130,328,535,740,308]

#If we want to find out how many elements are in the list 
#print(len(friends))

#If we want to print a specific element from the list

#print(friends[2])

#If we want to print specific elements from the list

#print(friends[1], friends[4])

#If we want to print a few elements from the list using slicing

#print(friends[1:4])

#If we want to know what position an element from the list is

#print(friends.index('Eric'))

#If we want to count the occurences of an element (How many times it appears)

#print(friends.count('Eric'))

#If we want to sort the elements in ascending order

# friends.sort()
# print(friends)

#If we want to sort in descending order

# friends.sort(reverse=True)
# print(friends)

#If we want to reverse the original order of the list

# friends.reverse()
# print(friends)

#All of the above is also applicable to numbers

#If we want to know the min or lowest number in a list
# print(min(cars))

#if we want to know the maximum or highest number in a list 

# print(max(cars))

#If we want to sum up the total of the list 

# print(sum(cars))

#Different methods to add elements to our lists: 

#Append (Adds a new element at the end of the list)
# friends.append('TerryG')

#Insert (Adds a new element at a specific position in the list)

# friends.insert(1,'TerryG')

#Specify (Change and add a new value in the place of another)
# friends[2]='TerryG'

#Extend list (Add another existing list to current)
# friends.extend(cars)
# print(friends)

#Different methods to remove elements from the list

#Specify (to remove one element)

# friends.remove('Terry')
# print(friends)

#Pop (You pop the last element to memory to use later)

# friends.pop()
# print(friends)

#PopSpecific (To specific which element we want to pop)
# friends.pop(2)

#ClearEntireList (To remove entire list)
# friends.clear()

#If We want to completely remove the list

# del friends

#If we want to remove part of the list completely

# del friends[2]

#copying lists

# new_friends = friends[:]
# print(friends)
# print(new_friends)

#or

# new_friends = friends.copy()
# print(friends)
# print(new_friends)

# new_friends = list(friends)
# print(friends)
# print(new_friends)

