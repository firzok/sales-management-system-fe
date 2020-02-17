const PROTOCOL = 'http';

// const SERVER_IP = '192.168.100.14';
const PORT = '4000';

const SERVER_IP = 'localhost';
// const PORT = '8080';

export const SERVER_PATH = `${PROTOCOL}://${SERVER_IP}:${PORT}`;

export const ROOT_URL = `${SERVER_PATH}/api`;

export const USER_BASE_URL = `${ROOT_URL}/accounts/user`;

export const USERS_URL = `${USER_BASE_URL}s`;
export const ACCOUNTS_BASE_URL = `${ROOT_URL}/accounts`;
export const CREATE_USER = `${ACCOUNTS_BASE_URL}/create`;
export const UPDATE_USER = `${ACCOUNTS_BASE_URL}/update`;
export const UPDATE_PASSWORD = `${ACCOUNTS_BASE_URL}/ChangePassword`;
export const RESET_PASSWORD = `${ACCOUNTS_BASE_URL}/ResetPassword`;

export const AUTH_BASE_URL = `${SERVER_PATH}/auth`;
export const USER_AUTHENITCATION = `${AUTH_BASE_URL}/signin`;
export const USER_LOGOUT = `${AUTH_BASE_URL}/logout`;

export const ROLES_BASE_URL = `${ROOT_URL}/roles`;
export const CREATE_ROLE = `${ROLES_BASE_URL}/create`;
export const UPDATE_ROLE = `${ROLES_BASE_URL}/update`;

export const DESIGNATION_BASE_URL = `${ROOT_URL}/designations`;

export const EMPLOYEE_BASE_URL = `${ROOT_URL}/employees`;
export const SHUFFLE_TEAM = `${EMPLOYEE_BASE_URL}/shuffleteam`;
export const UPDATE_EMPLOYEE_STATUS = `${EMPLOYEE_BASE_URL}/status`;
export const PROFILE_PICTURE = `${EMPLOYEE_BASE_URL}/profile-picture`;
export const EMPLOYEES_POSITIONS = `${EMPLOYEE_BASE_URL}/employees-positions`;
export const EMPLOYEES_LIST = `${EMPLOYEE_BASE_URL}/list`;

export const EMPLOYEE_ADJUSTMENTS = `${ROOT_URL}/employeeadjustments`;

export const NATIONALITY_BASE_URL = `${ROOT_URL}/nationalities`;

export const COUNTRY_BASE_URL = `${ROOT_URL}/countries`;

export const CITY_BASE_URL = `${ROOT_URL}/cities`;

export const CURRENCY_BASE_URL = `${ROOT_URL}/currencies`;

export const RE_LEAVE_TYPES_BASE_URL = `${ROOT_URL}/leaves`;
export const LEAVE_TYPES_LIST = `${RE_LEAVE_TYPES_BASE_URL}/list`;

export const LEAVE_TYPES_YEARLY_BASE_URL = `${ROOT_URL}/leavesyearlies`;

export const PUBLIC_LEAVE_BASE_URL = `${ROOT_URL}/publicholidays`;
export const COPY_PUBLIC_HOLIDAYS = `${PUBLIC_LEAVE_BASE_URL}/copy`;

export const LEAVE_RECORDS_BASE_URL = `${ROOT_URL}/leaverecords`;
export const GET_EMPLOYEE_RECENT_STATUS = `${LEAVE_RECORDS_BASE_URL}/employee-last-record`;
export const TODAY_LEAVE_RECORDS = `${LEAVE_RECORDS_BASE_URL}/today`;
export const TIME_OF_BALANCES = `${LEAVE_RECORDS_BASE_URL}/employees-report`;
export const EMPLOYEE_REPORT_BASE_URL = `${LEAVE_RECORDS_BASE_URL}/employee`;
export const YEARLY_LEAVES_HISTORY_REPORT = `${EMPLOYEE_REPORT_BASE_URL}/yearly`;

export const ATTENDANCES_BASE_URL = `${ROOT_URL}/attendances`;
export const EMPLOYEE_ATTENDANCE = `${ATTENDANCES_BASE_URL}/employee`;
export const EMPLOYEE_ATTENDANCE_WEEKLY_REPORT = `${EMPLOYEE_ATTENDANCE}/weekly-hours`;
export const APPROVE_ATTENDANCE = `${ATTENDANCES_BASE_URL}/approve-attendance`;

export const ACTIVITY_LOGS = `${ROOT_URL}/activitylogs`;

export const PERMISSIONS = `${ROOT_URL}/permissions`;

export const PUBLIC_HOLIDAYS = `${ROOT_URL}/publicholidays`;

export const SETTINGS = `${ROOT_URL}/settings`;

export const INVOICINGS = `${ROOT_URL}/invoicings`;
export const SEND_INVOICE_EMAIL = `${INVOICINGS}/send-mail`;

export const IMPORT = `${ROOT_URL}/import`;
export const EXPORT = `${ROOT_URL}/export`;
export const EXPORT_LEAVES_BALANCES = `${EXPORT}/leaves-balances`;

export const REPORTS_BASE_URL = `${ROOT_URL}/reports`;
export const GENDER_DISTRIBUTION = `${REPORTS_BASE_URL}/gender-break-down`;
export const CALENDAR = `${REPORTS_BASE_URL}/calendar`;
export const HEAD_COUNT = `${REPORTS_BASE_URL}/head-count`;
export const SALARY_HISTORY_GRAPH = `${REPORTS_BASE_URL}/employee-salary-history`;
export const PC_WISE_PENDING_COUNT = `${REPORTS_BASE_URL}/pc-wise-pending-count`;
export const WEEKDAYS_LEAVES_TREND = `${REPORTS_BASE_URL}/daily-leaves-trend`;
export const WEEKWISE_TREND = `${REPORTS_BASE_URL}/weekly-leaves-trend`;
export const MONTHLY_TREND = `${REPORTS_BASE_URL}/monthly-trend`;
export const MOST_DAYS_AWAY_TREND = `${REPORTS_BASE_URL}/most-days-away`;
export const MONTHLY_LEAVE_STACK_TREND = `${REPORTS_BASE_URL}/monthly-leavetypes`;
export const EMPLOYEES_DISTRIBUTION = `${REPORTS_BASE_URL}/employee-distribution`;
export const WEEKDAYS_ATTENDANCE_TREND = `${REPORTS_BASE_URL}/daily-attendence-trend`;
export const WEEKWISE_ATTENDANCE_TREND = `${REPORTS_BASE_URL}/weekly-attendence-trend`;
export const MONTHLY_ATTENDANCE_TREND = `${REPORTS_BASE_URL}/monthly-attendence-trend`;
export const MOST_WORKING_HOURS = `${REPORTS_BASE_URL}/most-working-hours`;
export const DAILY_LEAVES_PREDICTION = `${REPORTS_BASE_URL}/daily-leaves-predictions`;
export const WEEKLY_LEAVES_PREDICTION = `${REPORTS_BASE_URL}/weekly-leaves-predictions`;
export const MONTHLY_LEAVES_PREDICTION = `${REPORTS_BASE_URL}/monthly-leaves-predictions`;
export const EMPLOYEE_LEAVES_PREDICTION = `${REPORTS_BASE_URL}/employee-leaves-predictions`;
export const GET_CARRY_FORWARD_LEAVES_BALANCES = `${REPORTS_BASE_URL}/carry-forward-leaves-balances`;
export const ADDITIONS_AND_TERMINATION = `${REPORTS_BASE_URL}/get-additions-terminations`;

export const SALARY_HISTORIES = `${ROOT_URL}/salaryhistories`;

export const ANNOUNCEMENTS = `${ROOT_URL}/announcements`;
export const CURRENT_ANNOUNCEMENTS = `${ANNOUNCEMENTS}/current-announcements`;

export const QUOTE_GENERATOR = `${ROOT_URL}/qoutesGenerator`;

export const TIME_OF_BALANCES_REPORT = `${ROOT_URL}/TimesOffBalancesPdf/times-of-balances-pdf`