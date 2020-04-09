export const bloodGroup = [
  { value: "O+", label: "O+" },
  { value: "A+", label: "A+" },
  { value: "B+", label: "B+" },
  { value: "AB+", label: "AB+" },
  { value: "O-", label: "O-" },
  { value: "A-", label: "A-" },
  { value: "B-", label: "B-" },
  { value: "AB-", label: "AB-" },
];

export const dateFormat = "YYYY-MMM-DD";
export const RenderDateForm = "DD MMM, YYYY";

export const Gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const LeaveStatusWithAll = [
  { value: "all", label: "All", render: true },
  { value: "approved", label: "Approved", render: true },
  { value: "notapproved", label: "Rejected", render: true },
  { value: "pending", label: "Pending", render: true },
  { value: "withdrawn", label: "Withdrawn", render: true },
  { value: "deleted", label: "Deleted", render: true },
];

export const LeaveStatus = [
  { value: "approved", label: "Approved", render: true },
  { value: "notapproved", label: "Rejected", render: true },
  { value: "pending", label: "Pending", render: true },
  { value: "withdrawn", label: "Withdrawn", render: true },
  { value: "deleted", label: "Deleted", render: true },
];

export const LeaveStatusPending = [
  { value: "approved", label: "Approved", render: true },
  { value: "notapproved", label: "Rejected", render: true },
  { value: "pending", label: "Pending", render: true },
];

export const EmployeeStatus = [
  { value: "probation", label: "Probation" },
  { value: "current", label: "Permanent" },
  { value: "resign", label: "Resign" },
  { value: "layoff", label: "LayOff" },
  { value: "internee", label: "Intern" },
];

export const maritalStatus = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
];

export const actionOptions = [
  { value: "Add", label: "Add" },
  { value: "Update", label: "Update" },
  { value: "Delete", label: "Delete" },
];
export const religions = [
  { value: "Christianity", label: "Christianity" },
  { value: "Atheist", label: "Atheist" },
  { value: "Hinduism", label: "Hinduism" },
  { value: "Buddhism", label: "Buddhism" },
  { value: "Chinese Traditional", label: "Chinese Traditional" },
  { value: "Ethnic Religions ", label: "Ethnic Religions " },
  { value: "African Traditional", label: "African Traditional" },
  { value: "Sikhism", label: "Sikhism" },
  { value: "Spiritism", label: "Spiritism" },
  { value: "Judaism", label: "Judaism" },
  { value: "Jainism", label: "Jainism" },
  { value: "Shinto", label: "Shinto" },
  { value: "Cao Dai", label: "Cao Dai" },
  { value: "Zoroastrianism", label: "Zoroastrianism" },
  { value: "Tenrikyo", label: "Tenrikyo" },
  { value: "Neo-Paganism", label: "Neo-Paganism" },
  { value: "Unitarian Universalism", label: "Unitarian Universalism" },
  { value: "Rastafari", label: "Rastafari" },
  { value: "Primal-Indigenous", label: "Primal-Indigenous" },
  { value: "Bahai", label: "Bahai" },
  { value: "Islam", label: "Islam" },
  { value: "Other", label: "Other" },
];

export const Nationality = [
  { value: "Pakistani", label: "Pakistani" },
  { value: "German", label: "German" },
];

export const nok = [
  { value: "grandFather", label: "Grand Father" },
  { value: "grandMother", label: "Grand Mother" },
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "brother", label: "Brother" },
  { value: "sister", label: "Sister" },
  { value: "wife", label: "Wife" },
  { value: "child", label: "Child" },
  { value: "uncle", label: "Uncle" },
  { value: "aunt", label: "Aunt" },
  { value: "cousin", label: "Cousin" },
  { value: "Guardian", label: "Guardian" },
];

export const boolean = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];

export const halfFullDay = [
  { value: "1", label: "Half Day" },
  { value: "0", label: "Full Day" },
];

export const months = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

export const monthsObject = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

export const monthsObjectMap = {
  january: "Jan",
  february: "Feb",
  march: "Mar",
  april: "Apr",
  may: "May",
  june: "Jun",
  july: "Jul",
  august: "Aug",
  september: "Sep",
  october: "Oct",
  november: "Nov",
  december: "Dec",
};

export const monthListWithAllMonthOption = [
  {
    id: 0,
    name: "All Months",
  },
  {
    id: 1,
    name: "January",
  },
  {
    id: 2,
    name: "February",
  },
  {
    id: 3,
    name: "March",
  },
  {
    id: 4,
    name: "April",
  },
  {
    id: 5,
    name: "May",
  },
  {
    id: 6,
    name: "June",
  },
  {
    id: 7,
    name: "July",
  },
  {
    id: 8,
    name: "August",
  },
  {
    id: 9,
    name: "September",
  },
  {
    id: 10,
    name: "October",
  },
  {
    id: 11,
    name: "November",
  },
  {
    id: 12,
    name: "December",
  },
];

export const monthList = [
  {
    id: 1,
    name: "January",
  },
  {
    id: 2,
    name: "February",
  },
  {
    id: 3,
    name: "March",
  },
  {
    id: 4,
    name: "April",
  },
  {
    id: 5,
    name: "May",
  },
  {
    id: 6,
    name: "June",
  },
  {
    id: 7,
    name: "July",
  },
  {
    id: 8,
    name: "August",
  },
  {
    id: 9,
    name: "September",
  },
  {
    id: 10,
    name: "October",
  },
  {
    id: 11,
    name: "November",
  },
  {
    id: 12,
    name: "December",
  },
];

export const pages = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

export const positions = [
  { value: "domain_head", label: "People Coordinator" },
  { value: "company_head", label: "Company Head" },
  { value: "team_lead", label: "Team Lead" },
  { value: "human_resource", label: "Human Resource" },
  { value: "employee", label: "Employee" },
];

export const positionsWithoutEmployee = [
  { value: "domain_head", label: "People Coordinator" },
  { value: "company_head", label: "Company Head" },
  { value: "team_lead", label: "Team Lead" },
  { value: "human_resource", label: "Human Resource" },
];

export const heatmapColors = {
  0: "#fde5d9",
  1: "#fcbba1",
  2: "#fc6b4b",
  3: "#f13c37",
  4: "#cc1821",
};

export const colors = {
  a: "#2196f3",
  b: "#ec407a",
  c: "#ff9800",
  d: "#66bb6a",
  e: "#5c6bc0",
  f: "#ef5350",
  g: "#8d6e63",
  h: "#26a59a",
  i: "#ff9b12",
  j: "#343434",
  k: "#39589e",
  l: "#7886cb",
  m: "#26a59a",
  n: "#6A1B9A",
  o: "#283593",
  p: "#5C6BC0",
  q: "#4db6ab",
  r: "#444444",
  s: "#888888",
  t: "#37474F",
  u: "#4E342E",
  v: "#FF7043",
  w: "#263238",
  x: "#009688",
  y: "#00bcd4",
  z: "#8BC34A",
};

export const company = "iai";

export const defaultPermissionsList =
  "/,/dashboard,/new-order,/order,/all-orders,/auth/login,/auth/logout,/settings/change-password,/settings/view-profile,/error404,/leaves/view-leaves";

export const localPermissions = [
  "/auth/login",
  "/auth/logout",
  "/",
  "/dashboard-employee",
  "/dashboard-domainhead",
  "/dashboard-admin",

  "/new-order",
  "/all-orders",
  "/expense",

  "/employees",
  "/employees/add-employee",
  "/employees/edit-employee",
  "/add-employee",

  "/configurations",

  "/settings",
  "/error404",
];
export default localPermissions;
// TODO: Remove /add-employee

export const expenseTypes = [
  "Vehicle",
  "Petrol",
  "Food",
  "Cash Purchase",
  "Salary",
  "Other",
];

export const byType = ["By Day", "By Month", "By Year"];

export const cashDisposalTypes = ["Bank", "Self"];
