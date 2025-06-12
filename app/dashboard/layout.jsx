import Slidebar from '../_components/dashboard/Slidebar'
export default function Layout({ children }) {
  return (
    <div className="flex">
      <Slidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
