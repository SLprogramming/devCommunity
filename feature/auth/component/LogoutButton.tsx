import { Button } from "@/components/ui/button";
import React from "react";
import { signOutAction } from "../actions";
const LogoutButton = () => {
  return <Button onClick={signOutAction}>Logout</Button>;
};

export default LogoutButton;
