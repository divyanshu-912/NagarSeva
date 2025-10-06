import React from "react";
import LandingPageComponent from "../../components/user/LandingPage";

export default function LandingPage({ cityName }) {
  return <LandingPageComponent name={cityName} />;
}