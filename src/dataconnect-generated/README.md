# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListUsers*](#listusers)
  - [*GetBiometricLog*](#getbiometriclog)
  - [*ListBiometricLogs*](#listbiometriclogs)
  - [*GetNutritionLog*](#getnutritionlog)
  - [*ListNutritionLogs*](#listnutritionlogs)
  - [*GetHealthGoal*](#gethealthgoal)
  - [*ListHealthGoals*](#listhealthgoals)
  - [*GetHealthAlert*](#gethealthalert)
  - [*ListHealthAlerts*](#listhealthalerts)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateBiometricLog*](#createbiometriclog)
  - [*UpdateBiometricLog*](#updatebiometriclog)
  - [*DeleteBiometricLog*](#deletebiometriclog)
  - [*CreateNutritionLog*](#createnutritionlog)
  - [*UpdateNutritionLog*](#updatenutritionlog)
  - [*DeleteNutritionLog*](#deletenutritionlog)
  - [*CreateHealthGoal*](#createhealthgoal)
  - [*UpdateHealthGoal*](#updatehealthgoal)
  - [*DeleteHealthGoal*](#deletehealthgoal)
  - [*CreateHealthAlert*](#createhealthalert)
  - [*UpdateHealthAlert*](#updatehealthalert)
  - [*DeleteHealthAlert*](#deletehealthalert)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    email: string;
    firstName: string;
    createdAt: TimestampString;
  };
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    firstName: string;
    email: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetBiometricLog
You can execute the `GetBiometricLog` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getBiometricLog(vars: GetBiometricLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetBiometricLogData, GetBiometricLogVariables>;

interface GetBiometricLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBiometricLogVariables): QueryRef<GetBiometricLogData, GetBiometricLogVariables>;
}
export const getBiometricLogRef: GetBiometricLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBiometricLog(dc: DataConnect, vars: GetBiometricLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetBiometricLogData, GetBiometricLogVariables>;

interface GetBiometricLogRef {
  ...
  (dc: DataConnect, vars: GetBiometricLogVariables): QueryRef<GetBiometricLogData, GetBiometricLogVariables>;
}
export const getBiometricLogRef: GetBiometricLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBiometricLogRef:
```typescript
const name = getBiometricLogRef.operationName;
console.log(name);
```

### Variables
The `GetBiometricLog` query requires an argument of type `GetBiometricLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBiometricLogVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetBiometricLog` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBiometricLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBiometricLogData {
  biometricLog?: {
    metricType: string;
    value: number;
    timestamp: TimestampString;
  };
}
```
### Using `GetBiometricLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBiometricLog, GetBiometricLogVariables } from '@dataconnect/generated';

// The `GetBiometricLog` query requires an argument of type `GetBiometricLogVariables`:
const getBiometricLogVars: GetBiometricLogVariables = {
  id: ..., 
};

// Call the `getBiometricLog()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBiometricLog(getBiometricLogVars);
// Variables can be defined inline as well.
const { data } = await getBiometricLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBiometricLog(dataConnect, getBiometricLogVars);

console.log(data.biometricLog);

// Or, you can use the `Promise` API.
getBiometricLog(getBiometricLogVars).then((response) => {
  const data = response.data;
  console.log(data.biometricLog);
});
```

### Using `GetBiometricLog`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBiometricLogRef, GetBiometricLogVariables } from '@dataconnect/generated';

// The `GetBiometricLog` query requires an argument of type `GetBiometricLogVariables`:
const getBiometricLogVars: GetBiometricLogVariables = {
  id: ..., 
};

// Call the `getBiometricLogRef()` function to get a reference to the query.
const ref = getBiometricLogRef(getBiometricLogVars);
// Variables can be defined inline as well.
const ref = getBiometricLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBiometricLogRef(dataConnect, getBiometricLogVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.biometricLog);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.biometricLog);
});
```

## ListBiometricLogs
You can execute the `ListBiometricLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listBiometricLogs(options?: ExecuteQueryOptions): QueryPromise<ListBiometricLogsData, undefined>;

interface ListBiometricLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBiometricLogsData, undefined>;
}
export const listBiometricLogsRef: ListBiometricLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBiometricLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBiometricLogsData, undefined>;

interface ListBiometricLogsRef {
  ...
  (dc: DataConnect): QueryRef<ListBiometricLogsData, undefined>;
}
export const listBiometricLogsRef: ListBiometricLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBiometricLogsRef:
```typescript
const name = listBiometricLogsRef.operationName;
console.log(name);
```

### Variables
The `ListBiometricLogs` query has no variables.
### Return Type
Recall that executing the `ListBiometricLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBiometricLogsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListBiometricLogsData {
  biometricLogs: ({
    metricType: string;
    value: number;
    timestamp: TimestampString;
  })[];
}
```
### Using `ListBiometricLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBiometricLogs } from '@dataconnect/generated';


// Call the `listBiometricLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBiometricLogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBiometricLogs(dataConnect);

console.log(data.biometricLogs);

// Or, you can use the `Promise` API.
listBiometricLogs().then((response) => {
  const data = response.data;
  console.log(data.biometricLogs);
});
```

### Using `ListBiometricLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBiometricLogsRef } from '@dataconnect/generated';


// Call the `listBiometricLogsRef()` function to get a reference to the query.
const ref = listBiometricLogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBiometricLogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.biometricLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.biometricLogs);
});
```

## GetNutritionLog
You can execute the `GetNutritionLog` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getNutritionLog(vars: GetNutritionLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetNutritionLogData, GetNutritionLogVariables>;

interface GetNutritionLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNutritionLogVariables): QueryRef<GetNutritionLogData, GetNutritionLogVariables>;
}
export const getNutritionLogRef: GetNutritionLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNutritionLog(dc: DataConnect, vars: GetNutritionLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetNutritionLogData, GetNutritionLogVariables>;

interface GetNutritionLogRef {
  ...
  (dc: DataConnect, vars: GetNutritionLogVariables): QueryRef<GetNutritionLogData, GetNutritionLogVariables>;
}
export const getNutritionLogRef: GetNutritionLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNutritionLogRef:
```typescript
const name = getNutritionLogRef.operationName;
console.log(name);
```

### Variables
The `GetNutritionLog` query requires an argument of type `GetNutritionLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNutritionLogVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetNutritionLog` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNutritionLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetNutritionLogData {
  nutritionLog?: {
    foodName: string;
    calories?: number | null;
    timestamp: TimestampString;
  };
}
```
### Using `GetNutritionLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNutritionLog, GetNutritionLogVariables } from '@dataconnect/generated';

// The `GetNutritionLog` query requires an argument of type `GetNutritionLogVariables`:
const getNutritionLogVars: GetNutritionLogVariables = {
  id: ..., 
};

// Call the `getNutritionLog()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNutritionLog(getNutritionLogVars);
// Variables can be defined inline as well.
const { data } = await getNutritionLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNutritionLog(dataConnect, getNutritionLogVars);

console.log(data.nutritionLog);

// Or, you can use the `Promise` API.
getNutritionLog(getNutritionLogVars).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog);
});
```

### Using `GetNutritionLog`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNutritionLogRef, GetNutritionLogVariables } from '@dataconnect/generated';

// The `GetNutritionLog` query requires an argument of type `GetNutritionLogVariables`:
const getNutritionLogVars: GetNutritionLogVariables = {
  id: ..., 
};

// Call the `getNutritionLogRef()` function to get a reference to the query.
const ref = getNutritionLogRef(getNutritionLogVars);
// Variables can be defined inline as well.
const ref = getNutritionLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNutritionLogRef(dataConnect, getNutritionLogVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.nutritionLog);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog);
});
```

## ListNutritionLogs
You can execute the `ListNutritionLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listNutritionLogs(options?: ExecuteQueryOptions): QueryPromise<ListNutritionLogsData, undefined>;

interface ListNutritionLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListNutritionLogsData, undefined>;
}
export const listNutritionLogsRef: ListNutritionLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listNutritionLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListNutritionLogsData, undefined>;

interface ListNutritionLogsRef {
  ...
  (dc: DataConnect): QueryRef<ListNutritionLogsData, undefined>;
}
export const listNutritionLogsRef: ListNutritionLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listNutritionLogsRef:
```typescript
const name = listNutritionLogsRef.operationName;
console.log(name);
```

### Variables
The `ListNutritionLogs` query has no variables.
### Return Type
Recall that executing the `ListNutritionLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListNutritionLogsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListNutritionLogsData {
  nutritionLogs: ({
    foodName: string;
    calories?: number | null;
    timestamp: TimestampString;
  })[];
}
```
### Using `ListNutritionLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listNutritionLogs } from '@dataconnect/generated';


// Call the `listNutritionLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listNutritionLogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listNutritionLogs(dataConnect);

console.log(data.nutritionLogs);

// Or, you can use the `Promise` API.
listNutritionLogs().then((response) => {
  const data = response.data;
  console.log(data.nutritionLogs);
});
```

### Using `ListNutritionLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listNutritionLogsRef } from '@dataconnect/generated';


// Call the `listNutritionLogsRef()` function to get a reference to the query.
const ref = listNutritionLogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listNutritionLogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.nutritionLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.nutritionLogs);
});
```

## GetHealthGoal
You can execute the `GetHealthGoal` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getHealthGoal(vars: GetHealthGoalVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthGoalData, GetHealthGoalVariables>;

interface GetHealthGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetHealthGoalVariables): QueryRef<GetHealthGoalData, GetHealthGoalVariables>;
}
export const getHealthGoalRef: GetHealthGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getHealthGoal(dc: DataConnect, vars: GetHealthGoalVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthGoalData, GetHealthGoalVariables>;

interface GetHealthGoalRef {
  ...
  (dc: DataConnect, vars: GetHealthGoalVariables): QueryRef<GetHealthGoalData, GetHealthGoalVariables>;
}
export const getHealthGoalRef: GetHealthGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getHealthGoalRef:
```typescript
const name = getHealthGoalRef.operationName;
console.log(name);
```

### Variables
The `GetHealthGoal` query requires an argument of type `GetHealthGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetHealthGoalVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetHealthGoal` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetHealthGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetHealthGoalData {
  healthGoal?: {
    title: string;
    targetValue: number;
    status: string;
  };
}
```
### Using `GetHealthGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getHealthGoal, GetHealthGoalVariables } from '@dataconnect/generated';

// The `GetHealthGoal` query requires an argument of type `GetHealthGoalVariables`:
const getHealthGoalVars: GetHealthGoalVariables = {
  id: ..., 
};

// Call the `getHealthGoal()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getHealthGoal(getHealthGoalVars);
// Variables can be defined inline as well.
const { data } = await getHealthGoal({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getHealthGoal(dataConnect, getHealthGoalVars);

console.log(data.healthGoal);

// Or, you can use the `Promise` API.
getHealthGoal(getHealthGoalVars).then((response) => {
  const data = response.data;
  console.log(data.healthGoal);
});
```

### Using `GetHealthGoal`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getHealthGoalRef, GetHealthGoalVariables } from '@dataconnect/generated';

// The `GetHealthGoal` query requires an argument of type `GetHealthGoalVariables`:
const getHealthGoalVars: GetHealthGoalVariables = {
  id: ..., 
};

// Call the `getHealthGoalRef()` function to get a reference to the query.
const ref = getHealthGoalRef(getHealthGoalVars);
// Variables can be defined inline as well.
const ref = getHealthGoalRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getHealthGoalRef(dataConnect, getHealthGoalVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.healthGoal);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.healthGoal);
});
```

## ListHealthGoals
You can execute the `ListHealthGoals` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listHealthGoals(options?: ExecuteQueryOptions): QueryPromise<ListHealthGoalsData, undefined>;

interface ListHealthGoalsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListHealthGoalsData, undefined>;
}
export const listHealthGoalsRef: ListHealthGoalsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listHealthGoals(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListHealthGoalsData, undefined>;

interface ListHealthGoalsRef {
  ...
  (dc: DataConnect): QueryRef<ListHealthGoalsData, undefined>;
}
export const listHealthGoalsRef: ListHealthGoalsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listHealthGoalsRef:
```typescript
const name = listHealthGoalsRef.operationName;
console.log(name);
```

### Variables
The `ListHealthGoals` query has no variables.
### Return Type
Recall that executing the `ListHealthGoals` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListHealthGoalsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListHealthGoalsData {
  healthGoals: ({
    title: string;
    targetValue: number;
    status: string;
  })[];
}
```
### Using `ListHealthGoals`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listHealthGoals } from '@dataconnect/generated';


// Call the `listHealthGoals()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listHealthGoals();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listHealthGoals(dataConnect);

console.log(data.healthGoals);

// Or, you can use the `Promise` API.
listHealthGoals().then((response) => {
  const data = response.data;
  console.log(data.healthGoals);
});
```

### Using `ListHealthGoals`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listHealthGoalsRef } from '@dataconnect/generated';


// Call the `listHealthGoalsRef()` function to get a reference to the query.
const ref = listHealthGoalsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listHealthGoalsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.healthGoals);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.healthGoals);
});
```

## GetHealthAlert
You can execute the `GetHealthAlert` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getHealthAlert(vars: GetHealthAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthAlertData, GetHealthAlertVariables>;

interface GetHealthAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetHealthAlertVariables): QueryRef<GetHealthAlertData, GetHealthAlertVariables>;
}
export const getHealthAlertRef: GetHealthAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getHealthAlert(dc: DataConnect, vars: GetHealthAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthAlertData, GetHealthAlertVariables>;

interface GetHealthAlertRef {
  ...
  (dc: DataConnect, vars: GetHealthAlertVariables): QueryRef<GetHealthAlertData, GetHealthAlertVariables>;
}
export const getHealthAlertRef: GetHealthAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getHealthAlertRef:
```typescript
const name = getHealthAlertRef.operationName;
console.log(name);
```

### Variables
The `GetHealthAlert` query requires an argument of type `GetHealthAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetHealthAlertVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetHealthAlert` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetHealthAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetHealthAlertData {
  healthAlert?: {
    triggerMetric: string;
    severity: string;
    isRead: boolean;
  };
}
```
### Using `GetHealthAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getHealthAlert, GetHealthAlertVariables } from '@dataconnect/generated';

// The `GetHealthAlert` query requires an argument of type `GetHealthAlertVariables`:
const getHealthAlertVars: GetHealthAlertVariables = {
  id: ..., 
};

// Call the `getHealthAlert()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getHealthAlert(getHealthAlertVars);
// Variables can be defined inline as well.
const { data } = await getHealthAlert({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getHealthAlert(dataConnect, getHealthAlertVars);

console.log(data.healthAlert);

// Or, you can use the `Promise` API.
getHealthAlert(getHealthAlertVars).then((response) => {
  const data = response.data;
  console.log(data.healthAlert);
});
```

### Using `GetHealthAlert`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getHealthAlertRef, GetHealthAlertVariables } from '@dataconnect/generated';

// The `GetHealthAlert` query requires an argument of type `GetHealthAlertVariables`:
const getHealthAlertVars: GetHealthAlertVariables = {
  id: ..., 
};

// Call the `getHealthAlertRef()` function to get a reference to the query.
const ref = getHealthAlertRef(getHealthAlertVars);
// Variables can be defined inline as well.
const ref = getHealthAlertRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getHealthAlertRef(dataConnect, getHealthAlertVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.healthAlert);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.healthAlert);
});
```

## ListHealthAlerts
You can execute the `ListHealthAlerts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listHealthAlerts(options?: ExecuteQueryOptions): QueryPromise<ListHealthAlertsData, undefined>;

interface ListHealthAlertsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListHealthAlertsData, undefined>;
}
export const listHealthAlertsRef: ListHealthAlertsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listHealthAlerts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListHealthAlertsData, undefined>;

interface ListHealthAlertsRef {
  ...
  (dc: DataConnect): QueryRef<ListHealthAlertsData, undefined>;
}
export const listHealthAlertsRef: ListHealthAlertsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listHealthAlertsRef:
```typescript
const name = listHealthAlertsRef.operationName;
console.log(name);
```

### Variables
The `ListHealthAlerts` query has no variables.
### Return Type
Recall that executing the `ListHealthAlerts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListHealthAlertsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListHealthAlertsData {
  healthAlerts: ({
    triggerMetric: string;
    severity: string;
    isRead: boolean;
  })[];
}
```
### Using `ListHealthAlerts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listHealthAlerts } from '@dataconnect/generated';


// Call the `listHealthAlerts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listHealthAlerts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listHealthAlerts(dataConnect);

console.log(data.healthAlerts);

// Or, you can use the `Promise` API.
listHealthAlerts().then((response) => {
  const data = response.data;
  console.log(data.healthAlerts);
});
```

### Using `ListHealthAlerts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listHealthAlertsRef } from '@dataconnect/generated';


// Call the `listHealthAlertsRef()` function to get a reference to the query.
const ref = listHealthAlertsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listHealthAlertsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.healthAlerts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.healthAlerts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  firstName: string;
  email: string;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  firstName: ..., 
  email: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ firstName: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  firstName: ..., 
  email: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ firstName: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  firstName?: string | null;
  email?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  firstName: ..., // optional
  email: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ firstName: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  firstName: ..., // optional
  email: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ firstName: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateBiometricLog
You can execute the `CreateBiometricLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBiometricLog(vars: CreateBiometricLogVariables): MutationPromise<CreateBiometricLogData, CreateBiometricLogVariables>;

interface CreateBiometricLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBiometricLogVariables): MutationRef<CreateBiometricLogData, CreateBiometricLogVariables>;
}
export const createBiometricLogRef: CreateBiometricLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBiometricLog(dc: DataConnect, vars: CreateBiometricLogVariables): MutationPromise<CreateBiometricLogData, CreateBiometricLogVariables>;

interface CreateBiometricLogRef {
  ...
  (dc: DataConnect, vars: CreateBiometricLogVariables): MutationRef<CreateBiometricLogData, CreateBiometricLogVariables>;
}
export const createBiometricLogRef: CreateBiometricLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBiometricLogRef:
```typescript
const name = createBiometricLogRef.operationName;
console.log(name);
```

### Variables
The `CreateBiometricLog` mutation requires an argument of type `CreateBiometricLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBiometricLogVariables {
  metricType: string;
  value: number;
}
```
### Return Type
Recall that executing the `CreateBiometricLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBiometricLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBiometricLogData {
  biometricLog_insert: BiometricLog_Key;
}
```
### Using `CreateBiometricLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBiometricLog, CreateBiometricLogVariables } from '@dataconnect/generated';

// The `CreateBiometricLog` mutation requires an argument of type `CreateBiometricLogVariables`:
const createBiometricLogVars: CreateBiometricLogVariables = {
  metricType: ..., 
  value: ..., 
};

// Call the `createBiometricLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBiometricLog(createBiometricLogVars);
// Variables can be defined inline as well.
const { data } = await createBiometricLog({ metricType: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBiometricLog(dataConnect, createBiometricLogVars);

console.log(data.biometricLog_insert);

// Or, you can use the `Promise` API.
createBiometricLog(createBiometricLogVars).then((response) => {
  const data = response.data;
  console.log(data.biometricLog_insert);
});
```

### Using `CreateBiometricLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBiometricLogRef, CreateBiometricLogVariables } from '@dataconnect/generated';

// The `CreateBiometricLog` mutation requires an argument of type `CreateBiometricLogVariables`:
const createBiometricLogVars: CreateBiometricLogVariables = {
  metricType: ..., 
  value: ..., 
};

// Call the `createBiometricLogRef()` function to get a reference to the mutation.
const ref = createBiometricLogRef(createBiometricLogVars);
// Variables can be defined inline as well.
const ref = createBiometricLogRef({ metricType: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBiometricLogRef(dataConnect, createBiometricLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.biometricLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.biometricLog_insert);
});
```

## UpdateBiometricLog
You can execute the `UpdateBiometricLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateBiometricLog(vars: UpdateBiometricLogVariables): MutationPromise<UpdateBiometricLogData, UpdateBiometricLogVariables>;

interface UpdateBiometricLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBiometricLogVariables): MutationRef<UpdateBiometricLogData, UpdateBiometricLogVariables>;
}
export const updateBiometricLogRef: UpdateBiometricLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBiometricLog(dc: DataConnect, vars: UpdateBiometricLogVariables): MutationPromise<UpdateBiometricLogData, UpdateBiometricLogVariables>;

interface UpdateBiometricLogRef {
  ...
  (dc: DataConnect, vars: UpdateBiometricLogVariables): MutationRef<UpdateBiometricLogData, UpdateBiometricLogVariables>;
}
export const updateBiometricLogRef: UpdateBiometricLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBiometricLogRef:
```typescript
const name = updateBiometricLogRef.operationName;
console.log(name);
```

### Variables
The `UpdateBiometricLog` mutation requires an argument of type `UpdateBiometricLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBiometricLogVariables {
  id: UUIDString;
  value?: number | null;
}
```
### Return Type
Recall that executing the `UpdateBiometricLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBiometricLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBiometricLogData {
  biometricLog_update?: BiometricLog_Key | null;
}
```
### Using `UpdateBiometricLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBiometricLog, UpdateBiometricLogVariables } from '@dataconnect/generated';

// The `UpdateBiometricLog` mutation requires an argument of type `UpdateBiometricLogVariables`:
const updateBiometricLogVars: UpdateBiometricLogVariables = {
  id: ..., 
  value: ..., // optional
};

// Call the `updateBiometricLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBiometricLog(updateBiometricLogVars);
// Variables can be defined inline as well.
const { data } = await updateBiometricLog({ id: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBiometricLog(dataConnect, updateBiometricLogVars);

console.log(data.biometricLog_update);

// Or, you can use the `Promise` API.
updateBiometricLog(updateBiometricLogVars).then((response) => {
  const data = response.data;
  console.log(data.biometricLog_update);
});
```

### Using `UpdateBiometricLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBiometricLogRef, UpdateBiometricLogVariables } from '@dataconnect/generated';

// The `UpdateBiometricLog` mutation requires an argument of type `UpdateBiometricLogVariables`:
const updateBiometricLogVars: UpdateBiometricLogVariables = {
  id: ..., 
  value: ..., // optional
};

// Call the `updateBiometricLogRef()` function to get a reference to the mutation.
const ref = updateBiometricLogRef(updateBiometricLogVars);
// Variables can be defined inline as well.
const ref = updateBiometricLogRef({ id: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBiometricLogRef(dataConnect, updateBiometricLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.biometricLog_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.biometricLog_update);
});
```

## DeleteBiometricLog
You can execute the `DeleteBiometricLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteBiometricLog(vars: DeleteBiometricLogVariables): MutationPromise<DeleteBiometricLogData, DeleteBiometricLogVariables>;

interface DeleteBiometricLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBiometricLogVariables): MutationRef<DeleteBiometricLogData, DeleteBiometricLogVariables>;
}
export const deleteBiometricLogRef: DeleteBiometricLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBiometricLog(dc: DataConnect, vars: DeleteBiometricLogVariables): MutationPromise<DeleteBiometricLogData, DeleteBiometricLogVariables>;

interface DeleteBiometricLogRef {
  ...
  (dc: DataConnect, vars: DeleteBiometricLogVariables): MutationRef<DeleteBiometricLogData, DeleteBiometricLogVariables>;
}
export const deleteBiometricLogRef: DeleteBiometricLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBiometricLogRef:
```typescript
const name = deleteBiometricLogRef.operationName;
console.log(name);
```

### Variables
The `DeleteBiometricLog` mutation requires an argument of type `DeleteBiometricLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBiometricLogVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteBiometricLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBiometricLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBiometricLogData {
  biometricLog_delete?: BiometricLog_Key | null;
}
```
### Using `DeleteBiometricLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBiometricLog, DeleteBiometricLogVariables } from '@dataconnect/generated';

// The `DeleteBiometricLog` mutation requires an argument of type `DeleteBiometricLogVariables`:
const deleteBiometricLogVars: DeleteBiometricLogVariables = {
  id: ..., 
};

// Call the `deleteBiometricLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBiometricLog(deleteBiometricLogVars);
// Variables can be defined inline as well.
const { data } = await deleteBiometricLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBiometricLog(dataConnect, deleteBiometricLogVars);

console.log(data.biometricLog_delete);

// Or, you can use the `Promise` API.
deleteBiometricLog(deleteBiometricLogVars).then((response) => {
  const data = response.data;
  console.log(data.biometricLog_delete);
});
```

### Using `DeleteBiometricLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBiometricLogRef, DeleteBiometricLogVariables } from '@dataconnect/generated';

// The `DeleteBiometricLog` mutation requires an argument of type `DeleteBiometricLogVariables`:
const deleteBiometricLogVars: DeleteBiometricLogVariables = {
  id: ..., 
};

// Call the `deleteBiometricLogRef()` function to get a reference to the mutation.
const ref = deleteBiometricLogRef(deleteBiometricLogVars);
// Variables can be defined inline as well.
const ref = deleteBiometricLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBiometricLogRef(dataConnect, deleteBiometricLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.biometricLog_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.biometricLog_delete);
});
```

## CreateNutritionLog
You can execute the `CreateNutritionLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNutritionLog(vars: CreateNutritionLogVariables): MutationPromise<CreateNutritionLogData, CreateNutritionLogVariables>;

interface CreateNutritionLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNutritionLogVariables): MutationRef<CreateNutritionLogData, CreateNutritionLogVariables>;
}
export const createNutritionLogRef: CreateNutritionLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNutritionLog(dc: DataConnect, vars: CreateNutritionLogVariables): MutationPromise<CreateNutritionLogData, CreateNutritionLogVariables>;

interface CreateNutritionLogRef {
  ...
  (dc: DataConnect, vars: CreateNutritionLogVariables): MutationRef<CreateNutritionLogData, CreateNutritionLogVariables>;
}
export const createNutritionLogRef: CreateNutritionLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNutritionLogRef:
```typescript
const name = createNutritionLogRef.operationName;
console.log(name);
```

### Variables
The `CreateNutritionLog` mutation requires an argument of type `CreateNutritionLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNutritionLogVariables {
  foodName: string;
  calories?: number | null;
}
```
### Return Type
Recall that executing the `CreateNutritionLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNutritionLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNutritionLogData {
  nutritionLog_insert: NutritionLog_Key;
}
```
### Using `CreateNutritionLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNutritionLog, CreateNutritionLogVariables } from '@dataconnect/generated';

// The `CreateNutritionLog` mutation requires an argument of type `CreateNutritionLogVariables`:
const createNutritionLogVars: CreateNutritionLogVariables = {
  foodName: ..., 
  calories: ..., // optional
};

// Call the `createNutritionLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNutritionLog(createNutritionLogVars);
// Variables can be defined inline as well.
const { data } = await createNutritionLog({ foodName: ..., calories: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNutritionLog(dataConnect, createNutritionLogVars);

console.log(data.nutritionLog_insert);

// Or, you can use the `Promise` API.
createNutritionLog(createNutritionLogVars).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog_insert);
});
```

### Using `CreateNutritionLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNutritionLogRef, CreateNutritionLogVariables } from '@dataconnect/generated';

// The `CreateNutritionLog` mutation requires an argument of type `CreateNutritionLogVariables`:
const createNutritionLogVars: CreateNutritionLogVariables = {
  foodName: ..., 
  calories: ..., // optional
};

// Call the `createNutritionLogRef()` function to get a reference to the mutation.
const ref = createNutritionLogRef(createNutritionLogVars);
// Variables can be defined inline as well.
const ref = createNutritionLogRef({ foodName: ..., calories: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNutritionLogRef(dataConnect, createNutritionLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.nutritionLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog_insert);
});
```

## UpdateNutritionLog
You can execute the `UpdateNutritionLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateNutritionLog(vars: UpdateNutritionLogVariables): MutationPromise<UpdateNutritionLogData, UpdateNutritionLogVariables>;

interface UpdateNutritionLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNutritionLogVariables): MutationRef<UpdateNutritionLogData, UpdateNutritionLogVariables>;
}
export const updateNutritionLogRef: UpdateNutritionLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateNutritionLog(dc: DataConnect, vars: UpdateNutritionLogVariables): MutationPromise<UpdateNutritionLogData, UpdateNutritionLogVariables>;

interface UpdateNutritionLogRef {
  ...
  (dc: DataConnect, vars: UpdateNutritionLogVariables): MutationRef<UpdateNutritionLogData, UpdateNutritionLogVariables>;
}
export const updateNutritionLogRef: UpdateNutritionLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateNutritionLogRef:
```typescript
const name = updateNutritionLogRef.operationName;
console.log(name);
```

### Variables
The `UpdateNutritionLog` mutation requires an argument of type `UpdateNutritionLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateNutritionLogVariables {
  id: UUIDString;
  calories?: number | null;
}
```
### Return Type
Recall that executing the `UpdateNutritionLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateNutritionLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateNutritionLogData {
  nutritionLog_update?: NutritionLog_Key | null;
}
```
### Using `UpdateNutritionLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateNutritionLog, UpdateNutritionLogVariables } from '@dataconnect/generated';

// The `UpdateNutritionLog` mutation requires an argument of type `UpdateNutritionLogVariables`:
const updateNutritionLogVars: UpdateNutritionLogVariables = {
  id: ..., 
  calories: ..., // optional
};

// Call the `updateNutritionLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateNutritionLog(updateNutritionLogVars);
// Variables can be defined inline as well.
const { data } = await updateNutritionLog({ id: ..., calories: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateNutritionLog(dataConnect, updateNutritionLogVars);

console.log(data.nutritionLog_update);

// Or, you can use the `Promise` API.
updateNutritionLog(updateNutritionLogVars).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog_update);
});
```

### Using `UpdateNutritionLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateNutritionLogRef, UpdateNutritionLogVariables } from '@dataconnect/generated';

// The `UpdateNutritionLog` mutation requires an argument of type `UpdateNutritionLogVariables`:
const updateNutritionLogVars: UpdateNutritionLogVariables = {
  id: ..., 
  calories: ..., // optional
};

// Call the `updateNutritionLogRef()` function to get a reference to the mutation.
const ref = updateNutritionLogRef(updateNutritionLogVars);
// Variables can be defined inline as well.
const ref = updateNutritionLogRef({ id: ..., calories: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateNutritionLogRef(dataConnect, updateNutritionLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.nutritionLog_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog_update);
});
```

## DeleteNutritionLog
You can execute the `DeleteNutritionLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteNutritionLog(vars: DeleteNutritionLogVariables): MutationPromise<DeleteNutritionLogData, DeleteNutritionLogVariables>;

interface DeleteNutritionLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNutritionLogVariables): MutationRef<DeleteNutritionLogData, DeleteNutritionLogVariables>;
}
export const deleteNutritionLogRef: DeleteNutritionLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteNutritionLog(dc: DataConnect, vars: DeleteNutritionLogVariables): MutationPromise<DeleteNutritionLogData, DeleteNutritionLogVariables>;

interface DeleteNutritionLogRef {
  ...
  (dc: DataConnect, vars: DeleteNutritionLogVariables): MutationRef<DeleteNutritionLogData, DeleteNutritionLogVariables>;
}
export const deleteNutritionLogRef: DeleteNutritionLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteNutritionLogRef:
```typescript
const name = deleteNutritionLogRef.operationName;
console.log(name);
```

### Variables
The `DeleteNutritionLog` mutation requires an argument of type `DeleteNutritionLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteNutritionLogVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteNutritionLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteNutritionLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteNutritionLogData {
  nutritionLog_delete?: NutritionLog_Key | null;
}
```
### Using `DeleteNutritionLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteNutritionLog, DeleteNutritionLogVariables } from '@dataconnect/generated';

// The `DeleteNutritionLog` mutation requires an argument of type `DeleteNutritionLogVariables`:
const deleteNutritionLogVars: DeleteNutritionLogVariables = {
  id: ..., 
};

// Call the `deleteNutritionLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteNutritionLog(deleteNutritionLogVars);
// Variables can be defined inline as well.
const { data } = await deleteNutritionLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteNutritionLog(dataConnect, deleteNutritionLogVars);

console.log(data.nutritionLog_delete);

// Or, you can use the `Promise` API.
deleteNutritionLog(deleteNutritionLogVars).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog_delete);
});
```

### Using `DeleteNutritionLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteNutritionLogRef, DeleteNutritionLogVariables } from '@dataconnect/generated';

// The `DeleteNutritionLog` mutation requires an argument of type `DeleteNutritionLogVariables`:
const deleteNutritionLogVars: DeleteNutritionLogVariables = {
  id: ..., 
};

// Call the `deleteNutritionLogRef()` function to get a reference to the mutation.
const ref = deleteNutritionLogRef(deleteNutritionLogVars);
// Variables can be defined inline as well.
const ref = deleteNutritionLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteNutritionLogRef(dataConnect, deleteNutritionLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.nutritionLog_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.nutritionLog_delete);
});
```

## CreateHealthGoal
You can execute the `CreateHealthGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createHealthGoal(vars: CreateHealthGoalVariables): MutationPromise<CreateHealthGoalData, CreateHealthGoalVariables>;

interface CreateHealthGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHealthGoalVariables): MutationRef<CreateHealthGoalData, CreateHealthGoalVariables>;
}
export const createHealthGoalRef: CreateHealthGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createHealthGoal(dc: DataConnect, vars: CreateHealthGoalVariables): MutationPromise<CreateHealthGoalData, CreateHealthGoalVariables>;

interface CreateHealthGoalRef {
  ...
  (dc: DataConnect, vars: CreateHealthGoalVariables): MutationRef<CreateHealthGoalData, CreateHealthGoalVariables>;
}
export const createHealthGoalRef: CreateHealthGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createHealthGoalRef:
```typescript
const name = createHealthGoalRef.operationName;
console.log(name);
```

### Variables
The `CreateHealthGoal` mutation requires an argument of type `CreateHealthGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateHealthGoalVariables {
  title: string;
  targetValue: number;
  status: string;
}
```
### Return Type
Recall that executing the `CreateHealthGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateHealthGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateHealthGoalData {
  healthGoal_insert: HealthGoal_Key;
}
```
### Using `CreateHealthGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createHealthGoal, CreateHealthGoalVariables } from '@dataconnect/generated';

// The `CreateHealthGoal` mutation requires an argument of type `CreateHealthGoalVariables`:
const createHealthGoalVars: CreateHealthGoalVariables = {
  title: ..., 
  targetValue: ..., 
  status: ..., 
};

// Call the `createHealthGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createHealthGoal(createHealthGoalVars);
// Variables can be defined inline as well.
const { data } = await createHealthGoal({ title: ..., targetValue: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createHealthGoal(dataConnect, createHealthGoalVars);

console.log(data.healthGoal_insert);

// Or, you can use the `Promise` API.
createHealthGoal(createHealthGoalVars).then((response) => {
  const data = response.data;
  console.log(data.healthGoal_insert);
});
```

### Using `CreateHealthGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createHealthGoalRef, CreateHealthGoalVariables } from '@dataconnect/generated';

// The `CreateHealthGoal` mutation requires an argument of type `CreateHealthGoalVariables`:
const createHealthGoalVars: CreateHealthGoalVariables = {
  title: ..., 
  targetValue: ..., 
  status: ..., 
};

// Call the `createHealthGoalRef()` function to get a reference to the mutation.
const ref = createHealthGoalRef(createHealthGoalVars);
// Variables can be defined inline as well.
const ref = createHealthGoalRef({ title: ..., targetValue: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createHealthGoalRef(dataConnect, createHealthGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.healthGoal_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.healthGoal_insert);
});
```

## UpdateHealthGoal
You can execute the `UpdateHealthGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateHealthGoal(vars: UpdateHealthGoalVariables): MutationPromise<UpdateHealthGoalData, UpdateHealthGoalVariables>;

interface UpdateHealthGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHealthGoalVariables): MutationRef<UpdateHealthGoalData, UpdateHealthGoalVariables>;
}
export const updateHealthGoalRef: UpdateHealthGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateHealthGoal(dc: DataConnect, vars: UpdateHealthGoalVariables): MutationPromise<UpdateHealthGoalData, UpdateHealthGoalVariables>;

interface UpdateHealthGoalRef {
  ...
  (dc: DataConnect, vars: UpdateHealthGoalVariables): MutationRef<UpdateHealthGoalData, UpdateHealthGoalVariables>;
}
export const updateHealthGoalRef: UpdateHealthGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateHealthGoalRef:
```typescript
const name = updateHealthGoalRef.operationName;
console.log(name);
```

### Variables
The `UpdateHealthGoal` mutation requires an argument of type `UpdateHealthGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateHealthGoalVariables {
  id: UUIDString;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateHealthGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateHealthGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateHealthGoalData {
  healthGoal_update?: HealthGoal_Key | null;
}
```
### Using `UpdateHealthGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateHealthGoal, UpdateHealthGoalVariables } from '@dataconnect/generated';

// The `UpdateHealthGoal` mutation requires an argument of type `UpdateHealthGoalVariables`:
const updateHealthGoalVars: UpdateHealthGoalVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateHealthGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateHealthGoal(updateHealthGoalVars);
// Variables can be defined inline as well.
const { data } = await updateHealthGoal({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateHealthGoal(dataConnect, updateHealthGoalVars);

console.log(data.healthGoal_update);

// Or, you can use the `Promise` API.
updateHealthGoal(updateHealthGoalVars).then((response) => {
  const data = response.data;
  console.log(data.healthGoal_update);
});
```

### Using `UpdateHealthGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateHealthGoalRef, UpdateHealthGoalVariables } from '@dataconnect/generated';

// The `UpdateHealthGoal` mutation requires an argument of type `UpdateHealthGoalVariables`:
const updateHealthGoalVars: UpdateHealthGoalVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateHealthGoalRef()` function to get a reference to the mutation.
const ref = updateHealthGoalRef(updateHealthGoalVars);
// Variables can be defined inline as well.
const ref = updateHealthGoalRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateHealthGoalRef(dataConnect, updateHealthGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.healthGoal_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.healthGoal_update);
});
```

## DeleteHealthGoal
You can execute the `DeleteHealthGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteHealthGoal(vars: DeleteHealthGoalVariables): MutationPromise<DeleteHealthGoalData, DeleteHealthGoalVariables>;

interface DeleteHealthGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHealthGoalVariables): MutationRef<DeleteHealthGoalData, DeleteHealthGoalVariables>;
}
export const deleteHealthGoalRef: DeleteHealthGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteHealthGoal(dc: DataConnect, vars: DeleteHealthGoalVariables): MutationPromise<DeleteHealthGoalData, DeleteHealthGoalVariables>;

interface DeleteHealthGoalRef {
  ...
  (dc: DataConnect, vars: DeleteHealthGoalVariables): MutationRef<DeleteHealthGoalData, DeleteHealthGoalVariables>;
}
export const deleteHealthGoalRef: DeleteHealthGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteHealthGoalRef:
```typescript
const name = deleteHealthGoalRef.operationName;
console.log(name);
```

### Variables
The `DeleteHealthGoal` mutation requires an argument of type `DeleteHealthGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteHealthGoalVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteHealthGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteHealthGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteHealthGoalData {
  healthGoal_delete?: HealthGoal_Key | null;
}
```
### Using `DeleteHealthGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteHealthGoal, DeleteHealthGoalVariables } from '@dataconnect/generated';

// The `DeleteHealthGoal` mutation requires an argument of type `DeleteHealthGoalVariables`:
const deleteHealthGoalVars: DeleteHealthGoalVariables = {
  id: ..., 
};

// Call the `deleteHealthGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteHealthGoal(deleteHealthGoalVars);
// Variables can be defined inline as well.
const { data } = await deleteHealthGoal({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteHealthGoal(dataConnect, deleteHealthGoalVars);

console.log(data.healthGoal_delete);

// Or, you can use the `Promise` API.
deleteHealthGoal(deleteHealthGoalVars).then((response) => {
  const data = response.data;
  console.log(data.healthGoal_delete);
});
```

### Using `DeleteHealthGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteHealthGoalRef, DeleteHealthGoalVariables } from '@dataconnect/generated';

// The `DeleteHealthGoal` mutation requires an argument of type `DeleteHealthGoalVariables`:
const deleteHealthGoalVars: DeleteHealthGoalVariables = {
  id: ..., 
};

// Call the `deleteHealthGoalRef()` function to get a reference to the mutation.
const ref = deleteHealthGoalRef(deleteHealthGoalVars);
// Variables can be defined inline as well.
const ref = deleteHealthGoalRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteHealthGoalRef(dataConnect, deleteHealthGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.healthGoal_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.healthGoal_delete);
});
```

## CreateHealthAlert
You can execute the `CreateHealthAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createHealthAlert(vars: CreateHealthAlertVariables): MutationPromise<CreateHealthAlertData, CreateHealthAlertVariables>;

interface CreateHealthAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHealthAlertVariables): MutationRef<CreateHealthAlertData, CreateHealthAlertVariables>;
}
export const createHealthAlertRef: CreateHealthAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createHealthAlert(dc: DataConnect, vars: CreateHealthAlertVariables): MutationPromise<CreateHealthAlertData, CreateHealthAlertVariables>;

interface CreateHealthAlertRef {
  ...
  (dc: DataConnect, vars: CreateHealthAlertVariables): MutationRef<CreateHealthAlertData, CreateHealthAlertVariables>;
}
export const createHealthAlertRef: CreateHealthAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createHealthAlertRef:
```typescript
const name = createHealthAlertRef.operationName;
console.log(name);
```

### Variables
The `CreateHealthAlert` mutation requires an argument of type `CreateHealthAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateHealthAlertVariables {
  triggerMetric: string;
  severity: string;
  isRead: boolean;
}
```
### Return Type
Recall that executing the `CreateHealthAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateHealthAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateHealthAlertData {
  healthAlert_insert: HealthAlert_Key;
}
```
### Using `CreateHealthAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createHealthAlert, CreateHealthAlertVariables } from '@dataconnect/generated';

// The `CreateHealthAlert` mutation requires an argument of type `CreateHealthAlertVariables`:
const createHealthAlertVars: CreateHealthAlertVariables = {
  triggerMetric: ..., 
  severity: ..., 
  isRead: ..., 
};

// Call the `createHealthAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createHealthAlert(createHealthAlertVars);
// Variables can be defined inline as well.
const { data } = await createHealthAlert({ triggerMetric: ..., severity: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createHealthAlert(dataConnect, createHealthAlertVars);

console.log(data.healthAlert_insert);

// Or, you can use the `Promise` API.
createHealthAlert(createHealthAlertVars).then((response) => {
  const data = response.data;
  console.log(data.healthAlert_insert);
});
```

### Using `CreateHealthAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createHealthAlertRef, CreateHealthAlertVariables } from '@dataconnect/generated';

// The `CreateHealthAlert` mutation requires an argument of type `CreateHealthAlertVariables`:
const createHealthAlertVars: CreateHealthAlertVariables = {
  triggerMetric: ..., 
  severity: ..., 
  isRead: ..., 
};

// Call the `createHealthAlertRef()` function to get a reference to the mutation.
const ref = createHealthAlertRef(createHealthAlertVars);
// Variables can be defined inline as well.
const ref = createHealthAlertRef({ triggerMetric: ..., severity: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createHealthAlertRef(dataConnect, createHealthAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.healthAlert_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.healthAlert_insert);
});
```

## UpdateHealthAlert
You can execute the `UpdateHealthAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateHealthAlert(vars: UpdateHealthAlertVariables): MutationPromise<UpdateHealthAlertData, UpdateHealthAlertVariables>;

interface UpdateHealthAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHealthAlertVariables): MutationRef<UpdateHealthAlertData, UpdateHealthAlertVariables>;
}
export const updateHealthAlertRef: UpdateHealthAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateHealthAlert(dc: DataConnect, vars: UpdateHealthAlertVariables): MutationPromise<UpdateHealthAlertData, UpdateHealthAlertVariables>;

interface UpdateHealthAlertRef {
  ...
  (dc: DataConnect, vars: UpdateHealthAlertVariables): MutationRef<UpdateHealthAlertData, UpdateHealthAlertVariables>;
}
export const updateHealthAlertRef: UpdateHealthAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateHealthAlertRef:
```typescript
const name = updateHealthAlertRef.operationName;
console.log(name);
```

### Variables
The `UpdateHealthAlert` mutation requires an argument of type `UpdateHealthAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateHealthAlertVariables {
  id: UUIDString;
  isRead: boolean;
}
```
### Return Type
Recall that executing the `UpdateHealthAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateHealthAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateHealthAlertData {
  healthAlert_update?: HealthAlert_Key | null;
}
```
### Using `UpdateHealthAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateHealthAlert, UpdateHealthAlertVariables } from '@dataconnect/generated';

// The `UpdateHealthAlert` mutation requires an argument of type `UpdateHealthAlertVariables`:
const updateHealthAlertVars: UpdateHealthAlertVariables = {
  id: ..., 
  isRead: ..., 
};

// Call the `updateHealthAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateHealthAlert(updateHealthAlertVars);
// Variables can be defined inline as well.
const { data } = await updateHealthAlert({ id: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateHealthAlert(dataConnect, updateHealthAlertVars);

console.log(data.healthAlert_update);

// Or, you can use the `Promise` API.
updateHealthAlert(updateHealthAlertVars).then((response) => {
  const data = response.data;
  console.log(data.healthAlert_update);
});
```

### Using `UpdateHealthAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateHealthAlertRef, UpdateHealthAlertVariables } from '@dataconnect/generated';

// The `UpdateHealthAlert` mutation requires an argument of type `UpdateHealthAlertVariables`:
const updateHealthAlertVars: UpdateHealthAlertVariables = {
  id: ..., 
  isRead: ..., 
};

// Call the `updateHealthAlertRef()` function to get a reference to the mutation.
const ref = updateHealthAlertRef(updateHealthAlertVars);
// Variables can be defined inline as well.
const ref = updateHealthAlertRef({ id: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateHealthAlertRef(dataConnect, updateHealthAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.healthAlert_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.healthAlert_update);
});
```

## DeleteHealthAlert
You can execute the `DeleteHealthAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteHealthAlert(vars: DeleteHealthAlertVariables): MutationPromise<DeleteHealthAlertData, DeleteHealthAlertVariables>;

interface DeleteHealthAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHealthAlertVariables): MutationRef<DeleteHealthAlertData, DeleteHealthAlertVariables>;
}
export const deleteHealthAlertRef: DeleteHealthAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteHealthAlert(dc: DataConnect, vars: DeleteHealthAlertVariables): MutationPromise<DeleteHealthAlertData, DeleteHealthAlertVariables>;

interface DeleteHealthAlertRef {
  ...
  (dc: DataConnect, vars: DeleteHealthAlertVariables): MutationRef<DeleteHealthAlertData, DeleteHealthAlertVariables>;
}
export const deleteHealthAlertRef: DeleteHealthAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteHealthAlertRef:
```typescript
const name = deleteHealthAlertRef.operationName;
console.log(name);
```

### Variables
The `DeleteHealthAlert` mutation requires an argument of type `DeleteHealthAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteHealthAlertVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteHealthAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteHealthAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteHealthAlertData {
  healthAlert_delete?: HealthAlert_Key | null;
}
```
### Using `DeleteHealthAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteHealthAlert, DeleteHealthAlertVariables } from '@dataconnect/generated';

// The `DeleteHealthAlert` mutation requires an argument of type `DeleteHealthAlertVariables`:
const deleteHealthAlertVars: DeleteHealthAlertVariables = {
  id: ..., 
};

// Call the `deleteHealthAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteHealthAlert(deleteHealthAlertVars);
// Variables can be defined inline as well.
const { data } = await deleteHealthAlert({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteHealthAlert(dataConnect, deleteHealthAlertVars);

console.log(data.healthAlert_delete);

// Or, you can use the `Promise` API.
deleteHealthAlert(deleteHealthAlertVars).then((response) => {
  const data = response.data;
  console.log(data.healthAlert_delete);
});
```

### Using `DeleteHealthAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteHealthAlertRef, DeleteHealthAlertVariables } from '@dataconnect/generated';

// The `DeleteHealthAlert` mutation requires an argument of type `DeleteHealthAlertVariables`:
const deleteHealthAlertVars: DeleteHealthAlertVariables = {
  id: ..., 
};

// Call the `deleteHealthAlertRef()` function to get a reference to the mutation.
const ref = deleteHealthAlertRef(deleteHealthAlertVars);
// Variables can be defined inline as well.
const ref = deleteHealthAlertRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteHealthAlertRef(dataConnect, deleteHealthAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.healthAlert_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.healthAlert_delete);
});
```

