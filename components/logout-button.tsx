"use client";
import { logoutAction } from "@/action/authAction";
function LogoutButton() {
  return <button onClick={logoutAction}>Logout</button>;
}

export default LogoutButton;
