export default function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
  if (!regex.test(email)) {
    return { status: false, message: "Please enter a valid email address" };
  }
  return { status: true, message: "" };
}
