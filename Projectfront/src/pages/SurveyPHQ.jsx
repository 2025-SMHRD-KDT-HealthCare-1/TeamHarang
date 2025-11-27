import React from "react";
import SurveyForm from "../components/Survey/SurveyForm";
import { PHQ } from "../data/SurveyData";

const SurveyPHQ = () => {
  return <SurveyForm type="PHQ" questions={PHQ} />;
};

export default SurveyPHQ;
