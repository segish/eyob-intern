import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps extends React.ComponentProps<"div"> {
   email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loading:boolean
  handleSubmite: (e:React.FormEvent) => void;
}

export function LoginForm({
  className,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmite,
  loading,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 h-[80%]  rounded-xs">
        <CardContent className="grid p-0 md:grid-cols-2 h-full relative">
          
          <img src="/svgviewer-output (1).svg" alt="" className="absolute top-5 left-2 z-10 w-[100px] h-[50px]" />
          <div className="bg-muted relative hidden md:block">
            <img
              src="/pic-1.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <form className="md:p-8 h-full flex items-center justify-center" onSubmit={handleSubmite}>
            <div className="flex flex-col gap-6 w-full h-full">
              <div className="flex flex-col items-center text-center">
                <h1 className="font-bold">Login</h1>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email" className="font-normal text-gray-400">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="rounded-xs"
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}} 
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-normal text-gray-400">Password</Label>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  className="rounded-xs" 
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required />
              </div>
              <Button type="submit" className="w-full !rounded-xs" disabled={loading}>
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
