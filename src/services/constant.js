const prodUrl = "https://api.lifology.com";
const devUrl = "https://sp-app-api.herokuapp.com/v1/api/";
let apiUrl = devUrl;

export const menuItems = [
  {
    href: "/home",
    title: "Dashboard",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "User Management",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "Package and Pickup Management",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "Payment and Commission",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "Reported issue",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "Database",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "Feedback and Ratings",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "Support and Help Center",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/home",
    title: "Content Management",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
];

export const Constants = {
  baseUrl: apiUrl,
  lightgrey: "#757575",
  grey: "#333333",
  yellow: "#FFE600",
  black: "#000000",
  green: "#07A404",
  white: "#FFFFFF",
  red: "#E71126",
  constant_appLaunched: "appLaunched",
  HAS_ACCOUNT: "HASACCOUNT",
  LANGUAGE_SELECTED: "LANGUAGE_SELECTED",
  header_back_middle_right: "header_back_middle_right",
  header_back: "header_back",
  keyUserToken: "token",
  isOnboarded: "isOnboarded",
  authToken: "",
  keysocailLoggedIn: "isSocialLoggedIn",
  isProfileCreated: "isProfileCreated",
  userInfoObj: "userInfoObj",
  lastUserType: "lastUserType",
  isDeviceRegistered: "isDeviceRegistered",
  canResetPass: "canResetPass",
  fcmToken: "fcmToken",
  productionUrl: prodUrl,
  developmentUrl: devUrl,

  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
};

