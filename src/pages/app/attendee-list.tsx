import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { ChangeEvent, useEffect, useState } from 'react'

import { IconButton } from '../../components/icon-button'
import { Table } from '../../components/table/table'
import { TableHeader } from '../../components/table/table-header'
import { TableCell } from '../../components/table/table-cell'
import { TableRow } from '../../components/table/table-row'

dayjs.extend(relativeTime)

interface Attendee {
  id: string
  name: string
  email: string
  createdAt: string
  checkedInAt: string | null
}

export function AttendeeList() {
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
  const [attendees, setAttendees] = useState<Attendee[]>([])

  const totalPages = Math.ceil(total / 10)

  useEffect(() => {
    const url = new URL('http://localhost:3003/events/f5a04b1a-35b3-41e2-8a8b-5a774f9d9cb2/attendees')

    url.searchParams.set('pageIndex', String(page - 1))
    if (inputSearchValue.length > 0)
    url.searchParams.set('query', inputSearchValue)

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.attendees)
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
        <h1 className="text-2xl font-bold">Attendees</h1>
        <div className="flex justify-center px-3 w-72 py-1.5 border border-white/10 rounded-lg gap-3">
          <Search className='size-4 text-emerald-300'/>
          <input 
            type="text" 
            onChange={onSearchInputChange} 
            placeholder="Search attendee..." 
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
            <TableHeader>Attendee</TableHeader>
            <TableHeader>Registration date</TableHeader>
            <TableHeader>Check in date</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id} className='hover:bg-white/5'>
                <TableCell>
                  <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/20' />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <span className='font-semibold text-white'>{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt === null 
                    ? <span className='text-zinc-500'>Haven't checked in yet</span> 
                    : dayjs().to(attendee.checkedInAt)
                  }
                </TableCell>
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
              Showing {attendees.length} of { total } items
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