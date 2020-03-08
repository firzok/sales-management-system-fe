export const AUTH_BASE_URL = "/auth";
export const LOAD_LOGIN = `${AUTH_BASE_URL}/login`;
export const LOAD_LOGOUT = `${AUTH_BASE_URL}/logout`;

export const NEW_ORDER = `/new-order`;
export const ALL_ORDERS = `/all-orders`;

export const SETTINGS_BASE_URL = "/settings";
export const CHANGE_PASSWORD = `${SETTINGS_BASE_URL}/change-password`;
export const VIEW_PROFILE = `${SETTINGS_BASE_URL}/view-profile`;
export const CHANGE_PROFILE_PICTURE = `${SETTINGS_BASE_URL}/change-profile-picture`;

export const CONFIGURATIONS = "/configurations";

export const HOME = "";
export const BASE_ROUTE = "/";
export const LOAD_APP = "/";

export const DASHBOARD_EMPLOYEE = "/dashboard-employee";
export const DASHBOARD_DOMAINHEAD = "/dashboard-domainhead";
export const DASHBOARD_ADMIN = "/dashboard-admin";

export const EMPLOYEES_BASE_URL = "/employees";
export const ADD_EMPLOYEE = `${EMPLOYEES_BASE_URL}/add-employee`;
export const EDIT_EMPLOYEE = `${EMPLOYEES_BASE_URL}/edit-employee`;
export const VIEW_PROBATION_EMPLOYEE = `${EMPLOYEES_BASE_URL}/view-probation-employee`;
export const UPDATE_TEAM = `${EMPLOYEES_BASE_URL}/update-team`;
export const VIEW_INACTIVE_EMPLOYEE = `${EMPLOYEES_BASE_URL}/view-inactive`;
export const VIEW_EMPLOYEE_PROFILE = `${EMPLOYEES_BASE_URL}/employee-profile`;
export const CHANGE_EMPLOYEE_STATUS = `${EMPLOYEES_BASE_URL}/change-status`;
export const ADJUSTMENTS = `${EMPLOYEES_BASE_URL}/adjustments`;

export const LEAVE_BASE_URL = "/leaves";
export const APPLY_LEAVE = `${LEAVE_BASE_URL}/apply-leave`;
export const VIEW_LEAVE_HISTORY = `${LEAVE_BASE_URL}/view-leaves`;
export const VIEW_PENDING_HISTORY = `${LEAVE_BASE_URL}/pending-leaves`;
export const ADD_LEAVE_TYPE = `${LEAVE_BASE_URL}/add-leave-type`;
export const EDIT_LEAVE_TYPE = `${LEAVE_BASE_URL}/edit-leave-type`;
export const VIEW_LEAVE_TYPES = `${LEAVE_BASE_URL}/view-leave-types`;
export const EXPORT_LEAVES_BALANCES_BASE_URL = `${LEAVE_BASE_URL}/export-balances`;

export const REPORTS_BASE_URL = "/reports";
export const TIME_OF_BALANCES = `${REPORTS_BASE_URL}/time-of-balances`;
export const DETAILED_BALANCES = `${REPORTS_BASE_URL}/detailed-balances`;
export const EMPLOYEES_DISTRIBUTION = `${REPORTS_BASE_URL}/employees-distribution`;
export const HEAD_COUNT = `${REPORTS_BASE_URL}/head-count`;
export const ADDITTIONS_TERMINATIONS = `${REPORTS_BASE_URL}/get-additions-terminations`;
export const SALARY_HISTORY = `${REPORTS_BASE_URL}/salary-history`;
export const PC_WISE_PENDING_COUNT = `${REPORTS_BASE_URL}/pc-wise-pending-count`;
export const EMPLOYEES_LEAVES_BALANCE = `${REPORTS_BASE_URL}/employees-leaves-balance`;
export const CARRY_FORWARD_LEAVES_BALANCES = `${REPORTS_BASE_URL}/carry-forward-leaves-balances`;

export const TREND_ANALYSIS_BASE_URL = "/trend-analysis";
export const LEAVES_TREND = `${TREND_ANALYSIS_BASE_URL}/leaves`;
export const ATTENDANCE_TREND = `${TREND_ANALYSIS_BASE_URL}/attendance`;

export const AI_REPORTS_BASE_URL = "/ai-reports";
export const LEAVES_AI_REPORT = `${AI_REPORTS_BASE_URL}/leaves`;
export const ATTENDANCE_AI_REPORT = `${AI_REPORTS_BASE_URL}/attendance`;

export const ROLE_BASE_URL = "/administrative-rights";
export const ADD_ROLE = `${ROLE_BASE_URL}/add-administrative-right`;
export const EDIT_ROLE = `${ROLE_BASE_URL}/edit-administrative-right`;
export const DELETE_ROLE = `${ROLE_BASE_URL}/delete-administrative-right`;

export const ACTIVITY_LOGS_BASE_URL = "/activity-logs";
export const ACTIVITY_LOGS_TIMELINE = `${ACTIVITY_LOGS_BASE_URL}/timeline`;

export const ATTENDANCE_BASE_URL = "/attendance";
export const MARK_ATTENDANCE = `${ATTENDANCE_BASE_URL}/mark-attendance`;
export const APPROVE_ATTENDANCE = `${ATTENDANCE_BASE_URL}/approve-attendance`;

export const INVOICING = `/invoicing`;

export const IMPORTS = `/imports`;

export const ERROR_404 = "/error404";

export const CUSTOMIZATION = "/custom-fields";
export const NATIONALITY = `${CUSTOMIZATION}/nationalities`;
export const COUNTRY = `${CUSTOMIZATION}/countries`;
export const CITY = `${CUSTOMIZATION}/cities`;
export const CURRENCY = `${CUSTOMIZATION}/currencies`;
export const PUBLIC_HOLIDAYS = `${CUSTOMIZATION}/public-holidays`;
export const DESIGNATIONS = `${CUSTOMIZATION}/designation`;

export const DESIGNATION_URL = "/designation";
export const ADD_DESIGNATION = `${DESIGNATION_URL}/add-designation`;
export const EDIT_DESIGNATION = `${DESIGNATION_URL}/edit-designation`;

export const ANNOUNCEMENTS_URL = "/announcements";
export const ADD_EDIT_DELETE_ANNOUNCEMENTS = `${ANNOUNCEMENTS_URL}/add-edit-delete`;

export const HELP = process.env.PUBLIC_URL + "/user-guide/I-RMS.html";
