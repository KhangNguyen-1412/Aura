# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUser, deleteUser, getUser, listUsers, createBiometricLog, updateBiometricLog, deleteBiometricLog, getBiometricLog, listBiometricLogs } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetUser: 
const { data } = await GetUser(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateBiometricLog:  For variables, look at type CreateBiometricLogVars in ../index.d.ts
const { data } = await CreateBiometricLog(dataConnect, createBiometricLogVars);

// Operation UpdateBiometricLog:  For variables, look at type UpdateBiometricLogVars in ../index.d.ts
const { data } = await UpdateBiometricLog(dataConnect, updateBiometricLogVars);

// Operation DeleteBiometricLog:  For variables, look at type DeleteBiometricLogVars in ../index.d.ts
const { data } = await DeleteBiometricLog(dataConnect, deleteBiometricLogVars);

// Operation GetBiometricLog:  For variables, look at type GetBiometricLogVars in ../index.d.ts
const { data } = await GetBiometricLog(dataConnect, getBiometricLogVars);

// Operation ListBiometricLogs: 
const { data } = await ListBiometricLogs(dataConnect);


```