import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .required("Please enter your name")
    .matches(/^[a-zA-Z_ ]*$/, "No special characters and numbers")
    .min(3, "Name must be min 3 characters")
    .max(30, "Name must be max 30 characters"),
  email: Yup.string()
    .required("Please enter email address")
    .email("Please enter a valid email"),
  status: Yup.string().max(64, "Status must be max 64 characters"),
  password: Yup.string()
    .required("Please enter your password")
    .min(6, "Password must be minimum 6 chars!"),
  /* .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character."
    ), */
});
export const loginSchema = Yup.object({
  email: Yup.string().required("Please enter email address"),

  password: Yup.string().required("Please enter your password"),
});
