import React from 'react'
import styled from 'styled-components'
import ReactTable from '../components/reactTable'
import makeData from '../makeData'

const PageContainer = styled.div`
  padding: 20px;
`;

export default function Home() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            width: 50,
            align: 'right',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            width: 50,
            align: 'right',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(20), [])

  return (
    <PageContainer>
      <ReactTable data={data} columns={columns} scrollBodyHorizontally={true} />
    </PageContainer>
  )
}
