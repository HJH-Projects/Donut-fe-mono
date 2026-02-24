
import { BottomNav } from "./BottomNav"

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-screen bg-white flex flex-col">
      <main className="flex-1 min-h-0 flex flex-col ">{children}</main>
      <BottomNav />
    </div>
  )
}
export default PageLayout