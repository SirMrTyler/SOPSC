## Rules & Procedures

This file is to be refered to during ANY programming alterations.

---

## Syntaxical Rules

1. Front End:

   - Casing:
     - Pascal: 'PascalCasingWillBeUsedFor':
       - components. [link](Components)
       - export(ed) functions.
       - types (file names, and actual types)
     - camelCase/dromedaryCase: 'camelCasingWillBeUsedFor':
       - variables used only in local scope
       - helper functions
       - services files
     - whispering_snake_case: 'whispering_snake_case_will_be_used_for':
       - variables coming from foreign API's (such as firestore, expo, etc.)
     - Talking_Snake_Case: 'Talking_Snake_Case_Will_Be_Used_For':
       - Any object 'types' variable (such as Users)
     - SCREAMING_SNAKE_CASE: 'SCREAMING_SNAKE_CASE_WILL_BE_USED_FOR':
       - Any constant variables.
       - Variables that have to do with some sort of path/global variable.
     - kebab-case: 'kebab-case-will-be-used-for':
       - Variables pertaining to the url/style of something

---

## General Layout:

- File Structure:

  1. Files should be grouped if they are tied to one another, example: 'Messaging/Groups' or 'Messaging/Messages'

- Components:
  1. Getters: Any piece of data pulled from another component/source needs to defined as a structure and pulled from a helper/services file.
     - For bigger pieces of data import them as an object
  2. Setters: Any piece of data being set that will be sent elsewhere needs to be defined as a type.
     - Example: User.ts, fsMessages.ts, groupChat.ts, messages.ts, report.ts, etc
  3. Components of similar type need to be grouped in a folder
  4. foregin data received from another source will use 'whispering_snake_case'. Except for functions, those are standard 'camelCase'
