import React from 'react'
import ServiceChart from '../../components/common/ServiceChart'
import CaseStatusChart from '../../components/common/CaseStatusChart'
import AgentStatusCard from './AgentStatusCard'


const Dashboard = () => {
  return (
    <div className='page-wrap'>
        <div className='page-body d-flex flex-column'>
                <div className='row row-gap-3_4'>
                    <div className='col-md-4'>
                    <ServiceChart />
                    </div>
                    <div className='col-md-8'>
                     <CaseStatusChart />
                    </div>
                    <div className='col-md-4'>
                        <AgentStatusCard />
                    </div>
                </div>
        </div>
    </div>
  )
}

export default Dashboard