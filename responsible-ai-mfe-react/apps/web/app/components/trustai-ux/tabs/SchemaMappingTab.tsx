import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { caesSchema, fieldMappings } from "../data/mockData"
import type { CaesCategory } from "../data/mockData"
import { SchemaMappingTable } from "../ui/SchemaMappingTable"

const CATEGORIES: CaesCategory[] = ["Identity & Session", "Timing", "Tool Invocation", "Human Oversight", "Data Access", "Error & Recovery"]

export function SchemaMappingTab() {
  const requiredFields = caesSchema.filter((field) => field.required)
  const requiredMapped = requiredFields.filter((field) => {
    const mapping = fieldMappings.find((item) => item.schemaField === field.field)
    return mapping?.status === "satisfied"
  })
  const unmapped = fieldMappings.filter((mapping) => mapping.status === "missing").length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardContent className="pt-5">
            <p className="text-xs font-medium text-[#305669]/70">Schema Fields</p>
            <p className="mt-1.5 text-2xl font-semibold text-[#0f2b2c]">{caesSchema.length}</p>
            <p className="mt-1 text-xs text-[#305669]/60">{requiredFields.length} required</p>
          </CardContent>
        </Card>
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardContent className="pt-5">
            <p className="text-xs font-medium text-[#305669]/70">Required Fields Satisfied</p>
            <p className="mt-1.5 text-2xl font-semibold text-[#0f2b2c]">
              {requiredMapped.length} / {requiredFields.length}
            </p>
            <p className="mt-1 text-xs text-rose-600">{requiredFields.length - requiredMapped.length} required fields missing or partial</p>
          </CardContent>
        </Card>
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardContent className="pt-5">
            <p className="text-xs font-medium text-[#305669]/70">Unmapped Fields</p>
            <p className="mt-1.5 text-2xl font-semibold text-[#0f2b2c]">{unmapped}</p>
            <p className="mt-1 text-xs text-[#305669]/60">No candidate field found in the uploaded log</p>
          </CardContent>
        </Card>
      </div>

      {CATEGORIES.map((category) => (
        <Card key={category} className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              {caesSchema.filter((field) => field.category === category).length} fields in this category, including{" "}
              {caesSchema.filter((field) => field.category === category && field.required).length} required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SchemaMappingTable schema={caesSchema.filter((field) => field.category === category)} mappings={fieldMappings} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
