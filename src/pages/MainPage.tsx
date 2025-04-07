import React from 'react'

interface MainPageProps {
  aaa: string;
  children?: React.ReactNode;
}

const MainPage = ({aaa, children}:MainPageProps) => {
  return (
    <>
      <h1>Main Page</h1>
      <p>This is the main page.</p>
      {children}
      {children}
      <div>{aaa}</div>
    </>
  )
}

export default MainPage;
