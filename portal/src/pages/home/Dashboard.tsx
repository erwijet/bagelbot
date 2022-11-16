import React from 'react';
import useBagelbotCtx from '../../hooks/useBagelbotCtx';
import ReactApexChart from 'react-apexcharts';
import Navbar from '../../components/Navbar';
import { Divider, Flex, Heading, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Tag } from '@chakra-ui/react';
import Stats from '../../components/Stats';

const Dashboard = () => {
    const { coins } = useBagelbotCtx();

    return <Flex direction={'column'} style={{margin: '16px'}}>
        <Stats />
        <Divider />
        <Heading style={{ margin: '16px'}} size={'lg'}>My Wallet</Heading>
        <ReactApexChart type='area' options={{
            chart: {
                height: 350,
                type: 'area'
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'numeric'
            }
        }} series={[{
            name: 'Balance',
            data: coins
        }]} height={350}/>
    </Flex>
}

export default Dashboard;