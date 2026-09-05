import { useMutation } from '@tanstack/react-query'
import {
  runMonteCarloSimulation,
  SimulationScenarioInput,
} from '@/lib/api/simulation'

export function useRunSimulation() {
  return useMutation({
    mutationFn: (input: SimulationScenarioInput) =>
      runMonteCarloSimulation(input),
  })
}