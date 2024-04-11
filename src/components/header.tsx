import eventInIcon from '../assets/event-in-icon.svg'
import { NavLink } from './nav-link'

export function Header() {
  return (
    <div className='flex items-center gap-5 py-2'>
      <a href="/">
        <img src={eventInIcon} />  
      </a>

      <nav className='flex items-center gap-5'>
        <NavLink href='/events'>Events</NavLink>
        <NavLink href='/attendees'>Attendees</NavLink>
      </nav>
    </div>
  )
}
