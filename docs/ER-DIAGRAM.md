# CareerVault ER Diagram

## Entities

### Profile

- _id
- name
- email
- college
- branch
- year

### Skill

- _id
- name
- level
- createdAt
- updatedAt

## Relationship

A profile can have multiple skills.

```text
Profile
--------
_id
name
email
college
branch
year
   |
   | 1 : N
   |
   v
Skill
--------
_id
name
level
createdAt
updatedAt
