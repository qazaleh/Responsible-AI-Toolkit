import * as React from "react"
import { render, screen } from "@testing-library/react"
import { Navbar } from "./Navbar"
import { MemoryRouter } from "react-router"
import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom"

describe("Navbar Component", () => {
  it("renders the rebranded TrustAI title correctly", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    // Verify TrustAI brand text is present in the document
    const brandElement = screen.getByText(/TrustAI/i)
    expect(brandElement).toBeInTheDocument()
  })
})
