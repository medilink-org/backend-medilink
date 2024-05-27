## Utility

`updatePractitioners.ts` is a short script for updating practitioner accounts that were created before the `receptionist` and `admin` roles were added. This script will hash the passwords and add a role field with the value of `practitioner` in the database.

To run the script, execute the following command in your terminal:

```bash
ts-node updatePasswords.ts
```

Ensure you have ts-node installed globally. If not, you can install it using npm install -g ts-node.
