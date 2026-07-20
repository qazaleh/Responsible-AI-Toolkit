import * as React from "react"
import { render, screen } from "@testing-library/react"
import Home from "./home"
import { MemoryRouter } from "react-router"
import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom"

describe("MFE Dashboard Home Component", () => {
  it("renders the primary TrustAI navigation sidebar buttons correctly", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    
    // Verify specific sidebar navigation labels are present
    const workbenchButtons = screen.getAllByText(/AI Workbench/i)
    expect(workbenchButtons.length).toBeGreaterThan(0)
    expect(workbenchButtons[0]).toBeInTheDocument()

    expect(screen.getByText("Use Cases")).toBeInTheDocument()
    expect(screen.getByText("AI Models")).toBeInTheDocument()
  })
})
