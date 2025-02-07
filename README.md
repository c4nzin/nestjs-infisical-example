A working example for nestjs-infisical-sdk

https://www.npmjs.com/package/nestjs-infisical-sdk

```bash
##############################################################################################################

# A FRIENDLY WARNING!

# Please do not use this example project for malicious purposes as it will affect the experience of other developers. Cheers :)

# Because i am sharing a test account's credentials to common use.

##############################################################################################################


```

## Get a secret

```bash
GET /secret/example-secret
```

## Create a secret

```bash
POST /secret
Content-Type: application/json

{
  "secretName": "new-secret",
  "secretValue": "new-secret-value"
}
```
