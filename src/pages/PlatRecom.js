import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import '../css/PlatRecom.css';
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext';

const PlatRecom = () => {
  const { user } = useAuth(); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
  };

  const subscriptionData = [
    { platform: '넷플릭스', cost: 5500, color: '#FBB4AE' },
    { platform: '왓챠', cost: 9900, color: '#CCEBC5' },
    { platform: '디즈니플러스', cost: 7900, color: '#B3CDE3' },
    { platform: '티빙', cost: 7900, color: '#DECBE4' }
  ];

  const contentData = [
    { platform: '넷플릭스', content: 500 },
    { platform: '왓챠', content: 500 },
    { platform: '디즈니플러스', content: 500 },
    { platform: '티빙', content: 500 }
  ];

  return (
    <div className="plat-PlatRecom">
      <header className="pageHeader">
        <Link to="/recommendations" className="recomlogo">
          <img src={logoImage} alt="Logo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="recom-searchIcon"
          />
        </Link>
        <button className="recom-sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="plat-greetingText">
        {user ? `${user.name}님에게 딱 맞는 플랫폼을 골라보세요` : '플랫폼을 골라보세요'}
      </div>
      <div className="plat-content">
        <h1 className="plat-title">나에게 맞는 OTT 플랫폼 찾아보기</h1>
        <div className="plat-graphContainer">
          <div className="plat-barGraph">
            <div className="plat-subtitle">OTT 플랫폼별 구독료 (최저가를 기준으로 함)</div>
            <ResponsiveBar
              data={subscriptionData}
              keys={['cost']}
              indexBy="platform"
              margin={{ top: 30, right: 20, bottom: 50, left: 50 }}
              padding={0.3}
              layout="vertical"
              colors={({ data }) => data.color}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '플랫폼',
                legendPosition: 'middle',
                legendOffset: 32,
                tickColor: '#000000',
                tickTextColor: '#000000',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '구독료 (원)',
                legendPosition: 'middle',
                legendOffset: -42, // 간격을 2픽셀로 조정
                tickColor: '#000000',
                tickTextColor: '#000000',
                tickValues: [0, 2000, 4000, 6000, 8000], // 2000 단위로 설정
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="#000000"
              isInteractive={false} // 막대그래프 인터랙션 비활성화
              theme={{
                fontSize: 14,
              }}
            />
          </div>
        </div>
        <div className="plat-graphContainer">
          <div className="plat-pieGraph">
            <div className="plat-subtitle">OTT 플랫폼별 컨텐츠 양</div>
            <ResponsivePie
              data={contentData.map(d => ({ id: d.platform, label: d.platform, value: d.content }))}
              margin={{ top: 20, right: 20, bottom: 40, left: 20 }} // 아래쪽 여백을 늘려 범례 공간 확보
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={['#FBB4AE', '#CCEBC5', '#B3CDE3', '#DECBE4']}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableRadialLabels={false} // Radial labels 비활성화
              enableSliceLabels={false}  // Slice labels 비활성화
              isInteractive={false}      // 파이그래프 인터랙션 비활성화
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 30,
                  itemsSpacing: 0,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemTextColor: '#000000',
                  symbolSize: 12,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000000',
                      },
                    },
                  ],
                  data: [
                    { id: '단위', label: '단위: 개', color: '#000000' },
                  ],
                },
              ]}
              theme={{
                fontSize: 14,
              }}
            />
          </div>
        </div>
        <div className="plat-platformQuestion">
          <h2>
            {selectedPlatform ? (
              <span style={{ color: '#FBE64D' }}>{`${selectedPlatform}`}</span>
            ) : '나에게 맞는 OTT 플랫폼 찾아보기'}
            {selectedPlatform && ', 나에게 맞을까?'}
          </h2>
          <div className="plat-platformButtons">
            {['넷플릭스', '왓챠', '디즈니플러스', '티빙'].map(platform => (
              <button
                key={platform}
                className="plat-platformButton"
                onClick={() => handlePlatformSelect(platform)}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatRecom;
