/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  Button,
  List,
  Avatar,
  Input,
  Drawer,
  Typography,
  Switch,
} from "antd";
import {
  SearchOutlined,
  StarOutlined,
  TwitterOutlined,
  FacebookFilled,
  ClockCircleOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { NavLink, Link } from "react-router-dom";
import styled from "styled-components";
import avtar from "../../assets/images/team-2.jpg";

const ButtonContainer = styled.div`
  .ant-btn-primary {
    background-color: #1890ff;
  }
  .ant-btn-success {
    background-color: #52c41a;
  }
  .ant-btn-yellow {
    background-color: #fadb14;
  }
  .ant-btn-black {
    background-color: #262626;
    color: #fff;
    border: 0px;
    border-radius: 5px;
  }
  .ant-switch-active {
    background-color: #1890ff;
  }
`;

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z" fill="#111827"></path>
    <path d="M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z" fill="#111827"></path>
  </svg>
);

const WifiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 107 107" fill="#2EBD59" xmlns="http://www.w3.org/2000/svg">
    <path d="M53.5,0C23.9517912,0 0,23.9517912 0,53.5C0,83.0482088 23.9517912,107 53.5,107C83.0482088,107 107,83.0482088 107,53.5C107,23.9554418 83.0482088,0.00365063118 53.5,0ZM78.0358922,77.1597407C77.0757762,78.7368134 75.0204708,79.2296486 73.4506994,78.2695326C60.8888775,70.5922552 45.0743432,68.8582054 26.4524736,73.1111907C24.656363,73.523712 22.8675537,72.3993176 22.458683,70.6032071C22.0461617,68.8070966 23.1669055,67.0182873 24.9666667,66.6094166C45.3444899,61.9548618 62.8273627,63.9590583 76.9297509,72.5745479C78.4995223,73.5419652 78.9996588,75.5899693 78.0358922,77.1597407Z" />
  </svg>
);

const CreditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="#1890FF" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z" />
  </svg>
);

const data = [
  {
    key: '1',
    title: "New message from Sophie",
    description: <><ClockCircleOutlined /> 2 days ago</>,
    avatar: avtar,
  },
  {
    key: '2',
    title: "New album by Travis Scott",
    description: <><ClockCircleOutlined /> 2 days ago</>,
    avatar: <Avatar shape="square" icon={<WifiIcon />} />,
  },
  {
    key: '3',
    title: "Payment completed",
    description: <><ClockCircleOutlined /> 2 days ago</>,
    avatar: <Avatar shape="square" icon={<CreditIcon />} />,
  },
];

function Header({
  placement,
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const { Title, Text } = Typography;
  const [open, setOpen] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");
  const isMounted = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) {
        window.scrollTo(0, 0);
      }
    }, 0);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, []);

  const showDrawer = () => setOpen(true);
  const hideDrawer = () => setOpen(false);

  const formattedName = name.replace("/", "");
  const formattedSubName = subName.replace("/", "");

  const menuItems = [
    {
      key: 'notifications',
      label: (
        <List
          className="header-notifications-dropdown"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <>
      <div className="setting-drwer" onClick={showDrawer}>
        <SettingOutlined />
      </div>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">Pages</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
              {formattedName}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span className="ant-page-header-heading-title" style={{ textTransform: "capitalize" }}>
              {formattedSubName}
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Badge size="small" count={4}>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <a href="#pablo" className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <BellIcon />
              </a>
            </Dropdown>
          </Badge>
          <Button type="link" onClick={showDrawer}>
            <SettingOutlined />
          </Button>
          <Button type="link" className="sidebar-toggler" onClick={() => onPress()}>
            <MenuOutlined />
          </Button>
          <Drawer
            className="settings-drawer"
            mask={true}
            width={360}
            onClose={hideDrawer}
            placement={placement}
            open={open}
          >
            <div>
              <div className="header-top">
                <Title level={4}>
                  Configurator
                  <Text className="subtitle">See our dashboard options.</Text>
                </Title>
              </div>

              <div className="sidebar-color">
                <Title level={5}>Sidebar Color</Title>
                <div className="theme-color mb-2">
                  <ButtonContainer>
                    <Button type="primary" onClick={() => handleSidenavColor("#1890ff")}>
                      1
                    </Button>
                    <Button type="success" onClick={() => handleSidenavColor("#52c41a")}>
                      1
                    </Button>
                    <Button type="danger" onClick={() => handleSidenavColor("#d9363e")}>
                      1
                    </Button>
                    <Button type="yellow" onClick={() => handleSidenavColor("#fadb14")}>
                      1
                    </Button>
                    <Button type="black" onClick={() => handleSidenavColor("#111")}>
                      1
                    </Button>
                  </ButtonContainer>
                </div>

                <div className="sidebarnav-color mb-2">
                  <Title level={5}>Sidenav Type</Title>
                  <Text>Choose between 2 different sidenav types.</Text>
                  <ButtonContainer className="trans">
                    <Button
                      type={sidenavType === "transparent" ? "primary" : "white"}
                      onClick={() => {
                        handleSidenavType("transparent");
                        setSidenavType("transparent");
                      }}
                    >
                      TRANSPARENT
                    </Button>
                    <Button
                      type={sidenavType === "white" ? "primary" : "white"}
                      onClick={() => {
                        handleSidenavType("#fff");
                        setSidenavType("white");
                      }}
                    >
                      WHITE
                    </Button>
                  </ButtonContainer>
                </div>
                <div className="fixed-nav mb-2">
                  <Title level={5}>Navbar Fixed </Title>
                  <Switch onChange={(e) => handleFixedNavbar(e)} />
                </div>
                <div className="ant-docment">
                  <ButtonContainer>
                    <Button type="black" size="large">
                      FREE DOWNLOAD
                    </Button>
                    <Button size="large">VIEW DOCUMENTATION</Button>
                  </ButtonContainer>
                </div>
                <div className="viewstar">
                  <a href="#pablo"><StarOutlined /> Star</a>
                  <a href="#pablo"> 190</a>
                </div>
                <div className="ant-thank">
                  <Title level={5} className="mb-2">
                    Thank you for sharing!
                  </Title>
                  <ButtonContainer className="social">
                    <Button type="black"><TwitterOutlined /> TWEET</Button>
                    <Button type="black"><FacebookFilled /> SHARE</Button>
                  </ButtonContainer>
                </div>
              </div>
            </div>
          </Drawer>
          <Link to="/sign-in" className="btn-sign-in">
            <UserOutlined />
            <span>Sign in</span>
          </Link>
          <Input
            className="header-search"
            placeholder="Type here..."
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>
    </>
  );
}

export default Header;