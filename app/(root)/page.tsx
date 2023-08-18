import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  return (
    <div className="inline-flex items-start">
      <UserButton />
      <h1>Protected Setup Route!</h1>
    </div>
  )
}
  