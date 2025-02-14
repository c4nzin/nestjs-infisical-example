A working example of nestjs-infisical-sdk



# To use 

* Fork this repository
* Run the cli command => pnpm run install
* Send CRUD requests with Postman etc. Or just use our swagger : ```bash http://localhost:3000/swagger```


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
