import { Input, Divider, Button, message, Typography, Spin, Card, Image, Row, Col, Tag, Radio, Space } from 'antd'
import { useState } from 'react';
import ScrollButton from './ScrollButton';
import axios from 'axios'
import moment from 'moment'
import { API_URL } from './const';

function App() {
  const [data, setData] = useState([])
  const [dataShow, setDataShow] = useState([])
  const [pos, setPos] = useState('')
  const [loading, setLoading] = useState(false)
  const [groupSelection, setGroupSelection] = useState(0)
  const [searchString, setSearchString] = useState('')

  const groupData = [
    {
      id: "259536527221063683",
      name: "100community"
    },
    {
      id: "259296509361782784",
      name: "2600cp"
    },
    {
      id: "283442715188920321",
      name: "level30community"
    }
  ]

  function distance(lat1, lon1, lat2, lon2, unit) {
    lat1 = parseFloat(lat1)
    lon1 = parseFloat(lon1)
    lat2 = parseFloat(lat2)
    lon2 = parseFloat(lon2)
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") { dist = dist * 1.609344 }
      if (unit === "N") { dist = dist * 0.8684 }
      return dist.toFixed(1);
    }
  }

  const handleClick = async () => {
    try {
      setLoading(true)
      const res = await axios.post(API_URL, groupData[groupSelection])
      const serverData = res.data.data

      setData(serverData.map(item => {
        const [lat1, lon1] = pos.split(',')
        const [lat2, lon2] = item.location.split(',')
        const dis = distance(lat1, lon1, lat2, lon2, 'K')
        item.distance = dis
        const time = moment(item.timeStart).fromNow()
        item.timeStart = time
        return item
      }).sort((a, b) => a.distance - b.distance))
      setLoading(false)
      message.success('Thành công')
    } catch (error) {
      console.log(error)
      message.error('Không thành công')
      setLoading(false)
    }
  }

  const dataSelector = () => {
    return data.filter(item => item.name.includes(searchString))
  }

  return (
    <>
      {!loading && <div style={{ minHeight: '100vh', backgroundColor: '#dcfce7', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography.Title>PokeZ</Typography.Title>
        <div>Your location</div>
        <Input style={{ width: 560 }} placeholder='Điền tọa độ hiện tại của bạn' value={pos} onChange={(e) => setPos(e.target.value)}></Input>
        <Radio.Group onChange={(e) => setGroupSelection(e.target.value)} value={groupSelection} defaultValue={0}>
          <Space direction="vertical">
            {groupData.map((item, index) => <Radio key={item.id} value={index}>{item.name}</Radio>)}
          </Space>
        </Radio.Group>
        <Button style={{ marginTop: 10 }} type='primary' onClick={handleClick}>Tìm kiếm</Button>
        <Divider />
        <Typography.Title level={2}>{groupData[groupSelection].name}</Typography.Title>
        <Input onChange={(e) => setSearchString(e.target.value)} value={searchString} placeholder='Nhập tên poke muốn tìm kiếm'></Input>
        {dataSelector().map(item => <PokeCard key={item.id} data={item}></PokeCard>)}
      </div>
      }
      {loading && <Spin style={{ width: '100%', height: '100%', textAlign: 'center' }} size='large'></Spin>}
      <ScrollButton />
    </>
  );
}

function PokeCard({ data: { name, country, distance, cp, dsp, image, iv, location, lv, timeStart } }) {
  const title = <>
    <Image src={image}></Image>
    <span style={{ marginLeft: 10, marginRight: 10 }}>{name}</span>
    <Image src={country}></Image>
    <span style={{ marginLeft: 10, marginRight: 10 }}>{location}</span>
    <Button style={{ marginLeft: 20 }}>Copy</Button>
  </>

  return (
    <Card title={title} style={{ width: 560, marginTop: 10 }}>
      <Row style={{ width: '100%' }}>
        <Col span={12}>
          <Row>
            <Col span={6}><b>iv:</b></Col>
            <Col span={18}><Tag color='red'>{iv}</Tag></Col>
          </Row>
          <Row>
            <Col span={6}><b>cp:</b></Col>
            <Col span={18}><Tag color='blue'>{cp}</Tag></Col>
          </Row>
          <Row>
            <Col span={6}><b>lv:</b></Col>
            <Col span={18}><Tag color='green'>{lv}</Tag></Col>
          </Row>
        </Col>
        <Col span={12}><Row>
          <Col span={8}><b>DSP:</b></Col>
          <Col span={16}><Tag color='red'>{dsp} min</Tag></Col>
        </Row>
          <Row>
            <Col span={8}><b>Distance:</b></Col>
            <Col span={16}><Tag color='blue'>{distance} km</Tag></Col>
          </Row>
          <Row>
            <Col span={8}><b>TimeStart:</b></Col>
            <Col span={16}><Tag color='green'>{timeStart}</Tag></Col>
          </Row></Col>
      </Row>
    </Card>
  )
}

export default App;
