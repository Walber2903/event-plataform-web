import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react"
import { Table } from "../../components/table/table"
import { TableHeader } from "../../components/table/table-header"
import { TableRow } from "../../components/table/table-row"
import { TableCell } from "../../components/table/table-cell"
import { ChangeEvent, useEffect, useState } from "react"
import { IconButton } from "../../components/icon-button"


interface Event {
  id: string
  title: string
  slug: string
  details: string
  maximumAttendees: number
  attendeesAmount: number
}

export function EventList() {
  const [inputSearchValue, setInputSearchValue] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [total, setTotal] = useState(0)
  const [events, setEvents] = useState<Event[]>([])

  const totalPages = Math.ceil(total / 10)

  useEffect(() => {
    const url = new URL('http://localhost:3003/events')

    url.searchParams.set('pageIndex', String(page - 1))
    if (inputSearchValue.length > 0) {
      url.searchParams.set('query', inputSearchValue)
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setEvents(data.events)
        setTotal(data.total)
      })
  }, [page, inputSearchValue])

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    window.history.pushState({}, "", url)
    setInputSearchValue(search)
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, "", url)
    setPage(page)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement> ) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1)
  }

  function goToFirstPage() {
    setCurrentPage(1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  return(
    <div className='flex flex-col gap-4'>
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex justify-center px-3 w-72 py-1.5 border border-white/10 rounded-lg gap-3">
          <Search className='size-4 text-emerald-300'/>
          <input 
            type="text" 
            onChange={onSearchInputChange} 
            placeholder="Search event..." 
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" 
          />
        </div>
      </div>
      
      <Table>
        <thead>
            <TableRow className='border-b border-white/10'>
              <TableHeader style={{ width: 48 }}>
                <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/30' />
              </TableHeader>
              <TableHeader>Code</TableHeader>
              <TableHeader>Title</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader>Details</TableHeader>
              <TableHeader>Maximum Attendees</TableHeader>
              <TableHeader>Attendees Amount</TableHeader>
              <TableHeader style={{ width: 64 }}></TableHeader>
            </TableRow>
          </thead>

          <tbody>
            {events.map((event) => {
              return ( 
                <TableRow key={event.id}>
                  <TableCell>
                    <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/20' />
                  </TableCell>
                  <TableCell>{event.id}</TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.slug}</TableCell>
                  <TableCell>{event.details}</TableCell>
                  <TableCell>{event.maximumAttendees}</TableCell>
                  <TableCell>{event.attendeesAmount}</TableCell>
                  <TableCell>
                      <IconButton transparent={true}>
                        <MoreHorizontal className='size-4'/>
                      </IconButton>
                    </TableCell>
                </TableRow>
              )
            })}
          </tbody>

          <tfoot>
            <tr>
              <TableCell className='py-3 px-4 text-sm text-zinc-300' colSpan={3}>
                Showing {events.length} of { total } items
              </TableCell>
              <TableCell className='text-right' colSpan={3}>
                <div className='inline-flex gap-8 items-center'>
                  <span>Page {page} of {totalPages}</span>

                  <div className='flex gap-1.5'>
                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                      <ChevronsLeft className='size-4'/>
                    </IconButton>
                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                      <ChevronLeft className='size-4'/>
                    </IconButton>
                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                      <ChevronRight className='size-4'/>
                    </IconButton>
                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                      <ChevronsRight className='size-4'/>
                    </IconButton>
                  </div>                
                </div>
              </TableCell>
            </tr>
          </tfoot>
      </Table>

    </div>
  )
}