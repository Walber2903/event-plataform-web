import { createBrowserRouter } from "react-router-dom";
import { EventList } from "./pages/app/event-list";
import { AttendeeList } from "./pages/app/attendee-list";
import { SignIn } from "./pages/auth/sign-in";
import { AppLayout } from "./pages/_layouts/app";

export const router = createBrowserRouter([
  { 
    path: '/sign-in', 
    element: <SignIn />,
  },
  { 
    path: '/', 
    element: <AppLayout />,
    children:  [
      { path: '/',  element: <EventList />}
    ]
  },
  { 
    path: '/events', 
    element: <AppLayout />,
    children:  [
      { path: '/events',  element: <EventList />}
    ]
  },
  { 
    path: '/attendees', 
    element: <AppLayout />,
    children:  [
      { path: '/attendees',  element: <AttendeeList />}
    ]
  },
])