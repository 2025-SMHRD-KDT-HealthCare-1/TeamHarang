import React from "react";
import SurveyForm from "../components/Survey/SurveyForm";
import { GAD } from "../data/SurveyData";

export default function SurveyGAD() {
  return (
    <SurveyForm
      type="GAD"
      questions={GAD}   // GAD-7 공식 문항 들어감
    />
  );
}
