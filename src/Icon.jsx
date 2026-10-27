const P = {
  groceries: <><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.5 8H6" /><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></>,
  vegetables: <><path d="M12 8c-4 0-6 3-6 6 0 3 2 6 6 6s6-3 6-6c0-3-2-6-6-6z" /><path d="M12 8c0-2 1-4 3-5M12 8c-1-1.500-3-2-4.500-1.500" /></>,
  fruits: <><path d="M12 7c-3-1.500-7 0-7 5 0 4 3 8 5.500 8 1 0 1-.5 1.500-.5s.5.5 1.500.5C16 20 19 16 19 12c0-5-4-6.500-7-5z" /><path d="M12 7c0-2 1-3.500 3-4" /></>,
  milk: <><path d="M9 3h6v3l2 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l2-3V3z" /><path d="M7 12h10" /></>,
  petrol: <><path d="M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15" /><path d="M3 20h13M14 9h2.500a1.500 1.500 0 0 1 1.500 1.500V16a1.500 1.500 0 0 0 3 0V8l-3-3" /><path d="M7.500 8h4" /></>,
  bills: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" /><path d="M9 8h6M9 12h6" /></>,
  health: <><path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z" /><path d="M12 9v5M9.500 11.500h5" /></>,
  repair: <><path d="M14.500 6.500a4 4 0 0 0 4.800 4.800l-9.300 9.300a2.100 2.100 0 0 1-3-3l9.300-9.300a4 4 0 0 0-1.800-1.800z" /></>,
  others: <><path d="M12 4l1.800 4.700L18.500 10l-4.700 1.800L12 16.500l-1.800-4.700L5.500 10l4.700-1.300L12 4z" /><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" /></>,
  home: <><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9z" /></>,
  fill: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  stats: <><path d="M12 3a9 9 0 1 0 9 9h-9V3z" /><path d="M15 3.500A9 9 0 0 1 20.500 9H15V3.500z" /></>,
  history: <><path d="M4 12a8 8 0 1 0 2.500-5.800L4 8.500" /><path d="M4 4v4.500h4.500M12 8v4.500l3 2" /></>,
  cal: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
}
export default function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name]}
    </svg>
  )
}
