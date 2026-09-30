"use client";
import { createContext, useContext, useReducer } from "react";
import {
  activeScenario,
  initialState,
  planningReducer,
  type PlanningAction,
  type PlanningState,
} from "../engine/naturana";
import type { ScenarioPreset } from "../data/naturana.types";
type Context = {
  state: PlanningState;
  scenario: ScenarioPreset | undefined;
  dispatch: React.Dispatch<PlanningAction>;
};
const PlanningContext = createContext<Context | null>(null);
export function PlanningProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    planningReducer,
    undefined,
    initialState,
  );
  return (
    <PlanningContext.Provider
      value={{ state, scenario: activeScenario(state), dispatch }}
    >
      {children}
    </PlanningContext.Provider>
  );
}
export function usePlanning() {
  const value = useContext(PlanningContext);
  if (!value) throw new Error("PlanningProvider is required");
  return value;
}
