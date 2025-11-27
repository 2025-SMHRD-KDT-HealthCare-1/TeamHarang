import React from "react";
import SurveyForm from "../components/Survey/SurveyForm";
import { PSS } from "../data/SurveyData";

const SurveyPSS = () => {
  return <SurveyForm type="PSS" questions={PSS} />;
};

export default SurveyPSS;
