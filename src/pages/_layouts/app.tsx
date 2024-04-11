import { Outlet } from "react-router-dom"
import { Header } from "../../components/header"

export function AppLayout() {
  return (
    <div className="max-w-[1216px] mx-auto py-5 flex flex-col gap-5">
      <Header />

      <div>
        <Outlet />
      </div>
    </div>
  )
}