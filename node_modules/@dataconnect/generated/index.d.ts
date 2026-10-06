import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface BiometricLog_Key {
  id: UUIDString;
  __typename?: 'BiometricLog_Key';
}

export interface CreateBiometricLogData {
  biometricLog_insert: BiometricLog_Key;
}

export interface CreateBiometricLogVariables {
  metricType: string;
  value: number;
}

export interface CreateHealthAlertData {
  healthAlert_insert: HealthAlert_Key;
}

export interface CreateHealthAlertVariables {
  triggerMetric: string;
  severity: string;
  isRead: boolean;
}

export interface CreateHealthGoalData {
  healthGoal_insert: HealthGoal_Key;
}

export interface CreateHealthGoalVariables {
  title: string;
  targetValue: number;
  status: string;
}

export interface CreateNutritionLogData {
  nutritionLog_insert: NutritionLog_Key;
}

export interface CreateNutritionLogVariables {
  foodName: string;
  calories?: number | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  firstName: string;
  email: string;
}

export interface DeleteBiometricLogData {
  biometricLog_delete?: BiometricLog_Key | null;
}

export interface DeleteBiometricLogVariables {
  id: UUIDString;
}

export interface DeleteHealthAlertData {
  healthAlert_delete?: HealthAlert_Key | null;
}

export interface DeleteHealthAlertVariables {
  id: UUIDString;
}

export interface DeleteHealthGoalData {
  healthGoal_delete?: HealthGoal_Key | null;
}

export interface DeleteHealthGoalVariables {
  id: UUIDString;
}

export interface DeleteNutritionLogData {
  nutritionLog_delete?: NutritionLog_Key | null;
}

export interface DeleteNutritionLogVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetBiometricLogData {
  biometricLog?: {
    metricType: string;
    value: number;
    timestamp: TimestampString;
  };
}

export interface GetBiometricLogVariables {
  id: UUIDString;
}

export interface GetHealthAlertData {
  healthAlert?: {
    triggerMetric: string;
    severity: string;
    isRead: boolean;
  };
}

export interface GetHealthAlertVariables {
  id: UUIDString;
}

export interface GetHealthGoalData {
  healthGoal?: {
    title: string;
    targetValue: number;
    status: string;
  };
}

export interface GetHealthGoalVariables {
  id: UUIDString;
}

export interface GetNutritionLogData {
  nutritionLog?: {
    foodName: string;
    calories?: number | null;
    timestamp: TimestampString;
  };
}

export interface GetNutritionLogVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    email: string;
    firstName: string;
    createdAt: TimestampString;
  };
}

export interface HealthAlert_Key {
  id: UUIDString;
  __typename?: 'HealthAlert_Key';
}

export interface HealthGoal_Key {
  id: UUIDString;
  __typename?: 'HealthGoal_Key';
}

export interface ListBiometricLogsData {
  biometricLogs: ({
    metricType: string;
    value: number;
    timestamp: TimestampString;
  })[];
}

export interface ListHealthAlertsData {
  healthAlerts: ({
    triggerMetric: string;
    severity: string;
    isRead: boolean;
  })[];
}

export interface ListHealthGoalsData {
  healthGoals: ({
    title: string;
    targetValue: number;
    status: string;
  })[];
}

export interface ListNutritionLogsData {
  nutritionLogs: ({
    foodName: string;
    calories?: number | null;
    timestamp: TimestampString;
  })[];
}

export interface ListUsersData {
  users: ({
    firstName: string;
    email: string;
  })[];
}

export interface NutritionLog_Key {
  id: UUIDString;
  __typename?: 'NutritionLog_Key';
}

export interface UpdateBiometricLogData {
  biometricLog_update?: BiometricLog_Key | null;
}

export interface UpdateBiometricLogVariables {
  id: UUIDString;
  value?: number | null;
}

export interface UpdateHealthAlertData {
  healthAlert_update?: HealthAlert_Key | null;
}

export interface UpdateHealthAlertVariables {
  id: UUIDString;
  isRead: boolean;
}

export interface UpdateHealthGoalData {
  healthGoal_update?: HealthGoal_Key | null;
}

export interface UpdateHealthGoalVariables {
  id: UUIDString;
  status?: string | null;
}

export interface UpdateNutritionLogData {
  nutritionLog_update?: NutritionLog_Key | null;
}

export interface UpdateNutritionLogVariables {
  id: UUIDString;
  calories?: number | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  firstName?: string | null;
  email?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateBiometricLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBiometricLogVariables): MutationRef<CreateBiometricLogData, CreateBiometricLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBiometricLogVariables): MutationRef<CreateBiometricLogData, CreateBiometricLogVariables>;
  operationName: string;
}
export const createBiometricLogRef: CreateBiometricLogRef;

export function createBiometricLog(vars: CreateBiometricLogVariables): MutationPromise<CreateBiometricLogData, CreateBiometricLogVariables>;
export function createBiometricLog(dc: DataConnect, vars: CreateBiometricLogVariables): MutationPromise<CreateBiometricLogData, CreateBiometricLogVariables>;

interface UpdateBiometricLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBiometricLogVariables): MutationRef<UpdateBiometricLogData, UpdateBiometricLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBiometricLogVariables): MutationRef<UpdateBiometricLogData, UpdateBiometricLogVariables>;
  operationName: string;
}
export const updateBiometricLogRef: UpdateBiometricLogRef;

export function updateBiometricLog(vars: UpdateBiometricLogVariables): MutationPromise<UpdateBiometricLogData, UpdateBiometricLogVariables>;
export function updateBiometricLog(dc: DataConnect, vars: UpdateBiometricLogVariables): MutationPromise<UpdateBiometricLogData, UpdateBiometricLogVariables>;

interface DeleteBiometricLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBiometricLogVariables): MutationRef<DeleteBiometricLogData, DeleteBiometricLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBiometricLogVariables): MutationRef<DeleteBiometricLogData, DeleteBiometricLogVariables>;
  operationName: string;
}
export const deleteBiometricLogRef: DeleteBiometricLogRef;

export function deleteBiometricLog(vars: DeleteBiometricLogVariables): MutationPromise<DeleteBiometricLogData, DeleteBiometricLogVariables>;
export function deleteBiometricLog(dc: DataConnect, vars: DeleteBiometricLogVariables): MutationPromise<DeleteBiometricLogData, DeleteBiometricLogVariables>;

interface GetBiometricLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBiometricLogVariables): QueryRef<GetBiometricLogData, GetBiometricLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBiometricLogVariables): QueryRef<GetBiometricLogData, GetBiometricLogVariables>;
  operationName: string;
}
export const getBiometricLogRef: GetBiometricLogRef;

export function getBiometricLog(vars: GetBiometricLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetBiometricLogData, GetBiometricLogVariables>;
export function getBiometricLog(dc: DataConnect, vars: GetBiometricLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetBiometricLogData, GetBiometricLogVariables>;

interface ListBiometricLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBiometricLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBiometricLogsData, undefined>;
  operationName: string;
}
export const listBiometricLogsRef: ListBiometricLogsRef;

export function listBiometricLogs(options?: ExecuteQueryOptions): QueryPromise<ListBiometricLogsData, undefined>;
export function listBiometricLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBiometricLogsData, undefined>;

interface CreateNutritionLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNutritionLogVariables): MutationRef<CreateNutritionLogData, CreateNutritionLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNutritionLogVariables): MutationRef<CreateNutritionLogData, CreateNutritionLogVariables>;
  operationName: string;
}
export const createNutritionLogRef: CreateNutritionLogRef;

export function createNutritionLog(vars: CreateNutritionLogVariables): MutationPromise<CreateNutritionLogData, CreateNutritionLogVariables>;
export function createNutritionLog(dc: DataConnect, vars: CreateNutritionLogVariables): MutationPromise<CreateNutritionLogData, CreateNutritionLogVariables>;

interface UpdateNutritionLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNutritionLogVariables): MutationRef<UpdateNutritionLogData, UpdateNutritionLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateNutritionLogVariables): MutationRef<UpdateNutritionLogData, UpdateNutritionLogVariables>;
  operationName: string;
}
export const updateNutritionLogRef: UpdateNutritionLogRef;

export function updateNutritionLog(vars: UpdateNutritionLogVariables): MutationPromise<UpdateNutritionLogData, UpdateNutritionLogVariables>;
export function updateNutritionLog(dc: DataConnect, vars: UpdateNutritionLogVariables): MutationPromise<UpdateNutritionLogData, UpdateNutritionLogVariables>;

interface DeleteNutritionLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNutritionLogVariables): MutationRef<DeleteNutritionLogData, DeleteNutritionLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteNutritionLogVariables): MutationRef<DeleteNutritionLogData, DeleteNutritionLogVariables>;
  operationName: string;
}
export const deleteNutritionLogRef: DeleteNutritionLogRef;

export function deleteNutritionLog(vars: DeleteNutritionLogVariables): MutationPromise<DeleteNutritionLogData, DeleteNutritionLogVariables>;
export function deleteNutritionLog(dc: DataConnect, vars: DeleteNutritionLogVariables): MutationPromise<DeleteNutritionLogData, DeleteNutritionLogVariables>;

interface GetNutritionLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNutritionLogVariables): QueryRef<GetNutritionLogData, GetNutritionLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNutritionLogVariables): QueryRef<GetNutritionLogData, GetNutritionLogVariables>;
  operationName: string;
}
export const getNutritionLogRef: GetNutritionLogRef;

export function getNutritionLog(vars: GetNutritionLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetNutritionLogData, GetNutritionLogVariables>;
export function getNutritionLog(dc: DataConnect, vars: GetNutritionLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetNutritionLogData, GetNutritionLogVariables>;

interface ListNutritionLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListNutritionLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListNutritionLogsData, undefined>;
  operationName: string;
}
export const listNutritionLogsRef: ListNutritionLogsRef;

export function listNutritionLogs(options?: ExecuteQueryOptions): QueryPromise<ListNutritionLogsData, undefined>;
export function listNutritionLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListNutritionLogsData, undefined>;

interface CreateHealthGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHealthGoalVariables): MutationRef<CreateHealthGoalData, CreateHealthGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateHealthGoalVariables): MutationRef<CreateHealthGoalData, CreateHealthGoalVariables>;
  operationName: string;
}
export const createHealthGoalRef: CreateHealthGoalRef;

export function createHealthGoal(vars: CreateHealthGoalVariables): MutationPromise<CreateHealthGoalData, CreateHealthGoalVariables>;
export function createHealthGoal(dc: DataConnect, vars: CreateHealthGoalVariables): MutationPromise<CreateHealthGoalData, CreateHealthGoalVariables>;

interface UpdateHealthGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHealthGoalVariables): MutationRef<UpdateHealthGoalData, UpdateHealthGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateHealthGoalVariables): MutationRef<UpdateHealthGoalData, UpdateHealthGoalVariables>;
  operationName: string;
}
export const updateHealthGoalRef: UpdateHealthGoalRef;

export function updateHealthGoal(vars: UpdateHealthGoalVariables): MutationPromise<UpdateHealthGoalData, UpdateHealthGoalVariables>;
export function updateHealthGoal(dc: DataConnect, vars: UpdateHealthGoalVariables): MutationPromise<UpdateHealthGoalData, UpdateHealthGoalVariables>;

interface DeleteHealthGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHealthGoalVariables): MutationRef<DeleteHealthGoalData, DeleteHealthGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteHealthGoalVariables): MutationRef<DeleteHealthGoalData, DeleteHealthGoalVariables>;
  operationName: string;
}
export const deleteHealthGoalRef: DeleteHealthGoalRef;

export function deleteHealthGoal(vars: DeleteHealthGoalVariables): MutationPromise<DeleteHealthGoalData, DeleteHealthGoalVariables>;
export function deleteHealthGoal(dc: DataConnect, vars: DeleteHealthGoalVariables): MutationPromise<DeleteHealthGoalData, DeleteHealthGoalVariables>;

interface GetHealthGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetHealthGoalVariables): QueryRef<GetHealthGoalData, GetHealthGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetHealthGoalVariables): QueryRef<GetHealthGoalData, GetHealthGoalVariables>;
  operationName: string;
}
export const getHealthGoalRef: GetHealthGoalRef;

export function getHealthGoal(vars: GetHealthGoalVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthGoalData, GetHealthGoalVariables>;
export function getHealthGoal(dc: DataConnect, vars: GetHealthGoalVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthGoalData, GetHealthGoalVariables>;

interface ListHealthGoalsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListHealthGoalsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListHealthGoalsData, undefined>;
  operationName: string;
}
export const listHealthGoalsRef: ListHealthGoalsRef;

export function listHealthGoals(options?: ExecuteQueryOptions): QueryPromise<ListHealthGoalsData, undefined>;
export function listHealthGoals(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListHealthGoalsData, undefined>;

interface CreateHealthAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHealthAlertVariables): MutationRef<CreateHealthAlertData, CreateHealthAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateHealthAlertVariables): MutationRef<CreateHealthAlertData, CreateHealthAlertVariables>;
  operationName: string;
}
export const createHealthAlertRef: CreateHealthAlertRef;

export function createHealthAlert(vars: CreateHealthAlertVariables): MutationPromise<CreateHealthAlertData, CreateHealthAlertVariables>;
export function createHealthAlert(dc: DataConnect, vars: CreateHealthAlertVariables): MutationPromise<CreateHealthAlertData, CreateHealthAlertVariables>;

interface UpdateHealthAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHealthAlertVariables): MutationRef<UpdateHealthAlertData, UpdateHealthAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateHealthAlertVariables): MutationRef<UpdateHealthAlertData, UpdateHealthAlertVariables>;
  operationName: string;
}
export const updateHealthAlertRef: UpdateHealthAlertRef;

export function updateHealthAlert(vars: UpdateHealthAlertVariables): MutationPromise<UpdateHealthAlertData, UpdateHealthAlertVariables>;
export function updateHealthAlert(dc: DataConnect, vars: UpdateHealthAlertVariables): MutationPromise<UpdateHealthAlertData, UpdateHealthAlertVariables>;

interface DeleteHealthAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHealthAlertVariables): MutationRef<DeleteHealthAlertData, DeleteHealthAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteHealthAlertVariables): MutationRef<DeleteHealthAlertData, DeleteHealthAlertVariables>;
  operationName: string;
}
export const deleteHealthAlertRef: DeleteHealthAlertRef;

export function deleteHealthAlert(vars: DeleteHealthAlertVariables): MutationPromise<DeleteHealthAlertData, DeleteHealthAlertVariables>;
export function deleteHealthAlert(dc: DataConnect, vars: DeleteHealthAlertVariables): MutationPromise<DeleteHealthAlertData, DeleteHealthAlertVariables>;

interface GetHealthAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetHealthAlertVariables): QueryRef<GetHealthAlertData, GetHealthAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetHealthAlertVariables): QueryRef<GetHealthAlertData, GetHealthAlertVariables>;
  operationName: string;
}
export const getHealthAlertRef: GetHealthAlertRef;

export function getHealthAlert(vars: GetHealthAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthAlertData, GetHealthAlertVariables>;
export function getHealthAlert(dc: DataConnect, vars: GetHealthAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetHealthAlertData, GetHealthAlertVariables>;

interface ListHealthAlertsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListHealthAlertsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListHealthAlertsData, undefined>;
  operationName: string;
}
export const listHealthAlertsRef: ListHealthAlertsRef;

export function listHealthAlerts(options?: ExecuteQueryOptions): QueryPromise<ListHealthAlertsData, undefined>;
export function listHealthAlerts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListHealthAlertsData, undefined>;

