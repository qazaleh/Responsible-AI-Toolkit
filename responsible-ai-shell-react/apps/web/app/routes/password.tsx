import * as React from "react"
import { Lock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function Password() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#305669]" />
            Password Change
          </CardTitle>
          <CardDescription>Update your backend-managed TrustAI credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-10 border-[#e6dece] bg-[#fffdf8]"
            />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10 border-[#e6dece] bg-[#fffdf8]"
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 border-[#e6dece] bg-[#fffdf8]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="border-[#e6dece]">Cancel</Button>
            <Button className="bg-[#305669] text-white hover:bg-[#244455]">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
